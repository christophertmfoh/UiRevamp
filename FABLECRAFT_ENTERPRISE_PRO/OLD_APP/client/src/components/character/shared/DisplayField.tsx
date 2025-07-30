import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CHARACTER_FIELD_LABELS } from '@/types/character';
import { Character } from '@/types/character';

interface DisplayFieldProps {
  fieldKey: keyof Character;
  value: any;
  label?: string;
  className?: string;
  showEmptyState?: boolean;
  emptyText?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export function DisplayField({ 
  fieldKey, 
  value, 
  label, 
  className = '',
  showEmptyState = true,
  emptyText,
  variant = 'default'
}: DisplayFieldProps) {
  const displayLabel = label || CHARACTER_FIELD_LABELS[fieldKey as string] || fieldKey;
  const isEmpty = !value || 
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);

  const defaultEmptyText = emptyText || `No ${displayLabel.toLowerCase()} added yet`;

  const renderValue = () => {
    if (isEmpty) {
      return showEmptyState ? (
        <span className="text-muted-foreground italic text-sm">
          {defaultEmptyText}
        </span>
      ) : null;
    }

    // Handle array values (tags/lists)
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      );
    }

    // Handle string values
    if (typeof value === 'string') {
      // Check if it's a long text (paragraph style)
      if (value.length > 100) {
        return (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {value}
          </div>
        );
      }
      
      // Short text (inline style)
      return (
        <span className="text-sm">
          {value}
        </span>
      );
    }

    // Handle other types
    return (
      <span className="text-sm">
        {String(value)}
      </span>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {displayLabel}
        </div>
        <div>
          {renderValue()}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`border rounded-lg p-4 space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground">
            {displayLabel}
          </h4>
          {!isEmpty && Array.isArray(value) && (
            <Badge variant="outline" className="text-xs">
              {value.length} {value.length === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>
        <div>
          {renderValue()}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-foreground">
        {displayLabel}
      </div>
      <div>
        {renderValue()}
      </div>
    </div>
  );
}

// Specialized component for displaying a group of related fields
interface DisplayFieldGroupProps {
  title: string;
  fields: Array<{
    key: keyof Character;
    value: any;
    label?: string;
  }>;
  variant?: 'grid' | 'list';
  className?: string;
}

export function DisplayFieldGroup({ 
  title, 
  fields, 
  variant = 'grid',
  className = ''
}: DisplayFieldGroupProps) {
  const nonEmptyFields = fields.filter(field => {
    const value = field.value;
    return value && 
      (typeof value !== 'string' || value.trim() !== '') &&
      (!Array.isArray(value) || value.length > 0);
  });

  if (nonEmptyFields.length === 0) {
    return (
      <div className={`border rounded-lg p-6 text-center ${className}`}>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm italic">
          No {title.toLowerCase()} information added yet
        </p>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-6 space-y-4 ${className}`}>
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      
      {variant === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nonEmptyFields.map((field) => (
            <DisplayField
              key={field.key as string}
              fieldKey={field.key}
              value={field.value}
              label={field.label}
              variant="compact"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {nonEmptyFields.map((field) => (
            <DisplayField
              key={field.key as string}
              fieldKey={field.key}
              value={field.value}
              label={field.label}
              variant="default"
            />
          ))}
        </div>
      )}
    </div>
  );
}