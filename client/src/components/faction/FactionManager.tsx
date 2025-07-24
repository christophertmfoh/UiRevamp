import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Users } from 'lucide-react';
import type { Project } from '../../lib/types';
import { FactionCard } from './FactionCard';
import { FactionUnifiedView } from './FactionUnifiedView';
import { FactionForm } from './FactionForm';
import { FactionPortraitModal } from './FactionPortraitModal';
import { FactionGenerationModal } from './FactionGenerationModal';

interface Faction {
  id: string;
  projectId: string;
  name: string;
  description: string;
  goals: string;
  methods: string;
  history: string;
  leadership: string;
  resources: string;
  relationships: string;
  imageGallery: any[];
  displayImageId: number | null;
  tags: string[];
}

interface FactionManagerProps {
  project: Project;
}

export function FactionManager({ project }: FactionManagerProps) {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [portraitFaction, setPortraitFaction] = useState<Faction | null>(null);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const queryClient = useQueryClient();

  const { data: factions = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'factions'],
    enabled: !!project?.id,
  });

  const filteredFactions = factions.filter((faction: Faction) =>
    faction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFactionSelect = (faction: Faction) => {
    setSelectedFaction(faction);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedFaction(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateFaction = async (options: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/factions/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error('Failed to generate faction');
      }

      const generatedFaction = await response.json();
      setSelectedFaction(generatedFaction);
      setIsCreating(true);
      setIsGenerationModalOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['/api/projects', project.id, 'factions'] });
    } catch (error) {
      console.error('Error generating faction:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageGenerated = (factionId: string, imageUrl: string) => {
    queryClient.invalidateQueries({ queryKey: ['/api/projects', project.id, 'factions'] });
    
    if (selectedFaction && selectedFaction.id === factionId) {
      setSelectedFaction(prev => prev ? {
        ...prev,
        imageGallery: [...(prev.imageGallery || []), { id: Date.now(), url: imageUrl }]
      } : null);
    }
  };

  const handleImageUploaded = (factionId: string, imageUrl: string) => {
    handleImageGenerated(factionId, imageUrl);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading factions...</div>;
  }

  // If we're creating or editing a faction, show the form
  if (isCreating || selectedFaction) {
    return (
      <FactionUnifiedView
        faction={selectedFaction}
        project={project}
        isCreating={isCreating}
        onBack={() => {
          setSelectedFaction(null);
          setIsCreating(false);
        }}
        onImageRequest={(faction) => {
          setPortraitFaction(faction);
          setIsPortraitModalOpen(true);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Factions</h2>
          <p className="text-muted-foreground">
            {factions.length} {factions.length === 1 ? 'faction' : 'factions'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faction
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Faction
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search factions by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Factions Grid */}
      {filteredFactions.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No factions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first faction to get started'}
          </p>
          {!searchQuery && (
            <div className="flex gap-2 justify-center">
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Faction
              </Button>
              <Button onClick={handleOpenGenerationModal} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Faction
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFactions.map((faction: Faction) => (
            <FactionCard
              key={faction.id}
              faction={faction}
              onClick={() => handleFactionSelect(faction)}
            />
          ))}
        </div>
      )}

      {/* Faction Portrait Modal */}
      {portraitFaction && (
        <FactionPortraitModal
          faction={portraitFaction}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitFaction(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Faction Generation Modal */}
      <FactionGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateFaction}
        isGenerating={isGenerating}
      />
    </div>
  );
}