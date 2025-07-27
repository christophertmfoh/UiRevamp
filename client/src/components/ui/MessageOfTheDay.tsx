import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, RefreshCw, BookOpen, PenTool, Smile, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DailyContent {
  motivation: string;
  joke: string;
  tip: string;
  wordOfDay: {
    word: string;
    definition: string;
    usage: string;
  };
  prompt: string;
  fact: string;
  timestamp: number;
}

const motivationalQuotes = [
  "Every story starts with a single word. Make today's word count!",
  "Plot twist: You're already a better writer than you were yesterday!",
  "Remember: Every published author was once an unpublished author who didn't give up.",
  "Your characters are waiting to tell their tale.",
  "A single sentence can change everything.",
  "Great stories begin with a single keystroke.",
  "Your imagination is your greatest tool.",
  "Write the story only you can tell."
];

const writingJokes = [
  "Why did the writer break up with their keyboard? Too many mixed characters!",
  "I'm reading a book about anti-gravity writing. It's impossible to put down!",
  "Why did the writer stay in bed? They had a bad case of writer's block!",
  "What's a writer's favorite punctuation? The period—it means they finished something!",
  "How do writers stay warm? They sit by the drafts!",
  "What do you call a writer who doesn't follow guidelines? A rebel without a clause!",
  "Why was the comma afraid? It had too many pauses in life!",
  "What's a writer's favorite drink? Tequila mockingbird!"
];

const writingTips = [
  "Pro tip: Your first draft is just you telling yourself the story.",
  "Start with action to hook your readers immediately.",
  "Show, don't tell—let readers experience the emotion.",
  "Every character needs a want and a fear.",
  "Dialogue should reveal character, not just convey information.",
  "Read your dialogue aloud to test if it sounds natural.",
  "Your protagonist should change by the story's end.",
  "Conflict drives story—embrace it in every scene."
];

const wordsOfTheDay = [
  { word: "Petrichor", definition: "The pleasant smell of earth after rain", usage: "Perfect for atmospheric descriptions" },
  { word: "Sonder", definition: "The realization that everyone has a story", usage: "Great for character development" },
  { word: "Vellichor", definition: "The wistfulness of used bookstores", usage: "Ideal for nostalgic scenes" },
  { word: "Ineffable", definition: "Too great to be expressed in words", usage: "For those indescribable moments" },
  { word: "Ephemeral", definition: "Lasting for a very short time", usage: "Perfect for fleeting emotions" },
  { word: "Mellifluous", definition: "Sweet or musical; pleasant to hear", usage: "Describe voices or sounds" },
  { word: "Serendipity", definition: "Finding something good without looking", usage: "For fortunate plot twists" }
];

const writingPrompts = [
  "A character discovers a letter that was never meant to be sent...",
  "The last person on Earth hears a knock at the door...",
  "Your protagonist wakes up with a superpower they don't want...",
  "A time traveler arrives with news about tomorrow...",
  "Two enemies are trapped together during a storm...",
  "A character must choose between two terrible truths...",
  "Someone receives a package with no return address..."
];

const writingFacts = [
  "Agatha Christie is the best-selling novelist of all time with over 2 billion copies sold.",
  "The most expensive book ever sold was Leonardo da Vinci's Codex Leicester for $30.8 million.",
  "The word 'bookworm' originated from insects that actually ate through books.",
  "Dr. Seuss wrote 'Green Eggs and Ham' using only 50 different words to win a bet.",
  "The longest novel ever written is 'Artamène' with 2.1 million words.",
  "J.K. Rowling's Harry Potter manuscript was rejected 12 times before being published.",
  "Stephen King throws away the first draft of Carrie, but his wife rescued it from the trash.",
  "Mark Twain was the first author to submit a typewritten manuscript."
];

export function MessageOfTheDay() {
  const { token } = useAuth();
  const [content, setContent] = useState<DailyContent>({
    motivation: '',
    joke: '',
    tip: '',
    wordOfDay: { word: '', definition: '', usage: '' },
    prompt: '',
    fact: '',
    timestamp: Date.now()
  });
  const [currentSet, setCurrentSet] = useState(0); // 0 or 1 for cycling through content
  const [isGenerating, setIsGenerating] = useState(false);

  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const refreshContent = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/daily-content/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const newContent = await response.json();
        const contentWithTimestamp: DailyContent = {
          ...newContent,
          timestamp: Date.now()
        };
        setContent(contentWithTimestamp);
        localStorage.setItem('fablecraft_daily_content', JSON.stringify(contentWithTimestamp));
      } else {
        // Fallback to static content if API fails
        const newContent: DailyContent = {
          motivation: getRandomItem(motivationalQuotes),
          joke: getRandomItem(writingJokes),
          tip: getRandomItem(writingTips),
          wordOfDay: getRandomItem(wordsOfTheDay),
          prompt: getRandomItem(writingPrompts),
          fact: getRandomItem(writingFacts),
          timestamp: Date.now()
        };
        setContent(newContent);
        localStorage.setItem('fablecraft_daily_content', JSON.stringify(newContent));
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
      // Fallback to static content
      const newContent: DailyContent = {
        motivation: getRandomItem(motivationalQuotes),
        joke: getRandomItem(writingJokes),
        tip: getRandomItem(writingTips),
        wordOfDay: getRandomItem(wordsOfTheDay),
        prompt: getRandomItem(writingPrompts),
        fact: getRandomItem(writingFacts),
        timestamp: Date.now()
      };
      setContent(newContent);
      localStorage.setItem('fablecraft_daily_content', JSON.stringify(newContent));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextSet = () => {
    setCurrentSet((prev) => (prev + 1) % 2);
  };

  useEffect(() => {
    // Check if we have stored content
    const stored = localStorage.getItem('fablecraft_daily_content');
    const storedLike = localStorage.getItem('fablecraft_content_liked');
    const now = Date.now();
    
    if (stored) {
      try {
        const parsed: DailyContent = JSON.parse(stored);
        // Check if content is less than 12 hours old
        if (now - parsed.timestamp < 43200000) {
          setContent(parsed);
          return;
        }
      } catch (e) {
        console.log('Error parsing stored content:', e);
      }
    }
    
    // Generate new content
    refreshContent();
  }, []);

  // Cycle through content sets every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % 2);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card 
      className="glass-card dark:bg-card/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-border/30 dark:border-border/20 h-full group hover:shadow-2xl transition-all duration-300"
    >
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">
              Daily Inspiration
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                refreshContent();
              }}
              disabled={isGenerating}
              className="h-7 w-7 p-0 hover:bg-stone-100 dark:hover:bg-stone-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh content"
            >
              <RefreshCw className={`w-3 h-3 text-stone-400 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleNextSet();
              }}
              className="h-7 w-7 p-0 hover:bg-stone-100 dark:hover:bg-stone-700/30"
              title="Next set"
            >
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow space-y-3 flex flex-col justify-center">
          {currentSet === 0 && (
            <>
              {/* Motivation */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-600 to-amber-600 rounded-full"></div>
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Motivation</p>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 italic leading-normal">
                  "{content.motivation}"
                </p>
              </div>

              {/* Writing Joke */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smile className="h-3.5 w-3.5 text-warning" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Writer's Humor</p>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-normal">
                  {content.joke}
                </p>
              </div>

              {/* Writing Tip */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-warning" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Pro Tip</p>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-normal">
                  {content.tip}
                </p>
              </div>
            </>
          )}

          {currentSet === 1 && (
            <>
              {/* Word of the Day */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Word of the Day</p>
                </div>
                <p className="text-xs">
                  <span className="font-semibold text-emerald-600">{content.wordOfDay.word}</span>
                  <span className="text-stone-600 dark:text-stone-400"> - {content.wordOfDay.definition}</span>
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-500 italic">{content.wordOfDay.usage}</p>
              </div>

              {/* Quick Prompt */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <PenTool className="h-3.5 w-3.5 text-warning" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Quick Prompt</p>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 italic leading-normal">
                  {content.prompt}
                </p>
              </div>

              {/* Writing Fact */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Writing Fact</p>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-normal">
                  {content.fact}
                </p>
              </div>
            </>
          )}


        </div>
        
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-1">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentSet === index
                    ? 'bg-gradient-to-br from-emerald-600 to-amber-600 w-2 h-2'
                    : 'bg-stone-300 dark:bg-stone-600'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}