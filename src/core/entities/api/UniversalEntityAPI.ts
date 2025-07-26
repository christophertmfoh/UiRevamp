// Universal Entity API uses standard fetch for compatibility
import type { EntityType } from '../../../shared/schema';
import type { UniversalEntityConfig } from '../config/EntityConfig';
import { UniversalAIGeneration, type GenerationContext } from '../../ai/UniversalAIGeneration';

// Universal Entity API Class
export class UniversalEntityAPI {
  /**
   * Fetch all entities of a specific type for a project
   */
  static async getEntities<T = any>(projectId: string, entityType: EntityType): Promise<T[]> {
    try {
      const response = await fetch(`/api/projects/${projectId}/${entityType}`);
      if (!response.ok) throw new Error(`Failed to fetch ${entityType}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Fetch a single entity by ID
   */
  static async getEntity<T = any>(projectId: string, entityType: EntityType, id: string): Promise<T> {
    try {
      const response = await fetch(`/api/projects/${projectId}/${entityType}/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch ${entityType} ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${entityType} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new entity
   */
  static async createEntity<T = any>(
    projectId: string, 
    entityType: EntityType, 
    data: any
  ): Promise<T> {
    try {
      const entityData = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`/api/projects/${projectId}/${entityType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entityData)
      });
      if (!response.ok) throw new Error(`Failed to create ${entityType}`);
      return await response.json();
      
      return response as T;
    } catch (error) {
      console.error(`Error creating ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing entity
   */
  static async updateEntity<T = any>(
    projectId: string, 
    entityType: EntityType, 
    id: string, 
    data: any
  ): Promise<T> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`/api/projects/${projectId}/${entityType}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) throw new Error(`Failed to update ${entityType} ${id}`);
      return await response.json();
      
      return response as T;
    } catch (error) {
      console.error(`Error updating ${entityType} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an entity
   */
  static async deleteEntity(projectId: string, entityType: EntityType, id: string): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${projectId}/${entityType}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`Failed to delete ${entityType} ${id}`);
    } catch (error) {
      console.error(`Error deleting ${entityType} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Generate a new entity using AI
   */
  static async generateEntity<T = any>(
    projectId: string,
    config: UniversalEntityConfig,
    context: GenerationContext,
    customPrompt?: string
  ): Promise<T> {
    try {
      // Generate entity data using AI
      const generatedData = await UniversalAIGeneration.generateEntity(config, context, customPrompt);
      
      // Create the entity in the database
      const createdEntity = await this.createEntity(projectId, config.entityType, generatedData);
      
      return createdEntity;
    } catch (error) {
      console.error(`Error generating ${config.entityType}:`, error);
      throw error;
    }
  }

  /**
   * Enhance a specific field of an entity using AI
   */
  static async enhanceEntityField<T = any>(
    projectId: string,
    entityType: EntityType,
    id: string,
    fieldKey: string,
    config: UniversalEntityConfig,
    context: GenerationContext
  ): Promise<T> {
    try {
      // Get the current entity
      const entity = await this.getEntity(projectId, entityType, id);
      
      // Enhance the specific field
      const enhancedValue = await UniversalAIGeneration.enhanceField(
        config,
        fieldKey,
        entity[fieldKey] || '',
        entity,
        context
      );
      
      // Update the entity with the enhanced field
      const updatedEntity = await this.updateEntity(projectId, entityType, id, {
        ...entity,
        [fieldKey]: enhancedValue
      });
      
      return updatedEntity;
    } catch (error) {
      console.error(`Error enhancing ${fieldKey} for ${entityType} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Bulk operations for entities
   */
  static async bulkCreateEntities<T = any>(
    projectId: string,
    entityType: EntityType,
    entitiesData: any[]
  ): Promise<T[]> {
    try {
      const promises = entitiesData.map(data => 
        this.createEntity(projectId, entityType, data)
      );
      
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error(`Error bulk creating ${entityType}:`, error);
      throw error;
    }
  }

  static async bulkUpdateEntities<T = any>(
    projectId: string,
    entityType: EntityType,
    updates: Array<{ id: string; data: any }>
  ): Promise<T[]> {
    try {
      const promises = updates.map(({ id, data }) => 
        this.updateEntity(projectId, entityType, id, data)
      );
      
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error(`Error bulk updating ${entityType}:`, error);
      throw error;
    }
  }

  static async bulkDeleteEntities(
    projectId: string,
    entityType: EntityType,
    ids: string[]
  ): Promise<void> {
    try {
      const promises = ids.map(id => 
        this.deleteEntity(projectId, entityType, id)
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error(`Error bulk deleting ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Search entities with filters
   */
  static async searchEntities<T = any>(
    projectId: string,
    entityType: EntityType,
    searchParams: {
      query?: string;
      filters?: Record<string, any>;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }
  ): Promise<{ entities: T[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.query) queryParams.append('q', searchParams.query);
      if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
      if (searchParams.sortDirection) queryParams.append('sortDirection', searchParams.sortDirection);
      if (searchParams.limit) queryParams.append('limit', searchParams.limit.toString());
      if (searchParams.offset) queryParams.append('offset', searchParams.offset.toString());
      
      if (searchParams.filters) {
        Object.entries(searchParams.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(`filter_${key}`, String(value));
          }
        });
      }
      
      const url = `/api/projects/${projectId}/${entityType}/search?${queryParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to search ${entityType}`);
      return await response.json();
    } catch (error) {
      console.error(`Error searching ${entityType}:`, error);
      // Fallback to regular getEntities if search not implemented
      const entities = await this.getEntities<T>(projectId, entityType);
      return { entities, total: entities.length };
    }
  }

  /**
   * Export entities to various formats
   */
  static async exportEntities(
    projectId: string,
    entityType: EntityType,
    format: 'json' | 'csv' | 'pdf' = 'json',
    entityIds?: string[]
  ): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (entityIds && entityIds.length > 0) {
        queryParams.append('ids', entityIds.join(','));
      }
      
      const url = `/api/projects/${projectId}/${entityType}/export?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error(`Error exporting ${entityType}:`, error);
      throw error;
    }
  }
}

// Export convenience functions
export const {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  generateEntity,
  enhanceEntityField,
  bulkCreateEntities,
  bulkUpdateEntities,
  bulkDeleteEntities,
  searchEntities,
  exportEntities
} = UniversalEntityAPI;