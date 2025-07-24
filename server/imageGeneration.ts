import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Gemini AI with the API key
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "AIzaSyCIOJd-og642NA-5uQgaewy8IILv1npTh8" });

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
    const response = await gemini.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ 
        role: "user", 
        parts: [{ text: fullPrompt }] 
      }],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    });

    console.log('Gemini response structure:', JSON.stringify(response, null, 2));

    if (!response.response) {
      throw new Error("No response returned from Gemini");
    }

    const candidates = response.response.candidates;
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
        try {
          return await generateWithGemini(params);
        } catch (geminiError: any) {
          console.log('Gemini failed, falling back to OpenAI:', geminiError.message);
          // Fallback to OpenAI if Gemini fails
          const openaiParams = { ...params, aiEngine: 'openai' as const };
          return await generateWithOpenAI(openaiParams);
        }
      default:
        // Default to OpenAI if engine not specified or unknown
        return await generateWithOpenAI(params);
    }
  } catch (error: any) {
    console.error('Failed to generate image:', error);
    throw new Error(`Image generation failed: ${error?.message || 'Unknown error'}`);
  }
}