/**
 * Consolidated Field Renderer Component
 * Renders different field types with consistent styling and AI enhancement
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldAIAssist } from '../FieldAIAssist';
import { FieldConfigManager, type UniversalFieldDefinition, type UniversalFieldRendererProps } from '@/lib/config';
import { Star } from 'lucide-react';

interface FieldRendererProps extends Omit<UniversalFieldRendererProps, 'fieldDefinition'> {
  // Extends universal props, gets fieldDefinition internally via fieldKey
}

export function FieldRenderer({
  fieldKey,
  value,
  onChange,
  onEnhance,
  isEnhancing = false,
  error,
  disabled = false,
  showPriority = false
}: FieldRendererProps) {
  const fieldDef = FieldConfigManager.getField(fieldKey);
  
  if (!fieldDef) {
    console.warn(`No field definition found for: ${fieldKey}`);
    return null;
  }

  const renderPriorityIndicator = () => {
    if (!showPriority) return null;
    
    const stars = fieldDef.priority === 'essential' ? 3 : 
                  fieldDef.priority === 'important' ? 2 : 1;
    
    return (
      <div className="flex items-center gap-1 ml-2">
        {Array.from({ length: stars }).map((_, i) => (
          <Star 
            key={i} 
            className="h-3 w-3 text-yellow-500 fill-current" 
          />
        ))}
      </div>
    );
  };

  const renderLabel = () => (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <Label htmlFor={fieldKey} className="text-sm font-medium">
          {fieldDef.label}
          {fieldDef.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {renderPriorityIndicator()}
      </div>
      
      {onEnhance && fieldDef.type !== 'select' && (
        <FieldAIAssist
          fieldKey={fieldKey}
          fieldLabel={fieldDef.label}
          onEnhance={onEnhance}
          isEnhancing={isEnhancing}
          size="sm"
        />
      )}
    </div>
  );

  const renderDescription = () => {
    if (!fieldDef.description) return null;
    
    return (
      <p className="text-xs text-muted-foreground mt-1 mb-2">
        {fieldDef.description}
      </p>
    );
  };

  const renderError = () => {
    if (!error) return null;
    
    return (
      <p className="text-xs text-red-500 mt-1">
        {error}
      </p>
    );
  };

  const renderField = () => {
    const commonProps = {
      id: fieldKey,
      disabled,
      className: error ? 'border-red-500' : ''
    };

    switch (fieldDef.type) {
      case 'text':
        return (
          <Input
            {...commonProps}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldDef.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldDef.placeholder}
            rows={3}
            className="resize-none"
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={fieldDef.placeholder || `Select ${fieldDef.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {fieldDef.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'array':
      case 'tags':
        return (
          <div className="space-y-2">
            <Input
              {...commonProps}
              type="text"
              value={Array.isArray(value) ? value.join(', ') : (value || '')}
              onChange={(e) => {
                const items = e.target.value
                  .split(',')
                  .map(item => item.trim())
                  .filter(item => item.length > 0);
                onChange(items);
              }}
              placeholder={fieldDef.placeholder || 'Enter items separated by commas'}
            />
            {Array.isArray(value) && value.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {value.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            {...commonProps}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fieldDef.placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      {renderLabel()}
      {renderDescription()}
      {renderField()}
      {renderError()}
    </div>
  );
}