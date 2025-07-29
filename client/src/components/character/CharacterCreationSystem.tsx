/**
 * FableCraft Character Creation System
 * A professional-grade character creation experience that rivals industry leaders
 * 
 * Design Philosophy:
 * - Writers think in stories, not forms
 * - Progressive disclosure with smart defaults
 * - Visual feedback and immediate preview
 * - Seamless transitions between creation methods
 * - Enterprise-grade UX with consumer-friendly design
 */

import React from 'react';
import { cn } from '@/lib/utils';

// Shared design tokens for consistency across all creation methods
export const CreationTheme = {
  guided: {
    primary: 'blue',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    border: 'border-blue-500/20',
    icon: 'bg-blue-500/10 text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600 text-white',
    muted: 'text-blue-600/70'
  },
  templates: {
    primary: 'emerald',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/10 text-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    muted: 'text-emerald-600/70'
  },
  ai: {
    primary: 'purple',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    border: 'border-purple-500/20',
    icon: 'bg-purple-500/10 text-purple-500',
    button: 'bg-purple-500 hover:bg-purple-600 text-white',
    muted: 'text-purple-600/70'
  },
  upload: {
    primary: 'orange',
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    border: 'border-orange-500/20',
    icon: 'bg-orange-500/10 text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600 text-white',
    muted: 'text-orange-600/70'
  }
};

// Professional input component with proper labeling and help text
export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'tags' | 'relationship' | 'image';
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  suggestions?: string[];
}

// Section-based organization for better UX
export interface CreationSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FieldConfig[];
  preview?: (data: any) => React.ReactNode;
}

// Shared components for consistent UI
export const CreationCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(
    "bg-card rounded-lg border shadow-sm",
    "hover:shadow-md transition-shadow duration-200",
    className
  )}>
    {children}
  </div>
);

export const CreationField: React.FC<{
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  theme: typeof CreationTheme[keyof typeof CreationTheme];
}> = ({ field, value, onChange, theme }) => {
  // This will be implemented with proper field rendering
  return null;
};

// Progress indicator that shows meaningful progress
export const CreationProgress: React.FC<{
  sections: CreationSection[];
  currentSection: number;
  completedSections: Set<number>;
  onSectionClick: (index: number) => void;
  theme: typeof CreationTheme[keyof typeof CreationTheme];
}> = ({ sections, currentSection, completedSections, onSectionClick, theme }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isCompleted = completedSections.has(index);
        const isCurrent = index === currentSection;
        const isAccessible = index <= currentSection || isCompleted;
        
        return (
          <button
            key={section.id}
            onClick={() => isAccessible && onSectionClick(index)}
            disabled={!isAccessible}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
              "hover:bg-background/50",
              isCurrent && `${theme.icon} bg-opacity-100`,
              isCompleted && "bg-emerald-500/10 text-emerald-600",
              !isAccessible && "opacity-50 cursor-not-allowed",
              isAccessible && !isCurrent && !isCompleted && "hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium hidden lg:block">
              {section.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Live preview component for immediate feedback
export const CharacterPreview: React.FC<{
  data: any;
  theme: typeof CreationTheme[keyof typeof CreationTheme];
}> = ({ data, theme }) => {
  return (
    <div className={cn(
      "sticky top-0 h-full",
      "bg-gradient-to-b",
      theme.gradient
    )}>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        {/* Preview implementation */}
      </div>
    </div>
  );
};

// Export all components for use in individual creation methods
export default {
  CreationTheme,
  CreationCard,
  CreationField,
  CreationProgress,
  CharacterPreview
};