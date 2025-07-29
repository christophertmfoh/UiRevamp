import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Search, Check, Crown, Sword, Heart, Shield, BookOpen, 
  Zap, Users, Star, Loader2, Sparkles
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import type { Character } from '@/lib/types';

interface CharacterTemplatesUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  theme: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    border: string;
  };
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
    description: 'A brave hero on a journey of growth and self-discovery',
    category: 'Fantasy',
    icon: Crown,
    traits: ['Brave', 'Determined', 'Loyal', 'Noble'],
    popularity: 95
  },
  {
    id: 'villain',
    name: 'Complex Villain',
    description: 'An antagonist with depth, motivation, and compelling backstory',
    category: 'Universal',
    icon: Sword,
    traits: ['Ambitious', 'Intelligent', 'Ruthless', 'Charismatic'],
    popularity: 92
  },
  {
    id: 'mentor',
    name: 'Wise Mentor',
    description: 'A guide with knowledge, experience, and mysterious past',
    category: 'Universal',
    icon: BookOpen,
    traits: ['Wise', 'Patient', 'Mysterious', 'Protective'],
    popularity: 87
  },
  {
    id: 'rogue',
    name: 'Charming Rogue',
    description: 'A lovable scoundrel with a heart of gold',
    category: 'Fantasy',
    icon: Zap,
    traits: ['Witty', 'Resourceful', 'Charismatic', 'Independent'],
    popularity: 89
  },
  {
    id: 'warrior',
    name: 'Noble Warrior',
    description: 'A fighter with honor, duty, and unwavering principles',
    category: 'Fantasy',
    icon: Shield,
    traits: ['Honorable', 'Strong', 'Disciplined', 'Protective'],
    popularity: 84
  },
  {
    id: 'romantic',
    name: 'Romantic Lead',
    description: 'A character driven by love, passion, and emotional depth',
    category: 'Romance',
    icon: Heart,
    traits: ['Passionate', 'Devoted', 'Sensitive', 'Expressive'],
    popularity: 81
  },
  {
    id: 'sidekick',
    name: 'Loyal Sidekick',
    description: 'A faithful companion who provides support and comic relief',
    category: 'Universal',
    icon: Users,
    traits: ['Loyal', 'Supportive', 'Humorous', 'Dependable'],
    popularity: 78
  },
  {
    id: 'scholar',
    name: 'Brilliant Scholar',
    description: 'An intellectual character driven by knowledge and discovery',
    category: 'Universal',
    icon: BookOpen,
    traits: ['Intelligent', 'Curious', 'Methodical', 'Observant'],
    popularity: 76
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'Universal', label: 'Universal' },
  { id: 'Fantasy', label: 'Fantasy' },
  { id: 'Romance', label: 'Romance' },
  { id: 'SciFi', label: 'Sci-Fi' },
  { id: 'Modern', label: 'Modern' }
];

export function CharacterTemplatesUnified({
  projectId,
  onBack,
  onComplete,
  theme
}: CharacterTemplatesUnifiedProps) {
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
        role: 'Supporting Character'
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
        <div className="text-center space-y-6">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full border-4 animate-spin"
              style={{ 
                borderColor: theme.border,
                borderTopColor: theme.primary
              }}
            />
            <Sparkles 
              className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: theme.primary }}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Creating Your Character</h3>
            <p className="text-gray-600">
              AI is expanding <strong>{selectedTemplate?.name}</strong> into a complete character...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            This usually takes 10-20 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b border-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose a Template</h2>
          <p className="text-gray-600">Select a character archetype and let AI expand it into a complete character</p>
        </div>
      </div>

      {/* Filters Section */}
      <div 
        className="flex-shrink-0 border-b p-6 space-y-4"
        style={{ backgroundColor: theme.background }}
      >
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>
        
        {/* Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "gap-2 transition-all",
                selectedCategory === category.id 
                  ? "text-white" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
              style={{
                ...(selectedCategory === category.id && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary
                })
              }}
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
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className={cn(
                      "group relative cursor-pointer transition-all duration-200 border-2",
                      "hover:shadow-lg hover:-translate-y-1"
                    )}
                    style={{
                      borderColor: theme.border,
                      ['--hover-border' as any]: theme.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border;
                    }}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: theme.background }}
                          >
                            <Icon 
                              className="h-6 w-6" 
                              style={{ color: theme.primary }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-current text-amber-400" />
                          {template.popularity}%
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {template.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {template.traits.map((trait) => (
                            <Badge 
                              key={trait} 
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-700"
                            >
                              {trait}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Use Template</span>
                          <div 
                            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: theme.primary }}
                          >
                            <span className="text-sm font-medium">Generate</span>
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-3">
                <Search className="h-12 w-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No templates match your search criteria. Try adjusting your search or selecting a different category.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}