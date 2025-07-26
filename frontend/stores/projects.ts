import { defineStore } from 'pinia'

export interface Project {
  id: string
  name: string
  type: string
  description?: string
  genre: string[]
  manuscriptNovel?: string
  manuscriptScreenplay?: string
  createdAt: string
  lastModified: string
}

export interface CreateProjectRequest {
  name: string
  type: string
  description?: string
  genre?: string[]
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()

  // Fetch all projects
  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch<Project[]>(`${config.public.apiBase}/api/projects`)
      projects.value = data || []
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch single project
  const fetchProject = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Project>(`${config.public.apiBase}/api/projects/${id}`)
      currentProject.value = data
      return data
    } catch (err) {
      error.value = 'Failed to fetch project'
      console.error('Error fetching project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new project
  const createProject = async (projectData: CreateProjectRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const newProject: Omit<Project, 'createdAt' | 'lastModified'> = {
        id: Date.now().toString(),
        name: projectData.name,
        type: projectData.type,
        description: projectData.description || '',
        genre: projectData.genre || [],
        manuscriptNovel: '',
        manuscriptScreenplay: ''
      }
      
      const data = await $fetch<Project>(`${config.public.apiBase}/api/projects`, {
        method: 'POST',
        body: newProject
      })
      
      projects.value.unshift(data)
      return data
    } catch (err) {
      error.value = 'Failed to create project'
      console.error('Error creating project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update project
  const updateProject = async (id: string, updates: Partial<Project>) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Project>(`${config.public.apiBase}/api/projects/${id}`, {
        method: 'PUT',
        body: updates
      })
      
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = data
      }
      
      if (currentProject.value?.id === id) {
        currentProject.value = data
      }
      
      return data
    } catch (err) {
      error.value = 'Failed to update project'
      console.error('Error updating project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete project
  const deleteProject = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`${config.public.apiBase}/api/projects/${id}`, {
        method: 'DELETE'
      })
      
      projects.value = projects.value.filter(p => p.id !== id)
      
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete project'
      console.error('Error deleting project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const projectsByType = computed(() => {
    return projects.value.reduce((acc, project) => {
      if (!acc[project.type]) acc[project.type] = []
      acc[project.type].push(project)
      return acc
    }, {} as Record<string, Project[]>)
  })

  const totalProjects = computed(() => projects.value.length)

  return {
    // State
    projects: readonly(projects),
    currentProject: readonly(currentProject),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    
    // Computed
    projectsByType,
    totalProjects
  }
})