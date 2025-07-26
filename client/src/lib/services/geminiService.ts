import type { Project, Character } from '../types';

// Define service-specific types
interface GeneratedCharacter {
  name: string;
  role: string;
  description: string;
  personality: string;
  backstory: string;
  motivations: string;
  archetypes: string[];
}

interface FleshedOutCharacter extends Character {
  fears: string;
  secrets: string;
  relationships: any[];
}

interface AICoachFeedback {
  corePrincipleAnalysis: string;
  actionableSuggestions: string[];
  guidingQuestions: string[];
}

// Check if we're in browser environment  
const isClient = typeof window !== 'undefined';
const API_KEY = isClient ? import.meta.env.VITE_GEMINI_API_KEY : (process.env.GEMINI_API_KEY || process.env.API_KEY || 'your-gemini-api-key');

export async function generateNewCharacter(
  prompt: string, 
  project: Project, 
  toolId: string
): Promise<GeneratedCharacter> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    name: "Generated Character",
    role: "protagonist",
    description: "A character generated from your prompt",
    personality: "Complex and multi-dimensional",
    backstory: "Rich history that informs their current situation",
    motivations: "Clear goals that drive the story forward",
    archetypes: ["The Hero", "The Explorer"]
  };
}

export async function fleshOutCharacter(
  character: Character, 
  project: Project, 
  toolId: string
): Promise<FleshedOutCharacter> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    ...character,
    fears: "Deep-seated fears that create internal conflict",
    secrets: "Hidden aspects that add complexity",
    relationships: []
  };
}

export async function generateCharacterImage(
  character: Character, 
  stylePrompt: string, 
  engine: 'gemini' | 'midjourney' | 'openai'
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return a placeholder image URL
  return `https://api.dicebear.com/7.x/personas/svg?seed=${character.name}`;
}

export async function fleshOutItem(
  item: Item, 
  project: Project, 
  toolId: string
): Promise<Item> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    ...item,
    history: "Enhanced history with AI insights",
    powers: "Detailed magical or special properties",
    significance: "Importance to the story and characters"
  };
}

export async function generateItemImage(
  item: Item, 
  stylePrompt: string, 
  engine: 'gemini' | 'midjourney' | 'openai'
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return `https://picsum.photos/400/400?random=${item.id}`;
}

  stylePrompt: string, 
  engine: 'gemini' | 'midjourney' | 'openai'
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
}

  project: Project, 
  toolId: string
): Promise<Location> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    history: "Rich historical background",
    significance: "Important role in the story",
    atmosphere: "Vivid sensory details"
  };
}

export async function fleshOutFaction(
  faction: Faction, 
  project: Project, 
  toolId: string
): Promise<Faction> {
  await new Promise(resolve => setTimeout(resolve, 1300));
  
  return {
    ...faction,
    goals: "Clear organizational objectives",
    methods: "How they operate and achieve goals",
    leadership: "Key figures and hierarchy",
    resources: "Assets and capabilities",
    relationships: "Connections to other factions"
  };
}

export async function getAICoachFeedback(
  project: Project, 
  nodeTitle: string, 
  nodeContent: string
): Promise<AICoachFeedback> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    corePrincipleAnalysis: "Your story beat demonstrates strong character motivation and clear conflict progression. The emotional stakes are well-established.",
    actionableSuggestions: [
      "Consider adding more sensory details to ground readers in the scene",
      "The dialogue could benefit from more subtext to create tension",
      "Explore the character's internal conflict more deeply"
    ],
    guidingQuestions: [
      "What is at stake for your character in this moment?",
      "How does this scene advance your overall story theme?",
      "What emotion do you want readers to feel here?"
    ]
  };
}

// Export alias for compatibility
export const generateCharacter = generateNewCharacter;
