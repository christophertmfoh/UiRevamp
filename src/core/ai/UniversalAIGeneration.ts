import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UniversalEntityConfig } from '../entities/config/EntityConfig';
import type { EntityType } from '../../shared/schema';

// Generation context interface
export interface GenerationContext {
  project: {
    id: string;
    name: string;
    type: string;
    description?: string;
    genre?: string[];
  };
  existingEntities?: any[];
  targetEntity?: {
    name?: string;
    type?: string;
    description?: string;
  };
  customPrompt?: string;
}

// AI Generation Service
export class UniversalAIGeneration {
  private static model: any;
  
  private static initializeModel() {
    if (this.model) return this.model;
    
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY_1 || import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key not found');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    });
    
    return this.model;
  }

  static async generateEntity(
    config: UniversalEntityConfig,
    context: GenerationContext,
    customPrompt?: string
  ): Promise<any> {
    const model = this.initializeModel();
    
    const prompt = this.buildGenerationPrompt(config, context, customPrompt);
    
    let attempts = 0;
    const maxAttempts = config.ai.maxRetries || 3;
    
    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in AI response');
        }
        
        const entityData = JSON.parse(jsonMatch[0]);
        
        // Validate and clean the generated data
        const cleanedData = this.cleanAndValidateEntity(entityData, config);
        
        return cleanedData;
        
      } catch (error) {
        attempts++;
        console.error(`Generation attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          // Return fallback entity
          return this.createFallbackEntity(config, context);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    throw new Error('Failed to generate entity after maximum attempts');
  }

  static async enhanceField(
    config: UniversalEntityConfig,
    fieldKey: string,
    currentValue: string,
    entityData: any,
    context: GenerationContext
  ): Promise<string> {
    const model = this.initializeModel();
    
    const field = config.fields.find(f => f.key === fieldKey);
    if (!field || !field.aiEnhanceable) {
      return currentValue;
    }
    
    const enhancementRule = config.ai.enhancementRules.find(rule => rule.fieldKey === fieldKey);
    const prompt = this.buildFieldEnhancementPrompt(field, enhancementRule, currentValue, entityData, context);
    
    try {
      const result = await model.generateContent(prompt);
      const enhancedText = result.response.text().trim();
      
      // Clean up the response
      const cleaned = enhancedText
        .replace(/^["']|["']$/g, '') // Remove surrounding quotes
        .replace(/^\w+:\s*/, '') // Remove field name prefix
        .trim();
      
      return cleaned || currentValue;
      
    } catch (error) {
      console.error(`Field enhancement failed for ${fieldKey}:`, error);
      return currentValue;
    }
  }

  private static buildGenerationPrompt(
    config: UniversalEntityConfig,
    context: GenerationContext,
    customPrompt?: string
  ): string {
    let prompt = customPrompt || config.ai.promptTemplate;
    
    // Replace context placeholders
    const contextReplacements = {
      '{context}': this.buildContextString(context),
      '{entityType}': config.name,
      '{name}': context.targetEntity?.name || `New ${config.name}`,
      '{genre}': context.project.genre?.join(', ') || 'General Fiction',
      '{setting}': context.project.description || 'Unknown Setting',
      '{projectName}': context.project.name
    };
    
    Object.entries(contextReplacements).forEach(([placeholder, value]) => {
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Add field structure information
    prompt += `\n\nGenerate a JSON object with the following fields:\n`;
    config.fields.forEach(field => {
      if (field.priority === 'essential' || field.priority === 'important') {
        prompt += `- ${field.key}: ${field.type} - ${field.label}`;
        if (field.placeholder) prompt += ` (${field.placeholder})`;
        prompt += '\n';
      }
    });
    
    prompt += '\nReturn ONLY a valid JSON object without any markdown formatting or explanations.';
    
    return prompt;
  }

  private static buildFieldEnhancementPrompt(
    field: any,
    enhancementRule: any,
    currentValue: string,
    entityData: any,
    context: GenerationContext
  ): string {
    let prompt = enhancementRule?.promptTemplate || 
      `Enhance the ${field.label.toLowerCase()} for this ${context.project.type}. Current value: "${currentValue}". Make it more detailed, compelling, and fitting for the story world.`;
    
    // Replace placeholders
    const replacements = {
      '{current}': currentValue,
      '{name}': entityData.name || 'the character',
      '{fieldLabel}': field.label.toLowerCase()
    };
    
    // Add dependency values
    if (enhancementRule?.dependencies) {
      enhancementRule.dependencies.forEach((dep: string) => {
        replacements[`{${dep}}`] = entityData[dep] || '';
      });
    }
    
    Object.entries(replacements).forEach(([placeholder, value]) => {
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    });
    
    prompt += `\n\nReturn only the enhanced ${field.label.toLowerCase()} text without quotes or formatting.`;
    
    return prompt;
  }

  private static buildContextString(context: GenerationContext): string {
    let contextStr = `Project: ${context.project.name} (${context.project.type})`;
    
    if (context.project.description) {
      contextStr += `\nDescription: ${context.project.description}`;
    }
    
    if (context.project.genre && context.project.genre.length > 0) {
      contextStr += `\nGenre: ${context.project.genre.join(', ')}`;
    }
    
    if (context.existingEntities && context.existingEntities.length > 0) {
      contextStr += `\nExisting entities: ${context.existingEntities.map(e => e.name).join(', ')}`;
    }
    
    return contextStr;
  }

  private static cleanAndValidateEntity(data: any, config: UniversalEntityConfig): any {
    const cleaned: any = {};
    
    config.fields.forEach(field => {
      const value = data[field.key];
      
      if (value !== undefined && value !== null) {
        switch (field.type) {
          case 'array':
            if (Array.isArray(value)) {
              cleaned[field.key] = value.filter(item => item && item.trim() !== '');
            } else if (typeof value === 'string') {
              // Try to parse as array or split by commas
              try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                  cleaned[field.key] = parsed.filter(item => item && item.trim() !== '');
                }
              } catch {
                cleaned[field.key] = value.split(',').map(s => s.trim()).filter(s => s !== '');
              }
            } else {
              cleaned[field.key] = [];
            }
            break;
            
          case 'text':
          case 'textarea':
            cleaned[field.key] = String(value).trim();
            break;
            
          case 'number':
            const num = Number(value);
            cleaned[field.key] = isNaN(num) ? 0 : num;
            break;
            
          case 'boolean':
            cleaned[field.key] = Boolean(value);
            break;
            
          default:
            cleaned[field.key] = String(value).trim();
        }
      } else {
        // Set default values
        switch (field.type) {
          case 'array':
            cleaned[field.key] = [];
            break;
          case 'number':
            cleaned[field.key] = 0;
            break;
          case 'boolean':
            cleaned[field.key] = false;
            break;
          default:
            cleaned[field.key] = '';
        }
      }
    });
    
    return cleaned;
  }

  private static createFallbackEntity(config: UniversalEntityConfig, context: GenerationContext): any {
    const fallback: any = {};
    
    config.fields.forEach(field => {
      const fallbackValue = config.ai.fallbackFields[field.key];
      
      if (fallbackValue) {
        fallback[field.key] = fallbackValue;
      } else {
        switch (field.type) {
          case 'array':
            fallback[field.key] = [];
            break;
          case 'number':
            fallback[field.key] = 0;
            break;
          case 'boolean':
            fallback[field.key] = false;
            break;
          default:
            fallback[field.key] = field.placeholder || `Generated ${field.label}`;
        }
      }
    });
    
    // Set basic required fields
    fallback.name = context.targetEntity?.name || `New ${config.name}`;
    fallback.description = `A ${config.name.toLowerCase()} in the ${context.project.name} world.`;
    
    return fallback;
  }
}

// Export helper functions
export const generateEntity = UniversalAIGeneration.generateEntity.bind(UniversalAIGeneration);
export const enhanceField = UniversalAIGeneration.enhanceField.bind(UniversalAIGeneration);