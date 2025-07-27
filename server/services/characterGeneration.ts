import { storage } from "../storage";
// Removed generateCharacterPrompt import - using inline prompt generation
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || '');

interface GenerateCharacterParams {
  projectId: string;
  projectName: string;
  projectDescription: string;
  characterType?: string;
  role?: string;
  customPrompt?: string;
  personality?: string;
  archetype?: string;
}

export async function generateCharacterWithAI(params: GenerateCharacterParams) {
  const {
    projectId,
    projectName,
    projectDescription,
    characterType,
    role,
    customPrompt,
    personality,
    archetype
  } = params;

  // Build the generation prompt  
  let prompt = `Generate a detailed character for the project "${projectName}"`;
  
  if (projectDescription) {
    prompt += `\n\nProject description: ${projectDescription}`;
  }
  
  if (characterType) {
    prompt += `\n\nCharacter type: ${characterType}`;
  }
  
  if (role) {
    prompt += `\nRole in story: ${role}`;
  }
  
  if (personality) {
    prompt += `\nPersonality traits: ${personality}`;
  }
  
  if (archetype) {
    prompt += `\nArchetype: ${archetype}`;
  }
  
  if (customPrompt) {
    prompt += `\n\nAdditional requirements: ${customPrompt}`;
  }
  
  prompt += `\n\nGenerate a comprehensive character with name, description, personality, abilities, background, and other relevant details. Return valid JSON format.`;

  // Generate with AI
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  });

  const result = await model.generateContent(prompt);
  const generatedCharacter = JSON.parse(result.response.text());

  // Transform AI-generated data for database compatibility
  const { transformCharacterData } = await import("../utils/characterTransformers");
  
  const characterData = {
    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: generatedCharacter.name || 'Generated Character',
    projectId,
    ...generatedCharacter
  };
  
  console.log('AI Generated data sample:', {
    name: characterData.name,
    personalityTraits: characterData.personalityTraits,
    abilities: characterData.abilities,
    skills: characterData.skills
  });
  
  // Apply data transformation to handle array fields correctly
  const transformedData = transformCharacterData(characterData);
  
  console.log('Transformed data sample:', {
    name: transformedData.name,
    personalityTraits: transformedData.personalityTraits,
    abilities: transformedData.abilities,
    skills: transformedData.skills
  });
  
  const character = await storage.createCharacter(transformedData);

  return character;
}