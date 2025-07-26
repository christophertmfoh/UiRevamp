<template>
  <div>
    <!-- Main App Layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Global Notifications -->
    <div id="notifications" class="fixed top-4 right-4 z-50 space-y-2">
      <!-- Toast notifications will be rendered here -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Global meta configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

// Initialize theme
const colorMode = useColorMode()

// Global error handling
onErrorCaptured((error) => {
  console.error('Global error captured:', error)
  return false // Don't prevent error propagation
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', ui-sans-serif, system-ui;
}
</style>