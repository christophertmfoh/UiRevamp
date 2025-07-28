import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Zap, 
  User, 
  FileText, 
  Palette, 
  FolderOpen,
  Sparkles,
  Clock,
  Target,
  Coffee,
  Lightbulb
} from 'lucide-react';
import { useWritingComponentPreloading } from '@/components/writing/LazyWritingComponents';

/**
 * Phase 5 Component 2: Quick Creative Actions Panel
 * One-click creative tools for instant workflow acceleration
 */

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'create' | 'navigate' | 'tools' | 'ai';
  shortcut?: string;
  action: () => void | Promise<void | any>;
  isLoading?: boolean;
  isDisabled?: boolean;
  badge?: string;
}

interface QuickActionsPanelProps {
  projectId?: string;
  onActionComplete?: (actionId: string, result?: any) => void;
  className?: string;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  projectId,
  onActionComplete,
  className
}) => {
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);
  
  const { 
    preloadWritingEditor,
    preloadStoryOutlineEditor,
    preloadAllWritingComponents
  } = useWritingComponentPreloading();

  const setActionLoading = (actionId: string, loading: boolean) => {
    setLoadingActions(prev => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(actionId);
      } else {
        newSet.delete(actionId);
      }
      return newSet;
    });
  };

  const executeAction = async (action: QuickAction) => {
    if (loadingActions.has(action.id) || action.isDisabled) return;

    setActionLoading(action.id, true);
    setLastActionTime(new Date());

    try {
      const result = await action.action();
      onActionComplete?.(action.id, result);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ Quick action completed: ${action.title}`);
      }
    } catch (error) {
      console.error(`Failed to execute quick action ${action.title}:`, error);
    } finally {
      setActionLoading(action.id, false);
    }
  };

  const quickActions: QuickAction[] = [
    // Create Actions
    {
      id: 'create-character',
      title: 'New Character',
      description: 'Create a character with AI assistance',
      icon: <User className="w-4 h-4" />,
      category: 'create',
      shortcut: 'Ctrl+Alt+C',
      action: async () => {
        await preloadWritingEditor();
        // In real implementation, this would open character creation modal
        console.log('🎭 Opening character creation...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate action
        return { type: 'character', created: true };
      }
    },
    {
      id: 'quick-outline',
      title: 'Story Outline',
      description: 'Generate story structure with AI',
      icon: <FileText className="w-4 h-4" />,
      category: 'create',
      shortcut: 'Ctrl+Alt+O',
      action: async () => {
        await preloadStoryOutlineEditor();
        console.log('📋 Generating story outline...');
        await new Promise(resolve => setTimeout(resolve, 800));
        return { type: 'outline', generated: true };
      }
    },
    {
      id: 'ai-brainstorm',
      title: 'AI Brainstorm',
      description: 'Get creative ideas and suggestions',
      icon: <Lightbulb className="w-4 h-4" />,
      category: 'ai',
      action: async () => {
        console.log('💡 Starting AI brainstorm session...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { type: 'brainstorm', ideas: 5 };
      },
      badge: 'AI'
    },

    // Navigation Actions
    {
      id: 'switch-project',
      title: 'Switch Project',
      description: 'Quick project navigation',
      icon: <FolderOpen className="w-4 h-4" />,
      category: 'navigate',
      shortcut: 'Ctrl+P',
      action: async () => {
        console.log('📁 Opening project switcher...');
        await new Promise(resolve => setTimeout(resolve, 300));
        return { type: 'navigation', target: 'projects' };
      }
    },
    {
      id: 'recent-documents',
      title: 'Recent Docs',
      description: 'Access recently edited documents',
      icon: <Clock className="w-4 h-4" />,
      category: 'navigate',
      shortcut: 'Ctrl+R',
      action: async () => {
        console.log('📄 Loading recent documents...');
        await new Promise(resolve => setTimeout(resolve, 200));
        return { type: 'navigation', target: 'recent' };
      }
    },

    // Tools Actions
    {
      id: 'theme-cycle',
      title: 'Cycle Theme',
      description: 'Switch between writing themes',
      icon: <Palette className="w-4 h-4" />,
      category: 'tools',
      shortcut: 'Ctrl+T',
      action: async () => {
        console.log('🎨 Cycling through themes...');
        // In real implementation, this would cycle through themes
        const themes = ['default', 'dark', 'sepia', 'minimal'];
        const currentTheme = Math.floor(Math.random() * themes.length);
        await new Promise(resolve => setTimeout(resolve, 100));
        return { type: 'theme', selected: themes[currentTheme] };
      }
    },
    {
      id: 'focus-mode',
      title: 'Focus Mode',
      description: 'Minimize distractions for writing',
      icon: <Target className="w-4 h-4" />,
      category: 'tools',
      shortcut: 'F11',
      action: async () => {
        console.log('🎯 Activating focus mode...');
        await new Promise(resolve => setTimeout(resolve, 200));
        return { type: 'focus', enabled: true };
      }
    },
    {
      id: 'writing-break',
      title: 'Take Break',
      description: 'Start a timed writing break',
      icon: <Coffee className="w-4 h-4" />,
      category: 'tools',
      action: async () => {
        console.log('☕ Starting break timer...');
        await new Promise(resolve => setTimeout(resolve, 300));
        return { type: 'break', duration: 5 }; // 5 minute break
      }
    },

    // AI Actions
    {
      id: 'preload-components',
      title: 'Preload Tools',
      description: 'Load all writing components for faster access',
      icon: <Zap className="w-4 h-4" />,
      category: 'tools',
      action: async () => {
        console.log('⚡ Preloading writing components...');
        const results = await preloadAllWritingComponents();
        if (!results) return { type: 'preload', components: 0 };
        return { type: 'preload', components: results.length };
      },
      badge: 'Speed'
    }
  ];

  const categorizedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category]?.push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  const categoryIcons = {
    create: <Sparkles className="w-4 h-4" />,
    navigate: <FolderOpen className="w-4 h-4" />,
    tools: <Zap className="w-4 h-4" />,
    ai: <Lightbulb className="w-4 h-4" />
  };

  const categoryTitles = {
    create: 'Create',
    navigate: 'Navigate', 
    tools: 'Tools',
    ai: 'AI Assist'
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </div>
          {lastActionTime && (
            <Badge variant="outline" className="text-xs">
              Last: {lastActionTime.toLocaleTimeString()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <TooltipProvider>
          {Object.entries(categorizedActions).map(([category, actions]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {categoryIcons[category as keyof typeof categoryIcons]}
                {categoryTitles[category as keyof typeof categoryTitles]}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {actions.map((action) => (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto p-3 flex flex-col items-start gap-1 relative"
                        onClick={() => executeAction(action)}
                        disabled={loadingActions.has(action.id) || action.isDisabled}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {action.icon}
                          <span className="text-xs font-medium truncate flex-1">
                            {action.title}
                          </span>
                          {action.badge && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        
                        {loadingActions.has(action.id) && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs">{action.description}</p>
                        {action.shortcut && (
                          <p className="text-xs font-mono bg-muted px-1 rounded">
                            {action.shortcut}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </TooltipProvider>

        {/* Quick Stats */}
        <div className="pt-3 border-t border-border/20">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Actions available:</span>
              <span>{quickActions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Currently loading:</span>
              <span>{loadingActions.size}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Compact floating action button version
 */
export const QuickActionsFAB: React.FC<{
  onActionSelect: (actionId: string) => void;
  className?: string;
}> = ({ onActionSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fabActions = [
    { id: 'create-character', icon: <User className="w-4 h-4" />, title: 'Character' },
    { id: 'quick-outline', icon: <FileText className="w-4 h-4" />, title: 'Outline' },
    { id: 'ai-brainstorm', icon: <Lightbulb className="w-4 h-4" />, title: 'Ideas' },
    { id: 'theme-cycle', icon: <Palette className="w-4 h-4" />, title: 'Theme' }
  ];

  return (
    <div className={`fixed bottom-4 right-4 ${className}`}>
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-in slide-in-from-bottom-2">
          {fabActions.map((action) => (
            <TooltipProvider key={action.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-12 h-12 rounded-full shadow-lg"
                    onClick={() => {
                      onActionSelect(action.id);
                      setIsOpen(false);
                    }}
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {action.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
      
      <Button
        variant="default"
        size="lg"
        className="w-14 h-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Zap className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </Button>
    </div>
  );
};