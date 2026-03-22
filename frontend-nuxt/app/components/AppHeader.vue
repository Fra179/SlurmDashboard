<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shrink-0 transition-colors duration-200">
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <div class="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
        <ServerIcon class="w-6 h-6" />
      </div>
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">SLURM Cluster Monitor</h1>
        <div class="relative inline-flex items-center mt-0.5 max-w-full">
          <select 
            v-model="activeClusterId" 
            class="bg-transparent text-xs text-slate-500 dark:text-slate-400 font-medium outline-none cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors appearance-none pr-4 truncate"
            :disabled="clusters.length === 0"
          >
            <option v-if="clusters.length === 0" value="">No Clusters</option>
            <option v-for="c in clusters" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <ChevronDownIcon class="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
        <ClockIcon class="w-4 h-4 shrink-0" />
        <span class="truncate">Last Updated: <span class="text-slate-800 dark:text-slate-200 font-medium">{{ timeString }}</span></span>
      </div>
      <button @click="$emit('open-settings')" class="p-2 shrink-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Settings">
        <SettingsIcon class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ServerIcon, ChevronDownIcon, ClockIcon, SettingsIcon } from 'lucide-vue-next'
const { clusters, activeClusterId } = useClusters()
const { lastUpdated } = useSlurmData()

const timeString = computed(() => {
  if (!lastUpdated.value) return '--:--:--'
  return lastUpdated.value.toLocaleTimeString([], { hour12: false })
})
</script>
