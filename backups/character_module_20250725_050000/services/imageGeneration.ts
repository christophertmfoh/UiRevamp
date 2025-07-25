import OpenAI from 'openai';

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Lazy initialization of OpenAI client to avoid API key errors on module load
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = isClient ? import.meta.env.VITE_OPENAI_API_KEY : process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
}

export async function generateCharacterPortrait(
  characterData: any,
  stylePrompt: string = "high-quality digital art, detailed character portrait"
): Promise<string> {
  try {
    const prompt = `${stylePrompt}, character: ${characterData.name || 'character'}, ${characterData.physicalDescription || characterData.description || 'detailed character'}`;
    
    const client = getOpenAIClient();
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data?.[0]?.url || '';
  } catch (error) {
    console.error('Error generating character portrait:', error);
    throw new Error('Failed to generate character portrait');
  }
}

export async function generateImageWithOpenAI(
  prompt: string,
  size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024"
): Promise<string> {
  try {
    const client = getOpenAIClient();
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size,
      quality: "standard",
    });

    return response.data?.[0]?.url || '';
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    throw new Error('Failed to generate image');
  }
}