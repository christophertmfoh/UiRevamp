import { storage } from "../storage";
import { generateCharacterPrompt } from "../utils/characterPromptBuilder";
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
  const prompt = generateCharacterPrompt({
    projectName,
    projectDescription,
    characterType,
    role,
    customPrompt,
    personality,
    archetype
  });

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

  // Create character in database
  const character = await storage.createCharacter({
    ...generatedCharacter,
    projectId
  });

  return character;
}