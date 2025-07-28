import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Relationship } from '@/lib/types'; // Type not currently used

interface RelationshipSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function RelationshipSelect({ label, value, onChange, options }: RelationshipSelectProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const STRENGTH_OPTIONS = [
  { value: 'weak', label: 'Weak' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
  { value: 'intense', label: 'Intense' }
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'past', label: 'Past' },
  { value: 'complicated', label: 'Complicated' },
  { value: 'unknown', label: 'Unknown' }
];