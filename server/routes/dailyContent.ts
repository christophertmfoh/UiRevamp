import { Router } from 'express';
import { authenticateToken } from '../auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_X || process.env.GOOGLE_API_KEY!);

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a creative writing assistant. Generate fresh, inspiring content for writers in the following categories. Make sure all content is unique, engaging, and helpful for writers.

IMPORTANT CHARACTER LIMITS (strictly enforce these):
- motivation: Maximum 80 characters
- joke: Maximum 100 characters
- tip: Maximum 120 characters
- word definition: Maximum 60 characters
- word usage: Maximum 80 characters
- prompt: Maximum 100 characters
- fact: Maximum 120 characters

Generate content in this exact JSON format:
{
  "motivation": "An inspiring quote about writing (max 80 chars)",
  "joke": "A clever writing joke or pun (max 100 chars)",
  "tip": "A practical writing tip (max 120 chars)",
  "wordOfDay": {
    "word": "An uncommon but useful word",
    "definition": "Clear definition (max 60 chars)",
    "usage": "How to use this word (max 80 chars)"
  },
  "prompt": "A creative story prompt (max 100 chars)",
  "fact": "An interesting writing fact (max 120 chars)"
}

Keep content concise, punchy, and within character limits. Be creative and avoid clichés.`;

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