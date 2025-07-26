import { defineStore } from 'pinia'

export interface Character {
  id: string
  projectId: string
  name?: string
  title?: string
  role?: string
  race?: string
  characterClass?: string
  age?: string
  species?: string
  description?: string
  personality?: string
  backstory?: string
  motivations?: string
  goals?: string
  fears?: string
  secrets?: string
  personalityTraits: string[]
  abilities: string[]
  skills: string[]
  talents: string[]
  archetypes: string[]
  tags: string[]
  physicalDescription?: string
  imageUrl?: string
  portraits: string
  createdAt: string
  updatedAt?: string
}

export interface CreateCharacterRequest {
  projectId: string
  name?: string
  role?: string
  description?: string
  personality?: string
  backstory?: string
}

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<Character[]>([])
  const currentCharacter = ref<Character | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()

  // Fetch characters for a project
  const fetchCharacters = async (projectId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Character[]>(`${config.public.apiBase}/api/projects/${projectId}/characters`)
      characters.value = data || []
    } catch (err) {
      error.value = 'Failed to fetch characters'
      console.error('Error fetching characters:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch single character
  const fetchCharacter = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Character>(`${config.public.apiBase}/api/characters/${id}`)
      currentCharacter.value = data
      return data
    } catch (err) {
      error.value = 'Failed to fetch character'
      console.error('Error fetching character:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new character
  const createCharacter = async (characterData: CreateCharacterRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const newCharacter: Omit<Character, 'createdAt' | 'updatedAt'> = {
        id: Date.now().toString(),
        projectId: characterData.projectId,
        name: characterData.name || '',
        role: characterData.role || '',
        description: characterData.description || '',
        personality: characterData.personality || '',
        backstory: characterData.backstory || '',
        personalityTraits: [],
        abilities: [],
        skills: [],
        talents: [],
        archetypes: [],
        tags: [],
        portraits: '[]'
      }
      
      const data = await $fetch<Character>(`${config.public.apiBase}/api/projects/${characterData.projectId}/characters`, {
        method: 'POST',
        body: newCharacter
      })
      
      characters.value.unshift(data)
      return data
    } catch (err) {
      error.value = 'Failed to create character'
      console.error('Error creating character:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update character
  const updateCharacter = async (id: string, updates: Partial<Character>) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Character>(`${config.public.apiBase}/api/characters/${id}`, {
        method: 'PUT',
        body: updates
      })
      
      const index = characters.value.findIndex(c => c.id === id)
      if (index !== -1) {
        characters.value[index] = data
      }
      
      if (currentCharacter.value?.id === id) {
        currentCharacter.value = data
      }
      
      return data
    } catch (err) {
      error.value = 'Failed to update character'
      console.error('Error updating character:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete character
  const deleteCharacter = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`${config.public.apiBase}/api/characters/${id}`, {
        method: 'DELETE'
      })
      
      characters.value = characters.value.filter(c => c.id !== id)
      
      if (currentCharacter.value?.id === id) {
        currentCharacter.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete character'
      console.error('Error deleting character:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search characters
  const searchCharacters = async (projectId: string, query: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Character[]>(`${config.public.apiBase}/api/projects/${projectId}/characters/search`, {
        query: { name: query }
      })
      return data || []
    } catch (err) {
      error.value = 'Failed to search characters'
      console.error('Error searching characters:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const charactersByRole = computed(() => {
    return characters.value.reduce((acc, character) => {
      const role = character.role || 'Unassigned'
      if (!acc[role]) acc[role] = []
      acc[role].push(character)
      return acc
    }, {} as Record<string, Character[]>)
  })

  const totalCharacters = computed(() => characters.value.length)

  return {
    // State
    characters: readonly(characters),
    currentCharacter: readonly(currentCharacter),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchCharacters,
    fetchCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    searchCharacters,
    
    // Computed
    charactersByRole,
    totalCharacters
  }
})