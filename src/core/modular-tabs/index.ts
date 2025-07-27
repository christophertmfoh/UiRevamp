// Core Classes
export { TabFactory } from './TabFactory';

// Types
export type {
  ModularTabConfig,
  TabFeatures,
  TabUIConfig,
  TabDataConfig,
  TabComponentMappings,
  TabFactoryOptions,
  TabCloneOptions,
  TabTemplate,
  TabInstance,
  TabRegistry,
  TabFieldConfig,
  TabSectionConfig,
  TabCustomProperty,
  TabSortOption
} from './types/TabConfig';

// Templates
export { CHARACTERS_TEMPLATE } from './templates/CharactersTemplate';

// Components
export { AdvancedCharacterManager } from './components/AdvancedCharacterManager';
export { ModularTabManager } from './components/ModularTabManager';
export { TabCreator } from './components/TabCreator';
export { TabDemo } from './components/TabDemo';

// Example usage functions
export const createVillainsTab = async (projectId: string) => {
  const factory = TabFactory.getInstance();
  return await factory.quickCloneCharactersTab(
    'villains',
    'Villains',
    '#ef4444',
    // Note: You would need to import Shield from lucide-react
  );
};

export const createRomanceTab = async (projectId: string) => {
  const factory = TabFactory.getInstance();
  return await factory.quickCloneCharactersTab(
    'romance-characters',
    'Romance Characters',
    '#ec4899',
    // Note: You would need to import Heart from lucide-react
  );
};