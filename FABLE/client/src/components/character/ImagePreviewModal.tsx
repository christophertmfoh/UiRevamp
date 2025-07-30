import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  characterName: string;
  currentIndex: number;
  totalImages: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageSrc,
  characterName,
  currentIndex,
  totalImages,
  onNavigate
}: ImagePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
        <div className="relative bg-black/90 rounded-lg overflow-hidden">
          <img 
            src={imageSrc} 
            alt={`Full size portrait of ${characterName}`}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {/* Navigation arrows - only show if more than 1 image */}
          {totalImages > 1 && onNavigate && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 h-12 w-12 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 h-12 w-12 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          
          {/* Custom close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 z-50"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Image counter and info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-accent-foreground font-semibold text-lg">{characterName}</h3>
                <p className="text-accent-foreground/80 text-sm">Character Portrait</p>
              </div>
              {totalImages > 1 && (
                <div className="text-accent-foreground/80 text-sm">
                  {currentIndex + 1} of {totalImages}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}