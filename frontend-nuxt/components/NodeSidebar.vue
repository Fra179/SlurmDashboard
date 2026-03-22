<template>
  <div>
    <!-- Overlay -->
    <div 
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm z-40 transition-opacity duration-300"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 shadow-2xl flex flex-col"
      :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div v-if="activeSidebarNode" class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850 transition-colors duration-200">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <GpuIcon v-if="activeSidebarNode.gpu.total > 0" class="w-6 h-6" />
              <CpuIcon v-else class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-wide">{{ activeSidebarNode.id }}</h2>
              <div class="flex gap-2 mt-1">
                <div 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border"
                  :class="stateColorClasses(activeSidebarNode.state)"
                >
                  {{ activeSidebarNode.state }}
                </div>
                <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {{ activeSidebarNode.partition }}
                </div>
              </div>
            </div>
          </div>
          <button @click="closeSidebar" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Sidebar Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- Hardware Resources -->
          <div>
            <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HardDriveIcon class="w-4 h-4" /> Allocated Resources
            </h3>
            
            <div class="space-y-5">
              <!-- CPU Bar -->
              <div>
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="text-slate-700 dark:text-slate-300 font-medium">CPU Cores</span>
                  <span class="text-slate-500 dark:text-slate-400">{{ activeSidebarNode.cpu.alloc }} / {{ activeSidebarNode.cpu.total }}</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 border border-slate-200 dark:border-slate-800">
                  <div class="bg-blue-500 h-1.5 rounded-full mt-[1px] ml-[1px] transition-all duration-500" :style="{ width: percent(activeSidebarNode.cpu.alloc, activeSidebarNode.cpu.total) + '%' }"></div>
                </div>
              </div>

              <!-- GPU Bar -->
              <div v-if="activeSidebarNode.gpu.total > 0">
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">GPUs <span class="text-xs text-slate-500 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">{{ activeSidebarNode.gpu.type }}</span></span>
                  <span class="text-slate-500 dark:text-slate-400">{{ activeSidebarNode.gpu.alloc }} / {{ activeSidebarNode.gpu.total }}</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 border border-slate-200 dark:border-slate-800">
                  <div class="bg-purple-500 h-1.5 rounded-full mt-[1px] ml-[1px] transition-all duration-500" :style="{ width: percent(activeSidebarNode.gpu.alloc, activeSidebarNode.gpu.total) + '%' }"></div>
                </div>
              </div>

              <!-- Memory Bar -->
              <div>
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="text-slate-700 dark:text-slate-300 font-medium">Memory (GB)</span>
                  <span class="text-slate-500 dark:text-slate-400">{{ Math.round(activeSidebarNode.mem.alloc / 1024) }} / {{ Math.round(activeSidebarNode.mem.total / 1024) }}</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 border border-slate-200 dark:border-slate-800">
                  <div class="bg-emerald-500 h-1.5 rounded-full mt-[1px] ml-[1px] transition-all duration-500" :style="{ width: percent(activeSidebarNode.mem.alloc, activeSidebarNode.mem.total) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Jobs on Node -->
          <div>
            <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ListTreeIcon class="w-4 h-4" /> Active Jobs
            </h3>
            
            <div class="space-y-3">
              <div v-if="activeSidebarNode.jobs.length === 0" class="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center text-slate-500 text-sm">
                No active jobs on this node.
              </div>
              <div v-for="job in activeSidebarNode.jobs" :key="job.id" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Job ID: <span class="text-slate-700 dark:text-slate-300 font-mono">{{ job.id }}</span> <span class="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{{ job.status[0] }}</span></div>
                    <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ job.name }}</div>
                  </div>
                  <div class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <UserIcon class="w-3 h-3 text-slate-400 dark:text-slate-500" /> {{ job.user }}
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <span class="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.cores }} Cores</span>
                  <span class="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.mem }} GB RAM</span>
                  <span v-if="job.gpus > 0" class="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.gpus }} GPU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { GpuIcon, CpuIcon, XIcon, HardDriveIcon, ListTreeIcon, UserIcon } from 'lucide-vue-next'

const { isSidebarOpen, activeSidebarNode, closeSidebar } = useSidebar()

const percent = (alloc: number, total: number) => total === 0 ? 0 : Math.round((alloc / total) * 100)

const stateColorClasses = (state: string) => {
  if (state === 'IDLE') return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
  if (state === 'MIXED') return 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30'
  if (state === 'ALLOCATED') return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
  if (['DOWN', 'DOWN|NOT_RESPONDING'].includes(state)) return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
  if (state === 'DRAINED') return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
  return ''
}
</script>
