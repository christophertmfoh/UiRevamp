import OpenAI from "openai";
import { GoogleGenerativeAI } from '@google/generative-ai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Gemini client (same as character generation)
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GOOGLE_API_KEY_1, GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
  }
  
  console.log('Using API key:', apiKey.substring(0, 10) + '...');
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
    const fullPrompt = `Create a detailed character portrait: ${params.characterPrompt}. Style: ${params.stylePrompt}`;
    console.log('Generating Gemini image with prompt:', fullPrompt);

    // Use Gemini's image generation model with correct configuration
    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.0-flash-preview-image-generation"
    });
    
    // Try different configuration approaches
    let response;
    try {
      // First attempt: Use the newer SDK approach
      response = await model.generateContent({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"] as any
        }
      } as any);
    } catch (configError: any) {
      console.log('First config failed, trying alternative approach:', configError.message);
      
      // Second attempt: Try without explicit configuration
      try {
        response = await model.generateContent(fullPrompt);
      } catch (fallbackError: any) {
        console.log('Fallback approach also failed:', fallbackError.message);
        
        // If both fail, it's likely an API key permission or regional issue
        if (fallbackError.message.includes('response modalities') || 
            fallbackError.message.includes('not supported') ||
            fallbackError.message.includes('Bad Request')) {
          throw new Error('Image generation not available with your current Google API key. This could be due to:\n' +
                         '• Regional restrictions (not available in all countries)\n' +
                         '• API key limitations (may need paid tier)\n' +
                         '• Model experimental status\n\n' +
                         'Try using Google AI Studio directly at https://aistudio.google.com/ to test image generation.');
        }
        throw fallbackError;
      }
    }
    
    console.log('Gemini response received');

    // Process the response to extract image data
    const result = response.response;
    if (!result || !result.candidates || result.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini");
    }

    const content = result.candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content parts returned from Gemini");
    }

    // Find the image part
    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // Convert base64 to data URL for display
        const mimeType = part.inlineData.mimeType || 'image/png';
        const imageData = `data:${mimeType};base64,${part.inlineData.data}`;
        console.log('Successfully extracted image from Gemini response');
        return { url: imageData };
      }
    }

    throw new Error("No image data found in Gemini response - model may have returned only text");
  } catch (error: any) {
    console.error('Failed to generate Gemini image:', error);
    throw new Error(`Gemini image generation failed: ${error?.message || 'Unknown error'}`);
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