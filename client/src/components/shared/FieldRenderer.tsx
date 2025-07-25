import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import type { FieldConfig } from '@/lib/config/entityConfig';

interface FieldRendererProps {
  field: FieldConfig;
  value: any;
  isEditing: boolean;
  onChange: (value: any) => void;
}

export function FieldRenderer({ field, value, isEditing, onChange }: FieldRendererProps) {
  const handleArrayAdd = () => {
    const currentArray = Array.isArray(value) ? value : [];
    onChange([...currentArray, '']);
  };

  const handleArrayRemove = (index: number) => {
    const currentArray = Array.isArray(value) ? value : [];
    onChange(currentArray.filter((_, i) => i !== index));
  };

  const handleArrayChange = (index: number, newValue: string) => {
    const currentArray = Array.isArray(value) ? value : [];
    const updated = [...currentArray];
    updated[index] = newValue;
    onChange(updated);
  };

  // Display mode
  if (!isEditing) {
    if (field.type === 'array') {
      const arrayValue = Array.isArray(value) ? value : [];
      if (arrayValue.length === 0) {
        return (
          <div className="space-y-2">
            <Label>{field.label}</Label>
            <p className="text-sm text-muted-foreground">No {field.label.toLowerCase()} added yet</p>
          </div>
        );
      }
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <div className="flex flex-wrap gap-1">
            {arrayValue.map((item, index) => (
              <Badge key={index} variant="secondary">{item}</Badge>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        <div className={field.type === 'textarea' ? 'whitespace-pre-wrap' : ''}>
          {value || <span className="text-muted-foreground">Not provided</span>}
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>{field.label}{field.required && ' *'}</Label>
      
      {field.type === 'text' && (
        <Input
          id={field.key}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
      
      {field.type === 'textarea' && (
        <Textarea
          id={field.key}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={3}
        />
      )}
      
      {field.type === 'array' && (
        <div className="space-y-2">
          {Array.isArray(value) && value.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value)}
                placeholder={`${field.label} ${index + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleArrayRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleArrayAdd}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {field.label}
          </Button>
        </div>
      )}
    </div>
  );
}