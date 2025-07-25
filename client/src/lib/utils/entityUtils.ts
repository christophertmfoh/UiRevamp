/**
 * Universal Entity Utilities
 * Generic utility functions that work across all entity types (Characters, Locations, Factions, etc.)
 */

import type { FieldDefinition } from '@/lib/config/fieldConfig';

// Generic base entity interface
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Generic entity completeness calculation
export function calculateEntityCompleteness(
  entity: Partial<BaseEntity>, 
  fieldDefinitions: FieldDefinition[]
): {
  total: number;
  filled: number;
  percentage: number;
} {
  const totalFields = fieldDefinitions.length;
  const filledFields = fieldDefinitions.filter(field => {
    const value = entity[field.key as keyof BaseEntity];
    return value && value !== '' && (!Array.isArray(value) || value.length > 0);
  }).length;
  
  return {
    total: totalFields,
    filled: filledFields,
    percentage: Math.round((filledFields / totalFields) * 100)
  };
}

// Generic entity summary creation
export function createEntitySummary(
  entity: Partial<BaseEntity>, 
  entityType: string,
  fieldDefinitions: FieldDefinition[]
): string {
  const name = entity.name || `Unnamed ${entityType}`;
  const completeness = calculateEntityCompleteness(entity, fieldDefinitions);
  
  return `${name} - ${completeness.percentage}% complete`;
}

// Generic field processing for arrays and objects
export function processEntityDataForSave(data: any, fieldDefinitions: FieldDefinition[]): any {
  const processedData: any = { ...data };
  
  fieldDefinitions.forEach(field => {
    const value = data[field.key];
    
    if (field.type === 'array') {
      if (typeof value === 'string') {
        processedData[field.key] = value
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean);
      } else if (Array.isArray(value)) {
        processedData[field.key] = value;
      } else {
        processedData[field.key] = [];
      }
    } else if (field.type === 'tags') {
      if (typeof value === 'string') {
        processedData[field.key] = value
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      } else if (Array.isArray(value)) {
        processedData[field.key] = value;
      } else {
        processedData[field.key] = [];
      }
    } else {
      processedData[field.key] = value || '';
    }
  });
  
  return processedData;
}

// Generic data processing for form initialization
export function processEntityDataForForm(
  entity: Partial<BaseEntity> | undefined, 
  fieldDefinitions: FieldDefinition[]
): any {
  const initialData: any = {};
  
  fieldDefinitions.forEach(field => {
    const value = entity?.[field.key as keyof BaseEntity];
    
    if (field.type === 'array' || field.type === 'tags') {
      initialData[field.key] = Array.isArray(value) ? value.join(', ') : '';
    } else {
      initialData[field.key] = value || '';
    }
  });
  
  return initialData;
}

// Generic search filtering
export function filterEntitiesBySearch(
  entities: BaseEntity[], 
  searchQuery: string,
  searchFields: string[] = ['name', 'description']
): BaseEntity[] {
  if (!searchQuery.trim()) return entities;
  
  const query = searchQuery.toLowerCase();
  return entities.filter(entity =>
    searchFields.some(field => {
      const value = entity[field];
      return value && value.toString().toLowerCase().includes(query);
    })
  );
}

// Generic entity sorting
export function sortEntities(
  entities: BaseEntity[], 
  sortBy: 'alphabetical' | 'recently-added' | 'recently-edited'
): BaseEntity[] {
  return [...entities].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return (a.name || '').localeCompare(b.name || '');
      case 'recently-added':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'recently-edited':
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      default:
        return 0;
    }
  });
}

// Generic validation
export function validateEntityData(
  data: any, 
  fieldDefinitions: FieldDefinition[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  fieldDefinitions.forEach(field => {
    const value = data[field.key];
    
    if (field.required && (!value || value === '')) {
      errors[field.key] = `${field.label} is required`;
    }
    
    if (field.type === 'array' && field.required) {
      const arrayValue = typeof value === 'string' 
        ? value.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(value) ? value : [];
      
      if (arrayValue.length === 0) {
        errors[field.key] = `At least one ${field.label.toLowerCase()} is required`;
      }
    }
  });
  
  return errors;
}

// Generic entity statistics
export function calculateEntityStatistics(
  entities: BaseEntity[], 
  fieldDefinitions: FieldDefinition[]
): {
  total: number;
  wellDeveloped: number;
  inProgress: number;
  needWork: number;
} {
  const total = entities.length;
  let wellDeveloped = 0;
  let inProgress = 0;
  let needWork = 0;
  
  entities.forEach(entity => {
    const completeness = calculateEntityCompleteness(entity, fieldDefinitions).percentage;
    
    if (completeness >= 70) {
      wellDeveloped++;
    } else if (completeness >= 30) {
      inProgress++;
    } else {
      needWork++;
    }
  });
  
  return {
    total,
    wellDeveloped,
    inProgress,
    needWork
  };
}

// Generic entity duplication check
export function findDuplicateEntities(
  entities: BaseEntity[], 
  newEntity: Partial<BaseEntity>
): BaseEntity[] {
  const name = newEntity.name?.toLowerCase().trim();
  if (!name) return [];
  
  return entities.filter(entity => 
    entity.name?.toLowerCase().trim() === name && entity.id !== newEntity.id
  );
}

// Generic bulk operations
export function bulkUpdateEntities(
  entities: BaseEntity[], 
  updates: Partial<BaseEntity>,
  entityIds: string[]
): BaseEntity[] {
  return entities.map(entity => 
    entityIds.includes(entity.id) 
      ? { ...entity, ...updates, updatedAt: new Date().toISOString() }
      : entity
  );
}

// Generic export data preparation
export function prepareEntityForExport(
  entity: BaseEntity, 
  fieldDefinitions: FieldDefinition[]
): Record<string, any> {
  const exportData: Record<string, any> = {};
  
  fieldDefinitions.forEach(field => {
    const value = entity[field.key];
    
    if (value !== undefined && value !== null && value !== '') {
      if (field.type === 'array' || field.type === 'tags') {
        exportData[field.label] = Array.isArray(value) ? value.join(', ') : value;
      } else {
        exportData[field.label] = value;
      }
    }
  });
  
  return exportData;
}