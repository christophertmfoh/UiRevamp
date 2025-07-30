import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Star, Clock, Users, Sparkles } from 'lucide-react';
import type {
  EnhancedUniversalEntityConfig,
  TemplateConfig
} from '../config/EntityConfig';

interface UniversalTemplateCreationProps {
  config: EnhancedUniversalEntityConfig;
  onComplete: (entity: any) => void;
  projectId: string;
}

export function UniversalTemplateCreation({
  config,
  onComplete,
  projectId
}: UniversalTemplateCreationProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const templates = config.templateConfig?.templates || [];

  // Handle template selection and creation
  const handleTemplateSelect = async (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setIsCreating(true);

    try {
      // Apply template data to create entity
      const entityData: any = {
        projectId,
        // Start with template's base data
        ...template.baseData,
        // Generate a unique name if template provides a pattern
        name: generateEntityName(template),
      };

      // Apply template transformations
      if (template.dataTransforms) {
        for (const transform of template.dataTransforms) {
          switch (transform.type) {
            case 'randomize':
              if (transform.field && transform.options) {
                entityData[transform.field] = transform.options[Math.floor(Math.random() * transform.options.length)];
              }
              break;
            case 'increment':
              if (transform.field && transform.pattern) {
                // Simple incrementing logic - would need more sophisticated implementation
                entityData[transform.field] = transform.pattern.replace('{n}', String(Date.now() % 1000));
              }
              break;
            case 'generate':
              if (transform.field && transform.generator) {
                entityData[transform.field] = await executeGenerator(transform.generator, entityData);
              }
              break;
          }
        }
      }

      onComplete(entityData);
    } catch (error) {
      console.error('Failed to create from template:', error);
      setIsCreating(false);
    }
  };

  // Generate entity name from template pattern
  const generateEntityName = (template: TemplateConfig): string => {
    if (template.namePattern) {
      return template.namePattern
        .replace('{type}', config.displayName)
        .replace('{timestamp}', Date.now().toString())
        .replace('{random}', Math.floor(Math.random() * 1000).toString());
    }

    return `${template.name} ${config.displayName}`;
  };

  // Execute data generator function
  const executeGenerator = async (generator: string, context: any): Promise<any> => {
    // This would integrate with the AI generation system
    // For now, return placeholder data
    switch (generator) {
      case 'random_description':
        return `Generated description for ${context.name}`;
      case 'random_tags':
        return ['generated', 'template', 'example'];
      default:
        return null;
    }
  };

  // Get template difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render template preview
  const renderTemplatePreview = (template: TemplateConfig) => {
    return (
      <Card
        key={template.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setSelectedTemplate(template)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {template.icon ? (
                <template.icon className="h-6 w-6 text-primary" />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {template.difficulty && (
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              )}
              {template.isPopular && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  Popular
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Template stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {template.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {template.estimatedTime}
              </div>
            )}
            {template.usageCount && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {template.usageCount} uses
              </div>
            )}
            {template.aiEnhanced && (
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                AI Enhanced
              </div>
            )}
          </div>

          {/* Template tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Template features */}
          {template.features && template.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Includes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {template.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
                {template.features.length > 3 && (
                  <li className="text-xs">+{template.features.length - 3} more features</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // If no templates configured, show empty state
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Templates Available</h3>
          <p className="text-muted-foreground mb-4">
            No templates have been configured for {config.displayName.toLowerCase()} creation.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact your administrator to set up templates for this entity type.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          Choose a {config.displayName} Template
        </h3>
        <p className="text-muted-foreground">
          Start with a pre-configured template and customize as needed
        </p>
      </div>

      {/* Template categories */}
      {config.templateConfig?.categories && config.templateConfig.categories.length > 0 && (
        <div className="space-y-4">
          {config.templateConfig.categories.map(category => {
            const categoryTemplates = templates.filter(t => t.category === category.id);
            if (categoryTemplates.length === 0) return null;

            return (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  {category.icon && <category.icon className="h-5 w-5 text-primary" />}
                  <h4 className="font-medium">{category.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {categoryTemplates.length} templates
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTemplates.map(renderTemplatePreview)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Uncategorized templates */}
      {templates.filter(t => !t.category).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">All Templates</h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter(t => !t.category)
              .map(renderTemplatePreview)
            }
          </div>
        </div>
      )}

      {/* Action buttons */}
      {selectedTemplate && (
        <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border">
          <div className="flex items-center gap-3">
            {selectedTemplate.icon ? (
              <selectedTemplate.icon className="h-6 w-6 text-primary" />
            ) : (
              <FileText className="h-6 w-6 text-primary" />
            )}
            <div>
              <h4 className="font-medium">{selectedTemplate.name}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate.description}
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleTemplateSelect(selectedTemplate)}
            disabled={isCreating}
            className="gap-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Use Template
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default UniversalTemplateCreation;