import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Theme } from '../shared/schema';

interface ThemeGenerationOptions {
  themeType: string;
  scope: string;
  customPrompt: string;
  tone: string;
  focus: string;
}

interface ThemeGenerationContext {
  project: Project;
  existingCharacters?: any[];
  existingThemes?: any[];
  generationOptions?: ThemeGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: ThemeGenerationContext): string {
  const { project, existingCharacters, existingThemes, generationOptions } = context;
  
  let contextPrompt = `Create a theme for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (existingThemes && existingThemes.length > 0) {
    contextPrompt += `\n\nExisting Themes:`;
    existingThemes.slice(0, 5).forEach(theme => {
      contextPrompt += `\n- ${theme.name}: ${theme.description || 'A thematic element in this story'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.themeType) {
      contextPrompt += `\n\nTheme Type: ${generationOptions.themeType}`;
    }
    if (generationOptions.scope) {
      contextPrompt += `\nScope: ${generationOptions.scope}`;
    }
    if (generationOptions.tone) {
      contextPrompt += `\nTone: ${generationOptions.tone}`;
    }
    if (generationOptions.focus) {
      contextPrompt += `\nFocus: ${generationOptions.focus}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualTheme(
  context: ThemeGenerationContext
): Promise<Partial<Theme>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in literary theme creation. Generate a detailed theme that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Theme Name",
  "description": "What this theme represents and explores in the story",
  "core_message": "The central message or question this theme addresses",
  "manifestations": "How this theme appears and is expressed throughout the story",
  "conflicts": "The tensions and conflicts this theme creates",
  "character_connections": "How characters embody or struggle with this theme",
  "symbolism": "Symbols, motifs, or imagery associated with this theme",
  "resolution": "How this theme is resolved or concluded in the story",
  "universal_relevance": "Why this theme matters to readers beyond the story",
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
      const themeData = JSON.parse(jsonString);
      
      const finalTheme = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: themeData.name || 'Generated Theme',
        description: themeData.description || 'A significant thematic element that runs throughout the story.',
        manifestation: themeData.manifestations || '',
        symbolism: Array.isArray(themeData.symbolism) ? themeData.symbolism : themeData.symbolism ? [themeData.symbolism] : [],
        examples: Array.isArray(themeData.examples) ? themeData.examples : themeData.character_connections ? [themeData.character_connections] : [],
        significance: themeData.universal_relevance || '',
        tags: Array.isArray(themeData.tags) ? themeData.tags : [],
      };

      return finalTheme;
      
    } catch (parseError) {
      const fallbackTheme = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Theme',
        description: 'The eternal struggle between hope and despair that defines the human condition.',
        manifestation: 'Appears through character decisions, symbolic imagery, and plot developments.',
        symbolism: ['Light and darkness', 'Growth and decay', 'Songs in silence'],
        examples: ['Protagonists embody hope while antagonists represent despair'],
        significance: 'Resonates with anyone who has faced seemingly impossible challenges.',
        tags: ['philosophical', 'emotional', 'universal'],
      };

      return fallbackTheme;
    }

  } catch (error) {
    console.error('Theme generation error:', error);
    throw new Error('Failed to generate theme with AI');
  }
}