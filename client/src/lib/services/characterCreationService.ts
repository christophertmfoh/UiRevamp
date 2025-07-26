import { apiRequest, queryClient } from '@/lib/queryClient';
// @ts-ignore - Character type exists in shared schema
import type { Character } from '../../../shared/schema';

interface CharacterGenerationOptions {
  characterType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

interface TemplateData {
  name: string;
  description: string;
  category: string;
  traits?: string[];
  background?: string;
  class?: string;
  role?: string;
}

/**
 * Comprehensive character creation service that handles all 4 creation methods
 * with automatic portrait generation
 */
export class CharacterCreationService {
  
  /**
   * Method 1: Custom AI Generation with automatic portrait
   */
  static async generateCustomCharacter(
    projectId: string,
    options: CharacterGenerationOptions
  ): Promise<Partial<Character>> {
    console.log('Creating custom character with automatic portrait');
    
    try {
      const response = await apiRequest(`/api/projects/${projectId}/characters/generate`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate custom character');
      }

      const characterData = await response.json();
      console.log('Custom character generated with portrait:', characterData.imageUrl ? 'Yes' : 'No');
      
      return characterData;
    } catch (error) {
      console.error('Custom character generation failed:', error);
      throw error;
    }
  }

  /**
   * Method 2: Template-based generation with automatic portrait
   */
  static async generateFromTemplate(
    projectId: string,
    templateData: TemplateData
  ): Promise<Partial<Character>> {
    console.log('Creating template character with automatic portrait');
    
    try {
      const response = await apiRequest(`/api/projects/${projectId}/characters/generate-from-template`, {
        method: 'POST',
        body: JSON.stringify({ templateData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate template character');
      }

      const characterData = await response.json();
      console.log('Template character generated with portrait:', characterData.imageUrl ? 'Yes' : 'No');
      
      return characterData;
    } catch (error) {
      console.error('Template character generation failed:', error);
      throw error;
    }
  }

  /**
   * Method 3: Document import with automatic portrait
   */
  static async importFromDocument(
    projectId: string,
    file: File
  ): Promise<Partial<Character>> {
    console.log('Importing character from document with automatic portrait');
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('projectId', projectId);

      const response = await fetch('/api/characters/import-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import character from document');
      }

      const characterData = await response.json();
      console.log('Document character imported with portrait:', characterData.imageUrl ? 'Yes' : 'No');
      
      return characterData;
    } catch (error) {
      console.error('Document import failed:', error);
      throw error;
    }
  }

  /**
   * Method 4: Manual/blank character creation with automatic portrait
   */
  static async createManualCharacter(
    projectId: string,
    characterData: Partial<Character>
  ): Promise<Partial<Character>> {
    console.log('Creating manual character with automatic portrait');
    
    try {
      const response = await apiRequest(`/api/projects/${projectId}/characters/create-manual`, {
        method: 'POST',
        body: JSON.stringify(characterData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create manual character');
      }

      const enhancedCharacterData = await response.json();
      console.log('Manual character created with portrait:', enhancedCharacterData.imageUrl ? 'Yes' : 'No');
      
      return enhancedCharacterData;
    } catch (error) {
      console.error('Manual character creation failed:', error);
      throw error;
    }
  }

  /**
   * Saves character to database and invalidates cache
   */
  static async saveCharacter(
    projectId: string,
    characterData: Partial<Character>
  ): Promise<Character> {
    console.log('Saving character to database');
    
    try {
      const response = await apiRequest('/api/characters', {
        method: 'POST',
        body: JSON.stringify({
          ...characterData,
          projectId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save character');
      }

      const savedCharacter = await response.json();
      
      // Invalidate character cache to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['/api/characters', { projectId }] });
      
      return savedCharacter;
    } catch (error) {
      console.error('Character save failed:', error);
      throw error;
    }
  }

  /**
   * Complete character creation workflow for any method
   */
  static async completeCharacterCreation(
    projectId: string,
    method: 'custom' | 'template' | 'document' | 'manual',
    data: any
  ): Promise<Character> {
    let characterData: Partial<Character>;

    // Generate character with automatic portrait based on method
    switch (method) {
      case 'custom':
        characterData = await this.generateCustomCharacter(projectId, data);
        break;
      case 'template':
        characterData = await this.generateFromTemplate(projectId, data);
        break;
      case 'document':
        characterData = await this.importFromDocument(projectId, data);
        break;
      case 'manual':
        characterData = await this.createManualCharacter(projectId, data);
        break;
      default:
        throw new Error('Unknown character creation method');
    }

    // Save the character with all generated data including portrait
    const savedCharacter = await this.saveCharacter(projectId, characterData);
    
    console.log('Character creation complete:', {
      method,
      name: savedCharacter.name,
      hasPortrait: !!savedCharacter.imageUrl,
      portraitCount: savedCharacter.portraits?.length || 0
    });

    return savedCharacter;
  }
}

export default CharacterCreationService;