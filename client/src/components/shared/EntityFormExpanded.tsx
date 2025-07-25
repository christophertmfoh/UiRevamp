import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Save, Sparkles, User, MapPin, Users, Package, Building, Wand2, Clock, Languages, Palette, Scroll, Lightbulb } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { showSuccessToast, handleFormSubmissionError } from '@/lib/utils/errorHandling';
import { FieldConfigManager, getFieldsBySection } from '@/lib/config/fieldConfig';
// import { FieldAIAssist } from '../character/FieldAIAssist'; // TODO: Add back for entity-specific AI assistance

// Entity type configurations
const ENTITY_ICONS = {
  character: User,
  location: MapPin,
  faction: Users,
  item: Package,
  organization: Building,
  'magic-system': Wand2,
  'timeline-event': Clock,
  language: Languages,
  culture: Palette,
  prophecy: Scroll,
  theme: Lightbulb
};

const ENTITY_SECTIONS = {
  character: [
    { id: 'identity', title: 'Identity', description: 'Core identification and basic information', icon: 'User', order: 1 },
    { id: 'physical', title: 'Physical', description: 'Appearance and physical characteristics', icon: 'Eye', order: 2 },
    { id: 'personality', title: 'Personality', description: 'Character traits and behavior patterns', icon: 'Heart', order: 3 },
    { id: 'background', title: 'Background', description: 'History, origins, and experiences', icon: 'BookOpen', order: 4 },
    { id: 'skills', title: 'Skills', description: 'Abilities, talents, and competencies', icon: 'Zap', order: 5 },
    { id: 'story', title: 'Story', description: 'Narrative elements and goals', icon: 'BookText', order: 6 },
    { id: 'relationships', title: 'Relationships', description: 'Connections to other characters', icon: 'Users', order: 7 },
    { id: 'meta', title: 'Meta', description: 'Story function and development notes', icon: 'FileText', order: 8 }
  ],
  location: [
    { id: 'identity', title: 'Identity', description: 'Basic location information', icon: 'MapPin', order: 1 },
    { id: 'physical', title: 'Physical', description: 'Geography and physical features', icon: 'Mountain', order: 2 },
    { id: 'atmosphere', title: 'Atmosphere', description: 'Mood, climate, and ambiance', icon: 'Cloud', order: 3 },
    { id: 'inhabitants', title: 'Inhabitants', description: 'Who or what lives here', icon: 'Users', order: 4 },
    { id: 'history', title: 'History', description: 'Past events and significance', icon: 'BookOpen', order: 5 },
    { id: 'story', title: 'Story', description: 'Narrative importance and plot relevance', icon: 'BookText', order: 6 }
  ],
  faction: [
    { id: 'identity', title: 'Identity', description: 'Basic faction information', icon: 'Users', order: 1 },
    { id: 'structure', title: 'Structure', description: 'Organization and hierarchy', icon: 'Building', order: 2 },
    { id: 'beliefs', title: 'Beliefs', description: 'Ideology and core values', icon: 'Heart', order: 3 },
    { id: 'members', title: 'Members', description: 'Key figures and membership', icon: 'User', order: 4 },
    { id: 'resources', title: 'Resources', description: 'Assets, territory, and capabilities', icon: 'Package', order: 5 },
    { id: 'story', title: 'Story', description: 'Role in narrative and conflicts', icon: 'BookText', order: 6 }
  ],
  item: [
    { id: 'identity', title: 'Identity', description: 'Basic item information', icon: 'Package', order: 1 },
    { id: 'physical', title: 'Physical', description: 'Appearance and material properties', icon: 'Eye', order: 2 },
    { id: 'properties', title: 'Properties', description: 'Function, abilities, and effects', icon: 'Zap', order: 3 },
    { id: 'history', title: 'History', description: 'Origin, creation, and past owners', icon: 'BookOpen', order: 4 },
    { id: 'story', title: 'Story', description: 'Narrative significance and plot role', icon: 'BookText', order: 5 }
  ]
};

interface EntityFormExpandedProps {
  entityType: string;
  projectId: string;
  onCancel: () => void;
  entity?: any;
}

export function EntityFormExpanded({ entityType, projectId, onCancel, entity }: EntityFormExpandedProps) {
  // Get entity sections for this type
  const sections = ENTITY_SECTIONS[entityType as keyof typeof ENTITY_SECTIONS] || ENTITY_SECTIONS.character;
  const EntityIcon = ENTITY_ICONS[entityType as keyof typeof ENTITY_ICONS] || User;

  // Get display name for entity type
  const getEntityDisplayName = (type: string) => {
    const names = {
      character: 'Character',
      location: 'Location',
      faction: 'Faction',
      item: 'Item',
      organization: 'Organization',
      'magic-system': 'Magic System',
      'timeline-event': 'Timeline Event',
      language: 'Language',
      culture: 'Culture',
      prophecy: 'Prophecy',
      theme: 'Theme'
    };
    return names[type as keyof typeof names] || 'Entity';
  };

  // Initialize form data with all fields for this entity type
  const initializeFormData = () => {
    const initialData: any = {};
    
    sections.forEach(section => {
      const fields = getFieldsBySection(section.id);
      fields.forEach((field: any) => {
        const value = (entity as any)?.[field.key];
        if (field.type === 'array') {
          initialData[field.key] = Array.isArray(value) ? value.join(', ') : '';
        } else {
          initialData[field.key] = value || '';
        }
      });
    });
    
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/projects/${projectId}/${entityType}s`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, `${entityType}s`] });
      showSuccessToast(`${getEntityDisplayName(entityType)} created successfully`);
      onCancel();
    },
    onError: (error) => {
      const fieldErrors = handleFormSubmissionError(error, entityType);
      console.error('Form submission errors:', fieldErrors);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', `/api/${entityType}s/${entity?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, `${entityType}s`] });
      showSuccessToast(`${getEntityDisplayName(entityType)} updated successfully`);
      onCancel();
    },
    onError: (error) => {
      const fieldErrors = handleFormSubmissionError(error, entityType);
      console.error('Form submission errors:', fieldErrors);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      projectId,
      ...formData,
      isModelTrained: false,
      imageUrl: '',
    };

    // Process array fields
    sections.forEach(section => {
      const fields = getFieldsBySection(section.id);
      fields.forEach((field: any) => {
        if (field.type === 'array') {
          const value = formData[field.key];
          processedData[field.key] = typeof value === 'string' 
            ? value.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];
        }
      });
    });

    if (entity) {
      updateMutation.mutate(processedData);
    } else {
      const newEntityData = {
        ...processedData,
        id: Date.now().toString(),
      };
      createMutation.mutate(newEntityData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderField = (field: any) => {
    const value = formData[field.key] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className={field.rows && field.rows > 3 ? 'col-span-2' : ''}>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={field.key}>{field.label}</Label>
            </div>
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className="min-h-[80px]"
            />
            {field.description && (
              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.key}>
            <Label htmlFor={field.key} className="mb-2 block">{field.label}</Label>
            <Select value={value} onValueChange={(newValue) => updateField(field.key, newValue)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        );

      case 'array':
        return (
          <div key={field.key} className="col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={field.key}>{field.label}</Label>
            </div>
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={`${field.placeholder} (separate with commas)`}
              rows={2}
            />
            {field.description && (
              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={field.key}>{field.label}</Label>
            </div>
            <Input
              id={field.key}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.description && (
              <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
            )}
          </div>
        );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
                <EntityIcon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {entity ? `Edit ${getEntityDisplayName(entityType)}` : `Create New ${getEntityDisplayName(entityType)}`}
                </h1>
                <p className="text-muted-foreground">
                  {entity ? 'Update the details below' : 'Fill in the details to bring your new entity to life'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue={sections[0].id} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 mb-8">
                {sections.slice(0, 6).map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="text-xs lg:text-sm"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>{section.title}</span>
                        <Badge variant="outline" className="ml-auto">
                          {getFieldsBySection(section.id).length} fields
                        </Badge>
                      </CardTitle>
                      {section.description && (
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {getFieldsBySection(section.id).map(renderField)}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name}
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {entity ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {entity ? `Update ${getEntityDisplayName(entityType)}` : `Create ${getEntityDisplayName(entityType)}`}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}