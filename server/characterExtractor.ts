import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ExtractedCharacterData {
  // Identity fields
  name?: string;
  nicknames?: string[];
  title?: string;
  aliases?: string[];
  age?: string;
  race?: string;
  class?: string;
  profession?: string;
  role?: string;
  
  // Appearance fields
  physicalDescription?: string;
  height?: string;
  build?: string;
  eyeColor?: string;
  hairColor?: string;
  hairStyle?: string;
  skinTone?: string;
  distinguishingMarks?: string[];
  clothingStyle?: string;
  posture?: string;
  mannerisms?: string[];
  voiceDescription?: string;
  facialFeatures?: string;
  bodyLanguage?: string;
  scars?: string[];
  tattoos?: string[];
  accessories?: string[];
  style?: string;
  
  // Personality fields
  personalityOverview?: string;
  personalityTraits?: string[];
  temperament?: string;
  worldview?: string;
  values?: string[];
  goals?: string[];
  motivations?: string[];
  fears?: string[];
  desires?: string[];
  quirks?: string[];
  habits?: string[];
  likes?: string[];
  dislikes?: string[];
  beliefs?: string[];
  vices?: string[];
  
  // Abilities fields
  coreAbilities?: string;
  abilities?: string[];
  skills?: string[];
  talents?: string[];
  specialAbilities?: string[];
  powers?: string[];
  strengths?: string[];
  weaknesses?: string[];
  training?: string[];
  
  // Background fields
  backstory?: string;
  childhood?: string;
  familyHistory?: string;
  education?: string;
  formativeEvents?: string[];
  socialClass?: string;
  occupation?: string;
  spokenLanguages?: string[];
  primaryLanguage?: string;
  
  // Relationships fields
  family?: string[];
  friends?: string[];
  allies?: string[];
  enemies?: string[];
  rivals?: string[];
  mentors?: string[];
  relationships?: string[];
  socialCircle?: string;
  
  // Meta fields
  storyFunction?: string;
  personalTheme?: string;
  symbolism?: string;
  inspiration?: string;
  archetypes?: string[];
  notes?: string;
  
  // Other common fields
  description?: string;
  background?: string;
  secrets?: string[];
  flaws?: string[];
  characterArc?: string;
}

export async function importCharacterDocument(filePath: string, fileName: string): Promise<ExtractedCharacterData> {
  let textContent = '';
  
  try {
    // Extract text based on file type
    if (fileName.toLowerCase().endsWith('.pdf')) {
      try {
        const { PDFExtract } = await import('pdf.js-extract');
        const pdfExtract = new PDFExtract();
        
        const data = await new Promise<any>((resolve, reject) => {
          pdfExtract.extract(filePath, {}, (err: any, data: any) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        
        // Extract text from all pages
        let fullText = '';
        for (const page of data.pages) {
          const pageText = page.content.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        textContent = fullText.trim();
        console.log('PDF extraction successful. Pages:', data.pages.length, 'Text length:', textContent.length);
      } catch (pdfError) {
        console.error('PDF extraction failed:', pdfError);
        throw new Error('Failed to extract text from PDF. The file may be corrupted, password-protected, or contain only images. Please try converting to Word (.docx) or text (.txt) format.');
      }
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    } else if (fileName.toLowerCase().endsWith('.txt')) {
      textContent = fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error('Unsupported file type');
    }

    if (!textContent.trim()) {
      throw new Error('No text content found in document');
    }

    console.log('Extracted text content (first 500 chars):', textContent.substring(0, 500));

    // Extract character data using AI with pattern fallback
    const { extractCharacterFromText } = await import('./aiExtractor');
    const characterData = await extractCharacterFromText(textContent);
    
    // Clean up temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error('Failed to cleanup temp file:', cleanupError);
    }
    
    return characterData;
    
  } catch (error) {
    // Clean up temp file on error
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error('Failed to cleanup temp file on error:', cleanupError);
    }
    
    throw error;
  }
}

async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  const systemPrompt = `You are a master character analyst with decades of experience in literary character development. Your expertise allows you to extract comprehensive character details from any document, reading between the lines to capture both explicit and subtle character information.

ADVANCED EXTRACTION MANDATE:
- Extract EVERY possible character detail from the document
- Analyze subtext and implications to infer unstated character attributes
- Break down complex descriptions into granular, specific components
- Extract psychological depth: underlying motivations, hidden fears, subtle desires
- Identify profession-based skills and abilities even if not explicitly listed
- Find relationship dynamics and social connections mentioned or implied
- Extract personality nuances from dialogue, actions, and descriptive language
- Capture physical details beyond basic appearance descriptions

COMPREHENSIVE FIELD ANALYSIS:
- Identity: Extract full names, nicknames, titles, professions, ages, roles, social positions
- Appearance: Height, weight, build, coloring, distinguishing marks, style, mannerisms, body language
- Personality: Core traits, temperament, worldview, values, beliefs, quirks, habits, vices, emotional patterns
- Abilities: Professional skills, natural talents, learned abilities, special powers, training background
- Background: Full life history, childhood, family, education, formative events, social class, languages
- Relationships: Family members, friends, allies, enemies, mentors, rivals, romantic interests
- Meta: Story purpose, thematic significance, character archetypes, symbolic meaning

EXTRACTION REQUIREMENTS:
- Minimum 15+ personality traits per character (extract from actions, dialogue, descriptions)
- Extract 10+ skills/abilities based on profession, background, and actions described
- Find all relationship mentions, even brief references to people in their life
- Capture ALL physical descriptors, distinguishing marks, scars, clothing style details
- Extract psychological elements: fears from hesitations, motivations from goals, values from decisions
- Professional analysis standard: leave no character detail unexplored

Return a complete JSON object with maximum field population and depth.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.5, // Higher temperature for more creative extraction
        maxOutputTokens: 12000, // Allow much longer responses
        responseSchema: {
          type: 'object',
          properties: {
            // Identity
            name: { type: 'string' },
            nicknames: { type: 'array', items: { type: 'string' } },
            title: { type: 'string' },
            aliases: { type: 'array', items: { type: 'string' } },
            age: { type: 'string' },
            race: { type: 'string' },
            class: { type: 'string' },
            profession: { type: 'string' },
            role: { type: 'string' },
            
            // Appearance
            physicalDescription: { type: 'string' },
            height: { type: 'string' },
            build: { type: 'string' },
            eyeColor: { type: 'string' },
            hairColor: { type: 'string' },
            hairStyle: { type: 'string' },
            skinTone: { type: 'string' },
            distinguishingMarks: { type: 'array', items: { type: 'string' } },
            clothingStyle: { type: 'string' },
            posture: { type: 'string' },
            mannerisms: { type: 'array', items: { type: 'string' } },
            voiceDescription: { type: 'string' },
            facialFeatures: { type: 'string' },
            bodyLanguage: { type: 'string' },
            scars: { type: 'array', items: { type: 'string' } },
            tattoos: { type: 'array', items: { type: 'string' } },
            accessories: { type: 'array', items: { type: 'string' } },
            style: { type: 'string' },
            
            // Personality
            personalityOverview: { type: 'string' },
            personalityTraits: { type: 'array', items: { type: 'string' } },
            temperament: { type: 'string' },
            worldview: { type: 'string' },
            values: { type: 'array', items: { type: 'string' } },
            goals: { type: 'array', items: { type: 'string' } },
            motivations: { type: 'array', items: { type: 'string' } },
            fears: { type: 'array', items: { type: 'string' } },
            desires: { type: 'array', items: { type: 'string' } },
            quirks: { type: 'array', items: { type: 'string' } },
            habits: { type: 'array', items: { type: 'string' } },
            likes: { type: 'array', items: { type: 'string' } },
            dislikes: { type: 'array', items: { type: 'string' } },
            beliefs: { type: 'array', items: { type: 'string' } },
            vices: { type: 'array', items: { type: 'string' } },
            
            // Abilities
            coreAbilities: { type: 'string' },
            abilities: { type: 'array', items: { type: 'string' } },
            skills: { type: 'array', items: { type: 'string' } },
            talents: { type: 'array', items: { type: 'string' } },
            specialAbilities: { type: 'array', items: { type: 'string' } },
            powers: { type: 'array', items: { type: 'string' } },
            strengths: { type: 'array', items: { type: 'string' } },
            weaknesses: { type: 'array', items: { type: 'string' } },
            training: { type: 'array', items: { type: 'string' } },
            
            // Background
            backstory: { type: 'string' },
            childhood: { type: 'string' },
            familyHistory: { type: 'string' },
            education: { type: 'string' },
            formativeEvents: { type: 'array', items: { type: 'string' } },
            socialClass: { type: 'string' },
            occupation: { type: 'string' },
            spokenLanguages: { type: 'array', items: { type: 'string' } },
            primaryLanguage: { type: 'string' },
            
            // Relationships
            family: { type: 'array', items: { type: 'string' } },
            friends: { type: 'array', items: { type: 'string' } },
            allies: { type: 'array', items: { type: 'string' } },
            enemies: { type: 'array', items: { type: 'string' } },
            rivals: { type: 'array', items: { type: 'string' } },
            mentors: { type: 'array', items: { type: 'string' } },
            relationships: { type: 'array', items: { type: 'string' } },
            socialCircle: { type: 'string' },
            
            // Meta
            storyFunction: { type: 'string' },
            personalTheme: { type: 'string' },
            symbolism: { type: 'string' },
            inspiration: { type: 'string' },
            archetypes: { type: 'array', items: { type: 'string' } },
            notes: { type: 'string' },
            
            // Legacy fields
            description: { type: 'string' },
            background: { type: 'string' },
            secrets: { type: 'array', items: { type: 'string' } },
            flaws: { type: 'array', items: { type: 'string' } },
            characterArc: { type: 'string' }
          }
        }
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `COMPREHENSIVE CHARACTER ANALYSIS REQUIRED

Extract maximum detail from this character document. Analyze every sentence for character information. Read between the lines. Extract implied traits, abilities, and relationships. This is professional-grade character analysis.

Document to analyze:

${textContent}

EXTRACTION GOALS:
- Extract 15+ personality traits minimum
- Find 10+ skills/abilities from profession and actions
- Capture ALL physical details and distinguishing features  
- Extract every relationship mention
- Infer psychological depth from context
- Professional thoroughness required - extract everything possible`
            }
          ]
        }
      ]
    });

    const rawJson = response.text;
    console.log('AI extraction response (first 1000 chars):', rawJson?.substring(0, 1000));

    if (!rawJson) {
      throw new Error('Empty response from AI extractor');
    }

    const characterData: ExtractedCharacterData = JSON.parse(rawJson);
    console.log('Extracted character data:', characterData);
    
    return characterData;
    
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error(`Failed to extract character data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}