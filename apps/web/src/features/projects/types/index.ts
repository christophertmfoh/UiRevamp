export interface Project {
  id: string
  name: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  genre?: string
  targetWordCount?: number
  currentWordCount: number
  createdAt: Date
  updatedAt: Date
  userId: string
  settings: ProjectSettings
}

export type ProjectType = 'novel' | 'short-story' | 'screenplay' | 'comic' | 'poetry' | 'non-fiction'

export type ProjectStatus = 'planning' | 'drafting' | 'editing' | 'completed' | 'archived'

export interface ProjectSettings {
  autoSave: boolean
  backupEnabled: boolean
  collaborationEnabled: boolean
  visibilityLevel: 'private' | 'shared' | 'public'
  theme: string
}

export interface ProjectMetrics {
  totalWords: number
  chaptersCount: number
  charactersCount: number
  averageWordsPerDay: number
  completionPercentage: number
  lastActivityDate: Date
}

export interface ProjectSummary {
  id: string
  name: string
  type: ProjectType
  status: ProjectStatus
  wordCount: number
  lastModified: Date
}

export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'currentWordCount'>