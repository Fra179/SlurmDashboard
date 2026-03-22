<template>
  <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6 text-center">
    <WifiOff class="w-24 h-24 mb-6 text-slate-400 dark:text-slate-500 animate-pulse" stroke-width="1.5" />
    <h1 class="text-3xl font-bold mb-2">No Connection</h1>
    <p class="text-lg text-slate-500 dark:text-slate-400 max-w-md">
      You are currently offline. Please check your internet connection to continue using SLURM Dashboard.
    </p>
    <button 
      @click="retryConnection" 
      class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:ring-4 focus:ring-blue-500/20"
    >
      Retry Connection
    </button>
  </div>
</template>

<script setup lang="ts">
import { WifiOff } from 'lucide-vue-next'

const retryConnection = () => {
  window.location.reload()
}
</script>
