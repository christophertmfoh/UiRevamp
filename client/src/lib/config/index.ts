/**
 * Centralized Configuration Exports
 * Single source for all field configurations and entity management
 */

// Core field configuration system
export * from './baseFieldConfig';

// Entity-specific configurations
export * from './characterFieldConfig';
export * from './entityFieldConfigs';

// Legacy compatibility - export from old fieldConfig for backward compatibility
export { 
  getFieldDefinition,
  CHARACTER_SECTIONS
} from './fieldConfig';

// Main field configuration manager
export { FieldConfigManager } from './baseFieldConfig';