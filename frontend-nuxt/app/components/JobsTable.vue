<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors duration-200">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Active Jobs Overview</h2>
      
      <!-- Search/Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <select 
          v-model="jobPartitionFilter" 
          class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors cursor-pointer"
        >
          <option value="all">All Partitions</option>
          <option v-for="part in availablePartitions" :key="part" :value="part">{{ part.charAt(0).toUpperCase() + part.slice(1) }}</option>
        </select>
        <div class="relative w-full sm:w-64">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search jobs or users..." 
            class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2.5 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors"
          >
        </div>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
      <table class="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        <thead class="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th scope="col" class="px-4 py-3.5 font-semibold">Job ID</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">Job Name</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">Status</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">Partition</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">User</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">Node</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">CPU Cores</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">Memory</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">GPUs</th>
            <th scope="col" class="px-4 py-3.5 font-semibold">Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800/50">
          <tr v-if="filteredJobs.length === 0">
            <td colspan="10" class="px-4 py-8 text-center text-slate-500">No active jobs found matching the criteria.</td>
          </tr>
          <tr v-for="job in filteredJobs" :key="job.id" class="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
            <td class="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">#{{ job.id }}</td>
            <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ job.name }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border" :class="getStatusClass(job.status)">{{ job.status[0] }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{{ job.partition }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div class="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-400 font-bold border border-slate-300 dark:border-slate-700 shrink-0">
                  {{ job.user.charAt(0).toUpperCase() }}
                </div>
                <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors font-medium truncate" @click="openUserSidebar(job.user)">{{ job.user }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors" @click="handleNodeClick(job.node)">
              {{ job.node }}
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">{{ job.cores }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">{{ job.mem }} GB</span>
            </td>
            <td class="px-4 py-3">
              <span v-if="job.gpus > 0" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">{{ job.gpus }}</span>
              <span v-else class="text-slate-400 dark:text-slate-600">-</span>
            </td>
            <td class="px-4 py-3 text-slate-500 font-mono text-xs">{{ job.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchIcon } from 'lucide-vue-next'

const { data } = useSlurmData()
const { openSidebar, openUserSidebar } = useSidebar()

const getStatusClass = (status: any) => {
  const s = Array.isArray(status) ? status[0] : status
  const normalizedS = s?.toString().toUpperCase() || ''
  if (normalizedS === 'PENDING' || normalizedS === 'PD') {
    return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
  }
  return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
}

const jobPartitionFilter = ref('all')
const searchQuery = ref('')

const availablePartitions = computed(() => {
  const parts = data.value?.partitions || []
  return parts.filter(p => p !== 'all')
})

const filteredJobs = computed(() => {
  if (!data.value?.jobs) return []
  const query = searchQuery.value.toLowerCase()
  return data.value.jobs.filter(job => {
    const matchPartition = jobPartitionFilter.value === 'all' || job.partition === jobPartitionFilter.value
    const matchSearch = job.name.toLowerCase().includes(query) || 
                        job.user.toLowerCase().includes(query) ||
                        job.id.toString().includes(query)
    return matchPartition && matchSearch
  })
})

const handleNodeClick = (nodeId: string) => {
  const node = data.value?.nodes.find(n => n.id === nodeId)
  if (node) {
    openSidebar(node)
  }
}
</script>
