import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, X, Plus, Minus } from 'lucide-react';
import type { UniversalEntityConfig } from '../config/EntityConfig';

interface UniversalEntityFormProps {
  config: UniversalEntityConfig;
  projectId: string;
  entity?: any;
  onSave: (entityData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UniversalEntityForm({ 
  config, 
  projectId, 
  entity, 
  onSave, 
  onCancel, 
  isLoading = false 
}: UniversalEntityFormProps) {
  
  // Create dynamic form schema based on config
  const createFormSchema = () => {
    const schemaFields: Record<string, any> = {};
    
    config.fields.forEach(field => {
      let fieldSchema;
      
      switch (field.type) {
        case 'text':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          if (field.maxLength) {
            fieldSchema = fieldSchema.max(field.maxLength, `${field.label} must be less than ${field.maxLength} characters`);
          }
          break;
          
        case 'textarea':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          break;
          
        case 'array':
          fieldSchema = z.array(z.string()).optional();
          break;
          
        case 'number':
          fieldSchema = z.number();
          if (field.required) {
            fieldSchema = fieldSchema.min(0, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          break;
          
        case 'boolean':
          fieldSchema = z.boolean().optional();
          break;
          
        case 'select':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          break;
          
        default:
          fieldSchema = z.string().optional();
      }
      
      schemaFields[field.key] = fieldSchema;
    });
    
    return z.object(schemaFields);
  };

  const formSchema = createFormSchema();
  
  // Initialize form with default values
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};
    
    config.fields.forEach(field => {
      if (entity && entity[field.key] !== undefined) {
        defaults[field.key] = entity[field.key];
      } else {
        switch (field.type) {
          case 'text':
          case 'textarea':
          case 'select':
            defaults[field.key] = '';
            break;
          case 'array':
            defaults[field.key] = [];
            break;
          case 'number':
            defaults[field.key] = 0;
            break;
          case 'boolean':
            defaults[field.key] = false;
            break;
          default:
            defaults[field.key] = '';
        }
      }
    });
    
    return defaults;
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues()
  });

  // Array field management
  const [arrayFields, setArrayFields] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    config.fields.forEach(field => {
      if (field.type === 'array') {
        initial[field.key] = entity?.[field.key] || [];
      }
    });
    return initial;
  });

  const addArrayItem = (fieldKey: string) => {
    setArrayFields(prev => ({
      ...prev,
      [fieldKey]: [...(prev[fieldKey] || []), '']
    }));
  };

  const removeArrayItem = (fieldKey: string, index: number) => {
    setArrayFields(prev => ({
      ...prev,
      [fieldKey]: prev[fieldKey].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (fieldKey: string, index: number, value: string) => {
    setArrayFields(prev => ({
      ...prev,
      [fieldKey]: prev[fieldKey].map((item, i) => i === index ? value : item)
    }));
  };

  // Form submission
  const onSubmit = (data: any) => {
    // Merge array fields with form data
    const finalData = {
      ...data,
      ...arrayFields,
      projectId
    };
    
    // Filter out empty array items
    config.fields.forEach(field => {
      if (field.type === 'array' && finalData[field.key]) {
        finalData[field.key] = finalData[field.key].filter((item: string) => item.trim() !== '');
      }
    });
    
    onSave(finalData);
  };

  // Render form field based on type
  const renderFormField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    className="min-h-[100px]"
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'array':
        const items = arrayFields[field.key] || [];
        return (
          <div key={field.key} className="space-y-2">
            <FormLabel>{field.label}</FormLabel>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateArrayItem(field.key, index, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(field.key, index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(field.key)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {field.label.slice(0, -1)}
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {entity ? 'Edit' : 'Create'} {config.name}
          </h1>
          <p className="text-muted-foreground">
            {entity ? `Editing ${entity.name}` : `Create a new ${config.name.toLowerCase()}`}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="p-6">
              {/* Render sections */}
              {config.sections.map((section, sectionIndex) => (
                <div key={section.key}>
                  {sectionIndex > 0 && <Separator className="my-8" />}
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">{section.label}</h3>
                      {section.description && (
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map(fieldKey => {
                        const field = config.fields.find(f => f.key === fieldKey);
                        if (!field) return null;
                        
                        return renderFormField(field);
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Form Actions */}
            <div className="flex items-center justify-between p-6 bg-muted/50 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : entity ? 'Update' : 'Create'} {config.name}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}