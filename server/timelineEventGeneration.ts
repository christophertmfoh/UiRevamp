import { generateWorldElement } from './services/unifiedAI';
import type { Project, TimelineEvent } from '../shared/schema';

interface TimelineEventGenerationOptions {
  eventType: string;
  scope: string;
  customPrompt: string;
  impact: string;
  era: string;
}

interface TimelineEventGenerationContext {
  project: Project;
  locations?: any[];
  existingCharacters?: any[];
  existingTimelineEvents?: any[];
  generationOptions?: TimelineEventGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: TimelineEventGenerationContext): string {
  const { project, locations, existingCharacters, existingTimelineEvents, generationOptions } = context;
  
  let contextPrompt = `Create a timeline event for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (existingTimelineEvents && existingTimelineEvents.length > 0) {
    contextPrompt += `\n\nExisting Timeline Events:`;
    existingTimelineEvents.slice(0, 5).forEach(event => {
      contextPrompt += `\n- ${event.name}: ${event.description || 'A significant historical event'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.eventType) {
      contextPrompt += `\n\nEvent Type: ${generationOptions.eventType}`;
    }
    if (generationOptions.scope) {
      contextPrompt += `\nScope: ${generationOptions.scope}`;
    }
    if (generationOptions.era) {
      contextPrompt += `\nEra: ${generationOptions.era}`;
    }
    if (generationOptions.impact) {
      contextPrompt += `\nImpact: ${generationOptions.impact}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualTimelineEvent(
  context: TimelineEventGenerationContext
): Promise<Partial<TimelineEvent>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in historical timeline event creation. Generate a detailed timeline event that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Event Name",
  "description": "Detailed description of what happened during this event",
  "date": "When this event occurred (can be relative like 'Age of Shadows' or specific)",
  "impact": "How this event affected the world and its people",
  "causes": "What led to this event happening",
  "consequences": "The long-term effects and results of this event",
  "key_figures": "Important people involved in this event",
  "locations": "Where this event took place",
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
      const eventData = JSON.parse(jsonString);
      
      const finalTimelineEvent = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        era: eventData.date || 'The Age of Change',
        period: eventData.era || '',
        title: eventData.name || 'Generated Timeline Event',
        description: eventData.description || 'A significant event that shaped the world.',
        significance: eventData.impact || '',
        participants: Array.isArray(eventData.key_figures) ? eventData.key_figures : eventData.key_figures ? [eventData.key_figures] : [],
        locations: Array.isArray(eventData.locations) ? eventData.locations : eventData.locations ? [eventData.locations] : [],
        consequences: eventData.consequences || '',
        order: Date.now(),
        tags: Array.isArray(eventData.tags) ? eventData.tags : [],
      };

      return finalTimelineEvent;
      
    } catch (parseError) {
      const fallbackTimelineEvent = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        era: 'The Age of Change',
        period: 'Early Era',
        title: 'Generated Timeline Event',
        description: 'A pivotal moment that changed the course of history.',
        significance: 'This event had far-reaching consequences across the realm.',
        participants: ['Unknown figures'],
        locations: ['Multiple locations'],
        consequences: 'The world was forever altered by these events.',
        order: Date.now(),
        tags: ['historical', 'pivotal', 'world-changing'],
      };

      return fallbackTimelineEvent;
    }

  } catch (error) {
    console.error('Timeline event generation error:', error);
    throw new Error('Failed to generate timeline event with AI');
  }
}