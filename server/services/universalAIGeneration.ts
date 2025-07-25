import { GoogleGenerativeAI } from '@google/generative-ai';

interface EntityAIConfig {
  fieldPrompts: Record<string, string>;
  imagePrompts: Record<string, string>;
  enhancementCategories: string[];
}

// Entity-specific AI configuration
const ENTITY_AI_CONFIGS: Record<string, EntityAIConfig> = {
  character: {
    fieldPrompts: {
      name: "Generate a fitting name for this character based on their race, background, and setting",
      age: "Determine an appropriate age for this character considering their role and experience",
      race: "Select a race that fits this character's story and world",
      physicalDescription: "Describe this character's physical appearance in vivid detail",
      personalityTraits: "List 3-5 distinctive personality traits that define this character",
      background: "Create a rich backstory explaining how this character became who they are",
      goals: "Define clear, compelling goals that drive this character's actions",
      relationships: "Describe key relationships that shape this character's story"
    },
    imagePrompts: {
      portrait: "detailed character portrait, fantasy art style, professional lighting"
    },
    enhancementCategories: ['identity', 'physical', 'personality', 'background', 'skills', 'story']
  },
  
  location: {
    fieldPrompts: {
      name: "Generate an evocative name for this location that fits its nature and setting",
      terrain: "Describe the geographic features and terrain of this location",
      climate: "Define the weather patterns and climate conditions",
      architecture: "Detail the architectural styles and building types found here",
      landmarks: "List notable landmarks, monuments, or geographic features",
      atmosphere: "Capture the mood, feeling, and ambiance of this place",
      history: "Create a compelling history explaining how this location developed",
      inhabitants: "Describe who lives here and their way of life",
      economy: "Explain the economic activities and trade in this location"
    },
    imagePrompts: {
      map: "detailed fantasy map, birds eye view, cartographic style",
      landscape: "scenic landscape view, cinematic lighting, detailed environment"
    },
    enhancementCategories: ['geography', 'culture', 'history', 'politics', 'economy']
  },
  
  faction: {
    fieldPrompts: {
      name: "Create a powerful name for this faction that reflects their ideology",
      ideology: "Define the core beliefs and principles that unite this faction",
      goals: "Outline the faction's primary objectives and ambitions",
      structure: "Describe the organizational hierarchy and leadership structure",
      resources: "Detail the faction's assets, funding, and capabilities",
      territory: "Define the lands or regions under this faction's influence",
      history: "Chronicle the faction's formation and major historical events",
      rivals: "Identify opposing factions and sources of conflict",
      reputation: "Explain how others view this faction and their actions"
    },
    imagePrompts: {
      emblem: "heraldic emblem, coat of arms, symbolic design",
      banner: "faction banner, ceremonial flag, military standard"
    },
    enhancementCategories: ['identity', 'structure', 'politics', 'military', 'culture']
  },
  
  item: {
    fieldPrompts: {
      name: "Generate an intriguing name for this item that hints at its nature",
      description: "Provide a detailed physical description of this item",
      material: "Specify what materials this item is made from",
      craftsmanship: "Describe the quality and style of workmanship",
      rarity: "Determine how rare and valuable this item is",
      properties: "List any special magical or mundane properties",
      history: "Create a backstory explaining this item's origins",
      currentLocation: "Describe where this item can currently be found",
      lore: "Add myths, legends, or stories associated with this item"
    },
    imagePrompts: {
      illustration: "detailed item illustration, technical drawing style",
      artifact: "magical artifact, glowing effects, mystical appearance"
    },
    enhancementCategories: ['properties', 'history', 'craftsmanship', 'lore']
  },
  
  organization: {
    fieldPrompts: {
      name: "Create a name that captures this organization's purpose and character",
      purpose: "Define the organization's primary mission and objectives",
      structure: "Outline the hierarchy and organizational framework",
      membership: "Describe who can join and membership requirements",
      influence: "Explain the organization's reach and political power",
      resources: "Detail funding sources and available resources",
      activities: "List the organization's regular operations and projects",
      history: "Chronicle the organization's founding and development",
      reputation: "Describe public perception and relationships with others"
    },
    imagePrompts: {
      logo: "professional organization logo, corporate design",
      headquarters: "impressive building, architectural photography"
    },
    enhancementCategories: ['structure', 'operations', 'influence', 'culture', 'history']
  }
};

class UniversalAIGenerationService {
  private geminiClient: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('No Google API key found in environment variables');
    }
    this.geminiClient = new GoogleGenerativeAI(apiKey);
  }

  async generateEntityField(
    entityType: string,
    fieldKey: string,
    fieldLabel: string,
    entity: any,
    currentValue?: string
  ): Promise<string> {
    const config = ENTITY_AI_CONFIGS[entityType];
    if (!config) {
      throw new Error(`No AI configuration found for entity type: ${entityType}`);
    }

    const fieldPrompt = config.fieldPrompts[fieldKey];
    if (!fieldPrompt) {
      throw new Error(`No field prompt found for ${entityType}.${fieldKey}`);
    }

    const contextPrompt = this.buildEntityContext(entityType, entity);
    const fullPrompt = `${fieldPrompt}

Entity Context:
${contextPrompt}

${currentValue ? `Current value: ${currentValue}` : ''}

Generate a response that fits this ${entityType} and enhances the overall narrative. Keep it concise but engaging.`;

    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(fullPrompt);
    return result.response.text().trim();
  }

  async generateEntityImage(
    entityType: string,
    entity: any,
    stylePrompt?: string,
    imageType?: string
  ): Promise<string> {
    const config = ENTITY_AI_CONFIGS[entityType];
    if (!config) {
      throw new Error(`No AI configuration found for entity type: ${entityType}`);
    }

    const contextPrompt = this.buildEntityContext(entityType, entity);
    const baseImagePrompt = config.imagePrompts[imageType || Object.keys(config.imagePrompts)[0]];
    
    const fullPrompt = `${contextPrompt}, ${baseImagePrompt}${stylePrompt ? `, ${stylePrompt}` : ''}`;

    // For now, return a placeholder. In production, this would call an image generation API
    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(`Create a detailed description for an image of: ${fullPrompt}`);
    
    // This would typically generate an actual image, but for now we return the description
    return `data:image/svg+xml;base64,${btoa(`
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#f3f4f6"/>
        <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">
          Generated ${imageType || 'Image'}
        </text>
        <text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">
          ${entity.name || `${entityType} image`}
        </text>
      </svg>
    `)}`;
  }

  async enhanceEntity(
    entityType: string,
    entity: any,
    selectedCategories: string[]
  ): Promise<any> {
    const config = ENTITY_AI_CONFIGS[entityType];
    if (!config) {
      throw new Error(`No AI configuration found for entity type: ${entityType}`);
    }

    const contextPrompt = this.buildEntityContext(entityType, entity);
    const enhancements: any = {};

    for (const category of selectedCategories) {
      if (!config.enhancementCategories.includes(category)) {
        continue;
      }

      const categoryPrompt = `Enhance the ${category} aspects of this ${entityType}:

${contextPrompt}

Generate detailed, creative content for the ${category} category that enriches this ${entityType}'s story and makes them more compelling. Return the response as valid JSON with field names as keys.`;

      try {
        const model = this.geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(categoryPrompt);
        const enhancementData = JSON.parse(result.response.text());
        Object.assign(enhancements, enhancementData);
      } catch (error) {
        console.error(`Failed to enhance ${category} for ${entityType}:`, error);
      }
    }

    return enhancements;
  }

  private buildEntityContext(entityType: string, entity: any): string {
    const parts = [];
    
    if (entity.name) parts.push(`Name: ${entity.name}`);
    if (entity.description) parts.push(`Description: ${entity.description}`);
    
    // Add entity-specific context
    switch (entityType) {
      case 'character':
        if (entity.race) parts.push(`Race: ${entity.race}`);
        if (entity.class) parts.push(`Class: ${entity.class}`);
        if (entity.age) parts.push(`Age: ${entity.age}`);
        break;
      case 'location':
        if (entity.terrain) parts.push(`Terrain: ${entity.terrain}`);
        if (entity.climate) parts.push(`Climate: ${entity.climate}`);
        break;
      case 'faction':
        if (entity.ideology) parts.push(`Ideology: ${entity.ideology}`);
        if (entity.type) parts.push(`Type: ${entity.type}`);
        break;
    }
    
    return parts.join('\n');
  }
}

export const universalAIGeneration = new UniversalAIGenerationService();