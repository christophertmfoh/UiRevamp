import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Sparkles } from 'lucide-react';

interface Message {
  text: string;
  type: 'motivational' | 'pun' | 'joke' | 'tip';
  timestamp: number;
}

const defaultMessages: Message[] = [
  { text: "Every story starts with a single word. Make today's word count!", type: 'motivational', timestamp: Date.now() },
  { text: "Writers don't have writer's block, they have character development opportunities!", type: 'pun', timestamp: Date.now() },
  { text: "Why did the writer break up with their keyboard? Too many mixed characters!", type: 'joke', timestamp: Date.now() },
  { text: "Pro tip: Your first draft is just you telling yourself the story.", type: 'tip', timestamp: Date.now() },
  { text: "Plot twist: You're already a better writer than you were yesterday!", type: 'motivational', timestamp: Date.now() },
  { text: "I'm reading a book about anti-gravity writing. It's impossible to put down!", type: 'joke', timestamp: Date.now() },
  { text: "Character development is like coffee - it takes time to brew perfectly.", type: 'pun', timestamp: Date.now() },
  { text: "Remember: Every published author was once an unpublished author who didn't give up.", type: 'motivational', timestamp: Date.now() }
];

export function MessageOfTheDay() {
  const [currentMessage, setCurrentMessage] = useState<Message>(defaultMessages[0]);

  useEffect(() => {
    // Check if we have a stored message and timestamp
    const stored = localStorage.getItem('fablecraft_message_of_day');
    const now = Date.now();
    
    if (stored) {
      try {
        const parsed: Message = JSON.parse(stored);
        // Check if message is less than 12 hours old (12 * 60 * 60 * 1000 = 43200000)
        if (now - parsed.timestamp < 43200000) {
          setCurrentMessage(parsed);
          return;
        }
      } catch (e) {
        console.log('Error parsing stored message:', e);
      }
    }
    
    // Generate new message (for now, pick random from defaults)
    // TODO: In future, this would call AI service every 12 hours
    const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
    const newMessage: Message = {
      ...randomMessage,
      timestamp: now
    };
    
    setCurrentMessage(newMessage);
    localStorage.setItem('fablecraft_message_of_day', JSON.stringify(newMessage));
  }, []);

  const getIcon = () => {
    switch (currentMessage.type) {
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getLabel = () => {
    switch (currentMessage.type) {
      case 'motivational':
        return 'Daily Motivation';
      case 'pun':
        return 'Writer\'s Pun';
      case 'joke':
        return 'Writing Humor';
      case 'tip':
        return 'Writing Tip';
      default:
        return 'Message of the Day';
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl border border-stone-300/30 dark:border-slate-700/20">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {getIcon()}
          <h3 className="font-bold text-stone-900 dark:text-stone-50 text-sm">
            {getLabel()}
          </h3>
        </div>
        <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          {currentMessage.text}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Updates every 12 hours
          </span>
          <div className="w-2 h-2 bg-gradient-to-br from-emerald-600 to-amber-600 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}