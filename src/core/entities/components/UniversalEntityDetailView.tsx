import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Camera, Share, Download } from 'lucide-react';
import type { UniversalEntityConfig } from '../config/EntityConfig';

interface UniversalEntityDetailViewProps {
  config: UniversalEntityConfig;
  entity: any;
  projectId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UniversalEntityDetailView({ 
  config, 
  entity, 
  projectId, 
  onBack, 
  onEdit, 
  onDelete 
}: UniversalEntityDetailViewProps) {
  
  // Get entity image/portrait
  const getEntityImage = () => {
    if (entity.imageUrl) return entity.imageUrl;
    if (entity.portraits && entity.portraits.length > 0) return entity.portraits[0];
    return null;
  };

  const entityImage = getEntityImage();

  // Render field value based on type
  const renderFieldValue = (field: any, value: any) => {
    if (!value) return <span className="text-muted-foreground">Not specified</span>;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-muted-foreground">None added</span>;
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      );
    }

    if (typeof value === 'string') {
      if (field.type === 'textarea') {
        return (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{value}</p>
          </div>
        );
      }
      return <span>{value}</span>;
    }

    return <span>{String(value)}</span>;
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalFields = config.fields.length;
    const completedFields = config.fields.filter(field => {
      const value = entity[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{entity.name}</h1>
          <p className="text-muted-foreground">{config.name} Details</p>
        </div>
        <div className="flex gap-2">
          {config.features.hasPortraits && (
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Portraits
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Entity Image */}
            {config.features.hasPortraits && (
              <div className={`w-32 h-32 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                {entityImage ? (
                  <img 
                    src={entityImage} 
                    alt={entity.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <config.icon className={`h-16 w-16 text-${config.color}-600 dark:text-${config.color}-400`} />
                )}
              </div>
            )}

            {/* Entity Summary */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main description */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Description</h3>
                  {renderFieldValue(
                    { type: 'textarea' }, 
                    entity.description || entity.characterSummary || entity.oneLine
                  )}
                </div>

                {/* Quick stats */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Completion</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${config.color}-500`}
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{completionPercentage}%</span>
                    </div>
                  </div>

                  {/* Display key fields */}
                  {config.display.displayFields.detail.slice(1, 4).map(fieldKey => {
                    const field = config.fields.find(f => f.key === fieldKey);
                    const value = entity[fieldKey];
                    
                    if (!field || !value) return null;
                    
                    return (
                      <div key={fieldKey}>
                        <h4 className="font-medium text-sm text-muted-foreground">{field.label}</h4>
                        <div className="mt-1">
                          {renderFieldValue(field, value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <Tabs defaultValue={config.sections[0]?.key} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {config.sections.map(section => (
            <TabsTrigger key={section.key} value={section.key} className="text-xs">
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {config.sections.map(section => (
          <TabsContent key={section.key} value={section.key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon && <section.icon className="h-5 w-5" />}
                  {section.label}
                </CardTitle>
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {section.fields.map(fieldKey => {
                  const field = config.fields.find(f => f.key === fieldKey);
                  const value = entity[fieldKey];
                  
                  if (!field) return null;
                  
                  return (
                    <div key={fieldKey}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{field.label}</h4>
                        {field.aiEnhanceable && (
                          <Badge variant="outline" className="text-xs">
                            AI Enhanced
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm">
                        {renderFieldValue(field, value)}
                      </div>
                      {field.priority === 'essential' && !value && (
                        <p className="text-xs text-muted-foreground mt-1">
                          This is an essential field for a complete {config.name.toLowerCase()}.
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit {config.name}
            </Button>
            {config.features.hasPortraits && (
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Manage Portraits
              </Button>
            )}
            {config.features.hasAIGeneration && (
              <Button variant="outline" size="sm">
                <config.icon className="h-4 w-4 mr-2" />
                AI Enhance
              </Button>
            )}
            {config.features.hasRelationships && (
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Relationships
              </Button>
            )}
            {config.features.hasExport && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}