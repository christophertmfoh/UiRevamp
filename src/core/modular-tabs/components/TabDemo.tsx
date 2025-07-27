import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Shield, Heart, Sword, Settings, Download, Eye, Sparkles } from 'lucide-react';
import type { ModularTabConfig } from '../types/TabConfig';
import { TabFactory } from '../TabFactory';
import { TabCreator } from './TabCreator';
import { ModularTabManager } from './ModularTabManager';

interface TabDemoProps {
  projectId: string;
}

/**
 * TabDemo - Demonstration component showing the modular tab system in action
 * 
 * This component demonstrates:
 * - How to clone the Characters tab
 * - How to customize tabs with different names, colors, and icons
 * - How to preserve 100% of functionality
 * - How to manage multiple tab instances
 */
export function TabDemo({ projectId }: TabDemoProps) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [customTabs, setCustomTabs] = useState<ModularTabConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingTabs();
  }, [projectId]);

  const loadExistingTabs = async () => {
    try {
      const factory = TabFactory.getInstance();
      const allTabs = factory.getAllTabs();
      const projectTabs = factory.getProjectTabInstances(projectId);
      
      // Filter to get tabs that have instances in this project
      const tabsForProject = allTabs.filter(tab => 
        projectTabs.some(instance => instance.config.id === tab.id)
      );
      
      setCustomTabs(tabsForProject);
    } catch (error) {
      console.error('Failed to load tabs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabCreated = async (newTab: ModularTabConfig) => {
    setCustomTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCreateDemoTabs = async () => {
    const factory = TabFactory.getInstance();
    
    try {
      // Create some example tabs
      const villainsTab = await factory.quickCloneCharactersTab(
        'villains',
        'Villains',
        '#ef4444',
        Shield
      );
      
      const romanceTab = await factory.quickCloneCharactersTab(
        'romance-characters',
        'Romance Characters',
        '#ec4899',
        Heart
      );
      
      const heroesTab = await factory.quickCloneCharactersTab(
        'heroes',
        'Heroes',
        '#3b82f6',
        Sword
      );

      // Create instances for this project
      await factory.createTabInstance(villainsTab, projectId);
      await factory.createTabInstance(romanceTab, projectId);
      await factory.createTabInstance(heroesTab, projectId);

      setCustomTabs(prev => [...prev, villainsTab, romanceTab, heroesTab]);
    } catch (error) {
      console.error('Failed to create demo tabs:', error);
    }
  };

  const handleExportTab = (tab: ModularTabConfig) => {
    const factory = TabFactory.getInstance();
    const exportData = factory.exportTab(tab.id);
    
    // Create download
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tab.name}-tab-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteTab = async (tabId: string) => {
    if (confirm('Are you sure you want to delete this tab?')) {
      const factory = TabFactory.getInstance();
      await factory.deleteTab(tabId);
      setCustomTabs(prev => prev.filter(tab => tab.id !== tabId));
      if (activeTabId === tabId) {
        setActiveTabId(null);
      }
    }
  };

  if (activeTabId) {
    const activeTab = customTabs.find(tab => tab.id === activeTabId);
    if (activeTab) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setActiveTabId(null)}>
                ← Back to Tab Management
              </Button>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: activeTab.color }}
                >
                  <activeTab.icon className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold">{activeTab.displayName}</h2>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  Cloned Tab
                </Badge>
              </div>
            </div>
          </div>
          
          <ModularTabManager
            tabId={activeTab.id}
            projectId={projectId}
            tabConfig={activeTab}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Modular Tab System Demo</h1>
          <p className="text-muted-foreground mt-1">
            Clone and customize the Characters tab while preserving 100% of its functionality
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsCreatorOpen(true)}
            className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Tab
          </Button>
          
          {customTabs.length === 0 && (
            <Button variant="outline" onClick={handleCreateDemoTabs}>
              <Sparkles className="h-4 w-4 mr-2" />
              Create Demo Tabs
            </Button>
          )}
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold">100% Functionality Preserved</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All AI generation, portraits, bulk operations, sorting options, and premium UI components work exactly the same in cloned tabs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Full Customization</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Change names, colors, icons, and add custom fields while keeping all the advanced features like completion tracking and advanced sorting.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Specialized Templates</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Quick templates for villains, romance characters, NPCs, and heroes with pre-configured custom fields and styling.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Existing Tabs */}
      {customTabs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Custom Tabs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTabs.map((tab) => (
              <Card key={tab.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: tab.color }}
                      >
                        <tab.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tab.displayName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {tab.isCustom ? 'Custom Tab' : 'Built-in'}
                        </p>
                      </div>
                    </div>
                    {tab.clonedFrom && (
                      <Badge variant="outline" className="text-xs">
                        Cloned
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tab.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Features</span>
                      <span className="font-medium">
                        {Object.values(tab.features).filter(Boolean).length} enabled
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {tab.features.hasAIGeneration && (
                        <Badge variant="outline" className="text-xs">AI Generation</Badge>
                      )}
                      {tab.features.hasPortraits && (
                        <Badge variant="outline" className="text-xs">Portraits</Badge>
                      )}
                      {tab.features.hasBulkOperations && (
                        <Badge variant="outline" className="text-xs">Bulk Ops</Badge>
                      )}
                      {tab.features.hasCompletionTracking && (
                        <Badge variant="outline" className="text-xs">Progress</Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setActiveTabId(tab.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportTab(tab)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {tab.isCustom && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteTab(tab.id)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {customTabs.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Custom Tabs Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first custom tab to see the modular system in action. You can clone the Characters tab and customize it for villains, romance characters, NPCs, or any other character type.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setIsCreatorOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Tab
              </Button>
              <Button variant="outline" onClick={handleCreateDemoTabs}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Demo Tabs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`// Clone characters tab -> get identical functionality
const villainTab = await tabFactory.cloneTab(
  'characters-tab-id',
  'Villains',
  { color: 'red', icon: Shield }
);

// Render cloned tab with full functionality
<ModularTabManager
  tabId="villain-tab-id" 
  projectId={projectId}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Tab Creator Modal */}
      <TabCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onTabCreated={handleTabCreated}
        projectId={projectId}
      />
    </div>
  );
}