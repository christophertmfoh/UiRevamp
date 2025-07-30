import { EntityFieldConfig } from '@shared/schema';

export const characterFieldConfig: EntityFieldConfig[] = [
  // Basic Information
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'Basic Information',
    required: true,
    placeholder: 'Character name...',
    aiEnhanceable: false
  },
  {
    key: 'age',
    label: 'Age',
    type: 'text',
    section: 'Basic Information',
    placeholder: 'Character age...',
    aiEnhanceable: true
  },
  {
    key: 'occupation',
    label: 'Occupation',
    type: 'text',
    section: 'Basic Information',
    placeholder: 'Character occupation...',
    aiEnhanceable: true
  },
  {
    key: 'physicalDescription',
    label: 'Physical Description',
    type: 'textarea',
    section: 'Physical Appearance',
    placeholder: 'Describe physical appearance...',
    aiEnhanceable: true
  },
  {
    key: 'personality',
    label: 'Personality',
    type: 'textarea',
    section: 'Personality',
    placeholder: 'Describe personality traits...',
    aiEnhanceable: true
  },
  {
    key: 'backstory',
    label: 'Backstory',
    type: 'textarea',
    section: 'Background',
    placeholder: 'Character background story...',
    aiEnhanceable: true
  }
];

export default characterFieldConfig;