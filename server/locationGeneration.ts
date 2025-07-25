import { generateWorldElement } from './services/unifiedAI';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || '');

interface LocationGenerationRequest {
  projectId: string;
  prompt: string;
  locationName?: string;
  projectContext: {
    title: string;
    description?: string;
    genre?: string;
    setting?: string;
  };
}

export async function generateLocation(request: LocationGenerationRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `You are an expert world-builder and fantasy location designer. Your task is to create detailed, immersive locations for creative writing projects.

Given a user's prompt and project context, generate a comprehensive location with the following structure:

1. **Name**: Create an evocative name (or use the provided name if given)
2. **Description**: A rich, detailed description of the location (2-3 paragraphs)
3. **Significance**: Why this place is important to the story/world
4. **History**: The location's past and how it came to be
5. **Atmosphere**: The mood, feeling, and sensory experience of being there
6. **Tags**: 3-5 relevant category tags

Make the location feel authentic and lived-in. Consider:
- Geographic features and environment
- Architecture and construction materials
- Who lives/works/visits there
- Economic and social functions
- Cultural significance
- Hidden secrets or mysteries
- Sensory details (sights, sounds, smells)

Return the response as a JSON object with the exact fields: name, description, significance, history, atmosphere, tags (array).`;

    const userPrompt = `Project Context:
Title: ${request.projectContext.title}
${request.projectContext.description ? `Description: ${request.projectContext.description}` : ''}
${request.projectContext.genre ? `Genre: ${request.projectContext.genre}` : ''}
${request.projectContext.setting ? `Setting: ${request.projectContext.setting}` : ''}

${request.locationName ? `Location Name: ${request.locationName}` : ''}

User Request: ${request.prompt}

Please create a detailed location based on this information. Make it feel authentic to the project's world and genre.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt }
    ]);

    const response = result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    let locationData;
    try {
      // Look for JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        locationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON, creating fallback location:', parseError);
      // Create a fallback location from the text response
      locationData = {
        name: request.locationName || 'Generated Location',
        description: text.slice(0, 500) + '...',
        significance: 'A significant location in the story',
        history: 'This location has a rich and mysterious history',
        atmosphere: 'The atmosphere here is charged with possibility',
        tags: ['generated', 'location', 'fantasy']
      };
    }

    // Ensure required fields exist
    const finalLocation = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      projectId: request.projectId,
      name: locationData.name || request.locationName || 'Generated Location',
      description: locationData.description || 'A fascinating location waiting to be explored.',
      significance: locationData.significance || '',
      history: locationData.history || '',
      atmosphere: locationData.atmosphere || '',
      tags: Array.isArray(locationData.tags) ? locationData.tags : [],
    };

    return finalLocation;

  } catch (error) {
    console.error('Location generation error:', error);
    throw new Error('Failed to generate location with AI');
  }
}