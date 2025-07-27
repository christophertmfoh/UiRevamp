import React from 'react';
import { Monitor, Sun, Moon, Palette, Crown, Sunrise, Scroll, Leaf, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';

const themeIcons = {
  light: Sun,
  dark: Moon,
  'midnight-ink': Crown,
  'sunrise-creative': Sunrise,
  'sepia-parchment': Scroll,
  'evergreen-focus': Leaf,
  'obsidian-minimal': Minimize2,
  system: Monitor,
} as const;

export function ThemeToggle() {
  const { theme, setTheme, availableThemes } = useTheme();

  const getCurrentIcon = () => {
    const IconComponent = themeIcons[theme as keyof typeof themeIcons] || Palette;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleThemeChange = (newTheme: string) => {
    try {
      setTheme(newTheme as any);
    } catch (error) {
      console.warn('Theme change failed:', error);
    }
  };

  // Group themes by category
  const featuredThemes = availableThemes.filter(t => t.featured);
  const creativeThemes = availableThemes.filter(t => t.category === 'creative');
  const classicThemes = availableThemes.filter(t => !t.featured && t.category !== 'creative');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 hover:bg-accent/10 text-primary"
        >
          {getCurrentIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 bg-card/95 border-border/30 backdrop-blur-xl"
      >
        <div className="p-2">
          <DropdownMenuLabel className="text-sm font-semibold text-foreground flex items-center space-x-2">
            <Palette className="h-4 w-4 text-primary" />
            <span>Choose Your Theme</span>
          </DropdownMenuLabel>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Featured Themes */}
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
            Featured
          </div>
          {featuredThemes.map(themeConfig => {
            const IconComponent = themeIcons[themeConfig.id as keyof typeof themeIcons] || Palette;
            const isSelected = theme === themeConfig.id;
            
            return (
              <DropdownMenuItem
                key={themeConfig.id}
                onClick={() => handleThemeChange(themeConfig.id)}
                className="flex items-center justify-between hover:bg-accent/10 cursor-pointer py-3 px-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary/20' : 'bg-muted/50'}`}>
                    <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {themeConfig.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {themeConfig.mood}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Creative Themes */}
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
            Creative Collection
          </div>
          {creativeThemes.map(themeConfig => {
            const IconComponent = themeIcons[themeConfig.id as keyof typeof themeIcons] || Palette;
            const isSelected = theme === themeConfig.id;
            
            return (
              <DropdownMenuItem
                key={themeConfig.id}
                onClick={() => handleThemeChange(themeConfig.id)}
                className="flex items-center justify-between hover:bg-accent/10 cursor-pointer py-3 px-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary/20' : 'bg-muted/50'}`}>
                    <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {themeConfig.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {themeConfig.mood}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Classic Themes */}
        <div className="px-2 py-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wide">
            Classic
          </div>
          {classicThemes.map(themeConfig => {
            const IconComponent = themeIcons[themeConfig.id as keyof typeof themeIcons] || Palette;
            const isSelected = theme === themeConfig.id;
            
            return (
              <DropdownMenuItem
                key={themeConfig.id}
                onClick={() => handleThemeChange(themeConfig.id)}
                className="flex items-center justify-between hover:bg-accent/10 cursor-pointer py-3 px-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary/20' : 'bg-muted/50'}`}>
                    <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {themeConfig.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {themeConfig.mood}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <DropdownMenuSeparator />
        
        {/* System Theme */}
        <div className="px-2 py-1">
          <DropdownMenuItem
            onClick={() => handleThemeChange('system')}
            className="flex items-center justify-between hover:bg-accent/10 cursor-pointer py-3 px-4"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-md ${theme === 'system' ? 'bg-primary/20' : 'bg-muted/50'}`}>
                <Monitor className={`h-4 w-4 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${theme === 'system' ? 'text-primary' : 'text-foreground'}`}>
                  System
                </span>
                <span className="text-xs text-muted-foreground">
                  Follow OS preference
                </span>
              </div>
            </div>
            {theme === 'system' && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export a simple toggle button for places where dropdown isn't suitable
export function ThemeToggleSimple() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    try {
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    } catch (error) {
      console.warn('Theme toggle failed:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0 text-amber-600" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100 text-amber-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}