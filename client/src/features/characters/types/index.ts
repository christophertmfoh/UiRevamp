export interface Character {
  id: string
  name: string
  age?: number
  occupation?: string
  description?: string
  personality?: string
  backstory?: string
  goals?: string
  fears?: string
  relationships?: CharacterRelationship[]
  appearance?: CharacterAppearance
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface CharacterRelationship {
  id: string
  characterId: string
  relatedCharacterId: string
  relationshipType: string
  description?: string
  strength: number // 1-10
}

export interface CharacterAppearance {
  height?: string
  build?: string
  hairColor?: string
  eyeColor?: string
  distinctiveFeatures?: string
  clothing?: string
}

export interface CharacterSheet {
  basic: {
    name: string
    age: number
    occupation: string
  }
  physical: CharacterAppearance
  personality: {
    traits: string[]
    goals: string
    fears: string
    motivations: string
  }
  background: {
    backstory: string
    education: string
    family: string
  }
  relationships: CharacterRelationship[]
}

export type CharacterFormData = Partial<Character>