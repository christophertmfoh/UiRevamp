<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navigation Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Layout-specific logic can go here
</script>