import type { Project, ProjectFormData, ProjectMetrics, ProjectSummary } from '../types'

export const projectApi = {
  getProjects: async (): Promise<ProjectSummary[]> => {
    const response = await fetch('/api/projects')
    return response.json()
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`)
    return response.json()
  },

  createProject: async (data: ProjectFormData): Promise<Project> => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  deleteProject: async (id: string): Promise<void> => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
  },

  getProjectMetrics: async (id: string): Promise<ProjectMetrics> => {
    const response = await fetch(`/api/projects/${id}/metrics`)
    return response.json()
  },

  duplicateProject: async (id: string, newName: string): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })
    return response.json()
  },

  exportProject: async (id: string, format: 'pdf' | 'docx' | 'txt'): Promise<Blob> => {
    const response = await fetch(`/api/projects/${id}/export?format=${format}`)
    return response.blob()
  }
}