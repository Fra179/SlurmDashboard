<template>
  <div class="flex flex-col items-center text-center w-full">
    <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-6 relative inline-flex">
      <div class="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-600 dark:border-blue-400 animate-spin"></div>
      <ServerIcon class="w-10 h-10 text-blue-600 dark:text-blue-500 opacity-80" />
    </div>
    <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">{{ title }}</h2>
    <p class="text-slate-500 dark:text-slate-400 text-sm" v-html="description"></p>
  </div>
</template>

<script setup lang="ts">
import { ServerIcon } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Loading...'
  },
  description: {
    type: String,
    default: 'Please wait.'
  }
})
</script>
