<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <AppHeader @open-settings="isSettingsOpen = true" />
    
    <!-- Main Content Context -->
    <main class="flex-1 overflow-y-auto p-6 relative">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-3 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shrink-0">
      Made with <span class="text-pink-500">&lt;3</span> by <a href="https://francescodb.me" target="_blank" rel="noopener noreferrer" class="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">FrancescoDB</a> and <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">Nuxt</a>
    </footer>

    <!-- Modals and Sidebars -->
    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
    <NodeSidebar />
  </div>
</template>

<script setup lang="ts">
const isSettingsOpen = ref(false)
</script>
