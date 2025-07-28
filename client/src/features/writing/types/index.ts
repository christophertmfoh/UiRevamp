export interface WritingSession {
  projectId: string
  startTime: Date
  endTime?: Date
  wordsWritten: number
  targetWords?: number
  isActive: boolean
}

export interface WritingDocument {
  id: string
  title: string
  content: string
  projectId: string
  wordCount: number
  lastModified: Date
  version: number
}

export interface WritingMetrics {
  totalWords: number
  todayWords: number
  weekWords: number
  averageDaily: number
  writingStreak: number
}

export interface WritingSettings {
  autoSave: boolean
  autoSaveInterval: number
  showWordCount: boolean
  showReadingTime: boolean
  focusMode: boolean
  theme: string
}