import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Zap, User, Eye, BookOpen, Users, PenTool, X } from 'lucide-react';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssist: (selectedCategories: string[]) => void;
  isProcessing: boolean;
}

const AI_CATEGORIES = [
  {
    id: 'identity',
    name: 'Identity',
    icon: User,
    description: 'Basic character info like name, age, race, profession, and background details',
    fields: 16,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'physical',
    name: 'Physical',
    icon: Eye,
    description: 'Appearance details including height, build, facial features, clothing style',
    fields: 26,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'personality',
    name: 'Personality',
    icon: Brain,
    description: 'Character traits, temperament, beliefs, values, likes, dislikes, and habits',
    fields: 20,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'psychology',
    name: 'Psychology',
    icon: Zap,
    description: 'Deep psychological aspects like fears, desires, trauma, coping mechanisms',
    fields: 24,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'background',
    name: 'Background',
    icon: BookOpen,
    description: 'Personal history, family, education, significant life events, and experiences',
    fields: 18,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'social',
    name: 'Social',
    icon: Users,
    description: 'Relationships, social skills, reputation, allies, enemies, and connections',
    fields: 22,
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'story',
    name: 'Story Role',
    icon: PenTool,
    description: 'Narrative function, character arc, themes, symbolism, and story significance',
    fields: 14,
    color: 'from-pink-500 to-pink-600'
  }
];

export function AIAssistModal({ isOpen, onClose, onStartAssist }: AIAssistModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories(AI_CATEGORIES.map(cat => cat.id));
  };

  const handleSelectNone = () => {
    setSelectedCategories([]);
  };

  const handleStartAssist = () => {
    // AI functionality removed - just close the modal
    onStartAssist(selectedCategories);
    onClose();
  };

  const totalFields = AI_CATEGORIES
    .filter(cat => selectedCategories.includes(cat.id))
    .reduce((sum, cat) => sum + cat.fields, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border/30 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">AI Character Assistant</DialogTitle>
            <Badge variant="outline" className="text-xs">
              Coming Soon
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            AI enhancement features are currently being developed. This is a preview of the interface.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* How AI Assist Works */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-3">How AI Assist Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <p className="font-medium">Select Categories</p>
                <p className="text-muted-foreground text-xs mt-1">Choose which aspects of your character to enhance</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <p className="font-medium">AI Analysis</p>
                <p className="text-muted-foreground text-xs mt-1">AI analyzes existing character data for context</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <p className="font-medium">Enhanced Details</p>
                <p className="text-muted-foreground text-xs mt-1">Receive rich, contextual character enhancements</p>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Select Enhancement Categories</h3>
              <div className="flex gap-2">
                <Button onClick={handleSelectAll} variant="outline" size="sm" disabled>
                  Select All
                </Button>
                <Button onClick={handleSelectNone} variant="outline" size="sm" disabled>
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategories.includes(category.id);
                
                return (
                  <div
                    key={category.id}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-not-allowed opacity-50 ${
                      isSelected 
                        ? 'border-accent bg-accent/5' 
                        : 'border-border/30 hover:border-border/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        disabled
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md bg-gradient-to-r ${category.color} text-white`}>
                            <IconComponent className="h-3 w-3" />
                          </div>
                          <h4 className="font-medium text-sm">{category.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {category.fields} fields
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhancement Summary */}
          {selectedCategories.length > 0 && (
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h4 className="font-medium text-accent">Enhancement Preview</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                AI will enhance <strong>{totalFields} fields</strong> across{' '}
                <strong>{selectedCategories.length} categories</strong> to create deeper, 
                more compelling character details that fit seamlessly into your story world.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border/30">
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleStartAssist}
            disabled
            className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Coming Soon
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}