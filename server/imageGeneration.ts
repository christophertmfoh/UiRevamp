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
    const fullPrompt = `Generate a detailed character portrait: ${params.characterPrompt}. ${params.stylePrompt}`;
    console.log('Generating Gemini image with prompt:', fullPrompt);

    // Use Gemini's image generation model with correct API structure
    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash-preview-image-generation",
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      }
    });
    
    const response = await model.generateContent(fullPrompt);

    console.log('Gemini response structure:', JSON.stringify(response, null, 2));

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content parts returned from Gemini");
    }

    // Find the image part
    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // Convert base64 to blob URL for temporary use
        const imageData = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        console.log('Successfully extracted image from Gemini response');
        return { url: imageData };
      }
    }

    throw new Error("No image data found in Gemini response");
  } catch (error: any) {
    console.error('Failed to generate Gemini image:', error);
    throw new Error(`Gemini image generation failed: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateCharacterImage(params: CharacterImageRequest): Promise<{ url: string }> {
  try {
    console.log('Attempting image generation with primary engine:', params.aiEngine);
    switch (params.aiEngine) {
      case 'openai':
        return await generateWithOpenAI(params);
      case 'gemini':
        return await generateWithGemini(params);
      default:
        // Default to OpenAI if engine not specified or unknown
        return await generateWithOpenAI(params);
    }
  } catch (error: any) {
    console.error('Failed to generate image:', error);
    throw new Error(`Image generation failed: ${error?.message || 'Unknown error'}`);
  }
}