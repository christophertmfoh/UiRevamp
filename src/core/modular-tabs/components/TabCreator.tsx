import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Copy, 
  Users, 
  Shield, 
  Heart, 
  Sword, 
  Crown, 
  Sparkles,
  Settings,
  Palette,
  Check,
  X
} from 'lucide-react';
import type { ModularTabConfig, TabCloneOptions, TabFactoryOptions } from '../types/TabConfig';
import { TabFactory } from '../TabFactory';
import { CHARACTERS_TEMPLATE } from '../templates/CharactersTemplate';

interface TabCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onTabCreated: (tabConfig: ModularTabConfig) => void;
  projectId: string;
}

// Predefined customization options
const PRESET_COLORS = [
  { name: 'Amber (Default)', value: '#f59e0b', description: 'Classic character gold' },
  { name: 'Red', value: '#ef4444', description: 'Perfect for villains' },
  { name: 'Blue', value: '#3b82f6', description: 'Heroes and protagonists' },
  { name: 'Green', value: '#10b981', description: 'Nature and allies' },
  { name: 'Purple', value: '#8b5cf6', description: 'Magic and mystery' },
  { name: 'Pink', value: '#ec4899', description: 'Romance characters' },
  { name: 'Orange', value: '#f97316', description: 'Adventure and energy' },
  { name: 'Teal', value: '#14b8a6', description: 'Wisdom and mentors' }
];

const PRESET_ICONS = [
  { name: 'Users', icon: Users, description: 'General characters' },
  { name: 'Shield', icon: Shield, description: 'Heroes and protectors' },
  { name: 'Heart', icon: Heart, description: 'Romance characters' },
  { name: 'Sword', icon: Sword, description: 'Warriors and fighters' },
  { name: 'Crown', icon: Crown, description: 'Royalty and leaders' },
  { name: 'Sparkles', icon: Sparkles, description: 'Magic users' }
];

const QUICK_TEMPLATES = [
  {
    id: 'villains',
    name: 'villains',
    displayName: 'Villains',
    description: 'Antagonists, enemies, and morally complex characters',
    color: '#ef4444',
    icon: Shield,
    customFields: [
      { key: 'evilPlan', label: 'Evil Plan', type: 'textarea' as const, section: 'story', placeholder: 'Their master plan and schemes' },
      { key: 'moralJustification', label: 'Moral Justification', type: 'textarea' as const, section: 'psychology', placeholder: 'Why they believe they are right' }
    ]
  },
  {
    id: 'romance',
    name: 'romance-characters',
    displayName: 'Romance Characters',
    description: 'Love interests, romantic partners, and relationship-focused characters',
    color: '#ec4899',
    icon: Heart,
    customFields: [
      { key: 'loveLanguage', label: 'Love Language', type: 'text' as const, section: 'personality', placeholder: 'How they express and receive love' },
      { key: 'romanticHistory', label: 'Romantic History', type: 'textarea' as const, section: 'background', placeholder: 'Past relationships and experiences' }
    ]
  },
  {
    id: 'npcs',
    name: 'npcs',
    displayName: 'NPCs',
    description: 'Non-player characters, supporting cast, and background characters',
    color: '#10b981',
    icon: Users,
    customFields: [
      { key: 'screenTime', label: 'Screen Time', type: 'select' as const, section: 'meta', options: ['Minor', 'Recurring', 'Major', 'Cameo'] },
      { key: 'purpose', label: 'Story Purpose', type: 'text' as const, section: 'story', placeholder: 'Their role in advancing the plot' }
    ]
  },
  {
    id: 'protagonists',
    name: 'protagonists',
    displayName: 'Protagonists',
    description: 'Main characters, heroes, and central figures',
    color: '#3b82f6',
    icon: Sword,
    customFields: [
      { key: 'heroicFlaws', label: 'Heroic Flaws', type: 'textarea' as const, section: 'personality', placeholder: 'Flaws that make them relatable' },
      { key: 'growth arc', label: 'Growth Arc', type: 'textarea' as const, section: 'story', placeholder: 'How they change throughout the story' }
    ]
  }
];

export function TabCreator({ isOpen, onClose, onTabCreated, projectId }: TabCreatorProps) {
  const [mode, setMode] = useState<'clone' | 'create' | 'template'>('template');
  const [tabName, setTabName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(QUICK_TEMPLATES[0]);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreateFromTemplate = async () => {
    if (!displayName.trim()) return;
    
    setIsCreating(true);
    try {
      const factory = TabFactory.getInstance();
      
      const options: TabCloneOptions = {
        sourceTabId: 'characters-template',
        name: selectedTemplate.name,
        displayName: displayName.trim(),
        description: description.trim() || selectedTemplate.description,
        color: selectedColor.value,
        icon: selectedIcon.icon,
        customFields: selectedTemplate.customFields,
        preserveData: true,
        preserveSettings: true,
        preserveCustomizations: true
      };

      const newTab = await factory.cloneTab(options);
      
      // Create tab instance for the project
      await factory.createTabInstance(newTab, projectId);
      
      onTabCreated(newTab);
      onClose();
      
      // Reset form
      setTabName('');
      setDisplayName('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create tab:', error);
      alert('Failed to create tab. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickClone = async () => {
    if (!displayName.trim()) return;
    
    setIsCreating(true);
    try {
      const factory = TabFactory.getInstance();
      
      const clonedTab = await factory.quickCloneCharactersTab(
        tabName.trim() || selectedTemplate.name,
        displayName.trim(),
        selectedTemplate.color,
        selectedTemplate.icon
      );
      
      // Add custom fields if template has them
      if (selectedTemplate.customFields.length > 0) {
        clonedTab.dataConfig.fields = [
          ...clonedTab.dataConfig.fields,
          ...selectedTemplate.customFields
        ];
      }
      
      // Create tab instance for the project
      await factory.createTabInstance(clonedTab, projectId);
      
      onTabCreated(clonedTab);
      onClose();
      
      // Reset form
      setTabName('');
      setDisplayName('');
      setDescription('');
    } catch (error) {
      console.error('Failed to clone tab:', error);
      alert('Failed to clone tab. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCustomCreate = async () => {
    if (!displayName.trim()) return;
    
    setIsCreating(true);
    try {
      const factory = TabFactory.getInstance();
      
      const options: TabFactoryOptions = {
        name: tabName.trim() || displayName.toLowerCase().replace(/\s+/g, '-'),
        displayName: displayName.trim(),
        description: description.trim(),
        color: selectedColor.value,
        icon: selectedIcon.icon
      };

      const newTab = await factory.createTab(options);
      
      // Create tab instance for the project
      await factory.createTabInstance(newTab, projectId);
      
      onTabCreated(newTab);
      onClose();
      
      // Reset form
      setTabName('');
      setDisplayName('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create tab:', error);
      alert('Failed to create tab. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = displayName.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create New Tab</CardTitle>
              <p className="text-muted-foreground mt-1">
                Clone the Characters tab with your customizations while preserving all functionality
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Choose Creation Method</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${mode === 'template' ? 'border-accent bg-accent/5' : 'hover:border-accent/50'}`}
                onClick={() => setMode('template')}
              >
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h4 className="font-medium">Quick Templates</h4>
                  <p className="text-xs text-muted-foreground mt-1">Pre-configured for common character types</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${mode === 'clone' ? 'border-accent bg-accent/5' : 'hover:border-accent/50'}`}
                onClick={() => setMode('clone')}
              >
                <CardContent className="p-4 text-center">
                  <Copy className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h4 className="font-medium">Clone & Customize</h4>
                  <p className="text-xs text-muted-foreground mt-1">Clone characters tab with visual changes</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${mode === 'create' ? 'border-accent bg-accent/5' : 'hover:border-accent/50'}`}
                onClick={() => setMode('create')}
              >
                <CardContent className="p-4 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h4 className="font-medium">Custom Tab</h4>
                  <p className="text-xs text-muted-foreground mt-1">Build from scratch with full control</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Templates */}
          {mode === 'template' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Template</h3>
              <div className="grid grid-cols-2 gap-4">
                {QUICK_TEMPLATES.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all ${selectedTemplate.id === template.id ? 'border-accent bg-accent/5' : 'hover:border-accent/50'}`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: template.color }}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{template.displayName}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            {template.customFields.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-accent font-medium">+{template.customFields.length} custom fields</p>
                              </div>
                            )}
                          </div>
                          {selectedTemplate.id === template.id && (
                            <Check className="h-5 w-5 text-accent" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name *</label>
                <Input
                  placeholder={mode === 'template' ? selectedTemplate.displayName : "My Characters"}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Internal Name</label>
                <Input
                  placeholder={mode === 'template' ? selectedTemplate.name : "my-characters"}
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Used for internal identification (auto-generated if empty)</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder={mode === 'template' ? selectedTemplate.description : "Describe what this tab will contain..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Visual Customization */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Visual Customization
            </h3>
            
            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Color Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((color) => (
                  <div
                    key={color.value}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      selectedColor.value === color.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_ICONS.map((iconOption) => {
                  const IconComponent = iconOption.icon;
                  return (
                    <div
                      key={iconOption.name}
                      className={`cursor-pointer p-3 rounded-lg border transition-all text-center ${
                        selectedIcon.name === iconOption.name ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedIcon(iconOption)}
                    >
                      <IconComponent className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs font-medium">{iconOption.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold">Preview</h3>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedColor.value }}
                >
                  <selectedIcon.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{displayName || 'Tab Name'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {description || (mode === 'template' ? selectedTemplate.description : 'Tab description')}
                  </p>
                </div>
                <Badge 
                  className="ml-auto"
                  style={{ 
                    backgroundColor: selectedColor.value,
                    color: 'white'
                  }}
                >
                  Custom Tab
                </Badge>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              All original functionality will be preserved in your new tab
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={mode === 'template' ? handleCreateFromTemplate : mode === 'clone' ? handleQuickClone : handleCustomCreate}
                disabled={!isFormValid || isCreating}
                className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/95 hover:via-accent/85 hover:to-accent/75 text-accent-foreground"
              >
                {isCreating ? 'Creating...' : `Create ${displayName || 'Tab'}`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}