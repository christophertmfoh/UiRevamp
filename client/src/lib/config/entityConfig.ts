import { 
  Users, 
  MapPin, 
  Shield, 
  Package, 
  Crown,
  Sparkles,
  Clock,
  Eye,
  Languages,
  Heart,
  Scroll,
  Globe 
} from 'lucide-react';
import type { EntityType } from '../types';

// Entity configuration for generic components
export interface EntityConfig {
  label: string;
  singular: string;
  icon: any;
  apiEndpoint: string;
  createLabel: string;
}

export const ENTITY_CONFIGS: Record<EntityType, EntityConfig> = {
  character: {
    label: 'Characters',
    singular: 'Character',
    icon: Users,
    apiEndpoint: 'characters',
    createLabel: 'Create Character'
  },
  location: {
    label: 'Locations',
    singular: 'Location', 
    icon: MapPin,
    apiEndpoint: 'locations',
    createLabel: 'Create Location'
  },
  faction: {
    label: 'Factions',
    singular: 'Faction',
    icon: Shield,
    apiEndpoint: 'factions',
    createLabel: 'Create Faction'
  },
  item: {
    label: 'Items',
    singular: 'Item',
    icon: Package,
    apiEndpoint: 'items',
    createLabel: 'Create Item'
  },
  organization: {
    label: 'Organizations',
    singular: 'Organization',
    icon: Crown,
    apiEndpoint: 'organizations',
    createLabel: 'Create Organization'
  }
};

// Field configuration structure
export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'array';
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  fields: FieldConfig[];
}

export interface EntityFieldConfig {
  sections: SectionConfig[];
}

// Entity-specific field configurations
export const FIELD_CONFIGS: Record<EntityType, EntityFieldConfig> = {
  character: {
    sections: [
      {
        id: 'identity',
        title: 'Identity', 
        description: 'Core character identification',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'nicknames', label: 'Nicknames', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'race', label: 'Race', type: 'text' },
          { key: 'class', label: 'Class', type: 'text' },
          { key: 'age', label: 'Age', type: 'text' }
        ]
      },
      {
        id: 'physical',
        title: 'Physical',
        description: 'Appearance and physical traits',
        fields: [
          { key: 'physicalDescription', label: 'Physical Description', type: 'textarea' },
          { key: 'height', label: 'Height', type: 'text' },
          { key: 'build', label: 'Build', type: 'text' },
          { key: 'eyeColor', label: 'Eye Color', type: 'text' },
          { key: 'hairColor', label: 'Hair Color', type: 'text' }
        ]
      },
      {
        id: 'personality',
        title: 'Personality',
        description: 'Character traits and behavior',
        fields: [
          { key: 'personality', label: 'Personality', type: 'textarea' },
          { key: 'personalityTraits', label: 'Personality Traits', type: 'array' },
          { key: 'quirks', label: 'Quirks', type: 'text' },
          { key: 'temperament', label: 'Temperament', type: 'text' }
        ]
      },
      {
        id: 'background',
        title: 'Background',
        description: 'History and origins',
        fields: [
          { key: 'background', label: 'Background', type: 'textarea' },
          { key: 'backstory', label: 'Backstory', type: 'textarea' },
          { key: 'childhood', label: 'Childhood', type: 'textarea' },
          { key: 'education', label: 'Education', type: 'text' }
        ]
      }
    ]
  },
  location: {
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Basic location information',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'locationType', label: 'Type', type: 'text' },
          { key: 'size', label: 'Size', type: 'text' },
          { key: 'status', label: 'Status', type: 'text' }
        ]
      },
      {
        id: 'physical',
        title: 'Physical',
        description: 'Geographic and physical features',
        fields: [
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'geography', label: 'Geography', type: 'textarea' },
          { key: 'climate', label: 'Climate', type: 'text' },
          { key: 'terrain', label: 'Terrain', type: 'text' }
        ]
      },
      {
        id: 'society',
        title: 'Society',
        description: 'Cultural and social aspects',
        fields: [
          { key: 'population', label: 'Population', type: 'text' },
          { key: 'culture', label: 'Culture', type: 'textarea' },
          { key: 'governance', label: 'Governance', type: 'text' },
          { key: 'economy', label: 'Economy', type: 'text' }
        ]
      },
      {
        id: 'history',
        title: 'History',
        description: 'Historical significance',
        fields: [
          { key: 'history', label: 'History', type: 'textarea' },
          { key: 'significance', label: 'Significance', type: 'textarea' },
          { key: 'events', label: 'Notable Events', type: 'textarea' }
        ]
      }
    ]
  },
  faction: {
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Basic faction information',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'status', label: 'Status', type: 'text' }
        ]
      },
      {
        id: 'structure',
        title: 'Structure',
        description: 'Organization and hierarchy',
        fields: [
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'leadership', label: 'Leadership', type: 'textarea' },
          { key: 'structure', label: 'Structure', type: 'textarea' }
        ]
      }
    ]
  },
  item: {
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Basic item information',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'rarity', label: 'Rarity', type: 'text' }
        ]
      },
      {
        id: 'properties',
        title: 'Properties',
        description: 'Item characteristics',
        fields: [
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'properties', label: 'Properties', type: 'textarea' },
          { key: 'origin', label: 'Origin', type: 'text' }
        ]
      }
    ]
  },
  organization: {
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Basic organization information',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'status', label: 'Status', type: 'text' }
        ]
      },
      {
        id: 'structure',
        title: 'Structure',
        description: 'Organization structure',
        fields: [
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'purpose', label: 'Purpose', type: 'textarea' },
          { key: 'leadership', label: 'Leadership', type: 'text' }
        ]
      }
    ]
  }
};