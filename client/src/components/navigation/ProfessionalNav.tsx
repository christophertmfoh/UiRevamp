import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../theme-toggle';
import { 
  Feather, 
  BookOpen, 
  Users,
  PenTool,
  Library,
  Settings,
  User,
  LogOut,
  UserCircle,
  ChevronDown,
  Plus,
  Search,
  Home,
  Grid3X3,
  FileText,
  Palette,
  Globe,
  Zap
} from 'lucide-react';

interface ProfessionalNavProps {
  user: any;
  isAuthenticated: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
  onNewProject: () => void;
  onAuth: () => void;
  onLogout: () => Promise<void>;
}

const navigationItems = [
  { id: 'landing', label: 'Home', icon: Home, description: 'Landing page' },
  { id: 'projects', label: 'Projects', icon: Grid3X3, description: 'All your creative projects' },
  { id: 'characters', label: 'Characters', icon: Users, description: 'Character management' },
  { id: 'world', label: 'World Bible', icon: Globe, description: 'World building tools' },
  { id: 'templates', label: 'Templates', icon: FileText, description: 'Project templates' },
];

const quickActions = [
  { id: 'new-project', label: 'New Project', icon: Plus, action: 'onNewProject' },
  { id: 'new-character', label: 'New Character', icon: Users, action: 'onNavigate', target: 'characters' },
  { id: 'ai-generate', label: 'AI Generate', icon: Zap, action: 'onNavigate', target: 'ai-tools' },
];

export function ProfessionalNav({
  user,
  isAuthenticated,
  currentView,
  onNavigate,
  onNewProject,
  onAuth,
  onLogout
}: ProfessionalNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onNavigate('landing')}
            >
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Feather className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                FableCraft
              </span>
            </div>

            {/* Professional Badge for Authenticated Users */}
            {isAuthenticated && (
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 font-medium px-3 py-1"
              >
                Professional
              </Badge>
            )}
          </div>

          {/* Center Navigation - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onNavigate(item.id)}
                    className={`
                      relative px-4 py-2 h-9 font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-[1px] left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions - Authenticated Users */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                      <ChevronDown className="w-3 h-3 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {quickActions.map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <DropdownMenuItem
                          key={action.id}
                          onClick={() => {
                            if (action.action === 'onNewProject') {
                              onNewProject();
                            } else if (action.action === 'onNavigate' && action.target) {
                              onNavigate(action.target);
                            }
                          }}
                          className="cursor-pointer py-3"
                        >
                          <IconComponent className="w-4 h-4 mr-3 text-primary" />
                          <span className="font-medium">{action.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Search Button - Authenticated Users */}
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-border/60 hover:bg-accent/50 transition-all duration-300"
                onClick={() => {
                  // TODO: Implement command palette (PROMPT 3.1)
                  console.log('Search/Command Palette - Coming in Phase 3');
                }}
              >
                <Search className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 font-medium hover:bg-accent/50 transition-all duration-300"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline-block">
                      {user?.username || 'User'}
                    </span>
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-sm font-medium text-foreground">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Professional Plan
                    </p>
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={() => onNavigate('projects')}
                    className="cursor-pointer py-3"
                  >
                    <BookOpen className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-medium">Your Projects</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => console.log('Account settings - Coming soon')}
                    className="cursor-pointer py-3"
                  >
                    <User className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-medium">Account Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => console.log('Preferences - Coming soon')}
                    className="cursor-pointer py-3"
                  >
                    <Settings className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-medium">Preferences</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="cursor-pointer py-3 text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={onAuth}
                size="sm"
                className="gradient-primary text-primary-foreground px-4 py-2 h-9 font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Users className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isAuthenticated && (
          <div className="md:hidden border-t border-border/40 py-2">
            <div className="flex items-center justify-between space-x-2 overflow-x-auto">
              {navigationItems.slice(0, 4).map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onNavigate(item.id)}
                    className={`
                      flex-shrink-0 px-3 py-2 h-8 text-xs font-medium
                      ${isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <IconComponent className="w-3 h-3 mr-1.5" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile Quick Action */}
              <Button
                variant="outline"
                size="sm"
                onClick={onNewProject}
                className="flex-shrink-0 h-8 px-3 border-dashed border-primary/30 text-primary"
              >
                <Plus className="w-3 h-3 mr-1.5" />
                New
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}