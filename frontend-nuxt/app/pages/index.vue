<template>
  <div>
    <!-- Empty State -->
    <div v-if="!activeClusterId" class="flex flex-col items-center justify-center py-20 text-center h-full min-h-[60vh]">
      <div class="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-full mb-6">
        <ServerOffIcon class="w-12 h-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Clusters Configured</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">You haven't added any SLURM clusters yet. Add your first cluster API endpoint to start monitoring nodes and jobs.</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending && !data" class="flex flex-col items-center justify-center py-20 text-center h-full min-h-[60vh]">
      <LoadingSpinner title="Connecting to Cluster..." description="Fetching node states and active jobs" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center h-full min-h-[60vh]">
      <div class="bg-red-100 dark:bg-red-500/20 p-6 rounded-full mb-6">
        <ServerOffIcon class="w-12 h-12 text-red-500 dark:text-red-400" />
      </div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Connection Failed</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Could not fetch data from the current cluster. Please check the API URL or try again later.</p>
      <button @click="manualRefresh" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
        Retry
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto space-y-6">
      <SummaryCards />
      <NodeGrid />
      <JobsTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ServerOffIcon } from 'lucide-vue-next'

const { activeClusterId } = useClusters()
const { data, pending, error, manualRefresh } = useSlurmData()
</script>
