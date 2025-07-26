// Universal Entity Configuration System
export * from './EntityConfig';
export * from './CharacterConfig';


// Entity configuration registry
import { EntityConfigRegistry } from './EntityConfig';
import { CHARACTER_CONFIG } from './CharacterConfig';


// Register all entity configurations
EntityConfigRegistry.register(CHARACTER_CONFIG);

// Export registry and helper functions
export { EntityConfigRegistry };

// Helper function to get entity configuration
export const getEntityConfig = (entityType: string) => {
  return EntityConfigRegistry.get(entityType as any);
};

// Helper function to get all registered configurations
export const getAllEntityConfigs = () => {
  return EntityConfigRegistry.getAll();
};

// Entity type validation
export const isValidEntityType = (entityType: string): boolean => {
  return EntityConfigRegistry.get(entityType as any) !== undefined;
};