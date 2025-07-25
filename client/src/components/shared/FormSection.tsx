import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldRenderer } from './FieldRenderer';
import type { SectionConfig } from '@/lib/config/entityConfig';

interface FormSectionProps {
  section: SectionConfig;
  formData: any;
  isEditing: boolean;
  onFieldChange: (key: string, value: any) => void;
}

export function FormSection({ section, formData, isEditing, onFieldChange }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map(field => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={formData[field.key]}
            isEditing={isEditing}
            onChange={(value: any) => onFieldChange(field.key, value)}
          />
        ))}
      </CardContent>
    </Card>
  );
}