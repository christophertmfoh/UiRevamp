import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface EnhanceCharacterParams {
  currentData: any;
  project: any;
  character: any;
}

export async function enhanceCharacterWithAI({ currentData, project, character }: EnhanceCharacterParams) {
  // Build context about what fields have content vs what's empty
  const filledFields: string[] = [];
  const emptyFields: string[] = [];
  
  // Analyze current data to see what's filled and what's empty
  Object.entries(currentData).forEach(([key, value]) => {
    if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      filledFields.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
    } else if (key !== 'id' && key !== 'projectId' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'imageUrl' && key !== 'displayImageId' && key !== 'imageGallery') {
      emptyFields.push(key);
    }
  });

  const systemPrompt = `You are an expert creative writing assistant specializing in character development. Your task is to intelligently fill out missing character details based on existing information.

CONTEXT:
- Project: ${project.name} (${project.type})
- Genre: ${project.genre?.join(', ') || 'Not specified'}
- Project Description: ${project.description || 'Not provided'}

CURRENT CHARACTER DATA:
${filledFields.map(field => `- ${field}`).join('\n')}

FIELDS TO ENHANCE:
${emptyFields.join(', ')}

INSTRUCTIONS:
1. Use the existing character data to infer logical, consistent details for empty fields
2. Maintain consistency with the character's established personality, role, and background
3. Consider the project's genre and setting when creating details
4. Be creative but plausible - avoid contradictions with existing data
5. For array fields (like skills, traits, fears), provide 2-4 relevant items as comma-separated values
6. Keep descriptions concise but vivid (1-3 sentences per field)
7. Ensure all details support the character's role in the story

Return ONLY a JSON object with the enhanced character data, including both existing and new fields. Do not include explanations or additional text.`;

  const prompt = `Based on the character information provided, intelligently fill out the missing fields to create a complete, cohesive character profile. Focus on details that would enhance the character's depth and storytelling potential.

Current character: ${JSON.stringify(currentData, null, 2)}

Please return a complete character object with all fields filled out logically and consistently.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const rawJson = response.text;
    console.log('Raw character enhancement response:', rawJson);

    if (rawJson) {
      const enhancedData = JSON.parse(rawJson);
      
      // Ensure we preserve important system fields
      const finalData = {
        ...enhancedData,
        id: currentData.id,
        projectId: currentData.projectId,
        imageUrl: currentData.imageUrl || '',
        displayImageId: currentData.displayImageId || '',
        imageGallery: currentData.imageGallery || [],
        createdAt: currentData.createdAt,
        updatedAt: currentData.updatedAt
      };
      
      return finalData;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error('Character enhancement error:', error);
    throw new Error(`Failed to enhance character: ${error}`);
  }
}