<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
    <!-- Header -->
    <header class="border-b border-border/30 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Left side - empty for balance -->
          <div class="w-40"></div>
          
          <!-- Center - Brand -->
          <div class="flex items-center justify-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center border border-accent/20">
              <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div class="text-center">
              <h1 class="font-display text-3xl text-foreground leading-none tracking-tight">Fablecraft</h1>
              <div class="text-sm text-accent font-medium">Craft Your Fable</div>
            </div>
          </div>
          
          <!-- Right side - Projects button -->
          <div class="w-40 flex justify-end">
            <button 
              @click="showProjects = true"
              class="border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>Your Projects</span>
              <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-32">
      <div class="max-w-6xl mx-auto">
        <div class="text-center space-y-12">
          <!-- Badge -->
          <div class="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <div class="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-accent">Craft Your Fable</span>
          </div>
          
          <!-- Main Heading -->
          <h1 class="font-display text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] tracking-tight">
            The Complete
            <span class="block bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
              Your Creative Journey
            </span>
          </h1>
          
          <!-- Description -->
          <p class="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
            Transform fleeting ideas into rich, immersive worlds. From initial brainstorming to 
            final production, Fablecraft guides you through every step of the creative journey 
            with AI-powered tools and professional storytelling frameworks.
          </p>

          <!-- Loading Bar Animation -->
          <div class="max-w-md mx-auto pt-8">
            <div class="w-full bg-border/30 rounded-full h-2">
              <div class="bg-gradient-to-r from-accent via-accent/80 to-accent h-2 rounded-full animate-pulse" :style="`width: ${loadingProgress}%`"></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <button 
              @click="createNewProject"
              class="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-4 text-lg font-medium rounded-lg flex items-center space-x-3 min-w-[240px] group"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Start Your Story</span>
            </button>
            
            <button 
              @click="showProjects = true"
              class="border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 px-10 py-4 text-lg rounded-lg flex items-center space-x-3 min-w-[240px] group"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <span>Browse Projects</span>
            </button>
          </div>

          <!-- Feature Tags -->
          <div class="flex flex-wrap justify-center gap-3 pt-8">
            <span class="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">Character Development</span>
            <span class="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">World Building</span>
            <span class="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">AI Assistance</span>
            <span class="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">Story Structure</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features - Your Creative Toolkit -->
    <section class="container mx-auto px-6 py-24">
      <div class="max-w-5xl mx-auto">
        <div class="text-center space-y-4 mb-16">
          <div class="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center mx-auto mb-6 border border-accent/20">
            <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
            </svg>
          </div>
          <h3 class="font-display text-4xl text-foreground">Your Creative Toolkit</h3>
          <p class="font-literary text-xl text-muted-foreground max-w-2xl mx-auto">
            Every tool you need to bring your stories to life, from concept to completion
          </p>
        </div>
        
        <div class="space-y-6">
          <div v-for="(feature, index) in features" :key="index" class="relative">
            <!-- Connection line to next feature -->
            <div v-if="index < features.length - 1" class="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-accent/30 to-transparent z-10"></div>
            
            <div class="creative-card group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer relative overflow-hidden rounded-2xl p-8">
              <!-- Subtle glow on hover -->
              <div class="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="flex items-center space-x-6 relative">
                <div :class="`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`">
                  <component :is="feature.icon" class="h-8 w-8" />
                </div>
                <div class="flex-1 space-y-2">
                  <h4 class="font-display text-2xl text-foreground group-hover:text-accent transition-colors duration-300">
                    {{ feature.title }}
                  </h4>
                  <p class="font-literary text-muted-foreground leading-relaxed text-lg">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="container mx-auto px-6 py-24">
      <div class="max-w-4xl mx-auto">
        <!-- Visual Guide Leading to CTA -->
        <div class="flex justify-center mb-12">
          <div class="flex flex-col items-center space-y-4">
            <div class="flex space-x-2">
              <div class="w-2 h-2 bg-accent rounded-full animate-ping"></div>
              <div class="w-2 h-2 bg-accent rounded-full animate-ping delay-150"></div>
              <div class="w-2 h-2 bg-accent rounded-full animate-ping delay-300"></div>
            </div>
            <div class="w-1 h-8 bg-gradient-to-b from-accent to-transparent rounded-full"></div>
          </div>
        </div>
        
        <div class="text-center space-y-8">
          <div class="space-y-4">
            <div class="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto border border-accent/20">
              <svg class="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="font-display text-4xl text-foreground">Begin Your Journey</h3>
            <p class="font-literary text-xl text-muted-foreground max-w-2xl mx-auto">
              Join storytellers worldwide in crafting the next generation of immersive narratives
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div class="group">
              <button 
                @click="createNewProject"
                class="bg-gradient-to-r from-accent via-accent/90 to-accent text-accent-foreground text-lg px-10 py-4 min-w-[240px] group-hover:scale-105 transition-transform duration-300 rounded-lg flex items-center justify-center space-x-3"
              >
                <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Begin Your Journey</span>
              </button>
              <div class="mt-2 text-sm text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Create your first project
              </div>
            </div>
            
            <div class="group">
              <button 
                @click="showProjects = true"
                class="border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 text-lg px-10 py-4 min-w-[240px] group-hover:scale-105 rounded-lg flex items-center justify-center space-x-3"
              >
                <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span>View Your Projects</span>
              </button>
              <div class="mt-2 text-sm text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Continue existing work
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border/50 py-12">
      <div class="container mx-auto px-6">
        <div class="text-center">
          <p class="text-muted-foreground font-literary">
            Crafted for storytellers, by storytellers
          </p>
        </div>
      </div>
    </footer>

    <!-- Projects Modal -->
    <div v-if="showProjects" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="showProjects = false">
      <div class="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h3 class="text-2xl font-semibold text-foreground">Your Creative Projects</h3>
          <button @click="showProjects = false" class="text-muted-foreground hover:text-foreground">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="project in projects" :key="project.id" class="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-accent/30 transition-all duration-300 cursor-pointer" @click="openProject(project)">
              <div class="text-4xl mb-4">📚</div>
              <h4 class="text-lg font-semibold text-foreground mb-2">{{ project.name }}</h4>
              <p class="text-muted-foreground text-sm mb-4">{{ project.description }}</p>
              <span class="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">{{ project.type }}</span>
            </div>
            
            <div class="bg-card/30 border border-dashed border-accent/30 rounded-xl p-6 hover:bg-card/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center" @click="showCreateProject = true">
              <div class="text-6xl text-accent mb-4">+</div>
              <h4 class="text-lg font-semibold text-foreground mb-2">Create New Project</h4>
              <p class="text-muted-foreground text-sm">Start a fresh creative project</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="showCreateProject = false">
      <div class="bg-background border border-border rounded-2xl w-full max-w-md" @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h3 class="text-xl font-semibold text-foreground">Create New Project</h3>
          <button @click="showCreateProject = false" class="text-muted-foreground hover:text-foreground">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createProject" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Project Name</label>
            <input v-model="newProject.name" type="text" required placeholder="Enter your project name" class="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent">
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Project Type</label>
            <select v-model="newProject.type" required class="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">Select project type</option>
              <option value="Novel">Novel</option>
              <option value="Screenplay">Screenplay</option>
              <option value="Comic">Comic/Graphic Novel</option>
              <option value="Short Story">Short Story</option>
              <option value="Game">Game Story</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea v-model="newProject.description" rows="3" placeholder="Describe your project..." class="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"></textarea>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showCreateProject = false" class="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card/50 transition-colors">Cancel</button>
            <button type="submit" class="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// State
const showProjects = ref(false)
const showCreateProject = ref(false)
const loadingProgress = ref(0)

// Features data - exact match from React app
const features = [
  {
    icon: 'sparkles',
    title: "Brainstorm",
    description: "Generate endless story ideas with AI-powered creative assistance and narrative inspiration.",
    color: "candlelight-glow"
  },
  {
    icon: 'globe',
    title: "World Bible",
    description: "Build comprehensive universes with characters, locations, factions, items, and deep lore systems.",
    color: "ember-accent"
  },
  {
    icon: 'target',
    title: "Outline",
    description: "Structure your narrative with classic story beats, three-act structure, or custom frameworks.",
    color: "caramel-warm"
  },
  {
    icon: 'edit-3',
    title: "Manuscript",
    description: "Write novels and screenplays with AI assistance, formatting tools, and seamless revision tracking.",
    color: "leather-texture"
  },
  {
    icon: 'clapperboard',
    title: "Storyboard",
    description: "Visualize scenes and sequences with collaborative storyboarding and scene planning tools.",
    color: "candlelight-glow"
  },
  {
    icon: 'eye',
    title: "Pre-Visualization",
    description: "Create 3D scene previews, camera movements, and visual narrative planning.",
    color: "ember-accent"
  },
  {
    icon: 'music',
    title: "Score & Audio",
    description: "Integrate music, sound effects, and audio elements to complete your multimedia story.",
    color: "caramel-warm"
  }
]

// Sample projects data
const projects = ref([
  {
    id: 1,
    name: "The Last Guardian",
    type: "Novel",
    description: "A fantasy epic about ancient magic and forgotten realms"
  },
  {
    id: 2,
    name: "Neon Dreams", 
    type: "Screenplay",
    description: "Cyberpunk thriller set in 2087 Neo-Tokyo"
  },
  {
    id: 3,
    name: "Mystic Chronicles",
    type: "Comic",
    description: "Visual storytelling with supernatural elements"
  }
])

// Form data
const newProject = reactive({
  name: '',
  type: '',
  description: ''
})

// Loading animation
onMounted(() => {
  const interval = setInterval(() => {
    if (loadingProgress.value < 100) {
      loadingProgress.value += Math.random() * 10
    } else {
      loadingProgress.value = 0
    }
  }, 500)
})

// Methods
const createNewProject = () => {
  showCreateProject.value = true
}

const openProject = (project) => {
  showProjects.value = false
  console.log('Opening project:', project.name)
}

const createProject = () => {
  if (!newProject.name.trim() || !newProject.type) return
  
  const project = {
    id: Date.now(),
    name: newProject.name,
    type: newProject.type,
    description: newProject.description || 'New creative project'
  }
  
  projects.value.push(project)
  
  // Reset form
  Object.assign(newProject, { name: '', type: '', description: '' })
  showCreateProject.value = false
  showProjects.value = false
}
</script>