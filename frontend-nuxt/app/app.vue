<template>
  <div class="light min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans antialiased overflow-x-hidden flex flex-col transition-colors duration-200">
    <VitePwaManifest />
    
    <!-- Render normal app when online -->
    <template v-if="isOnline">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
    
    <!-- Render full screen error when offline -->
    <template v-else>
      <OfflineError />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useNetwork, useDark } from '@vueuse/core'

useHead({
  title: 'SLURM Cluster Monitor',
  htmlAttrs: {
    lang: 'en'
  }
})

const isDark = useDark() // This initializes the dark mode class on HTML tag automatically using vueuse
const { isOnline } = useNetwork()
</script>
