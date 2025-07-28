import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FieldRendererProps {
  field: {
    key: string;
    label: string;
    type: string;
    options?: string[];
  };
  value: any;
  isEditing: boolean;
  onChange: (field: string, value: string | string[]) => void;
}

export function FieldRenderer({ field, value, isEditing, onChange }: FieldRendererProps) {
  if (isEditing) {
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={value || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="creative-input"
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Textarea
              id={field.key}
              value={value || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="creative-input min-h-[100px] resize-y"
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select 
              value={value || ''} 
              onValueChange={(newValue) => onChange(field.key, newValue)}
            >
              <SelectTrigger className="creative-input">
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'array':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChange={(e) => onChange(field.key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder={`Enter ${field.label.toLowerCase()}, separated by commas...`}
              className="creative-input"
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={value || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="creative-input"
            />
          </div>
        );
    }
  } else {
    // View mode
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground">{field.label}</Label>
        {(!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) ? (
          <div className="text-sm text-muted-foreground italic">
            No {field.label.toLowerCase()} added yet
          </div>
        ) : Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.map((item: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm">{value}</p>
        )}
      </div>
    );
  }
}