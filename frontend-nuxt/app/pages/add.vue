<template>
  <div class="light min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans antialiased overflow-x-hidden flex flex-col items-center justify-center p-6 transition-colors duration-200">
    <div class="text-center max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 sm:p-12 relative overflow-hidden">
      <!-- Decorative background blur -->
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col items-center">
        <template v-if="status === 'adding'">
          <LoadingSpinner 
            title="Connecting to Cluster..." 
            :description="`Please wait while we add &quot;<b>${name}</b>&quot; to your dashboard.`" 
          />
        </template>
        
        <template v-else-if="status === 'error'">
          <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-full mb-6">
            <AlertCircle class="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Invalid Link</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-8">{{ errorMessage }}</p>
          <NuxtLink to="/" class="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all">
            <Home class="w-5 h-5" />
            Back to Dashboard
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, Home } from 'lucide-vue-next'

useHead({
  title: 'Adding Cluster... - SLURM Monitor'
})

const route = useRoute()
const router = useRouter()
const { clusters, addCluster, switchCluster } = useClusters()

const status = ref<'adding' | 'error'>('adding')
const errorMessage = ref('')

const name = route.query.name as string
const url = route.query.url as string

onMounted(() => {
  if (!name || !url) {
    status.value = 'error'
    errorMessage.value = 'The link is missing the cluster name or URL. Please ensure the share link is copied correctly.'
    return
  }

  // Use a slight delay to allow the loading animation to be seen by the user briefly
  // and avoid aggressive flickering
  setTimeout(() => {
    // Add cluster safely checks for duplicates and returns the id
    const clusterId = addCluster(name, url)
    if (clusterId) {
      switchCluster(clusterId)
    }
    
    // Redirect cleanly
    router.replace('/')
  }, 800)
})
</script>
