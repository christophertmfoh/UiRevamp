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
  Heart,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Zap,
  TrendingUp,
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

interface ContentMetrics {
  views: number;
  likes: number;
  shares: number;
  lastViewed: number;
}

// Enhanced fallback content with better variety
const ENHANCED_FALLBACKS = {
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

const WORD_POOLS = {
  literary: [
    { word: "Denouement", definition: "The final resolution of a story", usage: "Perfect for describing story endings" },
    { word: "Bildungsroman", definition: "A coming-of-age story", usage: "Use for character development arcs" },
    { word: "Verisimilitude", definition: "The appearance of truth", usage: "Essential for believable fiction" }
  ],
  atmospheric: [
    { word: "Petrichor", definition: "Scent of earth after rain", usage: "Creates vivid sensory descriptions" },
    { word: "Crepuscular", definition: "Relating to twilight", usage: "Perfect for moody scene-setting" },
    { word: "Lambent", definition: "Softly glowing light", usage: "Describes gentle illumination" }
  ],
  emotional: [
    { word: "Saudade", definition: "Bittersweet longing", usage: "Captures complex emotional states" },
    { word: "Hiraeth", definition: "Homesickness for a lost place", usage: "Expresses deep nostalgic yearning" },
    { word: "Schadenfreude", definition: "Joy from others' misfortune", usage: "For complex character motivations" }
  ]
};

export function MessageOfTheDay() {
  const { token } = useAuth();
  const { toast } = useToastActions();
  
  // Core state
  const [content, setContent] = useState<DailyContent | null>(null);
  const [currentSet, setCurrentSet] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  
  // Enhanced UX state
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [metrics, setMetrics] = useState<ContentMetrics>({
    views: 0,
    likes: 0,
    shares: 0,
    lastViewed: 0
  });
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Memoized content sections for performance
  const contentSections = useMemo(() => [
    {
      id: 'motivation-set',
      items: [
        { type: 'motivation', icon: Sparkles, label: 'Motivation', key: 'motivation' },
        { type: 'joke', icon: Smile, label: 'Writer\'s Humor', key: 'joke' },
        { type: 'tip', icon: Lightbulb, label: 'Pro Tip', key: 'tip' }
      ]
    },
    {
      id: 'knowledge-set', 
      items: [
        { type: 'word', icon: BookOpen, label: 'Word of the Day', key: 'wordOfDay' },
        { type: 'prompt', icon: PenTool, label: 'Quick Prompt', key: 'prompt' },
        { type: 'fact', icon: Brain, label: 'Writing Fact', key: 'fact' }
      ]
    }
  ], []);

  // Enhanced content fetching with retry logic
  const fetchContent = useCallback(async (forceRefresh = false) => {
    if (isGenerating) return;
    
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefresh;
    const MIN_REFRESH_INTERVAL = 30 * 1000; // 30 seconds
    
    if (!forceRefresh && timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
      toast.info(`Please wait ${Math.ceil((MIN_REFRESH_INTERVAL - timeSinceLastRefresh) / 1000)}s before refreshing`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎨 Fetching daily inspirations...');
      
      const response = await fetch('/api/daily-content/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const newContent: DailyContent = await response.json();
      
      // Validate content structure
      if (!newContent || !newContent.motivation) {
        throw new Error('Invalid content structure received');
      }
      
      setContent(newContent);
      setLastRefresh(now);
      setRetryCount(0);
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        views: prev.views + 1,
        lastViewed: now
      }));
      
      // Store in localStorage with timestamp
      const contentWithMeta = {
        ...newContent,
        fetchedAt: now,
        userId: token ? 'authenticated' : 'anonymous'
      };
      localStorage.setItem('fablecraft_daily_content', JSON.stringify(contentWithMeta));
      
      console.log('✅ Daily content updated successfully');
      toast.success('Fresh inspiration delivered!');
      
    } catch (error) {
      console.error('❌ Failed to fetch daily content:', error);
      setError(error instanceof Error ? error.message : 'Failed to load content');
      setRetryCount(prev => prev + 1);
      
      // Use fallback content if we don't have any
      if (!content && retryCount < MAX_RETRIES) {
        const fallbackContent = generateFallbackContent();
        setContent(fallbackContent);
        toast.warning('Using offline content. Check your connection.');
      } else if (retryCount >= MAX_RETRIES) {
        toast.error('Unable to fetch fresh content. Please try again later.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [token, isGenerating, lastRefresh, content, retryCount, toast]);

  // Generate high-quality fallback content
  const generateFallbackContent = useCallback((): DailyContent => {
    const getRandomItem = <T,>(array: T[]): T => 
      array[Math.floor(Math.random() * array.length)];
    
    const wordCategory = getRandomItem(Object.keys(WORD_POOLS));
    const wordData = getRandomItem(WORD_POOLS[wordCategory as keyof typeof WORD_POOLS]);
    
    return {
      motivation: getRandomItem(ENHANCED_FALLBACKS.motivations),
      joke: getRandomItem(ENHANCED_FALLBACKS.jokes),
      tip: getRandomItem(ENHANCED_FALLBACKS.tips),
      wordOfDay: wordData,
      prompt: getRandomItem(ENHANCED_FALLBACKS.prompts),
      fact: getRandomItem(ENHANCED_FALLBACKS.facts),
      personalizedHint: "Focus on showing emotions through actions, not just words.",
      timestamp: Date.now()
    };
  }, []);

  // Auto-advance content sets
  useEffect(() => {
    if (!isAutoPlay || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSet(prev => (prev + 1) % contentSections.length);
    }, 15000); // 15 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlay, isPaused, contentSections.length]);

  // Initialize content on mount
  useEffect(() => {
    const initializeContent = async () => {
      // Try to load from localStorage first
      try {
        const stored = localStorage.getItem('fablecraft_daily_content');
        if (stored) {
          const parsed = JSON.parse(stored);
          const age = Date.now() - (parsed.fetchedAt || parsed.timestamp || 0);
          const isStale = age > (12 * 60 * 60 * 1000); // 12 hours
          
          if (!isStale && parsed.motivation) {
            setContent(parsed);
            console.log('📋 Loaded cached daily content');
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached content:', e);
      }
      
      // Fetch fresh content
      await fetchContent();
    };
    
    initializeContent();
  }, [fetchContent]);

  // Enhanced user interactions
  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setMetrics(prev => ({
      ...prev,
      likes: prev.likes + (isLiked ? -1 : 1)
    }));
    
    if (!isLiked) {
      toast.success('Added to your favorites!');
    }
  }, [isLiked, toast]);

  const handleShare = useCallback(async () => {
    if (!content) return;
    
    const shareText = `Daily Writer's Inspiration:\n"${content.motivation}"\n\nWord of the Day: ${content.wordOfDay.word} - ${content.wordOfDay.definition}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Writer\'s Inspiration',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Inspiration copied to clipboard!');
      }
      
      setMetrics(prev => ({ ...prev, shares: prev.shares + 1 }));
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share content');
    }
  }, [content, toast]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(prev => !prev);
    // In production, this would save to user's bookmarks
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Bookmarked for later!');
  }, [isBookmarked, toast]);

  // Render content item with enhanced styling
  const renderContentItem = useCallback((item: any, value: any) => {
    const Icon = item.icon;
    
    if (item.type === 'word' && content?.wordOfDay) {
      return (
        <div key={item.type} className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {item.label}
            </p>
          </div>
          <div className="bg-accent/5 rounded-lg p-3 border border-border/20">
            <p className="text-sm">
              <span className="font-bold text-primary text-base">{content.wordOfDay.word}</span>
              <span className="text-muted-foreground ml-2">- {content.wordOfDay.definition}</span>
            </p>
            <p className="text-xs text-muted-foreground/80 italic mt-1">
              💡 {content.wordOfDay.usage}
            </p>
            {content.wordOfDay.pronunciation && (
              <p className="text-xs text-muted-foreground/60 mt-1">
                🔊 {content.wordOfDay.pronunciation}
              </p>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div key={item.type} className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 gradient-primary rounded-full" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {item.label}
          </p>
        </div>
        <p className={`text-xs leading-relaxed ${
          item.type === 'motivation' 
            ? 'text-foreground italic font-medium' 
            : 'text-muted-foreground'
        }`}>
          {item.type === 'motivation' ? `"${value}"` : value}
        </p>
      </div>
    );
  }, [content]);

  if (!content) {
    return (
      <Card className="glass-card backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 h-full">
        <CardContent className="p-5 h-full flex flex-col items-center justify-center">
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {isGenerating ? 'Crafting your daily inspiration...' : 'Loading inspirations...'}
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
      <CardContent className="p-5 h-full flex flex-col">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-primary" />
              {metrics.views > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Daily Inspiration</h3>
              {content.personalizedHint && (
                <p className="text-xs text-muted-foreground">Personalized for you</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPaused(!isPaused)}
              className="h-7 w-7 p-0 hover:bg-accent/10"
              title={isPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
            >
              {isPaused ? 
                <Play className="w-3 h-3 text-muted-foreground" /> :
                <Pause className="w-3 h-3 text-muted-foreground" />
              }
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fetchContent(true)}
              disabled={isGenerating}
              className="h-7 w-7 p-0 hover:bg-accent/10 disabled:opacity-50"
              title="Refresh content"
            >
              <RefreshCw className={`w-3 h-3 text-muted-foreground ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentSet((prev) => (prev + 1) % contentSections.length)}
              className="h-7 w-7 p-0 hover:bg-accent/10"
              title="Next set"
            >
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Content Display */}
        <div className="flex-grow space-y-4 overflow-hidden">
          <div className="transition-all duration-500 ease-in-out">
            {contentSections[currentSet]?.items.map(item => {
              const value = item.key === 'wordOfDay' ? content.wordOfDay : content[item.key as keyof DailyContent];
              return renderContentItem(item, value);
            })}
          </div>

          {/* Personalized Hint */}
          {content.personalizedHint && currentSet === 1 && (
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3 w-3 text-primary" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Personal Tip
                </p>
              </div>
              <p className="text-xs text-foreground/80">
                {content.personalizedHint}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-4 space-y-3">
          {/* Interaction Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLike}
                className={`h-7 px-2 hover:bg-accent/10 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{metrics.likes}</span>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                className="h-7 px-2 hover:bg-accent/10 text-muted-foreground"
              >
                <Share2 className="w-3 h-3 mr-1" />
                <span className="text-xs">{metrics.shares}</span>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleBookmark}
                className={`h-7 px-2 hover:bg-accent/10 ${isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            {metrics.views > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>{metrics.views} views</span>
              </div>
            )}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1">
              {contentSections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSet(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentSet === index
                      ? 'gradient-primary w-6 h-1.5'
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`View content set ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}