import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Organization } from '../shared/schema';

interface OrganizationGenerationOptions {
  organizationType: string;
  scope: string;
  customPrompt: string;
  purpose: string;
  structure: string;
}

interface OrganizationGenerationContext {
  project: Project;
  existingCharacters?: any[];
  existingOrganizations?: any[];
  generationOptions?: OrganizationGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: OrganizationGenerationContext): string {
  const { project, existingCharacters, existingOrganizations, generationOptions } = context;
  
  let contextPrompt = `Create an organization for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
      contextPrompt += `\n- ${location.name}: ${location.description || 'A significant location'}`;
    });
  }
  
  if (existingCharacters && existingCharacters.length > 0) {
    contextPrompt += `\n\nExisting Characters:`;
    existingCharacters.slice(0, 5).forEach(character => {
      contextPrompt += `\n- ${character.name} (${character.role || 'character'})`;
    });
  }
  
  if (existingOrganizations && existingOrganizations.length > 0) {
    contextPrompt += `\n\nExisting Organizations:`;
    existingOrganizations.slice(0, 5).forEach(org => {
      contextPrompt += `\n- ${org.name}: ${org.description || 'A significant organization'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.organizationType) {
      contextPrompt += `\n\nOrganization Type: ${generationOptions.organizationType}`;
    }
    if (generationOptions.scope) {
      contextPrompt += `\nScope: ${generationOptions.scope}`;
    }
    if (generationOptions.purpose) {
      contextPrompt += `\nPurpose: ${generationOptions.purpose}`;
    }
    if (generationOptions.structure) {
      contextPrompt += `\nStructure: ${generationOptions.structure}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualOrganization(
  context: OrganizationGenerationContext
): Promise<Partial<Organization>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in organization creation. Generate a detailed organization that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Organization Name",
  "type": "Type of organization (guild, cult, academy, etc.)",
  "description": "Detailed description of what this organization is and does",
  "purpose": "The organization's primary goals and mission",
  "structure": "How the organization is structured and governed",
  "membership": "Who belongs to this organization and how they join",
  "influence": "The organization's reach and power in the world",
  "secrets": "Hidden aspects or secret agendas of the organization",
  "tags": ["tag1", "tag2", "tag3"]
}

${projectContext}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    let cleanText = text.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '');
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    let jsonString = jsonMatch[0].replace(/[""]/g, '"').replace(/['']/g, "'");
    
    try {
      const orgData = JSON.parse(jsonString);
      
      const finalOrganization = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: orgData.name || 'Generated Organization',
        type: orgData.type || '',
        description: orgData.description || 'A mysterious organization with hidden purposes.',
        purpose: orgData.purpose || '',
        structure: orgData.structure || '',
        membership: orgData.membership || '',
        influence: orgData.influence || '',
        secrets: orgData.secrets || '',
        tags: Array.isArray(orgData.tags) ? orgData.tags : [],
      };

      return finalOrganization;
      
    } catch (parseError) {
      const fallbackOrganization = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Organization',
        type: 'Secret Society',
        description: 'A mysterious organization that operates from the shadows.',
        purpose: 'To achieve their enigmatic goals through careful planning.',
        structure: 'Hierarchical with strict codes of conduct.',
        membership: 'Exclusive membership by invitation only.',
        influence: 'Significant but carefully hidden influence.',
        secrets: 'Their true agenda remains carefully guarded.',
        tags: ['mysterious', 'secretive', 'influential'],
      };

      return fallbackOrganization;
    }

  } catch (error) {
    console.error('Organization generation error:', error);
    throw new Error('Failed to generate organization with AI');
  }
}