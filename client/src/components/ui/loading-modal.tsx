import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export function LoadingModal({ isOpen, title = "AI is thinking...", message = "Analyzing your character data and generating contextual details." }: LoadingModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="relative">
            <Sparkles className="h-12 w-12 text-orange-500 animate-pulse" />
            <Loader2 className="h-6 w-6 text-orange-400 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 animate-pulse"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}