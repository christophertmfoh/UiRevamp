import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-accent/10 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0 text-primary" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100 text-primary" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.includes('light') && (
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        )}
        {themes.includes('dark') && (
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        )}
        {themes.includes('system') && (
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button for minimal UIs
export function ThemeToggleSimple() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg hover:bg-accent/10 transition-colors"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0 text-primary" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100 text-primary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}