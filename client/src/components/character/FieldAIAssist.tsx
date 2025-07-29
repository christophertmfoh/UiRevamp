import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles } from 'lucide-react';

interface FieldAIAssistProps {
  character?: any; // Made optional since we're not using it
  fieldKey: string;
  fieldLabel: string;
  currentValue?: any; // Made optional since we're not using it
  onFieldUpdate?: (value: any) => void; // Made optional since we're not using it
  disabled?: boolean;
  fieldOptions?: string[];
}

export function FieldAIAssist({ 
  disabled = false
}: FieldAIAssistProps) {
  
  const handleFieldEnhance = () => {
    // AI functionality removed - this is just a placeholder UI element
    console.log('🤖 AI Field Enhancement - UI placeholder (no functionality)');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleFieldEnhance}
            disabled={disabled}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-accent/10 transition-colors opacity-50 cursor-default"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>AI Enhancement - Coming Soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}