<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors duration-200">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Node Status</h2>
      
      <!-- Legend -->
      <div class="flex flex-wrap gap-3 text-xs bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div class="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/50"></div> Idle</div>
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div class="w-3 h-3 rounded bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/50"></div> Mixed</div>
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div class="w-3 h-3 rounded bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/50"></div> Allocated</div>
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div class="w-3 h-3 rounded bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/50"></div> Drained</div>
          <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><div class="w-3 h-3 rounded bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50"></div> Down</div>
      </div>
    </div>

    <!-- Partition Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
      <button 
        v-for="part in partitionTabs" 
        :key="part"
        @click="activePartition = part"
        :class="activePartition === part 
            ? 'px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-white dark:bg-slate-800 dark:text-white border border-slate-700 transition-colors'
            : 'px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent transition-colors'"
      >
        {{ part === 'all' ? 'All Partitions' : part }}
      </button>
    </div>

    <!-- Dynamic Node Grid container -->
    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
      <button 
        v-for="node in filteredNodes" 
        :key="node.id"
        @click="openSidebar(node)"
        class="relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 overflow-hidden shadow-sm"
        :class="stateColorClasses(node.state)"
      >
        <component :is="node.gpu.total > 0 ? GpuIcon : CpuIcon" class="w-5 h-5 mb-1.5 opacity-80" />
        <span class="text-xs font-semibold tracking-wide">{{ node.id.replace('node-','') }}</span>
        
        <div v-if="['MIXED', 'ALLOCATED'].includes(node.state)" class="absolute bottom-0 left-0 h-1 bg-current opacity-50" :style="{ width: percent(node.cpu.alloc, node.cpu.total) + '%' }"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CpuIcon, GpuIcon } from 'lucide-vue-next'

const { data } = useSlurmData()
const { openSidebar } = useSidebar()

const activePartition = ref('all')

const partitionTabs = computed(() => {
  const parts = data.value?.partitions || []
  return ['all', ...parts.filter(p => p !== 'all')]
})

const filteredNodes = computed(() => {
  if (!data.value?.nodes) return []
  if (activePartition.value === 'all') return data.value.nodes
  return data.value.nodes.filter(n => n.partition === activePartition.value)
})

const percent = (alloc: number, total: number) => total === 0 ? 0 : Math.round((alloc / total) * 100)

const stateColorClasses = (state: string) => {
  if (state === 'IDLE') return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-500/60 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
  if (state === 'MIXED') return 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-500/60 hover:bg-cyan-100 dark:hover:bg-cyan-500/20'
  if (state === 'ALLOCATED') return 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500/60 hover:bg-blue-100 dark:hover:bg-blue-500/20'
  if (['DOWN', 'DOWN|NOT_RESPONDING'].includes(state)) return 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:border-red-300 dark:hover:border-red-500/60 hover:bg-red-100 dark:hover:bg-red-500/20'
  if (state === 'DRAINED') return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500/60 hover:bg-amber-100 dark:hover:bg-amber-500/20'
  return ''
}
</script>
