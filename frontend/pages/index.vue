<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Section -->
    <section class="relative flex items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-brand-50 via-warm-50 to-brand-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      <!-- Content -->
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <!-- Logo -->
        <div class="mb-8 flex justify-center">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl">
            <PenTool class="w-10 h-10 text-white" />
          </div>
        </div>
        
        <!-- Main Heading -->
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 bg-clip-text text-transparent">
          {{ config.public.appName }}
        </h1>
        
        <!-- Tagline -->
        <p class="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
          {{ config.public.appTagline }}
        </p>
        
        <!-- Description -->
        <p class="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Advanced AI-powered creative writing platform that empowers writers to craft immersive narratives with intelligent character generation and world-building tools.
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink 
            to="/projects"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 group"
          >
            <Plus class="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
            Start Writing
          </NuxtLink>
          
          <NuxtLink 
            to="/characters"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-8"
          >
            <Users class="mr-2 h-4 w-4" />
            Explore Characters
          </NuxtLink>
        </div>
      </div>
      
      <!-- Floating elements -->
      <div class="absolute top-20 left-10 w-16 h-16 bg-brand-200 rounded-full opacity-20 float-animation"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-brand-300 rounded-full opacity-30 float-animation" style="animation-delay: -1s;"></div>
      <div class="absolute bottom-32 left-20 w-20 h-20 bg-brand-100 rounded-full opacity-25 float-animation" style="animation-delay: -2s;"></div>
    </section>
    
    <!-- Features Section -->
    <section class="py-20 px-4">
      <div class="container max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Powerful Writing Tools</h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to bring your stories to life, powered by advanced AI technology.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1: Character Creation -->
          <div class="group p-6 rounded-xl border border-border hover:border-brand-200 transition-all duration-300 hover:shadow-lg">
            <div class="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users class="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 class="text-xl font-semibold mb-3">AI Character Generation</h3>
            <p class="text-muted-foreground">Create rich, detailed characters with our AI-powered generation system. From personality traits to backstories, bring your characters to life.</p>
          </div>
          
          <!-- Feature 2: World Building -->
          <div class="group p-6 rounded-xl border border-border hover:border-brand-200 transition-all duration-300 hover:shadow-lg">
            <div class="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe class="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 class="text-xl font-semibold mb-3">World Building</h3>
            <p class="text-muted-foreground">Design immersive worlds with locations, factions, cultures, and histories. Create a comprehensive universe for your stories.</p>
          </div>
          
          <!-- Feature 3: Story Management -->
          <div class="group p-6 rounded-xl border border-border hover:border-brand-200 transition-all duration-300 hover:shadow-lg">
            <div class="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen class="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Project Management</h3>
            <p class="text-muted-foreground">Organize your writing projects with powerful tools for novels, screenplays, and more. Keep everything structured and accessible.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-20 bg-muted/50">
      <div class="container max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to craft your fable?</h2>
        <p class="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of writers using Fablecraft to create compelling stories with the power of AI.
        </p>
        <NuxtLink 
          to="/projects"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8"
        >
          Get Started Free
          <ArrowRight class="ml-2 h-4 w-4" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PenTool, Plus, Users, Globe, BookOpen, ArrowRight } from 'lucide-vue-next'

const config = useRuntimeConfig()

// SEO
useHead({
  title: `${config.public.appName} - ${config.public.appTagline}`,
  meta: [
    { 
      name: 'description', 
      content: 'Advanced AI-powered creative writing platform that empowers writers to craft immersive narratives with intelligent character generation and world-building tools.' 
    }
  ]
})
</script>