<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Nodes -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Nodes</p>
          <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-1">{{ totalNodes }}</h3>
        </div>
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
          <ServerIcon class="w-5 h-5" />
        </div>
      </div>
      <div class="mt-4 flex gap-2 text-xs">
        <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ idleNodesCount }} Idle</span>
        <span class="text-slate-400 dark:text-slate-600">•</span>
        <span class="text-blue-600 dark:text-blue-400 font-medium">{{ activeNodesCount }} Active</span>
        <span class="text-slate-400 dark:text-slate-600">•</span>
        <span class="text-red-600 dark:text-red-400 font-medium">{{ offlineNodesCount }} Offline</span>
      </div>
    </div>

    <!-- Active Jobs -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Running Jobs</p>
          <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-1">{{ totalJobsCount }}</h3>
        </div>
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
          <ActivityIcon class="w-5 h-5" />
        </div>
      </div>
      <div class="mt-4 flex gap-2 text-xs">
        <span class="text-slate-500 dark:text-slate-400">Synced just now</span>
      </div>
    </div>

    <!-- CPU Utilization -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      <div class="flex justify-between items-start">
        <div class="w-full">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Cluster CPU Load</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ cpuStats.pct }}%</h3>
            <span class="text-xs text-slate-500">{{ cpuStats.alloc }} / {{ cpuStats.total }} Cores</span>
          </div>
        </div>
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
          <CpuIcon class="w-5 h-5" />
        </div>
      </div>
      <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
        <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: cpuStats.pct + '%' }"></div>
      </div>
    </div>

    <!-- GPU Utilization -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      <div class="flex justify-between items-start">
        <div class="w-full">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Cluster GPU Load</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ gpuStats.pct }}%</h3>
            <span class="text-xs text-slate-500">{{ gpuStats.alloc }} / {{ gpuStats.total }} GPUs</span>
          </div>
        </div>
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
          <GpuIcon class="w-5 h-5" />
        </div>
      </div>
      <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
        <div class="bg-purple-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: gpuStats.pct + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ServerIcon, ActivityIcon, CpuIcon, GpuIcon } from 'lucide-vue-next'
const { totalNodes, idleNodesCount, activeNodesCount, offlineNodesCount, totalJobsCount, cpuStats, gpuStats } = useSlurmData()
</script>
