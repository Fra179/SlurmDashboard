<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <AppHeader @open-settings="isSettingsOpen = true" />
    
    <!-- Main Content Context -->
    <main class="flex-1 overflow-y-auto p-6 relative">
      <slot />
    </main>

    <!-- Modals and Sidebars -->
    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
    <NodeSidebar />
  </div>
</template>

<script setup lang="ts">
const isSettingsOpen = ref(false)
</script>
