import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LocationGenerationOptions {
  locationType?: string;
  atmosphere?: string;
  scale?: string;
  setting?: string;
  existingContext?: {
    characters?: any[];
    locations?: any[];
    themes?: string[];
  };
}

interface Location {
  name: string;
  description: string;
  history: string;
  significance: string;
  atmosphere: string;
  type: string;
  scale: string;
  tags: string[];
}

export async function generateContextualLocation(
  projectName: string,
  projectDescription: string,
  options: LocationGenerationOptions = {}
): Promise<Location> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY_1 || import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set VITE_GOOGLE_API_KEY_1 or VITE_GOOGLE_API_KEY in your environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const contextInfo = options.existingContext ? `
    Existing Characters: ${options.existingContext.characters?.map(c => `${c.name} (${c.role})`).join(', ') || 'None'}
    Existing Locations: ${options.existingContext.locations?.map(l => l.name).join(', ') || 'None'}
    Project Themes: ${options.existingContext.themes?.join(', ') || 'None'}
  ` : '';

  const prompt = `You are a creative writing assistant specializing in world-building and location creation. Create a detailed, original location for the project "${projectName}".

Project Description: ${projectDescription}

Location Requirements:
- Type: ${options.locationType || 'any interesting location'}
- Atmosphere: ${options.atmosphere || 'fitting for the story'}
- Scale: ${options.scale || 'appropriate size'}
- Setting: ${options.setting || 'matches project tone'}

${contextInfo}

Generate a location that:
1. Fits seamlessly into the existing world context
2. Has rich, evocative details that spark imagination
3. Includes historical significance and current importance
4. Has clear atmospheric qualities
5. Connects meaningfully to the story world

Return ONLY a JSON object with this exact structure:
{
  "name": "Location Name",
  "description": "A rich, detailed description of the location (2-3 sentences)",
  "history": "The historical background and how it came to be (2-3 sentences)",
  "significance": "Why this location matters to the story world (1-2 sentences)",
  "atmosphere": "The mood, feeling, and sensory details (1-2 sentences)",
  "type": "The category of location (city, forest, castle, etc.)",
  "scale": "The size/scope (small village, massive city, regional, etc.)",
  "tags": ["3-5 descriptive tags"]
}

Make it creative, original, and compelling!`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }
    
    const locationData = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'history', 'significance', 'atmosphere', 'type', 'scale', 'tags'];
    for (const field of requiredFields) {
      if (!locationData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return locationData as Location;
  } catch (error) {
    console.error('Location generation error:', error);
    throw new Error(`Failed to generate location: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}