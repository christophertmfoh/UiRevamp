import type { WritingDocument, WritingMetrics, WritingSession } from '../types'

export const writingApi = {
  saveDocument: async (doc: WritingDocument): Promise<WritingDocument> => {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    })
    return response.json()
  },

  getDocument: async (id: string): Promise<WritingDocument> => {
    const response = await fetch(`/api/documents/${id}`)
    return response.json()
  },

  getMetrics: async (userId: string): Promise<WritingMetrics> => {
    const response = await fetch(`/api/writing/metrics/${userId}`)
    return response.json()
  },

  startSession: async (projectId: string): Promise<WritingSession> => {
    const response = await fetch('/api/writing/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId })
    })
    return response.json()
  },

  endSession: async (sessionId: string, wordsWritten: number): Promise<void> => {
    await fetch(`/api/writing/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordsWritten, endTime: new Date() })
    })
  }
}