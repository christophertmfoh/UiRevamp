import React from 'react';
import type { ModularTabConfig } from '../types/TabConfig';
import { AdvancedCharacterManager } from './AdvancedCharacterManager';

interface ModularTabManagerProps {
  tabId: string;
  projectId: string;
  tabConfig: ModularTabConfig;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

/**
 * ModularTabManager - Universal component that renders any modular tab
 * Routes to the appropriate manager component based on configuration
 * 
 * This is the main component that allows switching between different tab types
 * while preserving all functionality through the tab configuration system.
 */
export function ModularTabManager({
  tabId,
  projectId,
  tabConfig,
  selectedEntityId,
  onClearSelection
}: ModularTabManagerProps) {
  
  // Route to the appropriate manager component based on the tab configuration
  const renderTabContent = () => {
    // Check the component mapping to determine which manager to use
    const managerComponent = tabConfig.componentMappings.manager;
    
    switch (managerComponent) {
      case 'AdvancedCharacterManager':
      default:
        // Default to AdvancedCharacterManager for character-based tabs
        // This preserves ALL original CharacterManager functionality
        return (
          <AdvancedCharacterManager
            projectId={projectId}
            selectedCharacterId={selectedEntityId}
            onClearSelection={onClearSelection}
            tabConfig={tabConfig}
          />
        );
    }
  };

  return (
    <div 
      className="modular-tab-container"
      data-tab-id={tabId}
      data-tab-type={tabConfig.dataConfig.entityType}
      style={{
        // Apply tab-specific CSS custom properties for theming
        '--tab-primary-color': tabConfig.ui.primaryColor,
        '--tab-secondary-color': tabConfig.ui.secondaryColor,
        '--tab-accent-color': tabConfig.ui.accentColor,
      } as React.CSSProperties}
    >
      {renderTabContent()}
    </div>
  );
}