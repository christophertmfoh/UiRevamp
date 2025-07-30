import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
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

// Memoized field renderer for performance
const MemoizedFieldRenderer = memo(({ field, value, onChange, error, disabled }: any) => {
  // Memoized change handler to prevent unnecessary re-renders
  const handleChange = useCallback((newValue: any) => {
    onChange(field.key, newValue);
  }, [field.key, onChange]);
  
  return (
    <FieldRenderer
      field={field}
      value={value}
      onChange={handleChange}
      error={error}
      disabled={disabled}
    />
  );
});

// Memoized section component for performance
const MemoizedFormSection = memo(({ 
  section, 
  fields, 
  formData, 
  errors, 
  handleFieldChange, 
  disabled,
  config 
}: any) => {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded ?? true);
  
  // Memoize section fields to prevent recalculation
  const sectionFields = useMemo(() => 
    fields.filter((field: any) => section.fields.includes(field.key)),
    [fields, section.fields]
  );
  
  // Memoize error count for section
  const errorCount = useMemo(() => 
    sectionFields.reduce((count: number, field: any) => 
      count + (errors[field.key] ? 1 : 0), 0
    ),
    [sectionFields, errors]
  );
  
  // Memoize completion percentage
  const completionPercentage = useMemo(() => {
    const totalFields = sectionFields.length;
    const completedFields = sectionFields.filter((field: any) => {
      const value = formData[field.key];
      return value !== undefined && value !== null && 
             (typeof value !== 'string' || value.trim() !== '') &&
             (!Array.isArray(value) || value.length > 0);
    }).length;
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [sectionFields, formData]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className={section.collapsible ? "cursor-pointer hover:bg-accent/50" : ""}
        onClick={section.collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {section.title}
              {errorCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {errorCount} error{errorCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardTitle>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Completion indicator */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">{completionPercentage}%</div>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            
            {section.collapsible && (
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className={`grid gap-6 ${
            config.form.layout === 'two-column' && sectionFields.length > 3 
              ? 'md:grid-cols-2' 
              : 'grid-cols-1'
          }`}>
            {sectionFields.map((field: any) => (
              <MemoizedFieldRenderer
                key={field.key}
                field={field}
                value={formData[field.key]}
                onChange={handleFieldChange}
                error={errors[field.key]}
                disabled={disabled}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
});

export const UniversalEntityForm = memo(function UniversalEntityForm({
  config,
  entity,
  projectId,
  onSave,
  onCancel,
  isLoading
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

  // Performance: Memoize form sections
  const formSections = useMemo(() => 
    config.formConfig.sections || [],
    [config.formConfig.sections]
  );
  
  // Performance: Memoize field change handler
  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    form.setValue(fieldKey, value);
    
    // Clear error when field is changed
    if (form.formState.errors[fieldKey]) {
      form.clearErrors(fieldKey);
    }
  }, [form]);
  
  // Performance: Memoize validation
  const isFormValid = useMemo(() => {
    const requiredFields = config.fields.filter(f => f.required).map(f => f.key);
    return requiredFields.every(fieldKey => {
      const value = form.getValues()[fieldKey];
      return value !== undefined && value !== null && 
             (typeof value !== 'string' || value.trim() !== '') &&
             (!Array.isArray(value) || value.length > 0);
    }) && Object.keys(form.formState.errors).length === 0;
  }, [form, config.fields]);
  
  // Performance: Memoize form completion percentage
  const overallCompletion = useMemo(() => {
    const allFields = config.fields;
    const totalFields = allFields.length;
    const completedFields = allFields.filter(field => {
      const value = form.getValues()[field.key];
      return value !== undefined && value !== null && 
             (typeof value !== 'string' || value.trim() !== '') &&
             (!Array.isArray(value) || value.length > 0);
    }).length;
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [config.fields, form]);
  
  // Performance: Memoize submit handler
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    const requiredFields = config.fields.filter(f => f.required).map(f => f.key);
    requiredFields.forEach(fieldKey => {
      const value = form.getValues()[fieldKey];
      if (!value || (typeof value === 'string' && !value.trim()) || 
          (Array.isArray(value) && value.length === 0)) {
        const field = config.fields.find(f => f.key === fieldKey);
        newErrors[fieldKey] = `${field?.label || fieldKey} is required`;
      }
    });
    
    // Custom validation
    if (config.validation?.customValidators) {
      Object.entries(config.validation.customValidators).forEach(([fieldKey, validator]) => {
        const result = validator(form.getValues()[fieldKey], form.getValues());
        if (result !== true) {
          newErrors[fieldKey] = typeof result === 'string' ? result : 'Invalid value';
        }
      });
    }
    
    if (Object.keys(newErrors).length > 0) {
      form.setError(newErrors);
      return;
    }
    
    onSave(form.getValues());
  }, [form, config.validation, config.fields, onSave]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with completion indicator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {entity ? `Edit ${config.displayName}` : `Create ${config.displayName}`}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {config.formConfig.layout === 'two-column' ? 'Two-column' : 'Single-column'} layout
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Overall completion */}
              <div className="text-right">
                <div className="text-sm font-medium">{overallCompletion}% Complete</div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${overallCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Form sections with performance optimization */}
      <div className="space-y-6">
        {formSections.map((section) => (
          <MemoizedFormSection
            key={section.id}
            section={section}
            fields={config.fields}
            formData={form.getValues()}
            errors={form.formState.errors}
            handleFieldChange={handleFieldChange}
            disabled={isLoading}
            config={config}
          />
        ))}
      </div>
      
      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {Object.keys(form.formState.errors).length > 0 && (
                <span className="text-red-600">
                  {Object.keys(form.formState.errors).length} error{Object.keys(form.formState.errors).length !== 1 ? 's' : ''} to fix
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="gap-2"
              >
                {isLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                )}
                {entity ? 'Update' : 'Create'} {config.displayName}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
});

export default UniversalEntityForm;