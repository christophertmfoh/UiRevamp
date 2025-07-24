import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../../lib/types';

interface FieldAIAssistProps {
  character: Character;
  fieldKey: string;
  fieldLabel: string;
  currentValue: any;
  onFieldUpdate: (value: any) => void;
  disabled?: boolean;
}

export function FieldAIAssist({ 
  character, 
  fieldKey, 
  fieldLabel, 
  currentValue, 
  onFieldUpdate, 
  disabled = false 
}: FieldAIAssistProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleFieldEnhance = async () => {
    if (disabled || isEnhancing) return;
    
    setIsEnhancing(true);
    try {
      console.log(`Starting field enhancement for ${fieldKey}:`, fieldLabel);
      
      const response = await apiRequest('POST', `/api/characters/${character.id}/enhance-field`, {
        character,
        fieldKey,
        fieldLabel,
        currentValue
      });
      
      const result = await response.json();
      console.log(`Field enhancement result for ${fieldKey}:`, result);
      
      if (result[fieldKey] !== undefined) {
        onFieldUpdate(result[fieldKey]);
      }
    } catch (error) {
      console.error(`Failed to enhance field ${fieldKey}:`, error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Don't show genie if field already has content (non-destructive)
  if (currentValue && currentValue !== '' && (!Array.isArray(currentValue) || currentValue.length > 0)) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleFieldEnhance}
            disabled={disabled || isEnhancing}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-accent/10 transition-all duration-200"
          >
            {isEnhancing ? (
              <Loader2 className="h-3 w-3 animate-spin text-accent" />
            ) : (
              <Sparkles className="h-3 w-3 text-accent hover:text-accent/80" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-background border border-border/30 text-foreground">
          <p className="text-xs">
            {isEnhancing ? `Generating ${fieldLabel.toLowerCase()}...` : `AI generate ${fieldLabel.toLowerCase()}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}