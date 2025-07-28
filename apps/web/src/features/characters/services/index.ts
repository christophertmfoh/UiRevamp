import type { Character, CharacterFormData } from '../types'

export const characterApi = {
  getCharacters: async (projectId: string): Promise<Character[]> => {
    const response = await fetch(`/api/characters?projectId=${projectId}`)
    return response.json()
  },

  getCharacter: async (id: string): Promise<Character> => {
    const response = await fetch(`/api/characters/${id}`)
    return response.json()
  },

  createCharacter: async (data: CharacterFormData): Promise<Character> => {
    const response = await fetch('/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  updateCharacter: async (id: string, data: Partial<Character>): Promise<Character> => {
    const response = await fetch(`/api/characters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  deleteCharacter: async (id: string): Promise<void> => {
    await fetch(`/api/characters/${id}`, { method: 'DELETE' })
  },

  generateCharacterWithAI: async (prompt: string, projectId: string): Promise<Character> => {
    const response = await fetch('/api/characters/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, projectId })
    })
    return response.json()
  },

  enhanceCharacterField: async (characterId: string, field: string, context?: string): Promise<string> => {
    const response = await fetch('/api/characters/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId, field, context })
    })
    const result = await response.json()
    return result.enhancedContent
  }
}