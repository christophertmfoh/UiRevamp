import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search, Grid, List, Eye, Edit, Trash2 } from 'lucide-react';
import type { Character } from '@/lib/types';
import { CharacterCreationLaunch } from './CharacterCreationLaunch';
import { CharacterTemplates } from './CharacterTemplates';
import { CharacterGenerationModal } from './CharacterGenerationModal';
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';
import { CharacterDetailView } from './CharacterDetailView';
import { apiRequest } from '@/lib/queryClient';

interface CharacterManagerProps {
  projectId: string;
  selectedCharacterId?: string | null;
  onClearSelection: () => void;
  onSelectCharacter?: (character: Character) => void;
}

export function CharacterManager({ projectId, onSelectCharacter }: CharacterManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [portraitCharacter, setPortraitCharacter] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isGuidedCreation, setIsGuidedCreation] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
  });

  const filteredCharacters = characters.filter(character =>
    character.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Character creation handlers
  const handleCreateNew = () => {
    setIsGuidedCreation(true);
    setSelectedCharacter(null);
    setIsDetailViewOpen(true);
  };

  const handleGenerateCharacter = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // TODO: Implement AI character generation
      await handleCreateNew();
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsGenerating(false);
      setIsGenerationModalOpen(false);
    }
  };

  const handleSelectTemplate = async (template: any) => {
    setIsGenerating(true);
    try {
      // TODO: Implement template-based character creation
      await handleCreateNew();
    } catch (error) {
      console.error('Error creating character from template:', error);
    } finally {
      setIsGenerating(false);
      setIsTemplateModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">Characters</h1>
        </div>
        <Button 
          className="interactive-warm hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground group"
          onClick={() => setIsCreationLaunchOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
          Create Character
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharacters.map((character) => (
              <Card 
                key={character.id} 
                className="creative-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-accent/50 cursor-pointer group"
                onClick={() => {
                  setSelectedCharacter(character);
                  setIsGuidedCreation(false);
                  setIsDetailViewOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">{character.name || 'Unnamed Character'}</h3>
                  {character.role && (
                    <p className="text-sm text-muted-foreground mb-2 group-hover:text-accent/80 transition-colors">{character.role}</p>
                  )}
                  {character.physicalDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-3 group-hover:text-muted-foreground/90 transition-colors">
                      {character.physicalDescription}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-lg font-semibold mb-2">No characters yet</h3>
              <p className="text-muted-foreground mb-6">Start building your character roster</p>
              <Button 
                onClick={() => setIsCreationLaunchOpen(true)}
                className="interactive-warm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Character
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CharacterCreationLaunch
        isOpen={isCreationLaunchOpen}
        onClose={() => setIsCreationLaunchOpen(false)}
        onCreateBlank={() => {
          setIsCreationLaunchOpen(false);
          handleCreateNew();
        }}
        onOpenTemplates={() => {
          setIsCreationLaunchOpen(false);
          setIsTemplateModalOpen(true);
        }}
        onOpenAIGeneration={() => {
          setIsCreationLaunchOpen(false);
          setIsGenerationModalOpen(true);
        }}
      />

      <CharacterTemplates
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        isGenerating={isGenerating}
      />

      <CharacterGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateCharacter}
        isGenerating={isGenerating}
      />

      {portraitCharacter && (
        <CharacterPortraitModal
          character={portraitCharacter}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitCharacter(null);
          }}
          onImageGenerated={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
          }}
          onImageUploaded={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
          }}
        />
      )}

      {/* Character Detail View */}
      {isDetailViewOpen && (
        <CharacterDetailView
          projectId={projectId}
          character={selectedCharacter}
          isCreating={!selectedCharacter}
          isGuidedCreation={isGuidedCreation}
          onBack={() => {
            setIsDetailViewOpen(false);
            setSelectedCharacter(null);
            setIsGuidedCreation(false);
          }}
          onEdit={(updatedCharacter) => {
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
            setSelectedCharacter(updatedCharacter);
          }}
          onDelete={(character) => {
            // TODO: Implement delete functionality
            setIsDetailViewOpen(false);
            setSelectedCharacter(null);
            queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
          }}
        />
      )}
    </div>
  );
}