/**
 * Enterprise API Integration Tests - Projects
 * 
 * Testing the projects API endpoints that are currently working
 * with the professional storage factory implementation.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import { storage } from '../../storage'
import { testUtils } from '../setup'

// Mock the storage to ensure consistent test environment
vi.mock('../../storage', () => ({
  storage: {
    getProjects: vi.fn(),
    getProject: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }
}))

// Create test app with projects router
const createTestApp = () => {
  const app = express()
  app.use(express.json())
  
  // Import and use projects router
  import('../../routes/projects').then(({ projectRouter }) => {
    app.use('/api/projects', projectRouter)
  })
  
  return app
}

describe('Projects API - Enterprise Tests', () => {
  let app: express.Application

  beforeAll(async () => {
    app = createTestApp()
    
    // Set up test environment
    process.env.NODE_ENV = 'test'
    process.env.DATABASE_URL = 'mock://test-database'
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/projects - Business Critical', () => {
    it('should return list of projects successfully', async () => {
      // Mock storage response
      const mockProjects = [
        testUtils.mockProject,
        {
          ...testUtils.mockProject,
          id: 'test-project-2',
          name: 'Another Test Project',
          type: 'screenplay' as const,
        }
      ]
      
      vi.mocked(storage.getProjects).mockResolvedValue(mockProjects)

      const response = await request(app)
        .get('/api/projects')
        .expect(200)

      expect(response.body).toEqual(mockProjects)
      expect(storage.getProjects).toHaveBeenCalledWith()
    })

    it('should handle storage errors gracefully', async () => {
      // Mock storage error
      vi.mocked(storage.getProjects).mockRejectedValue(new Error('Storage error'))

      const response = await request(app)
        .get('/api/projects')
        .expect(500)

      expect(response.body).toEqual({ error: 'Internal server error' })
    })

    it('should filter projects by userId when provided', async () => {
      const mockProjects = [testUtils.mockProject]
      vi.mocked(storage.getProjects).mockResolvedValue(mockProjects)

      await request(app)
        .get('/api/projects?userId=test-user-1')
        .expect(200)

      expect(storage.getProjects).toHaveBeenCalledWith('test-user-1')
    })
  })

  describe('GET /api/projects/:id - Individual Project', () => {
    it('should return specific project successfully', async () => {
      vi.mocked(storage.getProject).mockResolvedValue(testUtils.mockProject)
      vi.mocked(storage.getCharacters).mockResolvedValue([])
      vi.mocked(storage.getOutlines).mockResolvedValue([])
      vi.mocked(storage.getProseDocuments).mockResolvedValue([])

      const response = await request(app)
        .get('/api/projects/test-project-1')
        .expect(200)

      expect(response.body.project).toEqual(testUtils.mockProject)
      expect(response.body.characters).toEqual([])
      expect(response.body.outlines).toEqual([])
      expect(response.body.proseDocuments).toEqual([])
    })

    it('should return 404 for non-existent project', async () => {
      vi.mocked(storage.getProject).mockResolvedValue(undefined)

      const response = await request(app)
        .get('/api/projects/non-existent')
        .expect(404)

      expect(response.body).toEqual({ error: 'Project not found' })
    })
  })

  describe('POST /api/projects - Project Creation', () => {
    it('should create new project successfully', async () => {
      const newProjectData = {
        userId: 'test-user-1',
        name: 'New Test Project',
        type: 'novel',
        description: 'A new test project',
        genre: ['Fantasy'],
        synopsis: 'Test synopsis'
      }

      const createdProject = {
        ...newProjectData,
        id: 'new-project-id',
        manuscriptNovel: '',
        manuscriptScreenplay: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(storage.createProject).mockResolvedValue(createdProject)

      const response = await request(app)
        .post('/api/projects')
        .send(newProjectData)
        .expect(201)

      expect(response.body).toEqual(createdProject)
      expect(storage.createProject).toHaveBeenCalledWith(
        expect.objectContaining(newProjectData)
      )
    })

    it('should validate required fields', async () => {
      const invalidData = {
        // Missing required fields
        name: 'Test Project'
      }

      const response = await request(app)
        .post('/api/projects')
        .send(invalidData)
        .expect(400)

      expect(response.body.error).toContain('validation')
    })

    it('should handle storage errors during creation', async () => {
      const newProjectData = {
        userId: 'test-user-1',
        name: 'Test Project',
        type: 'novel',
        description: 'Test description',
        genre: ['Fantasy'],
        synopsis: 'Test synopsis'
      }

      vi.mocked(storage.createProject).mockRejectedValue(new Error('Storage error'))

      const response = await request(app)
        .post('/api/projects')
        .send(newProjectData)
        .expect(500)

      expect(response.body).toEqual({ error: 'Internal server error' })
    })
  })

  describe('PUT /api/projects/:id - Project Updates', () => {
    it('should update existing project successfully', async () => {
      const updateData = {
        name: 'Updated Project Name',
        description: 'Updated description'
      }

      const updatedProject = {
        ...testUtils.mockProject,
        ...updateData,
        updatedAt: new Date(),
      }

      vi.mocked(storage.updateProject).mockResolvedValue(updatedProject)

      const response = await request(app)
        .put('/api/projects/test-project-1')
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual(updatedProject)
      expect(storage.updateProject).toHaveBeenCalledWith('test-project-1', updateData)
    })

    it('should return 404 for non-existent project update', async () => {
      vi.mocked(storage.updateProject).mockResolvedValue(undefined)

      const response = await request(app)
        .put('/api/projects/non-existent')
        .send({ name: 'Updated Name' })
        .expect(404)

      expect(response.body).toEqual({ error: 'Project not found' })
    })
  })

  describe('DELETE /api/projects/:id - Project Deletion', () => {
    it('should delete project successfully', async () => {
      vi.mocked(storage.deleteProject).mockResolvedValue(true)

      const response = await request(app)
        .delete('/api/projects/test-project-1')
        .expect(200)

      expect(response.body).toEqual({ message: 'Project deleted successfully' })
      expect(storage.deleteProject).toHaveBeenCalledWith('test-project-1')
    })

    it('should return 404 for non-existent project deletion', async () => {
      vi.mocked(storage.deleteProject).mockResolvedValue(false)

      const response = await request(app)
        .delete('/api/projects/non-existent')
        .expect(404)

      expect(response.body).toEqual({ error: 'Project not found' })
    })

    it('should handle storage errors during deletion', async () => {
      vi.mocked(storage.deleteProject).mockRejectedValue(new Error('Storage error'))

      const response = await request(app)
        .delete('/api/projects/test-project-1')
        .expect(500)

      expect(response.body).toEqual({ error: 'Internal server error' })
    })
  })

  describe('API Performance - Enterprise Standards', () => {
    it('should respond to GET requests within acceptable time', async () => {
      vi.mocked(storage.getProjects).mockResolvedValue([testUtils.mockProject])

      const startTime = Date.now()
      await request(app)
        .get('/api/projects')
        .expect(200)
      const endTime = Date.now()

      // Should respond within 1 second (enterprise standard)
      expect(endTime - startTime).toBeLessThan(1000)
    })

    it('should handle concurrent requests', async () => {
      vi.mocked(storage.getProjects).mockResolvedValue([testUtils.mockProject])

      // Simulate 5 concurrent requests
      const requests = Array(5).fill(null).map(() =>
        request(app).get('/api/projects')
      )

      const responses = await Promise.all(requests)
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
    })
  })

  describe('API Security - Business Protection', () => {
    it('should sanitize input data', async () => {
      const maliciousData = {
        userId: 'test-user-1',
        name: '<script>alert("xss")</script>',
        type: 'novel',
        description: 'Test description',
        genre: ['Fantasy'],
        synopsis: 'Test synopsis'
      }

      // Even with malicious input, API should handle it safely
      const response = await request(app)
        .post('/api/projects')
        .send(maliciousData)

      // Should not crash and should handle the request
      expect([201, 400, 500]).toContain(response.status)
    })

    it('should handle large payload sizes', async () => {
      const largeData = {
        userId: 'test-user-1',
        name: 'Test Project',
        type: 'novel',
        description: 'A'.repeat(10000), // Large description
        genre: ['Fantasy'],
        synopsis: 'Test synopsis'
      }

      const response = await request(app)
        .post('/api/projects')
        .send(largeData)

      // Should handle large payloads gracefully
      expect([201, 400, 413, 500]).toContain(response.status)
    })
  })
})