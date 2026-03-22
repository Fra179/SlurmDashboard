<template>
  <div class="light min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans antialiased overflow-x-hidden flex flex-col items-center justify-center p-6 transition-colors duration-200">
    <div class="text-center max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
      <!-- Decorative background blur -->
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="flex justify-center mb-6">
          <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full">
            <AlertCircle v-if="error.statusCode !== 404" class="w-12 h-12 text-blue-600 dark:text-blue-500" />
            <MonitorOff v-else class="w-12 h-12 text-blue-600 dark:text-blue-500" />
          </div>
        </div>
        
        <h1 class="text-6xl sm:text-7xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
          {{ error.statusCode }}
        </h1>
        
        <h2 class="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">
          {{ error.statusCode === 404 ? 'Page Not Found' : 'An Error Occurred' }}
        </h2>
        
        <p class="text-slate-500 dark:text-slate-400 mb-8 text-base">
          {{ error.statusCode === 404 
              ? "We can't seem to find the page you're looking for. It might have been removed or the link is incorrect." 
              : error.statusMessage || error.message || "Something went wrong." }}
        </p>
        
        <button 
          @click="handleError" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all shadow-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <Home class="w-5 h-5 stroke-[2.5]" />
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home, MonitorOff, AlertCircle } from 'lucide-vue-next'
import type { NuxtError } from '#app'
import { useDark } from '@vueuse/core'

// Initialize the dark mode class on HTML tag automatically using vueuse
const isDark = useDark() 

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
})

useHead({
  title: props.error?.statusCode === 404 ? '404 - Page Not Found' : 'Error - SLURM Monitor',
  htmlAttrs: {
    lang: 'en'
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>
