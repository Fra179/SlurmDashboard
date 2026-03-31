<template>
  <div>
    <!-- Overlay -->
    <div 
      v-if="isUserSidebarOpen"
      class="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm z-40 transition-opacity duration-300"
      @click="closeUserSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 shadow-2xl flex flex-col"
      :class="isUserSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div v-if="activeSidebarUser" class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850 transition-colors duration-200">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <UserIcon class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-wide">{{ activeSidebarUser }}</h2>
              <div class="flex gap-2 mt-1">
                <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {{ userJobs.length }} Active Jobs
                </div>
              </div>
            </div>
          </div>
          <button @click="closeUserSidebar" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Sidebar Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- Hardware Resources Overview -->
          <div>
            <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ActivityIcon class="w-4 h-4" /> Total Usage
            </h3>
            
            <div class="grid grid-cols-2 gap-4">
              <!-- CPU Cores -->
              <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div class="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">CPU Cores</div>
                <div class="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {{ totalCores }}
                </div>
              </div>

              <!-- Memory -->
              <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div class="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Memory (GB)</div>
                <div class="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {{ totalMem }}
                </div>
              </div>

              <!-- GPUs -->
              <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 col-span-2">
                <div class="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">GPUs</div>
                <div class="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {{ totalGpus }}
                </div>
              </div>
            </div>
          </div>

          <!-- Active Jobs -->
          <div>
            <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ListTreeIcon class="w-4 h-4" /> Job Details
            </h3>
            
            <div class="space-y-3">
              <div v-if="userJobs.length === 0" class="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center text-slate-500 text-sm">
                No active jobs.
              </div>
              <div v-for="job in userJobs" :key="job.id" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Job ID: <span class="text-slate-700 dark:text-slate-300 font-mono">{{ job.id }}</span> <span class="ml-2 text-[10px] font-bold" :class="getStatusClass(job.status)">{{ typeof job.status === 'string' ? job.status[0] : (Array.isArray(job.status) ? job.status[0] : '') }}</span></div>
                    <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ job.name }}</div>
                  </div>
                  <div class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:underline transition-colors" @click="handleNodeClick(job.node)">
                    <HardDriveIcon class="w-3 h-3 text-slate-400 dark:text-slate-500" /> {{ job.node }}
                  </div>
                </div>
                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.cores }} Cores</span>
                  <span class="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.mem }} GB RAM</span>
                  <span v-if="job.gpus > 0" class="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.gpus }} GPU</span>
                  <span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">{{ job.time }}</span>
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
import { XIcon, ActivityIcon, ListTreeIcon, UserIcon, HardDriveIcon } from 'lucide-vue-next'

const { isUserSidebarOpen, activeSidebarUser, closeUserSidebar, openSidebar } = useSidebar()
const { data } = useSlurmData()

const userJobs = computed(() => {
  if (!data.value?.jobs || !activeSidebarUser.value) return []
  return data.value.jobs.filter(j => j.user === activeSidebarUser.value)
})

const totalCores = computed(() => {
  return userJobs.value.reduce((acc, job) => acc + job.cores, 0)
})

const totalMem = computed(() => {
  return userJobs.value.reduce((acc, job) => acc + job.mem, 0)
})

const totalGpus = computed(() => {
  return userJobs.value.reduce((acc, job) => acc + (job.gpus || 0), 0)
})

const getStatusClass = (status: any) => {
  const s = Array.isArray(status) ? status[0] : status
  const normalizedS = s?.toString().toUpperCase() || ''
  if (normalizedS === 'PENDING' || normalizedS === 'PD') {
    return 'text-orange-500 dark:text-orange-400'
  }
  return 'text-emerald-600 dark:text-emerald-400'
}

const handleNodeClick = (nodeId: string) => {
  if (!nodeId || nodeId === 'None') return
  const node = data.value?.nodes.find(n => n.id === nodeId)
  if (node) {
    // Open the node sidebar too (they can stack since z-index works, or we could close user sidebar)
    openSidebar(node)
  }
}
</script>
