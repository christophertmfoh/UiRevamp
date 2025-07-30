import { EntityFieldConfig } from '@shared/schema';

export const baseFieldConfig: EntityFieldConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    section: 'Basic Information',
    required: true,
    placeholder: 'Enter name...',
    aiEnhanceable: false
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    section: 'Basic Information',
    required: false,
    placeholder: 'Enter description...',
    aiEnhanceable: true
  }
];

export default baseFieldConfig;