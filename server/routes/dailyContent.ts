import { Router } from 'express';
import { authenticateToken } from '../auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_X || process.env.GOOGLE_API_KEY!);

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a creative writing assistant. Generate fresh, inspiring content for writers in the following categories. Make sure all content is unique, engaging, and helpful for writers.

Generate content in this exact JSON format:
{
  "motivation": "An inspiring quote about writing, creativity, or perseverance (not from a famous person, create original)",
  "joke": "A clever, clean writing-related joke or pun that will make writers smile",
  "tip": "A practical, actionable writing tip that helps improve craft or process",
  "wordOfDay": {
    "word": "An interesting, uncommon but useful word for writers",
    "definition": "Clear, concise definition",
    "usage": "How writers can use this word effectively"
  },
  "prompt": "A creative story prompt that sparks imagination (one sentence)",
  "fact": "An interesting, lesser-known fact about writing, literature, or famous authors"
}

Make the content fresh, varied, and specifically helpful for fiction writers. Be creative and avoid clichés.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        res.json(content);
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