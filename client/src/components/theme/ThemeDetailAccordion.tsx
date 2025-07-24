import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Edit, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool } from 'lucide-react';
import type { Theme } from '../../lib/types';
import { CHARACTER_SECTIONS } from '../../lib/config';

interface ThemeDetailAccordionProps {
  projectId: string;
  theme: Theme;
  onBack: () => void;
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

// Icon mapping for dynamic icon rendering
const ICON_MAP = {
  User,
  Eye,
  Brain,
  Zap,
  BookOpen,
  Users,
  PenTool,
};

export function ThemeDetailAccordion({ 
  theme, 
  onBack, 
  onEdit, 
  onDelete 
}: ThemeDetailAccordionProps) {
  
  // Helper function to render a field if it has content
  const renderField = (label: string, value: string | undefined, className = "") => {
    if (!value || value.trim().length === 0) return null;
    return (
      <div className={className}>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{value.trim()}</p>
      </div>
    );
  };

  // Helper function to render array fields as badges
  const renderArrayField = (label: string, values: string[] | undefined, variant: "default" | "secondary" | "outline" = "outline") => {
    if (!values?.length || !values.some(v => v?.trim())) return null;
    
    // Handle both array and comma-separated string
    let processedValues: string[] = [];
    if (typeof values === 'string') {
      processedValues = values.split(',').map(v => v.trim()).filter(v => v);
    } else if (Array.isArray(values)) {
      processedValues = values.filter(v => v?.trim());
    }
    
    if (processedValues.length === 0) return null;
    
    return (
      <div>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <div className="flex flex-wrap gap-2">
          {processedValues.map((value, index) => (
            <Badge key={index} variant={variant} className="text-sm">
              {value.trim()}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to check if a section has any content
  const sectionHasContent = (sectionId: string) => {
    const section = CHARACTER_SECTIONS.find(s => s.id === sectionId);
    if (!section) return false;
    
    return section.fields.some(field => {
      const value = (theme as any)[field.key];
      if (field.type === 'array') {
        return Array.isArray(value) && value.length > 0 && value.some(v => v?.trim());
      }
      return value && value.toString().trim().length > 0;
    });
  };

  // Render a section's content dynamically based on configuration
  const renderSectionContent = (sectionId: string) => {
    const section = CHARACTER_SECTIONS.find(s => s.id === sectionId);
    if (!section) return null;

    const content = section.fields.map((field, index) => {
      const value = (theme as any)[field.key];
      
      if (field.type === 'array') {
        return renderArrayField(field.label, value);
      } else {
        return renderField(field.label, value);
      }
    }).filter(Boolean);

    if (content.length === 0) return null;

    return (
      <div className="space-y-4">
        {content.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Themes
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(theme)} className="interactive-warm gap-2">
            <Edit className="h-4 w-4" />
            Edit Theme
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(theme)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Theme Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Theme Image */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
              {theme.imageUrl ? (
                <img 
                  src={theme.imageUrl} 
                  alt={theme.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            {/* Theme Basic Info */}
            <div className="flex-1">
              <h1 className="font-title text-3xl mb-2">
                {theme.name || 'Unnamed Theme'}
              </h1>
              
              {theme.title && (
                <p className="text-lg text-muted-foreground mb-3 italic">"{theme.title}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {theme.role && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {theme.role}
                  </Badge>
                )}
                {theme.race && (
                  <Badge variant="secondary" className="text-sm">
                    {theme.race}
                  </Badge>
                )}
                {theme.class && (
                  <Badge variant="outline" className="text-sm">
                    {theme.class}
                  </Badge>
                )}
                {theme.age && (
                  <Badge variant="outline" className="text-sm">
                    Age {theme.age}
                  </Badge>
                )}
                {theme.occupation && (
                  <Badge variant="outline" className="text-sm">
                    {theme.occupation}
                  </Badge>
                )}
              </div>

              {theme.oneLine && (
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{theme.oneLine}"
                </p>
              )}
              
              {theme.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {theme.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Accordion Sections */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <Accordion type="multiple" className="w-full">
            {CHARACTER_SECTIONS.map(section => {
              if (!sectionHasContent(section.id)) return null;
              
              const IconComponent = ICON_MAP[section.icon as keyof typeof ICON_MAP];
              
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      <div className="text-left">
                        <div className="font-semibold">{section.title}</div>
                        <div className="text-sm text-muted-foreground">{section.description}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    {renderSectionContent(section.id)}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}