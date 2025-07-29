import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, X, Search, Sparkles, Crown, Sword, Heart, 
  Shield, BookOpen, Zap, Users, Star, Loader2
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import type { Character } from '@/lib/types';

interface CharacterTemplatesV4Props {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  traits: string[];
  popularity: number;
}

const TEMPLATES: Template[] = [
  {
    id: 'hero',
    name: 'Heroic Protagonist',
    description: 'A brave hero on a journey of growth',
    category: 'fantasy',
    icon: Crown,
    traits: ['brave', 'determined', 'loyal'],
    popularity: 95
  },
  {
    id: 'villain',
    name: 'Complex Villain',
    description: 'An antagonist with depth and motivation',
    category: 'universal',
    icon: Sword,
    traits: ['ambitious', 'intelligent', 'ruthless'],
    popularity: 90
  },
  {
    id: 'mentor',
    name: 'Wise Mentor',
    description: 'A guide with knowledge and experience',
    category: 'universal',
    icon: BookOpen,
    traits: ['wise', 'patient', 'mysterious'],
    popularity: 85
  },
  {
    id: 'rogue',
    name: 'Charming Rogue',
    description: 'A lovable scoundrel with a heart of gold',
    category: 'fantasy',
    icon: Zap,
    traits: ['witty', 'resourceful', 'charismatic'],
    popularity: 88
  },
  {
    id: 'warrior',
    name: 'Noble Warrior',
    description: 'A fighter with honor and purpose',
    category: 'fantasy',
    icon: Shield,
    traits: ['honorable', 'strong', 'disciplined'],
    popularity: 82
  },
  {
    id: 'romantic',
    name: 'Romantic Lead',
    description: 'A character driven by love and passion',
    category: 'romance',
    icon: Heart,
    traits: ['passionate', 'devoted', 'sensitive'],
    popularity: 80
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'universal', label: 'Universal' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'romance', label: 'Romance' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'modern', label: 'Modern' }
];

export function CharacterTemplatesV4({
  projectId,
  onBack,
  onComplete,
  onClose
}: CharacterTemplatesV4Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const templateData = {
        name: template.name,
        description: template.description,
        category: template.category,
        traits: template.traits,
        role: 'supporting'
      };
      return await CharacterCreationService.generateFromTemplate(projectId, templateData);
    },
    onSuccess: (character) => {
      onComplete(character as Character);
    }
  });

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    generateMutation.mutate(template);
  };

  if (generateMutation.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <Sparkles className="h-8 w-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Creating Your Character</h3>
            <p className="text-sm text-muted-foreground">
              AI is expanding {selectedTemplate?.name} into a complete character...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            This usually takes 10-20 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-xl font-semibold">AI Templates</h2>
            <p className="text-sm text-muted-foreground">
              Choose a template and let AI expand it
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Filters */}
      <div className="p-6 border-b space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              {category.label}
              {category.id === 'all' && (
                <Badge variant="secondary" className="ml-1">
                  {TEMPLATES.length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={cn(
                  "group relative p-6 rounded-xl border-2 text-left transition-all",
                  "hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1",
                  "bg-gradient-to-br from-emerald-500/5 to-transparent"
                )}
              >
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    {template.popularity}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {template.traits.map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Use Template</span>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}