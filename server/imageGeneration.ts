import OpenAI from "openai";
import { GoogleGenerativeAI } from '@google/generative-ai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Gemini client (same as character generation)
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_X || process.env.GOOGLE_API_KEY_2 || process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_X, GOOGLE_API_KEY_2, GOOGLE_API_KEY_1, GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
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

  // Optimize DALL-E 3 prompt for better portrait generation
  const optimizedPrompt = `Portrait photography of ${params.characterPrompt}. Professional studio lighting, highly detailed facial features, sharp focus on eyes, photorealistic quality. ${params.stylePrompt || 'High-quality portrait with dramatic lighting, cinematic composition, award-winning photography'}. Medium shot composition, detailed textures, realistic proportions, expressive eyes.`;
  console.log('Generating OpenAI image with optimized prompt:', optimizedPrompt);
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: optimizedPrompt,
    n: 1,
    size: "1024x1024",
    quality: "hd", // Use HD quality for better portraits
    style: "vivid", // Vivid style for more detailed character portraits
  });

  if (!response.data?.[0]?.url) {
    throw new Error("No image URL returned from OpenAI");
  }

  return { url: response.data[0].url };
}

async function generateWithGemini(params: CharacterImageRequest): Promise<{ url: string }> {
  try {
    // Optimize prompt structure for better portrait generation
    const optimizedPrompt = `Professional character portrait photography: ${params.characterPrompt}. 
    
Artistic direction: ${params.stylePrompt || 'High-quality portrait photography with dramatic lighting, masterpiece quality, highly detailed, sharp focus, cinematic lighting, expressive eyes, realistic proportions'}.

Photography specifications: Medium shot portrait composition, professional studio lighting, detailed facial features, clear sharp focus on face and eyes, photorealistic quality, award-winning portrait photography.`;
    
    console.log('Generating Gemini image with optimized prompt:', optimizedPrompt);

    // Use the @google/genai library with proper configuration
    const { GoogleGenAI, Modality } = await import("@google/genai");
    
    const apiKey = process.env.GEMINI_X || process.env.GOOGLE_API_KEY_2 || process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add GEMINI_X, GOOGLE_API_KEY_2, GOOGLE_API_KEY_1, GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Use the image generation model with optimized prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: optimizedPrompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

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
      if (part.text) {
        console.log('Gemini response text:', part.text);
      } else if (part.inlineData && part.inlineData.data) {
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
    
    // Provide helpful error messages based on common issues
    if (error.message.includes('not supported') || error.message.includes('Bad Request')) {
      throw new Error('Image generation not available with your current Google API key. This could be due to:\n' +
                     '• Regional restrictions (not available in all countries)\n' +
                     '• API key limitations (may need paid tier)\n' +
                     '• Model experimental status\n\n' +
                     'Try using Google AI Studio directly at https://aistudio.google.com/ to test image generation.');
    }
    
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