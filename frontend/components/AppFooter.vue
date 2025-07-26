<template>
  <footer class="border-t border-border">
    <div class="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
      <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
        <div class="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
          <PenTool class="w-4 h-4 text-white" />
        </div>
        <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Fablecraft. Craft your stories with AI-powered tools.
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <NuxtLink 
          to="/about" 
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          About
        </NuxtLink>
        <NuxtLink 
          to="/privacy" 
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy
        </NuxtLink>
        <NuxtLink 
          to="/terms" 
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { PenTool } from 'lucide-vue-next'
</script>