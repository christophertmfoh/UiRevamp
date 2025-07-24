// Single source of truth for character field structure
// This configuration drives both the form and the detail view

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'array' | 'select';
  placeholder?: string;
  rows?: number;
  options?: string[];
}

export interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  fields: FieldConfig[];
}



// Helper function to get all field keys for type safety
export function getAllFieldKeys(): string[] {
  return CHARACTER_SECTIONS.flatMap(section => section.fields.map(field => field.key));
}

// Helper function to get a field config by key
export function getFieldConfig(key: string): FieldConfig | undefined {
  for (const section of CHARACTER_SECTIONS) {
    const field = section.fields.find(f => f.key === key);
    if (field) return field;
  }
  return undefined;
}

// Icon mapping for components
export const ICON_MAP = {
  User: 'User',
  Eye: 'Eye', 
  Brain: 'Brain',
  Zap: 'Zap',
  BookOpen: 'BookOpen',
  Users: 'Users',
  PenTool: 'PenTool',
};