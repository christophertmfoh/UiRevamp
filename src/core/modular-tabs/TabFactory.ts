import type { 
  ModularTabConfig, 
  TabFactoryOptions, 
  TabCloneOptions, 
  TabTemplate, 
  TabInstance,
  TabRegistry,
  TabFeatures,
  TabUIConfig,
  TabDataConfig,
  TabComponentMappings
} from './types/TabConfig';
import { CHARACTERS_TEMPLATE } from './templates/CharactersTemplate';

/**
 * TabFactory - Main factory class for creating and cloning modular tabs
 * Preserves 100% of functionality when cloning Character tabs
 */
export class TabFactory {
  private static instance: TabFactory;
  private registry: TabRegistry;

  constructor() {
    this.registry = {
      tabs: {},
      instances: {},
      templates: {},
      categories: ['characters', 'locations', 'items', 'events', 'custom'],
      tags: ['story', 'world-building', 'character-development', 'plot'],
      defaultCharacterTabId: 'characters-template'
    };
    
    // Register built-in templates
    this.registerTemplate({
      id: 'characters-builtin',
      name: 'Characters',
      description: 'Complete character management with AI generation, portraits, and advanced features',
      category: 'characters',
      icon: CHARACTERS_TEMPLATE.icon,
      config: CHARACTERS_TEMPLATE,
      tags: ['characters', 'story', 'development'],
      popularity: 100,
      isBuiltIn: true,
      isVisible: true
    });
  }

  static getInstance(): TabFactory {
    if (!TabFactory.instance) {
      TabFactory.instance = new TabFactory();
    }
    return TabFactory.instance;
  }

  /**
   * Creates a new tab from scratch with custom configuration
   */
  async createTab(options: TabFactoryOptions): Promise<ModularTabConfig> {
    const tabId = this.generateTabId(options.name);
    
    const config: ModularTabConfig = {
      id: tabId,
      name: this.slugify(options.name),
      displayName: options.displayName,
      description: options.description,
      icon: options.icon || CHARACTERS_TEMPLATE.icon,
      color: options.color || '#3b82f6',
      gradient: options.gradient,
      
      // Metadata
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Features - Start with base features
      features: this.mergeFeatures(CHARACTERS_TEMPLATE.features, options.featureOverrides),
      
      // UI Configuration
      ui: this.mergeUIConfig(CHARACTERS_TEMPLATE.ui, options.uiOverrides),
      
      // Data Configuration
      dataConfig: this.mergeDataConfig(CHARACTERS_TEMPLATE.dataConfig, options.dataOverrides, options),
      
      // Component Mappings - Default to Character Manager components
      componentMappings: CHARACTERS_TEMPLATE.componentMappings
    };

    // Register the new tab
    this.registry.tabs[tabId] = config;
    
    return config;
  }

  /**
   * Clones an existing tab with customizations while preserving ALL functionality
   * This is the key method that ensures 100% feature preservation
   */
  async cloneTab(options: TabCloneOptions): Promise<ModularTabConfig> {
    const sourceConfig = this.registry.tabs[options.sourceTabId] || CHARACTERS_TEMPLATE;
    
    if (!sourceConfig) {
      throw new Error(`Source tab '${options.sourceTabId}' not found`);
    }

    const clonedTabId = this.generateTabId(options.name);
    
    // Deep clone the source configuration to preserve ALL functionality
    const clonedConfig: ModularTabConfig = {
      ...sourceConfig,
      id: clonedTabId,
      name: this.slugify(options.name),
      displayName: options.displayName,
      description: options.description || sourceConfig.description,
      
      // Visual customization
      icon: options.icon || sourceConfig.icon,
      color: options.color || sourceConfig.color,
      gradient: options.gradient || sourceConfig.gradient,
      
      // Metadata
      isCustom: true,
      clonedFrom: options.sourceTabId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Preserve ALL features by default, then apply overrides
      features: this.mergeFeatures(sourceConfig.features, options.featureOverrides),
      
      // UI Configuration with customizations
      ui: this.mergeUIConfig(sourceConfig.ui, {
        ...options.uiOverrides,
        icon: options.icon || sourceConfig.ui.icon,
        primaryColor: options.color || sourceConfig.ui.primaryColor,
        iconColor: options.color || sourceConfig.ui.iconColor
      }),
      
      // Data Configuration with custom fields added
      dataConfig: this.mergeDataConfig(sourceConfig.dataConfig, options.dataOverrides, options),
      
      // Component Mappings - PRESERVE EXACTLY to maintain functionality
      componentMappings: options.preserveCustomizations !== false 
        ? { ...sourceConfig.componentMappings }
        : CHARACTERS_TEMPLATE.componentMappings
    };

    // Register the cloned tab
    this.registry.tabs[clonedTabId] = clonedConfig;
    
    return clonedConfig;
  }

  /**
   * Creates a tab instance for a specific project
   */
  async createTabInstance(config: ModularTabConfig, projectId: string): Promise<TabInstance> {
    const instanceId = `${config.id}-${projectId}`;
    
    const instance: TabInstance = {
      id: instanceId,
      config,
      projectId,
      isActive: false,
      lastAccessed: new Date().toISOString(),
      entityCount: 0,
      lastEntityUpdate: new Date().toISOString(),
      cacheKey: this.generateCacheKey(config.id, projectId),
      preloadData: true
    };

    this.registry.instances[instanceId] = instance;
    return instance;
  }

  /**
   * Quick clone of characters tab with just name and color changes
   * Preserves 100% of Character Manager functionality
   */
  async quickCloneCharactersTab(
    name: string, 
    displayName: string, 
    color?: string, 
    icon?: any
  ): Promise<ModularTabConfig> {
    return this.cloneTab({
      sourceTabId: 'characters-template',
      name,
      displayName,
      color,
      icon,
      preserveData: true,
      preserveSettings: true,
      preserveCustomizations: true
    });
  }

  /**
   * Merge features while preserving functionality
   */
  private mergeFeatures(base: TabFeatures, overrides?: Partial<TabFeatures>): TabFeatures {
    return {
      ...base,
      ...overrides,
      // Ensure critical features are never accidentally disabled
      hasAPIIntegration: overrides?.hasAPIIntegration ?? base.hasAPIIntegration,
      hasRealTimeUpdates: overrides?.hasRealTimeUpdates ?? base.hasRealTimeUpdates,
      // Preserve all sort options unless explicitly overridden
      sortOptions: overrides?.sortOptions || base.sortOptions
    };
  }

  /**
   * Merge UI configuration with customizations
   */
  private mergeUIConfig(base: TabUIConfig, overrides?: Partial<TabUIConfig>): TabUIConfig {
    return {
      ...base,
      ...overrides,
      // Ensure display fields are preserved unless explicitly changed
      displayFields: overrides?.displayFields || base.displayFields
    };
  }

  /**
   * Merge data configuration and add custom fields
   */
  private mergeDataConfig(
    base: TabDataConfig, 
    overrides?: Partial<TabDataConfig>,
    options?: TabFactoryOptions
  ): TabDataConfig {
    const merged = {
      ...base,
      ...overrides
    };

    // Add custom fields if provided
    if (options?.customFields) {
      merged.fields = [...merged.fields, ...options.customFields];
    }

    // Add custom sections if provided
    if (options?.customSections) {
      merged.sections = [...merged.sections, ...options.customSections];
    }

    // Add custom properties if provided
    if (options?.customProperties) {
      merged.customProperties = [...merged.customProperties, ...options.customProperties];
    }

    return merged;
  }

  /**
   * Register a new template
   */
  registerTemplate(template: TabTemplate): void {
    this.registry.templates[template.id] = template;
  }

  /**
   * Get available templates
   */
  getTemplates(category?: string): TabTemplate[] {
    const templates = Object.values(this.registry.templates);
    
    if (category) {
      return templates.filter(t => t.category === category && t.isVisible);
    }
    
    return templates.filter(t => t.isVisible);
  }

  /**
   * Get a specific tab configuration
   */
  getTab(tabId: string): ModularTabConfig | undefined {
    return this.registry.tabs[tabId];
  }

  /**
   * Get all tabs
   */
  getAllTabs(): ModularTabConfig[] {
    return Object.values(this.registry.tabs);
  }

  /**
   * Get tab instance
   */
  getTabInstance(instanceId: string): TabInstance | undefined {
    return this.registry.instances[instanceId];
  }

  /**
   * Get tab instances for a project
   */
  getProjectTabInstances(projectId: string): TabInstance[] {
    return Object.values(this.registry.instances)
      .filter(instance => instance.projectId === projectId);
  }

  /**
   * Update tab configuration
   */
  async updateTab(tabId: string, updates: Partial<ModularTabConfig>): Promise<ModularTabConfig> {
    const existing = this.registry.tabs[tabId];
    if (!existing) {
      throw new Error(`Tab '${tabId}' not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.registry.tabs[tabId] = updated;
    return updated;
  }

  /**
   * Delete a tab
   */
  async deleteTab(tabId: string): Promise<void> {
    if (this.registry.tabs[tabId]) {
      delete this.registry.tabs[tabId];
      
      // Also delete associated instances
      Object.keys(this.registry.instances).forEach(instanceId => {
        const instance = this.registry.instances[instanceId];
        if (instance.config.id === tabId) {
          delete this.registry.instances[instanceId];
        }
      });
    }
  }

  /**
   * Export tab configuration
   */
  exportTab(tabId: string): string {
    const config = this.registry.tabs[tabId];
    const instances = Object.values(this.registry.instances)
      .filter(instance => instance.config.id === tabId);
    
    const exportData = {
      config,
      instances,
      templates: [],
      metadata: {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        exportedBy: 'TabFactory'
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import tab configuration
   */
  async importTab(jsonData: string): Promise<ModularTabConfig> {
    const data = JSON.parse(jsonData);
    
    if (!data.config) {
      throw new Error('Invalid tab export data');
    }

    const newTabId = this.generateTabId(data.config.name);
    const importedConfig = {
      ...data.config,
      id: newTabId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.registry.tabs[newTabId] = importedConfig;
    return importedConfig;
  }

  /**
   * Generate unique tab ID
   */
  private generateTabId(name: string): string {
    const baseId = this.slugify(name);
    let counter = 1;
    let tabId = baseId;
    
    while (this.registry.tabs[tabId]) {
      tabId = `${baseId}-${counter}`;
      counter++;
    }
    
    return tabId;
  }

  /**
   * Convert string to slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(tabId: string, projectId: string): string {
    return `tab-${tabId}-project-${projectId}-${Date.now()}`;
  }

  /**
   * Get registry (for debugging/admin)
   */
  getRegistry(): TabRegistry {
    return { ...this.registry };
  }

  /**
   * Reset registry (for testing)
   */
  resetRegistry(): void {
    this.registry = {
      tabs: {},
      instances: {},
      templates: {},
      categories: ['characters', 'locations', 'items', 'events', 'custom'],
      tags: ['story', 'world-building', 'character-development', 'plot'],
      defaultCharacterTabId: 'characters-template'
    };
  }
}