import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Edit, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool, Heart, FileText, BookText } from 'lucide-react';
import type { Character } from '../../lib/types';
import { CHARACTER_SECTIONS, getFieldsBySection } from '../../lib/config/fieldConfig';

interface CharacterDetailAccordionProps {
  projectId: string;
  character: Character;
  onBack: () => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
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
  Heart,
  FileText,
  BookText,
};

export function CharacterDetailAccordion({ 
  character, 
  onBack, 
  onEdit, 
  onDelete 
}: CharacterDetailAccordionProps) {
  
  // Helper function to render a field if it has content
  const renderField = (label: string, value: string | string[] | undefined, className = "") => {
    // Handle arrays (for legacy data that hasn't been converted yet)
    if (Array.isArray(value)) {
      if (value.length === 0 || !value.some(v => v?.trim())) return null;
      const processedValue = value.filter(v => v?.trim()).join(', ');
      return (
        <div className={className}>
          <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{processedValue}</p>
        </div>
      );
    }
    
    // Handle strings
    if (!value || value.trim().length === 0) return null;
    return (
      <div className={className}>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{value.trim()}</p>
      </div>
    );
  };

  // Helper function to render array fields as badges
  const renderArrayField = (label: string, values: string[] | string | undefined, variant: "default" | "secondary" | "outline" = "outline", showEmptyState: boolean = false) => {
    // Handle both array and comma-separated string
    let processedValues: string[] = [];
    
    if (!values || (Array.isArray(values) && values.length === 0)) {
      // Empty array or null/undefined
      if (showEmptyState) {
        return (
          <div>
            <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">No {label.toLowerCase()} added yet</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1 text-accent hover:text-accent/80 text-xs"
                onClick={() => onEdit(character)}
              >
                + Add {label}
              </Button>
            </div>
          </div>
        );
      }
      return null;
    }
    
    if (typeof values === 'string') {
      processedValues = values.split(',').map((v: string) => v.trim()).filter((v: string) => v);
    } else if (Array.isArray(values)) {
      processedValues = values.filter((v: string) => v?.trim());
    }
    
    if (processedValues.length === 0) {
      if (showEmptyState) {
        return (
          <div>
            <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">No {label.toLowerCase()} added yet</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1 text-accent hover:text-accent/80 text-xs"
                onClick={() => onEdit(character)}
              >
                + Add {label}
              </Button>
            </div>
          </div>
        );
      }
      return null;
    }
    
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
    const fields = getFieldsBySection(sectionId);
    if (!fields.length) return false;
    
    return fields.some(field => {
      const value = (character as any)[field.key];
      if (field.type === 'array') {
        if (typeof value === 'string') {
          return value.trim().length > 0;
        }
        return Array.isArray(value) && value.length > 0 && value.some(v => v?.trim());
      }
      return value && value.toString().trim().length > 0;
    });
  };

  // Helper function to render empty state for text fields
  const renderEmptyField = (label: string) => {
    return (
      <div>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <div className="text-center py-4 text-muted-foreground">
          <div className="text-sm">No {label.toLowerCase()} added yet</div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-1 text-accent hover:text-accent/80 text-xs"
            onClick={() => onEdit(character)}
          >
            + Add {label}
          </Button>
        </div>
      </div>
    );
  };

  // Render a section's content dynamically based on configuration
  const renderSectionContent = (sectionId: string) => {
    const fields = getFieldsBySection(sectionId);
    console.log(`Section ${sectionId} has ${fields.length} fields:`, fields.map(f => f.key));
    if (!fields.length) return null;

    const content = fields.map((field, index) => {
      const value = (character as any)[field.key];
      
      // Debug personalityTraits specifically
      if (field.key === 'personalityTraits') {
        console.log('=== PERSONALITY TRAITS DEBUG ===');
        console.log('field:', field);  
        console.log('value from character:', value);
        console.log('field.type:', field.type);
        console.log('Array.isArray(value):', Array.isArray(value));
        console.log('value === null:', value === null);
        console.log('value === undefined:', value === undefined);
        console.log('=== END DEBUG ===');
      }
      
      if (field.type === 'array') {
        const result = renderArrayField(field.label, value, "outline", true);
        return <div key={index}>{result}</div>;
      } else {
        // For text fields, show content if available, otherwise show empty state
        const fieldContent = renderField(field.label, value);
        if (fieldContent) {
          return <div key={index}>{fieldContent}</div>;
        } else {
          return <div key={index}>{renderEmptyField(field.label)}</div>;
        }
      }
    });

    return (
      <div className="space-y-4">
        {content}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(character)} className="interactive-warm gap-2">
            <Edit className="h-4 w-4" />
            Edit Character
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(character)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Character Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Character Image */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
              {character.imageUrl ? (
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            {/* Character Basic Info */}
            <div className="flex-1">
              <h1 className="font-title text-3xl mb-2">
                {character.name || 'Unnamed Character'}
              </h1>
              
              {character.title && (
                <p className="text-lg text-muted-foreground mb-3 italic">"{character.title}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {character.role && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {character.role}
                  </Badge>
                )}
                {character.race && (
                  <Badge variant="secondary" className="text-sm">
                    {character.race}
                  </Badge>
                )}
                {character.class && (
                  <Badge variant="outline" className="text-sm">
                    {character.class}
                  </Badge>
                )}
                {character.age && (
                  <Badge variant="outline" className="text-sm">
                    Age {character.age}
                  </Badge>
                )}
                {character.occupation && (
                  <Badge variant="outline" className="text-sm">
                    {character.occupation}
                  </Badge>
                )}
              </div>

              {character.oneLine && (
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{character.oneLine}"
                </p>
              )}
              
              {character.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {character.description}
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