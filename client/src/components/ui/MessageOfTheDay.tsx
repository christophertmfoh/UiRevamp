import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  PenTool, 
  Smile, 
  ChevronRight,
  Pause,
  Play,
  Copy,
  Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToastActions } from '@/components/ui/Toast';

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

// High-quality fallback content for writers
const WRITER_FALLBACKS = {
  motivations: [
    "Every master was once a beginner. Every pro was once an amateur.",
    "Your story matters. The world needs your unique voice.",
    "Plot holes are just opportunities for creativity in disguise.",
    "Characters become real when you believe in them first."
  ],
  jokes: [
    "Why did the writer break up with the thesaurus? Too many synonyms!",
    "A writer's favorite type of music? Compose-itions!",
    "What's a ghost writer's favorite punctuation? Boo-lean logic!",
    "Why don't writers ever get cold? They're always drafting!"
  ],
  tips: [
    "Start scenes as late as possible and end them as early as possible.",
    "Give every character a secret that influences their actions.",
    "Use concrete details to make abstract emotions tangible.",
    "Read your work aloud to catch rhythm and flow issues."
  ],
  prompts: [
    "The library books started returning themselves, with notes in the margins...",
    "Every mirror in the house shows a different version of you...",
    "The delivery arrived 20 years too late, but at the perfect time...",
    "Your character's shadow started acting independently..."
  ],
  facts: [
    "Maya Angelou wrote standing up at a podium in a hotel room.",
    "Roald Dahl wrote all his books with a specific pencil type.",
    "Agatha Christie disappeared for 11 days and never explained why.",
    "J.K. Rowling wrote the first Harry Potter book on napkins."
  ]
};

const LITERARY_WORDS = [
  { word: "Denouement", definition: "The final resolution of a story", usage: "Perfect for describing story endings" },
  { word: "Bildungsroman", definition: "A coming-of-age story", usage: "Use for character development arcs" },
  { word: "Verisimilitude", definition: "The appearance of truth", usage: "Essential for believable fiction" },
  { word: "Petrichor", definition: "Scent of earth after rain", usage: "Creates vivid sensory descriptions" },
  { word: "Crepuscular", definition: "Relating to twilight", usage: "Perfect for moody scene-setting" },
  { word: "Saudade", definition: "Bittersweet longing", usage: "Captures complex emotional states" }
];

export function MessageOfTheDay() {
  const { token } = useAuth();
  const { toast } = useToastActions();
  
  // Core state only
  const [content, setContent] = useState<DailyContent | null>(null);
  const [currentSet, setCurrentSet] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Content sections for organized display
  const contentSections = useMemo(() => [
    {
      id: 'inspiration',
      title: 'Daily Inspiration',
      items: [
        { type: 'motivation', icon: Sparkles, label: 'Motivation', key: 'motivation' },
        { type: 'tip', icon: Lightbulb, label: 'Writing Tip', key: 'tip' },
        { type: 'joke', icon: Smile, label: 'Writer\'s Humor', key: 'joke' }
      ]
    },
    {
      id: 'knowledge',
      title: 'Learning & Practice', 
      items: [
        { type: 'word', icon: BookOpen, label: 'Word of the Day', key: 'wordOfDay' },
        { type: 'prompt', icon: PenTool, label: 'Writing Prompt', key: 'prompt' },
        { type: 'fact', icon: Brain, label: 'Writer\'s Fact', key: 'fact' }
      ]
    }
  ], []);

  // Generate quality fallback content
  const generateFallbackContent = useCallback((): DailyContent => {
    const getRandomItem = <T,>(array: T[]): T => 
      array[Math.floor(Math.random() * array.length)];
    
    const wordData = getRandomItem(LITERARY_WORDS);
    
    return {
      motivation: getRandomItem(WRITER_FALLBACKS.motivations),
      joke: getRandomItem(WRITER_FALLBACKS.jokes),
      tip: getRandomItem(WRITER_FALLBACKS.tips),
      wordOfDay: wordData,
      prompt: getRandomItem(WRITER_FALLBACKS.prompts),
      fact: getRandomItem(WRITER_FALLBACKS.facts),
      timestamp: Date.now()
    };
  }, []);

  // Intelligent content fetching with proper error handling
  const fetchContent = useCallback(async (forceRefresh = false) => {
    if (isLoading) {
      console.log('⏳ Already loading, skipping duplicate request');
      return;
    }
    
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefresh;
    const MIN_REFRESH_INTERVAL = 30 * 1000; // 30 seconds
    
    if (!forceRefresh && timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
      const waitTime = Math.ceil((MIN_REFRESH_INTERVAL - timeSinceLastRefresh) / 1000);
      toast.info(`Please wait ${waitTime}s before refreshing`);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Request timeout, resetting loading state');
      setIsLoading(false);
      setError('Request timeout');
      toast.error('Request timed out. Please try again.');
    }, 15000); // 15 second timeout
    
    try {
      console.log('🎨 Fetching daily writing inspiration...');
      console.log('🔗 Using token:', token ? 'Available' : 'Missing');
      
      const response = await fetch('/api/daily-content/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear timeout on successful response
      clearTimeout(timeoutId);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }
      
      const newContent: DailyContent = await response.json();
      console.log('📦 Received content:', {
        motivation: newContent?.motivation?.substring(0, 30),
        wordOfDay: newContent?.wordOfDay?.word,
        timestamp: newContent?.timestamp
      });
      
      if (!newContent || !newContent.motivation) {
        console.error('❌ Invalid content structure:', newContent);
        throw new Error('Invalid content received from server');
      }
      
      setContent(newContent);
      setLastRefresh(now);
      
      // Cache with metadata for offline usage
      const contentWithMeta = {
        ...newContent,
        fetchedAt: now,
        version: '1.0'
      };
      localStorage.setItem('fablecraft_daily_inspiration', JSON.stringify(contentWithMeta));
      
      console.log('✅ Fresh inspiration loaded');
      if (forceRefresh) {
        toast.success('Fresh inspiration delivered!');
      }
      
    } catch (error) {
      // Clear timeout on error
      clearTimeout(timeoutId);
      
      console.error('❌ Failed to fetch inspiration:', error);
      setError(error instanceof Error ? error.message : 'Failed to load');
      
      // Use fallback if no content exists
      if (!content) {
        const fallbackContent = generateFallbackContent();
        setContent(fallbackContent);
        toast.warning('Using offline inspiration. Check your connection.');
      } else {
        toast.error('Unable to refresh. Using cached content.');
      }
    } finally {
      // Ensure loading state is always reset
      setIsLoading(false);
    }
  }, [token, lastRefresh, content, toast, generateFallbackContent]);



  // Auto-advance content sets for better UX
  useEffect(() => {
    if (!isAutoPlay || !content) return;
    
    const interval = setInterval(() => {
      setCurrentSet(prev => (prev + 1) % contentSections.length);
    }, 20000); // 20 seconds - slower, less distracting
    
    return () => clearInterval(interval);
  }, [isAutoPlay, contentSections.length, content]);

  // Initialize content on mount
  useEffect(() => {
    const initializeContent = async () => {
      // Try cached content first
      try {
        const stored = localStorage.getItem('fablecraft_daily_inspiration');
        if (stored) {
          const parsed = JSON.parse(stored);
          const age = Date.now() - (parsed.fetchedAt || parsed.timestamp || 0);
          const isStale = age > (8 * 60 * 60 * 1000); // 8 hours
          
          if (!isStale && parsed.motivation) {
            setContent(parsed);
            console.log('📋 Loaded cached inspiration');
            
            // Still fetch fresh content in background if it's been a while
            if (age > (4 * 60 * 60 * 1000)) { // 4+ hours old
              setTimeout(() => fetchContent(), 2000);
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached content:', e);
      }
      
      // Fetch fresh content only on initial mount
      await fetchContent();
    };
    
    initializeContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Copy content to clipboard - actually useful feature
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy text');
    }
  }, [toast]);

  // Render individual content items
  const renderContentItem = useCallback((item: any, value: any) => {
    const Icon = item.icon;
    
    if (item.type === 'word' && content?.wordOfDay) {
      return (
        <div key={item.type} className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {item.label}
            </p>
          </div>
          <div className="bg-accent/10 rounded-lg p-4 border border-border/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-base font-bold text-primary mb-1">
                  {content.wordOfDay.word}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {content.wordOfDay.definition}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  💡 {content.wordOfDay.usage}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(content.wordOfDay.word, 'Word')}
                className="h-8 w-8 p-0 hover:bg-accent/20"
                title="Copy word"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={item.type} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 gradient-primary rounded-full" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {item.label}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(
              item.type === 'motivation' ? `"${value}"` : value, 
              item.label
            )}
            className="h-6 w-6 p-0 hover:bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"
            title={`Copy ${item.label.toLowerCase()}`}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <div className="group">
          <p className={`text-sm leading-relaxed ${
            item.type === 'motivation' 
              ? 'text-foreground italic font-medium' 
              : 'text-muted-foreground'
          }`}>
            {item.type === 'motivation' ? `"${value}"` : value}
          </p>
        </div>
      </div>
    );
  }, [content, copyToClipboard]);

  // Loading state
  if (!content) {
    return (
      <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
        <CardContent className="p-6 h-full flex flex-col items-center justify-center">
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {isLoading ? 'Loading your daily inspiration...' : 'Preparing writing inspiration...'}
          </p>
          {error && (
            <p className="text-xs text-destructive text-center mt-2">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full group hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Clean, focused header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-foreground text-base">Daily Inspiration</h3>
              <p className="text-xs text-muted-foreground">
                {contentSections[currentSet]?.title}
              </p>
            </div>
          </div>
          
          {/* Minimal, useful controls */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="h-8 w-8 p-0 hover:bg-accent/10"
              title={isAutoPlay ? 'Pause auto-advance' : 'Resume auto-advance'}
            >
              {isAutoPlay ? 
                <Pause className="w-3.5 h-3.5 text-muted-foreground" /> :
                <Play className="w-3.5 h-3.5 text-muted-foreground" />
              }
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fetchContent(true)}
              disabled={isLoading}
              className="h-8 w-8 p-0 hover:bg-accent/10 disabled:opacity-50"
              title="Get fresh inspiration"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentSet((prev) => (prev + 1) % contentSections.length)}
              className="h-8 w-8 p-0 hover:bg-accent/10"
              title="Next section"
            >
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Content display */}
        <div className="flex-grow space-y-4">
          <div className="transition-all duration-500 ease-in-out space-y-4">
            {contentSections[currentSet]?.items.map(item => {
              const value = item.key === 'wordOfDay' ? content.wordOfDay : content[item.key as keyof DailyContent];
              return renderContentItem(item, value);
            })}
          </div>

          {/* Personalized hint if available */}
          {content.personalizedHint && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-primary">
                  Personal Writing Tip
                </p>
              </div>
              <p className="text-sm text-foreground/80">
                {content.personalizedHint}
              </p>
            </div>
          )}
        </div>

        {/* Simple navigation dots */}
        <div className="flex justify-center mt-5">
          <div className="flex items-center gap-2">
            {contentSections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSet(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSet === index
                    ? 'gradient-primary w-6 h-2'
                    : 'bg-muted hover:bg-muted-foreground/50'
                }`}
                aria-label={`View ${contentSections[index].title}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}