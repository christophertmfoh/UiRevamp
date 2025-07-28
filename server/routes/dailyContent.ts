import { Router } from 'express';
import { authenticateToken } from '../auth';
import { generateWithRetry, checkRateLimit } from '../services/aiGeneration';

const router = Router();

// Simple cache for daily content - focused approach
interface DailyContent {
  motivation: string;
  joke: string;
  tip: string;
  wordOfDay: {
    word: string;
    definition: string;
    usage: string;
    etymology?: string;
  };
  prompt: string;
  fact: string;
  personalizedHint?: string;
  timestamp: number;
}

interface CachedContent {
  content: DailyContent;
  timestamp: number;
  userId: string;
}

// In-memory cache (simple and effective)
const contentCache = new Map<string, CachedContent>();
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 hours

// Curated word pool for quality and variety
const LITERARY_WORDS = [
  'petrichor', 'susurrus', 'ephemeral', 'liminal', 'diaphanous', 'gossamer', 'lambent', 'cerulean', 'vermillion', 'incandescent',
  'mellifluous', 'saudade', 'schadenfreude', 'ennui', 'wanderlust', 'hiraeth', 'fernweh', 'komorebi', 'ubuntu', 'hygge',
  'anachronism', 'denouement', 'verisimilitude', 'pastiche', 'bildungsroman', 'doppelganger', 'leitmotif', 'allegory', 'synecdoche', 'metonymy',
  'crepuscular', 'tenebrous', 'luminous', 'ethereal', 'sonorous', 'cacophonous', 'pellucid', 'opalescent', 'iridescent', 'coruscate'
];

// Track used words to ensure variety
const usedWords = new Set<string>();

function getRandomUnusedWord(): string {
  const availableWords = LITERARY_WORDS.filter(word => !usedWords.has(word));
  
  if (availableWords.length === 0) {
    // Reset if we've used all words
    usedWords.clear();
    return getRandomUnusedWord();
  }
  
  const selected = availableWords[Math.floor(Math.random() * availableWords.length)];
  usedWords.add(selected);
  return selected;
}

// Focused AI prompts for each content type
const AI_PROMPTS = {
  motivation: (previousContent?: string) => 
    `Generate a unique, inspiring writing quote (max 80 characters). 
Focus on: creativity, persistence, storytelling craft, or writer's journey.
Avoid clichés and this previous content: ${previousContent || 'none'}
Return ONLY the quote in quotes.`,

  joke: () => 
    `Create an original writing/literature pun or joke (max 100 characters).
Focus on: wordplay, grammar humor, writing struggles, or literary references.
Make it clever but accessible. Return ONLY the joke.`,

  tip: () => 
    `Provide a specific, actionable writing technique (max 120 characters).
Focus on: craft elements, character development, plot structure, or editing.
Be practical and immediately useful. Return ONLY the tip.`,

  prompt: () => 
    `Create an intriguing story opening (max 100 characters).
Start with action or mystery. Make readers want to know more.
Avoid "woke up" or "normal day" beginnings. Return ONLY the prompt.`,

  fact: () => 
    `Share a fascinating writing/literature fact (max 120 characters).
Focus on: famous authors, publishing history, or writing process insights.
Make it surprising or little-known. Return ONLY the fact.`,
  
  wordDefinition: (word: string) => 
    `Define "${word}" in simple, clear language (max 60 characters).
Focus on the most relevant meaning for writers. Return ONLY the definition.`,

  wordUsage: (word: string) => 
    `Explain how writers can use "${word}" effectively (max 80 characters).
Be specific about context or literary technique. Return ONLY the usage tip.`
};

// Generate fresh content efficiently
async function generateDailyContent(userId: string, existingContent?: DailyContent): Promise<DailyContent> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  console.log(`🎨 Generating writing inspiration for user ${userId}`);

  try {
    // Select a new word
    const word = getRandomUnusedWord();
    console.log(`📚 Selected word: ${word}`);

    // Generate content efficiently in parallel
    const [motivation, joke, tip, prompt, fact, definition, usage] = await Promise.all([
      generateWithRetry(AI_PROMPTS.motivation(existingContent?.motivation), 2, { maxOutputTokens: 100, temperature: 0.9 }),
      generateWithRetry(AI_PROMPTS.joke(), 2, { maxOutputTokens: 120, temperature: 0.8 }),
      generateWithRetry(AI_PROMPTS.tip(), 2, { maxOutputTokens: 150, temperature: 0.7 }),
      generateWithRetry(AI_PROMPTS.prompt(), 2, { maxOutputTokens: 120, temperature: 0.9 }),
      generateWithRetry(AI_PROMPTS.fact(), 2, { maxOutputTokens: 150, temperature: 0.6 }),
      generateWithRetry(AI_PROMPTS.wordDefinition(word), 2, { maxOutputTokens: 80, temperature: 0.5 }),
      generateWithRetry(AI_PROMPTS.wordUsage(word), 2, { maxOutputTokens: 100, temperature: 0.7 })
    ]);

    // Clean up responses
    const cleanText = (text: string, maxLength: number): string => {
      return text
        .replace(/^["']|["']$/g, '') // Remove quotes
        .trim()
        .substring(0, maxLength);
    };

    const content: DailyContent = {
      motivation: cleanText(motivation, 80),
      joke: cleanText(joke, 100),
      tip: cleanText(tip, 120),
      wordOfDay: {
        word: word,
        definition: cleanText(definition, 60),
        usage: cleanText(usage, 80),
        etymology: `Literary vocabulary` // Simple, consistent
      },
      prompt: cleanText(prompt, 100),
      fact: cleanText(fact, 120),
      timestamp: Date.now()
    };

    console.log('✅ Generated daily content successfully');
    return content;

  } catch (error) {
    console.error('❌ Failed to generate AI content:', error);
    throw error;
  }
}

// Quality fallback content
const getFallbackContent = (): DailyContent => {
  const word = getRandomUnusedWord();
  
  const fallbacks = {
    motivations: [
      "Every story starts with a single word. Make yours count today.",
      "Your characters are waiting. Don't keep them waiting too long.",
      "Plot holes are just opportunities for creativity in disguise.",
      "The best time to write was yesterday. The second best time is now."
    ],
    jokes: [
      "Why don't writers trust stairs? They're always up to something!",
      "What's a writer's favorite type of music? Compose-itions!",
      "Why did the writer break up with the thesaurus? Too many synonyms!",
      "What do you call a writer who doesn't follow guidelines? A rebel without a clause!"
    ],
    tips: [
      "Read your dialogue aloud. If it sounds unnatural, your readers will notice.",
      "Start scenes as late as possible and end them as early as possible.",
      "Give every character a secret that influences their actions.",
      "Show, don't tell—let readers experience the emotion."
    ],
    prompts: [
      "A character receives a letter addressed to someone who died years ago...",
      "The library books started returning themselves, with notes in the margins...",
      "Every mirror in the house shows a different version of you...",
      "Your character's shadow started acting independently..."
    ],
    facts: [
      "Stephen King writes 2,000 words every day, including holidays.",
      "Maya Angelou wrote standing up at a podium in a hotel room.",
      "J.K. Rowling wrote the first Harry Potter book on napkins.",
      "Agatha Christie disappeared for 11 days and never explained why."
    ]
  };

  const getRandomItem = <T,>(array: T[]): T => 
    array[Math.floor(Math.random() * array.length)];
  
  return {
    motivation: getRandomItem(fallbacks.motivations),
    joke: getRandomItem(fallbacks.jokes),
    tip: getRandomItem(fallbacks.tips),
    wordOfDay: {
      word: word,
      definition: "A carefully selected word to enhance your vocabulary",
      usage: "Perfect for adding sophistication to your writing"
    },
    prompt: getRandomItem(fallbacks.prompts),
    fact: getRandomItem(fallbacks.facts),
    timestamp: Date.now()
  };
};

// Main API endpoint - clean and focused
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const cacheKey = `daily_inspiration_${userId}`;
    
    // Check cache first
    const cached = contentCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`📋 Serving cached content for user ${userId}`);
      return res.json(cached.content);
    }

    // Generate new content
    let content: DailyContent;
    try {
      const existingContent = cached?.content;
      content = await generateDailyContent(userId, existingContent);
    } catch (error) {
      console.warn('🔄 AI generation failed, using fallback content');
      content = getFallbackContent();
    }

    // Cache the result
    contentCache.set(cacheKey, {
      content,
      timestamp: Date.now(),
      userId
    });

    // Clean old cache entries periodically
    if (contentCache.size > 100) {
      for (const [key, value] of contentCache.entries()) {
        if (Date.now() - value.timestamp > CACHE_DURATION) {
          contentCache.delete(key);
        }
      }
    }

    console.log(`🎯 Delivered fresh inspiration to user ${userId}`);
    res.json(content);

  } catch (error) {
    console.error('💥 Daily content API error:', error);
    
    // Always return something useful
    const fallback = getFallbackContent();
    res.status(200).json(fallback);
  }
});

// Simple health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    cacheSize: contentCache.size,
    usedWordsCount: usedWords.size,
    timestamp: Date.now()
  });
});

export const dailyContentRouter = router;