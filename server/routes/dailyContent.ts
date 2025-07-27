import { Router } from 'express';
import { authenticateToken } from '../auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_X || process.env.GOOGLE_API_KEY!);

// Simple in-memory cache for pre-generated content
let contentCache: any[] = [];
let isGenerating = false;

// Pre-generate content in the background
async function preGenerateContent() {
  if (isGenerating || contentCache.length >= 5) return;
  
  isGenerating = true;
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
      }
    });

    const prompt = `Generate unique writing content. Character limits: motivation(80), joke(100), tip(120), word def(60), usage(80), prompt(100), fact(120).

Word variety: petrichor, ephemeral, saudade, verisimilitude, crepuscular, mellifluous, etc.

Return JSON only:
{
  "motivation": "inspiring writing quote",
  "joke": "writing humor",
  "tip": "practical advice",
  "wordOfDay": {
    "word": "unique uncommon word",
    "definition": "brief definition",
    "usage": "how to use it"
  },
  "prompt": "story starter",
  "fact": "writing trivia"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const content = JSON.parse(jsonMatch[0]);
      contentCache.push(content);
    }
  } catch (error) {
    console.error('Pre-generation error:', error);
  } finally {
    isGenerating = false;
  }
}

// Start pre-generating content
setInterval(preGenerateContent, 10000); // Try to generate every 10 seconds
preGenerateContent(); // Generate first one immediately

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    // First check if we have pre-generated content
    if (contentCache.length > 0) {
      const content = contentCache.shift(); // Get first item and remove it
      res.json(content);
      
      // Trigger background generation to refill cache
      setTimeout(preGenerateContent, 100);
      return;
    }

    // If no cached content, generate on demand
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      }
    });

    const prompt = `Generate unique writing content. Character limits: motivation(80), joke(100), tip(120), word def(60), usage(80), prompt(100), fact(120).

Word variety: petrichor, ephemeral, saudade, verisimilitude, crepuscular, mellifluous, etc.

Return JSON only:
{
  "motivation": "inspiring writing quote",
  "joke": "writing humor",
  "tip": "practical advice",
  "wordOfDay": {
    "word": "unique uncommon word",
    "definition": "brief definition",
    "usage": "how to use it"
  },
  "prompt": "story starter",
  "fact": "writing trivia"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        res.json(content);
        
        // Trigger background generation to fill cache
        setTimeout(preGenerateContent, 100);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback content
      res.json({
        motivation: "Every word you write brings your story closer to life.",
        joke: "Why don't writers like tennis? Too many faults in their service!",
        tip: "Write your first draft with your heart. Edit with your head.",
        wordOfDay: {
          word: "Euphonious",
          definition: "Pleasing to the ear",
          usage: "Use for describing beautiful sounds or voices"
        },
        prompt: "A character finds a door that wasn't there yesterday...",
        fact: "The most prolific author ever wrote over 700 books in their lifetime."
      });
    }
  } catch (error) {
    console.error('Error generating daily content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

export const dailyContentRouter = router;