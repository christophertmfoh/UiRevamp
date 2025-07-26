<template>
  <header class="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <!-- Logo and Brand -->
      <div class="mr-4 hidden md:flex">
        <NuxtLink to="/" class="mr-6 flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <PenTool class="w-5 h-5 text-white" />
          </div>
          <span class="hidden font-bold sm:inline-block">{{ config.public.appName }}</span>
        </NuxtLink>
      </div>
      
      <!-- Mobile menu button -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
      >
        <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
        <X v-else class="h-6 w-6" />
      </button>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
        <NuxtLink 
          to="/projects" 
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          active-class="text-foreground"
        >
          Projects
        </NuxtLink>
        <NuxtLink 
          to="/characters" 
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          active-class="text-foreground"
        >
          Characters
        </NuxtLink>
        <NuxtLink 
          to="/world" 
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          active-class="text-foreground"
        >
          World Building
        </NuxtLink>
      </nav>
      
      <!-- Right side actions -->
      <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <!-- Search -->
        <div class="w-full flex-1 md:w-auto md:flex-none">
          <button class="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
            <Search class="mr-2 h-4 w-4" />
            <span class="hidden lg:inline-flex">Search characters...</span>
            <span class="inline-flex lg:hidden">Search...</span>
            <kbd class="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span class="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>
        
        <!-- Theme toggle -->
        <button
          @click="toggleColorMode"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9"
        >
          <Sun v-if="$colorMode.value === 'dark'" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-border">
      <nav class="flex flex-col space-y-2 p-4">
        <NuxtLink 
          to="/projects" 
          class="text-foreground/60 hover:text-foreground transition-colors py-2"
          @click="mobileMenuOpen = false"
        >
          Projects
        </NuxtLink>
        <NuxtLink 
          to="/characters" 
          class="text-foreground/60 hover:text-foreground transition-colors py-2"
          @click="mobileMenuOpen = false"
        >
          Characters
        </NuxtLink>
        <NuxtLink 
          to="/world" 
          class="text-foreground/60 hover:text-foreground transition-colors py-2"
          @click="mobileMenuOpen = false"
        >
          World Building
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, X, Search, Sun, Moon, PenTool } from 'lucide-vue-next'

const config = useRuntimeConfig()
const colorMode = useColorMode()
const mobileMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>