/**
 * Form Section Component
 * Renders organized sections of character fields with consistent layout
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';
import { getFieldsBySection, getSectionById } from '@/lib/config/fieldConfig';
import { QuickProgress } from './CharacterProgress';

interface FormSectionProps {
  sectionId: string;
  character: any;
  onChange: (fieldKey: string, value: any) => void;
  onEnhanceField?: (fieldKey: string, fieldLabel: string) => void;
  fieldEnhancements?: Record<string, boolean>;
  validationErrors?: Record<string, string>;
  disabled?: boolean;
  showPriority?: boolean;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FormSection({
  sectionId,
  character,
  onChange,
  onEnhanceField,
  fieldEnhancements = {},
  validationErrors = {},
  disabled = false,
  showPriority = false,
  isCollapsible = true,
  defaultExpanded = true
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const section = getSectionById(sectionId);
  const fields = getFieldsBySection(sectionId);
  
  if (!section || fields.length === 0) {
    return null;
  }

  // Calculate completion for this section
  const filledFields = fields.filter(field => {
    const value = character[field.key];
    return value && value !== '' && (!Array.isArray(value) || value.length > 0);
  }).length;
  
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  const handleBulkEnhance = () => {
    if (!onEnhanceField) return;
    
    // Enhance all empty fields in this section
    fields.forEach(field => {
      const value = character[field.key];
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        onEnhanceField(field.key, field.label);
      }
    });
  };

  const emptyFieldsCount = fields.filter(field => {
    const value = character[field.key];
    return !value || value === '' || (Array.isArray(value) && value.length === 0);
  }).length;

  const sectionContent = (
    <div className="space-y-4">
      {fields.map(field => (
        <FieldRenderer
          key={field.key}
          fieldKey={field.key}
          value={character[field.key]}
          onChange={(value) => onChange(field.key, value)}
          onEnhance={onEnhanceField}
          isEnhancing={fieldEnhancements[field.key]}
          error={validationErrors[field.key]}
          disabled={disabled}
          showPriority={showPriority}
        />
      ))}
    </div>
  );

  if (!isCollapsible) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <QuickProgress percentage={completionPercentage} />
              {onEnhanceField && emptyFieldsCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkEnhance}
                  disabled={disabled}
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Fill {emptyFieldsCount} Empty
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sectionContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-left">{section.title}</h3>
                  <p className="text-sm text-muted-foreground text-left">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  {filledFields}/{fields.length}
                </Badge>
                <QuickProgress percentage={completionPercentage} />
                {onEnhanceField && emptyFieldsCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBulkEnhance();
                    }}
                    disabled={disabled}
                    className="gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Fill {emptyFieldsCount}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {sectionContent}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}