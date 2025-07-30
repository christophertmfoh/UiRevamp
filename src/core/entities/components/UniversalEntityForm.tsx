import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Save, X, Plus, Minus, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import type { 
  EnhancedUniversalEntityConfig, 
  FormSectionConfig 
} from '../config/EntityConfig';

interface UniversalEntityFormProps {
  config: EnhancedUniversalEntityConfig;
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
  
  // Section collapse state management
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const initialCollapsed = new Set<string>();
    config.formConfig.sections.forEach(section => {
      if (section.defaultCollapsed) {
        initialCollapsed.add(section.id);
      }
    });
    return initialCollapsed;
  });
  
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };
  
  // Create dynamic form schema based on config with enhanced validation
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
          if (field.validation?.min) {
            fieldSchema = fieldSchema.min(field.validation.min, `${field.label} must be at least ${field.validation.min} characters`);
          }
          if (field.validation?.pattern) {
            fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern), field.validation.message || 'Invalid format');
          }
          break;
          
        case 'textarea':
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
          
        case 'array':
          fieldSchema = z.array(z.string()).optional();
          if (field.validation?.minItems) {
            fieldSchema = fieldSchema.min(field.validation.minItems, `${field.label} must have at least ${field.validation.minItems} items`);
          }
          if (field.validation?.maxItems) {
            fieldSchema = fieldSchema.max(field.validation.maxItems, `${field.label} cannot have more than ${field.validation.maxItems} items`);
          }
          break;
          
        case 'number':
          fieldSchema = z.coerce.number();
          if (field.required) {
            fieldSchema = fieldSchema.min(0, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min, `${field.label} must be at least ${field.validation.min}`);
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.validation.max, `${field.label} cannot exceed ${field.validation.max}`);
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
          if (field.options) {
            fieldSchema = fieldSchema.refine(
              (val) => !val || field.options!.includes(val),
              { message: `${field.label} must be one of: ${field.options.join(', ')}` }
            );
          }
          break;
          
        case 'date':
          fieldSchema = z.string().optional();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
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
          case 'date':
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

  // Array field management with enhanced functionality
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
    const field = config.fields.find(f => f.key === fieldKey);
    const maxItems = field?.validation?.maxItems;
    
    if (maxItems && arrayFields[fieldKey]?.length >= maxItems) {
      return; // Don't add if at max
    }
    
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

  // Form submission with enhanced data processing
  const onSubmit = (data: any) => {
    // Merge array fields with form data
    const finalData = {
      ...data,
      ...arrayFields,
      projectId
    };
    
    // Process data based on field configurations
    config.fields.forEach(field => {
      if (field.type === 'array' && finalData[field.key]) {
        finalData[field.key] = finalData[field.key].filter((item: string) => item.trim() !== '');
      }
      
      // Handle number fields
      if (field.type === 'number' && finalData[field.key] !== undefined) {
        finalData[field.key] = Number(finalData[field.key]);
      }
      
      // Handle empty strings for optional fields
      if (!field.required && finalData[field.key] === '') {
        finalData[field.key] = null;
      }
    });
    
    onSave(finalData);
  };

  // Enhanced form field rendering with improved types and validation
  const renderFormField = (field: any) => {
    const fieldError = form.formState.errors[field.key];
    
    // Common field wrapper
    const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="space-y-2">
        {children}
        {field.helpText && (
          <FormDescription className="text-xs text-muted-foreground">
            {field.helpText}
          </FormDescription>
        )}
      </div>
    );
    
    switch (field.type) {
      case 'textarea':
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                  {field.aiEnhanceable && (
                    <Badge variant="outline" className="text-xs">
                      AI Enhanced
                    </Badge>
                  )}
                </FormLabel>
                <FieldWrapper>
                  <FormControl>
                    <Textarea
                      placeholder={field.placeholder}
                      className="min-h-[100px] resize-none"
                      maxLength={field.maxLength}
                      {...formField}
                    />
                  </FormControl>
                  {field.maxLength && (
                    <div className="text-xs text-muted-foreground text-right">
                      {formField.value?.length || 0}/{field.maxLength}
                    </div>
                  )}
                </FieldWrapper>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <FieldWrapper>
                  <Select onValueChange={formField.onChange} value={formField.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.options?.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'boolean':
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-2">
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                  </FormLabel>
                  {field.helpText && (
                    <FormDescription className="text-xs">
                      {field.helpText}
                    </FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <FieldWrapper>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={field.placeholder}
                      min={field.validation?.min}
                      max={field.validation?.max}
                      {...formField}
                    />
                  </FormControl>
                </FieldWrapper>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'date':
        return (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </FormLabel>
                <FieldWrapper>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  </FormControl>
                </FieldWrapper>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'array':
        const items = arrayFields[field.key] || [];
        const maxItems = field.validation?.maxItems;
        const minItems = field.validation?.minItems;
        
        return (
          <div key={field.key} className="space-y-3">
            <FormLabel className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
              {field.aiEnhanceable && (
                <Badge variant="outline" className="text-xs">
                  AI Enhanced
                </Badge>
              )}
            </FormLabel>
            
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateArrayItem(field.key, index, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase().slice(0, -1)}`}
                    className="flex-1"
                    maxLength={field.maxLength}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(field.key, index)}
                    disabled={minItems && items.length <= minItems}
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
                disabled={maxItems && items.length >= maxItems}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {field.label.toLowerCase().slice(0, -1) || 'item'}
                {maxItems && ` (${items.length}/${maxItems})`}
              </Button>
              
              {field.helpText && (
                <FormDescription className="text-xs text-muted-foreground">
                  {field.helpText}
                </FormDescription>
              )}
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
                <FormLabel className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                  {field.aiEnhanceable && (
                    <Badge variant="outline" className="text-xs">
                      AI Enhanced
                    </Badge>
                  )}
                </FormLabel>
                <FieldWrapper>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      {...formField}
                    />
                  </FormControl>
                  {field.maxLength && (
                    <div className="text-xs text-muted-foreground text-right">
                      {formField.value?.length || 0}/{field.maxLength}
                    </div>
                  )}
                </FieldWrapper>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  // Calculate form completion percentage
  const calculateFormCompletion = () => {
    const values = form.getValues();
    const essentialFields = config.fields.filter(f => f.priority === 'essential');
    const importantFields = config.fields.filter(f => f.priority === 'important');
    
    const essentialCompleted = essentialFields.filter(field => {
      const value = values[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
    
    const importantCompleted = importantFields.filter(field => {
      const value = values[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
    
    const essentialWeight = 0.7;
    const importantWeight = 0.3;
    
    const essentialScore = essentialFields.length > 0 ? 
      (essentialCompleted / essentialFields.length) * essentialWeight : 0;
    const importantScore = importantFields.length > 0 ? 
      (importantCompleted / importantFields.length) * importantWeight : 0;
    
    return Math.round((essentialScore + importantScore) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {entity ? 'Edit' : 'Create'} {config.displayName}
          </h1>
          <p className="text-muted-foreground">
            {entity ? `Editing ${entity.name || 'entity'}` : `Create a new ${config.displayName.toLowerCase()}`}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {calculateFormCompletion()}% complete
        </div>
      </div>

      {/* Form */}
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="p-0">
              {/* Render configurable sections */}
              {config.formConfig.sections.map((section, sectionIndex) => {
                const isCollapsed = collapsedSections.has(section.id);
                const sectionFields = section.fields || [];
                const hasErrors = sectionFields.some(fieldKey => form.formState.errors[fieldKey]);
                
                return (
                  <div key={section.id}>
                    {sectionIndex > 0 && <Separator />}
                    
                    <Collapsible 
                      open={!isCollapsed} 
                      onOpenChange={() => section.collapsible && toggleSection(section.id)}
                    >
                      <div className="p-6">
                        <CollapsibleTrigger 
                          asChild={section.collapsible}
                          disabled={!section.collapsible}
                          className={section.collapsible ? 'cursor-pointer' : 'cursor-default'}
                        >
                          <div className={`flex items-center justify-between ${
                            section.collapsible ? 'hover:bg-accent/50 -m-2 p-2 rounded-md transition-colors' : ''
                          }`}>
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                {section.icon && <section.icon className="h-5 w-5" />}
                                {section.title}
                                {section.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                                {hasErrors && (
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                )}
                              </h3>
                              {section.description && (
                                <p className="text-sm text-muted-foreground">
                                  {section.description}
                                </p>
                              )}
                            </div>
                            {section.collapsible && (
                              <div className="flex items-center gap-2">
                                {hasErrors && (
                                  <Badge variant="destructive" className="text-xs">
                                    Has errors
                                  </Badge>
                                )}
                                {isCollapsed ? (
                                  <ChevronRight className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            )}
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="space-y-6 mt-6">
                          <div className={`grid gap-6 ${
                            section.layout === 'single' ? 'grid-cols-1' :
                            section.layout === 'double' ? 'md:grid-cols-2' :
                            'md:grid-cols-2 lg:grid-cols-3'
                          }`}>
                            {sectionFields.map(fieldKey => {
                              const field = config.fields.find(f => f.key === fieldKey);
                              if (!field) return null;
                              
                              return renderFormField(field);
                            })}
                          </div>
                          
                          {section.customComponent && (
                            <div className="mt-6">
                              {section.customComponent({ 
                                form, 
                                entity, 
                                config, 
                                projectId 
                              })}
                            </div>
                          )}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </div>
                );
              })}
            </CardContent>

            {/* Form Actions */}
            <div className="flex items-center justify-between p-6 bg-muted/50 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {calculateFormCompletion()}% complete
                </div>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : entity ? 'Update' : 'Create'} {config.displayName}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}