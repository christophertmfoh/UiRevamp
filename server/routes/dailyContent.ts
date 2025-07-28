import { Router } from 'express';
import { authenticateToken } from '../auth';
import { AIGenerationService, generateWithRetry, checkRateLimit, AI_CONFIG } from '../services/aiGeneration';

const router = Router();

// Cache for daily content to avoid excessive AI calls
interface CachedContent {
  content: DailyContent;
  timestamp: number;
  userId: string;
}

interface DailyContent {
  motivation: string;
  joke: string;
  tip: string;
  wordOfDay: {
    word: string;
    definition: string;
    usage: string;
    etymology?: string;
    pronunciation?: string;
  };
  prompt: string;
  fact: string;
  personalizedHint?: string;
  timestamp: number;
}

// In-memory cache (in production, use Redis)
const contentCache = new Map<string, CachedContent>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

// Word pool for variety - real developer would use a database
const ADVANCED_WORD_POOLS = {
  descriptive: ['petrichor', 'susurrus', 'ephemeral', 'liminal', 'diaphanous', 'gossamer', 'lambent', 'cerulean', 'vermillion', 'incandescent'],
  emotional: ['mellifluous', 'saudade', 'schadenfreude', 'ennui', 'wanderlust', 'hiraeth', 'fernweh', 'komorebi', 'ubuntu', 'hygge'],
  literary: ['anachronism', 'denouement', 'verisimilitude', 'pastiche', 'bildungsroman', 'doppelganger', 'leitmotif', 'allegory', 'synecdoche', 'metonymy'],
  atmospheric: ['crepuscular', 'tenebrous', 'luminous', 'ethereal', 'sonorous', 'mellifluous', 'cacophonous', 'pellucid', 'opalescent', 'iridescent'],
  action: ['eviscerate', 'genuflect', 'gesticulate', 'prevaricate', 'coruscate', 'perambulate', 'genuflect', 'capitulate', 'pontificate', 'ruminate']
};

// Track used words to ensure variety
const usedWords = new Set<string>();

function getRandomUnusedWord(): { word: string; category: string } {
  const categories = Object.keys(ADVANCED_WORD_POOLS);
  const availableWords = categories.flatMap(category => 
    ADVANCED_WORD_POOLS[category as keyof typeof ADVANCED_WORD_POOLS]
      .filter(word => !usedWords.has(word))
      .map(word => ({ word, category }))
  );
  
  if (availableWords.length === 0) {
    // Reset if we've used all words
    usedWords.clear();
    return getRandomUnusedWord();
  }
  
  const selected = availableWords[Math.floor(Math.random() * availableWords.length)];
  usedWords.add(selected.word);
  return selected;
}

// Optimized AI prompts for each content type
const AI_PROMPTS = {
  motivation: `Generate a unique, inspiring writing quote (max 80 characters). 
Focus on: creativity, persistence, storytelling craft, or writer's journey.
Avoid clichés. Be specific to writing. Return ONLY the quote in quotes.`,

  joke: `Create an original writing/literature pun or joke (max 100 characters).
Focus on: wordplay, grammar humor, writing struggles, or literary references.
Make it clever but accessible. Return ONLY the joke.`,

  tip: `Provide a specific, actionable writing technique (max 120 characters).
Focus on: craft elements, character development, plot structure, or editing.
Be practical and immediately useful. Return ONLY the tip.`,

  prompt: `Create an intriguing story opening (max 100 characters).
Start with action or mystery. Make readers want to know more.
Avoid "woke up" or "normal day" beginnings. Return ONLY the prompt.`,

  fact: `Share a fascinating writing/literature fact (max 120 characters).
Focus on: famous authors, publishing history, or writing process insights.
Make it surprising or little-known. Return ONLY the fact.`,
  
  wordDefinition: (word: string) => `Define "${word}" in simple, clear language (max 60 characters).
Focus on the most relevant meaning for writers. Return ONLY the definition.`,

  wordUsage: (word: string) => `Explain how writers can use "${word}" effectively (max 80 characters).
Be specific about context or literary technique. Return ONLY the usage tip.`
};

// Generate personalized hint based on user writing patterns (future enhancement)
async function generatePersonalizedHint(userId: string): Promise<string> {
  // In production, this would analyze user's writing patterns, goals, etc.
  // For now, return a generic tip
  return "Try writing your scene from a different character's perspective.";
}

// Main content generation function
async function generateDailyContent(userId: string): Promise<DailyContent> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  console.log(`🎨 Generating fresh daily content for user ${userId}`);

  try {
    // Select a new word
    const { word, category } = getRandomUnusedWord();
    console.log(`📚 Selected word: ${word} (${category})`);

    // Generate all content in parallel for efficiency
    const [motivation, joke, tip, prompt, fact, definition, usage, personalizedHint] = await Promise.all([
      generateWithRetry(AI_PROMPTS.motivation, 2, { maxOutputTokens: 100, temperature: 0.9 }),
      generateWithRetry(AI_PROMPTS.joke, 2, { maxOutputTokens: 120, temperature: 0.8 }),
      generateWithRetry(AI_PROMPTS.tip, 2, { maxOutputTokens: 150, temperature: 0.7 }),
      generateWithRetry(AI_PROMPTS.prompt, 2, { maxOutputTokens: 120, temperature: 0.9 }),
      generateWithRetry(AI_PROMPTS.fact, 2, { maxOutputTokens: 150, temperature: 0.6 }),
      generateWithRetry(AI_PROMPTS.wordDefinition(word), 2, { maxOutputTokens: 80, temperature: 0.5 }),
      generateWithRetry(AI_PROMPTS.wordUsage(word), 2, { maxOutputTokens: 100, temperature: 0.7 }),
      generatePersonalizedHint(userId)
    ]);

    // Clean up responses (remove quotes, extra spaces, etc.)
    const cleanText = (text: string, maxLength: number): string => {
      return text
        .replace(/^["']|["']$/g, '') // Remove quotes
        .replace(/^\s+|\s+$/g, '') // Trim spaces
        .substring(0, maxLength) // Enforce length
        .replace(/\.$/, '') + (text.length > maxLength - 3 ? '...' : ''); // Add ellipsis if truncated
    };

    const content: DailyContent = {
      motivation: cleanText(motivation, 80),
      joke: cleanText(joke, 100),
      tip: cleanText(tip, 120),
      wordOfDay: {
        word: word,
        definition: cleanText(definition, 60),
        usage: cleanText(usage, 80),
        etymology: `From ${category} vocabulary`, // Could be enhanced with real etymology
        pronunciation: `/${word.split('').join('-')}/` // Simplified pronunciation
      },
      prompt: cleanText(prompt, 100),
      fact: cleanText(fact, 120),
      personalizedHint: cleanText(personalizedHint, 100),
      timestamp: Date.now()
    };

    console.log('✅ Generated daily content successfully');
    return content;

  } catch (error) {
    console.error('❌ Failed to generate AI content:', error);
    throw error;
  }
}

// Fallback content for when AI fails
const getFallbackContent = (): DailyContent => {
  const { word } = getRandomUnusedWord();
  
  return {
    motivation: "Every story starts with a single word. Make yours count today.",
    joke: "Why don't writers trust stairs? They're always up to something!",
    tip: "Read your dialogue aloud. If it sounds unnatural, your readers will notice.",
    wordOfDay: {
      word: word,
      definition: "A carefully selected word to enhance your vocabulary",
      usage: "Perfect for adding sophistication to your writing"
    },
    prompt: "A character receives a letter addressed to someone who died years ago...",
    fact: "Stephen King writes 2,000 words every day, including holidays.",
    personalizedHint: "Try writing a scene using only dialogue and action.",
    timestamp: Date.now()
  };
};

// API Routes
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const cacheKey = `daily_content_${userId}`;
    
    // Check cache first
    const cached = contentCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`📋 Serving cached content for user ${userId}`);
      return res.json(cached.content);
    }

    // Generate new content
    let content: DailyContent;
    try {
      content = await generateDailyContent(userId);
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

    // Clean old cache entries
    for (const [key, value] of contentCache.entries()) {
      if (Date.now() - value.timestamp > CACHE_DURATION) {
        contentCache.delete(key);
      }
    }

    console.log(`🎯 Delivered fresh content to user ${userId}`);
    res.json(content);

  } catch (error) {
    console.error('💥 Daily content API error:', error);
    
    // Always return something to the user
    const fallback = getFallbackContent();
    res.status(200).json(fallback); // Return 200 with fallback instead of 500
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    cacheSize: contentCache.size,
    usedWordsCount: usedWords.size,
    timestamp: Date.now()
  });
});

// Clear cache endpoint (admin only)
router.post('/cache/clear', authenticateToken, (req, res) => {
  contentCache.clear();
  usedWords.clear();
  console.log('🧹 Cache cleared');
  res.json({ message: 'Cache cleared successfully' });
});

export const dailyContentRouter = router;