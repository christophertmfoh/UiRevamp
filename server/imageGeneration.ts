import OpenAI from "openai";
import { GoogleGenerativeAI } from '@google/generative-ai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Gemini client (same as character generation)
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

interface CharacterImageRequest {
  characterPrompt: string;
  stylePrompt: string;
  aiEngine: string;
}

async function generateWithOpenAI(params: CharacterImageRequest): Promise<{ url: string }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const fullPrompt = `${params.characterPrompt}, ${params.stylePrompt}`;
  console.log('Generating OpenAI image with prompt:', fullPrompt);
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: fullPrompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  if (!response.data?.[0]?.url) {
    throw new Error("No image URL returned from OpenAI");
  }

  return { url: response.data[0].url };
}

async function generateWithGemini(params: CharacterImageRequest): Promise<{ url: string }> {
  try {
    const fullPrompt = `Create an image of: ${params.characterPrompt}. Style: ${params.stylePrompt}`;
    console.log('Generating Gemini image with prompt:', fullPrompt);

    // Use Gemini's regular text model to generate a description for image creation
    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });
    
    // Generate a detailed image description
    const imagePrompt = `Create a detailed visual description for an image of this character: ${params.characterPrompt}. Style should be: ${params.stylePrompt}. Provide a clear, detailed description that could be used to create an artistic portrait.`;
    
    const response = await model.generateContent(imagePrompt);
    const result = response.response;
    const description = result.text();
    
    console.log('Generated image description:', description);
    
    // Since we can't generate actual images without OpenAI, return a placeholder
    // In a real implementation, you would integrate with an image generation service that accepts your API keys
    throw new Error("Image generation requires a paid image generation service. Please use a different method or provide an OpenAI API key.");
    
  } catch (error: any) {
    console.error('Failed to generate Gemini image:', error);
    throw new Error(`Image generation is not available without a paid service: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateCharacterImage(params: CharacterImageRequest): Promise<{ url: string }> {
  try {
    console.log('Attempting image generation with Gemini');
    
    // Always use Gemini for image generation
    return await generateWithGemini(params);
  } catch (error: any) {
    console.error('Failed to generate image:', error);
    throw new Error(`Image generation failed: ${error?.message || 'Unknown error'}`);
  }
}