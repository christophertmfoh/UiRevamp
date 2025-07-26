<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">Projects</h1>
        <p class="text-muted-foreground">Manage your writing projects and bring your stories to life.</p>
      </div>
      
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
      >
        <Plus class="mr-2 h-4 w-4" />
        New Project
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="projectsStore.loading && projectsStore.projects.length === 0" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="projectsStore.error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6">
      <p class="text-destructive">{{ projectsStore.error }}</p>
      <button 
        @click="projectsStore.fetchProjects()"
        class="mt-2 text-sm text-destructive hover:underline"
      >
        Try again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="projectsStore.projects.length === 0" class="text-center py-12">
      <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <BookOpen class="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 class="text-xl font-semibold mb-2">No projects yet</h3>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto">
        Start your writing journey by creating your first project. Whether it's a novel, screenplay, or comic, we'll help you organize your ideas.
      </p>
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
      >
        <Plus class="mr-2 h-4 w-4" />
        Create Your First Project
      </button>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="project in projectsStore.projects" 
        :key="project.id"
        class="group rounded-lg border border-border bg-card p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
        @click="navigateTo(`/projects/${project.id}`)"
      >
        <!-- Project Type Badge -->
        <div class="flex items-center justify-between mb-4">
          <span class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            {{ project.type }}
          </span>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click.stop="editProject(project)"
              class="p-1 hover:bg-muted rounded"
            >
              <Edit2 class="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <!-- Project Title -->
        <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {{ project.name }}
        </h3>

        <!-- Project Description -->
        <p class="text-muted-foreground text-sm mb-4 line-clamp-2">
          {{ project.description || 'No description provided.' }}
        </p>

        <!-- Project Meta -->
        <div class="space-y-2 text-xs text-muted-foreground">
          <div v-if="project.genre && project.genre.length > 0" class="flex items-center">
            <Tag class="w-3 h-3 mr-1" />
            {{ project.genre.slice(0, 2).join(', ') }}
            <span v-if="project.genre.length > 2" class="ml-1">+{{ project.genre.length - 2 }}</span>
          </div>
          <div class="flex items-center">
            <Clock class="w-3 h-3 mr-1" />
            Last modified {{ formatDate(project.lastModified) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <CreateProjectModal 
      v-model:open="showCreateModal"
      @created="onProjectCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus, BookOpen, Edit2, Tag, Clock } from 'lucide-vue-next'
import { useProjectsStore } from '~/stores/projects'
import { format } from 'date-fns'

const projectsStore = useProjectsStore()
const showCreateModal = ref(false)

// Fetch projects on mount
onMounted(() => {
  projectsStore.fetchProjects()
})

// Utility functions
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy')
  } catch {
    return 'Unknown'
  }
}

const editProject = (project: any) => {
  // TODO: Implement edit project modal
  console.log('Edit project:', project)
}

const onProjectCreated = (project: any) => {
  navigateTo(`/projects/${project.id}`)
}

// SEO
useHead({
  title: 'Projects - Fablecraft',
  meta: [
    { name: 'description', content: 'Manage your writing projects and organize your creative work with Fablecraft.' }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>