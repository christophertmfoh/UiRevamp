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

// High-quality fallback content for writers - ALWAYS WORKS
const WRITER_CONTENT_POOLS = {
  motivations: [
    "Every master was once a beginner. Every pro was once an amateur.",
    "Your story matters. The world needs your unique voice.",
    "Plot holes are just opportunities for creativity in disguise.",
    "Characters become real when you believe in them first.",
    "The first draft is you telling yourself the story.",
    "Writing is rewriting. The magic happens in the edit.",
    "Your only competition is who you were yesterday.",
    "Every word you write brings your vision to life."
  ],
  jokes: [
    "Why did the writer break up with the thesaurus? Too many synonyms!",
    "A writer's favorite type of music? Compose-itions!",
    "What's a ghost writer's favorite punctuation? Boo-lean logic!",
    "Why don't writers ever get cold? They're always drafting!",
    "What do you call a writer without coffee? A rough draft!",
    "Why did the comma break up with the apostrophe? It was possessive!",
    "What's a writer's favorite exercise? Plot twists!",
    "Why don't writers play poker? Too many tells in their stories!"
  ],
  tips: [
    "Start scenes as late as possible and end them as early as possible.",
    "Give every character a secret that influences their actions.",
    "Use concrete details to make abstract emotions tangible.",
    "Read your work aloud to catch rhythm and flow issues.",
    "Show character emotions through actions, not exposition.",
    "Every scene should either advance plot or develop character.",
    "Write the story only you can tell.",
    "Trust your reader's intelligence."
  ],
  prompts: [
    "The library books started returning themselves, with notes in the margins...",
    "Every mirror in the house shows a different version of you...",
    "The delivery arrived 20 years too late, but at the perfect time...",
    "Your character's shadow started acting independently...",
    "The last letter in the mailbox was addressed to someone who died yesterday...",
    "Every door in the house leads to a different year...",
    "The antique typewriter only writes true stories about the future...",
    "Your character finds their own diary, written in someone else's handwriting..."
  ],
  facts: [
    "Maya Angelou wrote standing up at a podium in a hotel room.",
    "Roald Dahl wrote all his books with a specific pencil type.",
    "Agatha Christie disappeared for 11 days and never explained why.",
    "J.K. Rowling wrote the first Harry Potter book on napkins.",
    "Stephen King writes 2,000 words every day, including holidays.",
    "Toni Morrison wrote her first novel while raising two children alone.",
    "Ray Bradbury wrote Fahrenheit 451 on a rented typewriter for $9.80.",
    "Virginia Woolf wrote all her books standing at a tall desk."
  ]
};

const LITERARY_WORDS = [
  { word: "Denouement", definition: "The final resolution of a story", usage: "Perfect for describing story endings" },
  { word: "Bildungsroman", definition: "A coming-of-age story", usage: "Use for character development arcs" },
  { word: "Verisimilitude", definition: "The appearance of truth", usage: "Essential for believable fiction" },
  { word: "Petrichor", definition: "Scent of earth after rain", usage: "Creates vivid sensory descriptions" },
  { word: "Crepuscular", definition: "Relating to twilight", usage: "Perfect for moody scene-setting" },
  { word: "Saudade", definition: "Bittersweet longing", usage: "Captures complex emotional states" },
  { word: "Ephemeral", definition: "Lasting a very short time", usage: "Describes fleeting moments" },
  { word: "Luminous", definition: "Giving off light; bright", usage: "For radiant descriptions" },
  { word: "Mellifluous", definition: "Sweet-sounding", usage: "Describes beautiful voices or music" },
  { word: "Ineffable", definition: "Too great to be expressed", usage: "For indescribable experiences" }
];

export function MessageOfTheDay() {
  const { token } = useAuth();
  
  // Simple toast replacement - always works
  const toast = {
    info: (msg: string) => console.log('ℹ️', msg),
    success: (msg: string) => console.log('✅', msg),
    warning: (msg: string) => console.warn('⚠️', msg),
    error: (msg: string) => console.error('❌', msg)
  };
  
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

  // Generate quality content - ALWAYS WORKS
  const generateFreshContent = useCallback((): DailyContent => {
    const getRandomItem = <T,>(array: T[]): T => 
      array[Math.floor(Math.random() * array.length)];
    
    const wordData = getRandomItem(LITERARY_WORDS);
    
    return {
      motivation: getRandomItem(WRITER_CONTENT_POOLS.motivations),
      joke: getRandomItem(WRITER_CONTENT_POOLS.jokes),
      tip: getRandomItem(WRITER_CONTENT_POOLS.tips),
      wordOfDay: wordData,
      prompt: getRandomItem(WRITER_CONTENT_POOLS.prompts),
      fact: getRandomItem(WRITER_CONTENT_POOLS.facts),
      timestamp: Date.now()
    };
  }, []);

  // Smart content fetching - tries AI first, always falls back to quality content
  const fetchContent = useCallback(async (forceRefresh = false) => {
    console.log('🚀 fetchContent called with forceRefresh:', forceRefresh);
    
    if (isLoading) {
      console.log('⏳ Already loading, skipping duplicate request');
      return;
    }
    
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefresh;
    const MIN_REFRESH_INTERVAL = 5 * 1000; // 5 seconds for testing
    
    if (!forceRefresh && timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
      const waitTime = Math.ceil((MIN_REFRESH_INTERVAL - timeSinceLastRefresh) / 1000);
      console.log('⏱️ Rate limited, waiting:', waitTime);
      toast.info(`Please wait ${waitTime}s before refreshing`);
      return;
    }

    console.log('✅ Starting content fetch...');
    setIsLoading(true);
    setError(null);
    
    let newContent: DailyContent;
    
    try {
      console.log('🤖 Attempting AI generation...');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/daily-content/generate', {
        method: 'POST',
        headers
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        newContent = await response.json();
        console.log('🎉 AI generation successful!');
        toast.success('Fresh AI-generated inspiration delivered!');
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
      
    } catch (error) {
      console.log('🔄 AI failed, using high-quality fallback content');
      newContent = generateFreshContent();
      toast.success('Fresh inspiration delivered!');
    }
    
    // Always update content
    setContent(newContent);
    setLastRefresh(now);
    
    // Cache with metadata
    const contentWithMeta = {
      ...newContent,
      fetchedAt: now,
      version: '2.0'
    };
    localStorage.setItem('fablecraft_daily_inspiration', JSON.stringify(contentWithMeta));
    
    setIsLoading(false);
    console.log('✅ Content refresh complete');
    
  }, [token, isLoading, lastRefresh, generateFreshContent, toast]);

  // Auto-advance content sets for better UX
  useEffect(() => {
    if (!isAutoPlay || !content) return;
    
    const interval = setInterval(() => {
      setCurrentSet(prev => (prev + 1) % contentSections.length);
    }, 20000); // 20 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlay, contentSections.length, content]);

  // Initialize content on mount - ALWAYS WORKS
  useEffect(() => {
    const initializeContent = () => {
      // Try cached content first
      try {
        const stored = localStorage.getItem('fablecraft_daily_inspiration');
        if (stored) {
          const parsed = JSON.parse(stored);
          const age = Date.now() - (parsed.fetchedAt || parsed.timestamp || 0);
          const isStale = age > (4 * 60 * 60 * 1000); // 4 hours
          
          if (!isStale && parsed.motivation) {
            setContent(parsed);
            console.log('📋 Loaded cached inspiration');
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached content:', e);
      }
      
      // Generate fresh content immediately - no waiting
      console.log('🎲 Generating fresh inspiration...');
      const freshContent = generateFreshContent();
      setContent(freshContent);
      setLastRefresh(Date.now());
      console.log('✅ Fresh content ready immediately');
    };
    
    initializeContent();
  }, [generateFreshContent]);

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
            Preparing your daily writing inspiration...
          </p>
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
              onClick={() => {
                console.log('🔄 Refresh button clicked!');
                fetchContent(true);
              }}
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