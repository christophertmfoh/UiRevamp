import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Edit, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool } from 'lucide-react';
import type { MagicSystem } from '../../lib/types';
import { CHARACTER_SECTIONS } from '../../lib/config';

interface MagicSystemDetailAccordionProps {
  projectId: string;
  magicsystem: MagicSystem;
  onBack: () => void;
  onEdit: (magicsystem: MagicSystem) => void;
  onDelete: (magicsystem: MagicSystem) => void;
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

export function MagicSystemDetailAccordion({ 
  magicsystem, 
  onBack, 
  onEdit, 
  onDelete 
}: MagicSystemDetailAccordionProps) {
  
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
      const value = (magicsystem as any)[field.key];
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
      const value = (magicsystem as any)[field.key];
      
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
          Back to MagicSystems
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(magicsystem)} className="interactive-warm gap-2">
            <Edit className="h-4 w-4" />
            Edit MagicSystem
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(magicsystem)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* MagicSystem Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* MagicSystem Image */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
              {magicsystem.imageUrl ? (
                <img 
                  src={magicsystem.imageUrl} 
                  alt={magicsystem.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            {/* MagicSystem Basic Info */}
            <div className="flex-1">
              <h1 className="font-title text-3xl mb-2">
                {magicsystem.name || 'Unnamed MagicSystem'}
              </h1>
              
              {magicsystem.title && (
                <p className="text-lg text-muted-foreground mb-3 italic">"{magicsystem.title}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {magicsystem.role && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {magicsystem.role}
                  </Badge>
                )}
                {magicsystem.race && (
                  <Badge variant="secondary" className="text-sm">
                    {magicsystem.race}
                  </Badge>
                )}
                {magicsystem.class && (
                  <Badge variant="outline" className="text-sm">
                    {magicsystem.class}
                  </Badge>
                )}
                {magicsystem.age && (
                  <Badge variant="outline" className="text-sm">
                    Age {magicsystem.age}
                  </Badge>
                )}
                {magicsystem.occupation && (
                  <Badge variant="outline" className="text-sm">
                    {magicsystem.occupation}
                  </Badge>
                )}
              </div>

              {magicsystem.oneLine && (
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{magicsystem.oneLine}"
                </p>
              )}
              
              {magicsystem.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {magicsystem.description}
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