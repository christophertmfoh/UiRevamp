import { defineStore } from 'pinia'

export interface Project {
  id: number
  name: string
  type: 'novel' | 'screenplay' | 'comic' | 'short-story'
  description: string
  characters?: number
  locations?: number
  createdAt: string
  updatedAt?: string
}

export interface Character {
  id: number
  name: string
  role?: string
  race?: string
  age?: number
  profession?: string
  completeness: number
  image?: string
  projectId?: number
}

export interface WorldElement {
  id: number
  name: string
  type: string
  description: string
  projectId?: number
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    characters: [] as Character[],
    worldElements: [] as WorldElement[],
    currentProject: null as Project | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getProjectById: (state) => (id: number) => {
      return state.projects.find(project => project.id === id)
    },
    
    getCharactersByProject: (state) => (projectId: number) => {
      return state.characters.filter(character => character.projectId === projectId)
    },
    
    getWorldElementsByProject: (state) => (projectId: number) => {
      return state.worldElements.filter(element => element.projectId === projectId)
    }
  },

  actions: {
    async fetchProjects() {
      this.loading = true
      try {
        // API call to Kotlin backend
        const response = await $fetch('/api/projects')
        this.projects = response
      } catch (error) {
        this.error = 'Failed to fetch projects'
        console.error('Error fetching projects:', error)
      } finally {
        this.loading = false
      }
    },

    async createProject(projectData: Omit<Project, 'id' | 'createdAt'>) {
      this.loading = true
      try {
        const response = await $fetch('/api/projects', {
          method: 'POST',
          body: projectData
        })
        this.projects.push(response)
        return response
      } catch (error) {
        this.error = 'Failed to create project'
        console.error('Error creating project:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCharacters(projectId?: number) {
      this.loading = true
      try {
        const url = projectId ? `/api/characters?projectId=${projectId}` : '/api/characters'
        const response = await $fetch(url)
        this.characters = response
      } catch (error) {
        this.error = 'Failed to fetch characters'
        console.error('Error fetching characters:', error)
      } finally {
        this.loading = false
      }
    },

    async createCharacter(characterData: Omit<Character, 'id'>) {
      this.loading = true
      try {
        const response = await $fetch('/api/characters', {
          method: 'POST',
          body: characterData
        })
        this.characters.push(response)
        return response
      } catch (error) {
        this.error = 'Failed to create character'
        console.error('Error creating character:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentProject(project: Project) {
      this.currentProject = project
    },

    clearError() {
      this.error = null
    }
  }
})