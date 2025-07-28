import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, 
  Feather, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Lock,
  Unlock
} from 'lucide-react';

interface User {
  username?: string;
}

interface ProjectsHeaderProps {
  user: User | null;
  isEditMode: boolean;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToggleEditMode: () => void;
}

export const ProjectsHeader = React.memo(function ProjectsHeader({
  user,
  isEditMode,
  onNavigate,
  onLogout,
  onToggleEditMode
}: ProjectsHeaderProps) {
  return (
    <nav className="relative z-10 px-8 py-4 border-b border-border/20 backdrop-blur-xl bg-background/80">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="group text-foreground hover:text-foreground/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </Button>
        </div>
        
        {/* Centered Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary-br rounded-xl flex items-center justify-center shadow-lg">
            <Feather className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-heading-2 font-serif text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Fablecraft
          </span>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="group gradient-primary text-primary-foreground px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:brightness-110 rounded-xl relative overflow-hidden flex items-center space-x-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center space-x-2">
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">{user?.username}</span>
                  <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border border-border/30 shadow-xl">
              <DropdownMenuItem className="text-foreground hover:bg-accent/10 focus:bg-accent/10 hover:text-foreground focus:text-foreground">
                <User className="w-4 h-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-accent/10 focus:bg-accent/10 hover:text-foreground focus:text-foreground">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive hover:text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="icon"
            onClick={onToggleEditMode}
            className="w-10 h-10 gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 rounded-lg"
            title={isEditMode ? 'Lock Layout' : 'Customize Layout'}
          >
            {isEditMode ? (
              <Unlock className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
});