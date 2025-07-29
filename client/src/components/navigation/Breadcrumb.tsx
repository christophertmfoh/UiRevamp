import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  id: string;
  isClickable?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (view: string) => void;
  className?: string;
}

export function Breadcrumb({ items, onNavigate, className = '' }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('landing')}
        className="h-7 px-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <Home className="w-3 h-3" />
      </Button>

      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
          
          {item.isClickable !== false && index < items.length - 1 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className="h-7 px-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              {item.label}
            </Button>
          ) : (
            <span 
              className={`px-2 py-1 font-medium ${
                index === items.length - 1 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Helper function to generate breadcrumbs based on current view
export function generateBreadcrumbs(currentView: string, additionalContext?: any): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  switch (currentView) {
    case 'projects':
      breadcrumbs.push({ label: 'Projects', id: 'projects', isClickable: false });
      break;
      
    case 'project-dashboard':
      breadcrumbs.push(
        { label: 'Projects', id: 'projects' },
        { label: additionalContext?.projectName || 'Project', id: 'project-dashboard', isClickable: false }
      );
      break;
      
    case 'characters':
      breadcrumbs.push({ label: 'Characters', id: 'characters', isClickable: false });
      break;
      
    case 'character-detail':
      breadcrumbs.push(
        { label: 'Characters', id: 'characters' },
        { label: additionalContext?.characterName || 'Character', id: 'character-detail', isClickable: false }
      );
      break;
      
    case 'world':
      breadcrumbs.push({ label: 'World Bible', id: 'world', isClickable: false });
      break;
      
    case 'templates':
      breadcrumbs.push({ label: 'Templates', id: 'templates', isClickable: false });
      break;
      
    case 'dashboard':
      breadcrumbs.push({ label: 'Dashboard', id: 'dashboard', isClickable: false });
      break;
      
    default:
      // For landing page and unknown views, return empty breadcrumbs
      return [];
  }

  return breadcrumbs;
}