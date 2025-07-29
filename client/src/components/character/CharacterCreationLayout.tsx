import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterCreationLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  progress?: number;
  isLoading?: boolean;
  loadingText?: string;
  onBack?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function CharacterCreationLayout({
  title,
  subtitle,
  icon,
  iconColor,
  progress,
  isLoading,
  loadingText,
  onBack,
  children,
  actions
}: CharacterCreationLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", iconColor)}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          </div>
          {progress !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              <Progress value={progress} className="w-32 h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">{loadingText || 'Loading...'}</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && !isLoading && (
        <div className="border-t bg-muted/30 px-6 py-4">
          {actions}
        </div>
      )}
    </div>
  );
}