import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Zap, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character, Project } from '@/lib/types';
import { CharacterDetailView } from './CharacterDetailView';
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';
// REMOVED: Legacy CharacterGenerationModal - replaced by CharacterWizardUnified
// REMOVED: Legacy CharacterTemplates - replaced by CharacterTemplatesUnified
import CharacterWizardUnified from './CharacterWizardUnified';
// REMOVED: Legacy CharacterTemplatesV2 - never opened, dead code
// REMOVED: Legacy CharacterDocumentUpload - replaced by CharacterDocumentUploadUnified
import { CharacterCreationService } from '@/lib/services/characterCreationService';

interface CharacterManagerProps {
  projectId: string;
  selectedCharacterId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited' | 'by-completion' | 'by-role' | 'by-race' | 'protagonists-first' | 'antagonists-first' | 'by-development-level' | 'by-relationship-count' | 'by-trait-complexity' | 'by-narrative-importance';
type ViewMode = 'grid' | 'list';

export function CharacterManager({ projectId, selectedCharacterId, onClearSelection }: CharacterManagerProps) {
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recently-added');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGuidedCreation, setIsGuidedCreation] = useState(false);
  const [shouldStartInEditMode, setShouldStartInEditMode] = useState(false);
  const [isV2WizardOpen, setIsV2WizardOpen] = useState(false);
  // REMOVED: Dead state - isV2TemplatesOpen (CharacterTemplatesV2 never opened)
  const [portraitCharacter, setPortraitCharacter] = useState<Character | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  // REMOVED: Dead state - isTemplateModalOpen (CharacterTemplates modal removed)
  // Removed isCreationLaunchOpen - using V3 wizard for all creation
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [newCharacterData, setNewCharacterData] = useState<Partial<Character>>({});
  const queryClient = useQueryClient();

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  // Auto-select character if selectedCharacterId is provided
  useEffect(() => {
    if (selectedCharacterId && characters.length > 0) {
      const character = characters.find(c => c.id === selectedCharacterId);
      if (character) {
        setSelectedCharacter(character);
        setIsCreating(false);
        onClearSelection?.();
      }
    }
  }, [selectedCharacterId, characters, onClearSelection]);

  // Persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem('characterViewMode', viewMode);
  }, [viewMode]);

  const deleteMutation = useMutation({
    mutationFn: (characterId: string) => 
      apiRequest('DELETE', `/api/characters/${characterId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (characterIds: string[]) => {
      console.log('🗑️ Bulk deleting characters:', characterIds);
      
      // Use the correct project-based endpoint for each character
      const deletePromises = characterIds.map(async (id) => {
        try {
          const response = await apiRequest('DELETE', `/api/characters/${id}`);
          console.log(`✅ Deleted character ${id}`);
          return response;
        } catch (error) {
          console.error(`❌ Failed to delete character ${id}:`, error);
          throw error;
        }
      });
      
      await Promise.all(deletePromises);
      console.log('✅ All characters deleted successfully');
    },
    onSuccess: () => {
      console.log('🔄 Refreshing character list after bulk delete');
      
      // Use the correct query key that matches the useQuery
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      
      // Clear selection and exit selection mode
      setSelectedCharacterIds(new Set());
      setIsSelectionMode(false);
      
      console.log('✅ Bulk delete completed - returned to view mode');
    },
    onError: (error) => {
      console.error('❌ Bulk delete failed:', error);
      alert(`Failed to delete characters: ${error.message || 'Unknown error'}`);
    },
  });

  const updateCharacterMutation = useMutation({
    mutationFn: (character: Character) => 
      apiRequest('PUT', `/api/characters/${character.id}`, character),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
  });

  const createCharacterMutation = useMutation({
    mutationFn: async (character: Partial<Character>) => {
      console.log('Mutation: Creating character with data:', character);
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, character);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newCharacter: Character) => {
      console.log('Character created successfully, setting as selected:', newCharacter);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setSelectedCharacter(newCharacter);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create character:', error);
    }
  });

  // Calculate character completion percentage based on all editor fields
  const getCompletionPercentage = (character: Character): number => {
    if (!character) return 0;
    
    // Define all character fields organized by category (matching the actual character schema)
    const identityFields = [
      'name', 'nicknames', 'title', 'aliases', 'race', 'class', 'age', 'role',
      'gender', 'profession', 'occupation', 'birthdate', 'zodiacSign'
    ];
    
    const appearanceFields = [
      'physicalDescription', 'height', 'weight', 'build', 'eyeColor', 'hairColor', 
      'hairStyle', 'skinTone', 'distinguishingMarks', 'clothingStyle', 'posture',
      'gait', 'gestures', 'mannerisms', 'imageUrl'
    ];
    
    const personalityFields = [
      'personalityOverview', 'personality', 'personalityTraits', 'temperament', 'worldview',
      'values', 'goals', 'motivations', 'fears', 'desires', 'vices', 'habits', 'quirks'
    ];
    
    const abilitiesFields = [
      'coreAbilities', 'skills', 'talents', 'specialAbilities', 'powers', 'strengths',
      'weaknesses', 'training'
    ];
    
    const backgroundFields = [
      'backstory', 'background', 'childhood', 'familyHistory', 'education', 
      'formativeEvents', 'socialClass', 'spokenLanguages'
    ];
    
    const relationshipsFields = [
      'family', 'friends', 'allies', 'enemies', 'rivals', 'mentors', 
      'relationships', 'socialCircle'
    ];
    
    const metaFields = [
      'storyFunction', 'personalTheme', 'symbolism', 'inspiration', 'archetypes', 
      'notes', 'description', 'oneLine'
    ];
    
    // Count filled fields in each category
    const countFilledFields = (fields: string[]) => {
      return fields.reduce((count, field) => {
        const value = (character as any)[field];
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string') {
            return count + (value.trim().length > 0 ? 1 : 0);
          } else if (Array.isArray(value)) {
            return count + (value.length > 0 ? 1 : 0);
          } else {
            return count + 1;
          }
        }
        return count;
      }, 0);
    };
    
    const identityCount = countFilledFields(identityFields);
    const appearanceCount = countFilledFields(appearanceFields);
    const personalityCount = countFilledFields(personalityFields);
    const abilitiesCount = countFilledFields(abilitiesFields);
    const backgroundCount = countFilledFields(backgroundFields);
    const relationshipsCount = countFilledFields(relationshipsFields);
    const metaCount = countFilledFields(metaFields);
    
    const totalFields = identityFields.length + appearanceFields.length + personalityFields.length + 
                       abilitiesFields.length + backgroundFields.length + relationshipsFields.length + metaFields.length;
    const totalFilled = identityCount + appearanceCount + personalityCount + abilitiesCount + 
                       backgroundCount + relationshipsCount + metaCount;
    
    // Debug logging for the new character
    if (character.name === 'Borin Stonehand') {
      console.log('Progress calculation for Borin Stonehand:', {
        identityCount, appearanceCount, personalityCount, abilitiesCount,
        backgroundCount, relationshipsCount, metaCount,
        totalFields, totalFilled,
        percentage: Math.round((totalFilled / totalFields) * 100)
      });
    }
    
    return Math.max(1, Math.round((totalFilled / totalFields) * 100));
  };

  // Sort and filter characters
  const sortCharacters = (chars: Character[]): Character[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...chars].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...chars].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...chars].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'by-role':
        return [...chars].sort((a, b) => (a.role || 'Character').localeCompare(b.role || 'Character'));
      case 'by-race':
        return [...chars].sort((a, b) => (a.race || 'Unknown').localeCompare(b.race || 'Unknown'));
      case 'by-development-level':
        return [...chars].sort((a, b) => {
          const getDevLevel = (char: Character) => {
            let score = 0;
            if (char.background) score += 25;
            if (char.goals) score += 20;
            if (char.motivations) score += 20;
            if (char.personalityTraits?.length) score += 15;
            if (char.relationships) score += 10;
            if (char.description) score += 10;
            return score;
          };
          return getDevLevel(b) - getDevLevel(a);
        });
      case 'by-relationship-count':
        return [...chars].sort((a, b) => {
          const relationshipA = (Array.isArray(a.relationships) ? a.relationships.length : 0) + (Array.isArray(a.family) ? a.family.length : 0);
          const relationshipB = (Array.isArray(b.relationships) ? b.relationships.length : 0) + (Array.isArray(b.family) ? b.family.length : 0);
          return relationshipB - relationshipA;
        });
      case 'by-trait-complexity':
        return [...chars].sort((a, b) => {
          const complexityA = (a.personalityTraits?.length || 0) + (a.abilities?.length || 0) + (a.skills?.length || 0);
          const complexityB = (b.personalityTraits?.length || 0) + (b.abilities?.length || 0) + (b.skills?.length || 0);
          return complexityB - complexityA;
        });
      case 'by-narrative-importance':
        return [...chars].sort((a, b) => {
          const getImportance = (char: Character) => {
            const role = char.role?.toLowerCase() || '';
            if (role.includes('protagonist') || role.includes('main')) return 100;
            if (role.includes('antagonist') || role.includes('villain')) return 90;
            if (role.includes('deuteragonist') || role.includes('secondary')) return 80;
            if (role.includes('supporting') || role.includes('ally')) return 70;
            if (role.includes('mentor') || role.includes('guide')) return 60;
            if (role.includes('minor') || role.includes('background')) return 30;
            return 50; // Default for unspecified roles
          };
          return getImportance(b) - getImportance(a);
        });
      case 'by-completion':
        return [...chars].sort((a, b) => getCompletionPercentage(b) - getCompletionPercentage(a)); // Most complete first
      case 'protagonists-first':
        return [...chars].sort((a, b) => {
          const roleA = a.role?.toLowerCase() || '';
          const roleB = b.role?.toLowerCase() || '';
          const isProtagonistA = roleA.includes('protagonist') || roleA.includes('hero') || roleA.includes('main');
          const isProtagonistB = roleB.includes('protagonist') || roleB.includes('hero') || roleB.includes('main');
          if (isProtagonistA && !isProtagonistB) return -1;
          if (!isProtagonistA && isProtagonistB) return 1;
          return (a.name || '').localeCompare(b.name || '');
        });
      case 'antagonists-first':
        return [...chars].sort((a, b) => {
          const roleA = a.role?.toLowerCase() || '';
          const roleB = b.role?.toLowerCase() || '';
          const isAntagonistA = roleA.includes('villain') || roleA.includes('antagonist') || roleA.includes('enemy');
          const isAntagonistB = roleB.includes('villain') || roleB.includes('antagonist') || roleB.includes('enemy');
          if (isAntagonistA && !isAntagonistB) return -1;
          if (!isAntagonistA && isAntagonistB) return 1;
          return (a.name || '').localeCompare(b.name || '');
        });
      default:
        return chars;
    }
  };

  const filteredCharacters = sortCharacters(
    characters.filter(character => 
      character.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.race?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (character: Character) => {
    setSelectedCharacter(character);
    setIsCreating(false);
    setIsGuidedCreation(false);
    setShouldStartInEditMode(false);
  };

  const handleEditFromList = (character: Character) => {
    setSelectedCharacter(character);
    setIsCreating(false);
    setIsGuidedCreation(false);
    setShouldStartInEditMode(true);
  };

  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete ${character.name}?`)) {
      deleteMutation.mutate(character.id, {
        onSuccess: () => {
          setSelectedCharacter(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleBulkDelete = () => {
    const count = selectedCharacterIds.size;
    if (count === 0) return;
    
    const characterNames = Array.from(selectedCharacterIds)
      .map(id => characters.find(c => c.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
    
    const displayText = count > 3 
      ? `${characterNames} and ${count - 3} others`
      : characterNames;
    
    if (window.confirm(`Are you sure you want to delete ${count} character${count > 1 ? 's' : ''}?\n\n${displayText}`)) {
      bulkDeleteMutation.mutate(Array.from(selectedCharacterIds));
    }
  };

  const handleIndividualDelete = (character: Character, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    if (window.confirm(`Are you sure you want to delete "${character.name}"?\n\nThis action cannot be undone.`)) {
      console.log('🗑️ Deleting individual character:', character.id);
      bulkDeleteMutation.mutate([character.id]);
    }
  };

  const handleSelectCharacter = (characterId: string, selected: boolean) => {
    console.log(`🔲 Character selection: ${characterId} -> ${selected ? 'selected' : 'deselected'}`);
    const newSelected = new Set(selectedCharacterIds);
    if (selected) {
      newSelected.add(characterId);
    } else {
      newSelected.delete(characterId);
    }
    setSelectedCharacterIds(newSelected);
    console.log(`🔲 Total selected: ${newSelected.size} characters`);
  };

  const handleSelectAll = () => {
    if (selectedCharacterIds.size === filteredCharacters.length) {
      setSelectedCharacterIds(new Set());
    } else {
      setSelectedCharacterIds(new Set(filteredCharacters.map(c => c.id)));
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedCharacterIds(new Set());
    }
  };

  const handleCreateNew = () => {
            // Removed - using V3 wizard
    setIsCreating(true);
    setIsGuidedCreation(true);
    setSelectedCharacter(null);
  };

  const handleDocumentParseComplete = async (characterData: any) => {
    try {
      setIsGenerating(true);
      console.log('Document imported successfully:', characterData);
      
      // Refresh the characters list to show the new character
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      
      // Navigate to the new character
      setSelectedCharacter(characterData);
      setIsCreating(false);
      setIsDocumentUploadOpen(false);
      
    } catch (error) {
      console.error('Failed to handle document import:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleSelectTemplate = async (template: any) => {
    setIsGenerating(true);
    
    try {
      console.log('Starting template-based character creation with automatic portrait generation');
      
      // Use the comprehensive service for template-based creation with automatic portrait generation
      const createdCharacter = await CharacterCreationService.completeCharacterCreation(
        projectId,
        'template',
        template
      );
      
      console.log('Template-based character creation completed with portrait:', createdCharacter);
      
      // Navigate to the new character
      setSelectedCharacter(createdCharacter);
      setIsCreating(false);
      // REMOVED: setIsTemplateModalOpen(false) - dead code
      
    } catch (error) {
      console.error('Failed to create character from template:', error);
      alert(`Failed to generate template character: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async (generationOptions: CharacterGenerationOptions) => {
    setIsGenerating(true);
    
    try {
      console.log('Starting custom AI character generation with automatic portrait generation');
      
      // Use the comprehensive service for custom AI generation with automatic portrait generation
      const createdCharacter = await CharacterCreationService.completeCharacterCreation(
        projectId,
        'custom',
        generationOptions
      );
      
      console.log('Custom AI character creation completed with portrait:', createdCharacter);
      
      setSelectedCharacter(createdCharacter);
      setIsCreating(false);
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating character:', error);
      alert(`Failed to generate character: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    setSelectedCharacter(null);
    setIsCreating(false);
    setIsGuidedCreation(false);
    setShouldStartInEditMode(false);
  };

  const handlePortraitClick = (character: Character, event: React.MouseEvent) => {
    event.stopPropagation();
    setPortraitCharacter(character);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitCharacter) {
      updateCharacterMutation.mutate({ 
        ...portraitCharacter, 
        imageUrl,
        portraits: portraitCharacter.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitCharacter) {
      updateCharacterMutation.mutate({ 
        ...portraitCharacter, 
        imageUrl,
        portraits: portraitCharacter.portraits || []
      });
    }
  };

  // Character detail view
  if (selectedCharacter || isCreating) {
    return (
      <CharacterDetailView
        projectId={projectId}
        character={selectedCharacter}
        isCreating={isCreating}
        isGuidedCreation={isGuidedCreation}
        initialEditMode={shouldStartInEditMode}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Premium Character Card for Grid View
  const CharacterCard = ({ character }: { character: Character }) => (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border overflow-hidden relative ${
      isSelectionMode 
        ? selectedCharacterIds.has(character.id)
          ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-lg' 
          : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
        : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
    }`} 
          onClick={() => {
            if (isSelectionMode) {
              handleSelectCharacter(character.id, !selectedCharacterIds.has(character.id));
            } else {
              setSelectedCharacter(character);
            }
          }}>
      <CardContent className="p-0 relative">
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              selectedCharacterIds.has(character.id)
                ? 'bg-accent border-accent text-accent-foreground'
                : 'bg-background/80 border-border hover:border-[var(--accent)]'
            }`}>
              {selectedCharacterIds.has(character.id) && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        )}
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        
        {/* Character Image Header */}
        <div 
          className="relative h-64 bg-gradient-to-br from-[var(--accent)]/5 via-muted/20 to-[var(--accent)]/10 overflow-hidden cursor-pointer group/image"
          onClick={(e) => handlePortraitClick(character, e)}
        >
          {character.imageUrl ? (
            <>
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover/image:brightness-75"
              />
              {/* Image Overlay for Better Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Camera overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Camera className="h-8 w-8 text-accent-foreground" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 to-muted/30 group-hover/image:bg-gradient-to-br group-hover/image:from-[var(--accent)]/20 group-hover/image:to-muted/40 transition-all duration-200">
              <div className="w-20 h-20 bg-[var(--accent)]/20 rounded-full flex items-center justify-center group-hover/image:bg-[var(--accent)]/30 transition-all duration-200">
                <Camera className="h-10 w-10 text-[var(--accent)]/60 group-hover/image:text-[var(--accent)]/80 group-hover/image:scale-110 transition-all duration-200" />
              </div>
            </div>
          )}
          

          



        </div>

        {/* Premium Character Info */}
        <div className="p-6 space-y-4 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl group-hover:text-[var(--accent)] transition-colors truncate leading-tight">
                {character.name}
              </h3>
              <Badge className="bg-[var(--accent)] text-[white] font-medium text-xs px-2 py-1 shadow-md border-0 rounded-full">
                Character
              </Badge>
            </div>
            {character.title && (
              <p className="text-[var(--accent)]/80 text-sm font-medium truncate mb-3">
                "{character.title}"
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {character.race && (
                <Badge variant="outline" className="text-xs bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]/80 hover:bg-[var(--accent)]/10 transition-colors font-medium">
                  {character.race}
                </Badge>
              )}
              {character.class && (
                <Badge variant="outline" className="text-xs bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]/80 hover:bg-[var(--accent)]/10 transition-colors font-medium">
                  {character.class}
                </Badge>
              )}
              {character.age && (
                <Badge variant="outline" className="text-xs bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]/80 hover:bg-[var(--accent)]/10 transition-colors font-medium">
                  Age {character.age}
                </Badge>
              )}
            </div>
          </div>

          {!character.description && (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground italic">
                Click to add character details...
              </p>
            </div>
          )}

          {/* Premium Key Traits */}
          {character.personalityTraits && character.personalityTraits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {character.personalityTraits.slice(0, 3).map((trait, index) => (
                <span key={index} className="text-xs px-3 py-1.5 bg-[var(--accent)]/15 text-[var(--accent)] rounded-full font-semibold border border-[var(--accent)]/20">
                  {trait}
                </span>
              ))}
              {character.personalityTraits.length > 3 && (
                <span className="text-xs px-3 py-1.5 bg-muted/40 rounded-full text-muted-foreground font-semibold border border-muted/40">
                  +{character.personalityTraits.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Character Completeness Indicator */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 transition-all duration-300"
                    style={{
                      width: `${getCompletionPercentage(character)}%`
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {getCompletionPercentage(character)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Premium List View Item
  const CharacterListItem = ({ character }: { character: Character }) => (
    <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] border relative overflow-hidden ${
      isSelectionMode 
        ? selectedCharacterIds.has(character.id)
          ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-lg'
          : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-r from-background via-background/95 to-[var(--accent)]/5'
        : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-r from-background via-background/95 to-[var(--accent)]/5'
    }`}
          onClick={() => {
            if (isSelectionMode) {
              handleSelectCharacter(character.id, !selectedCharacterIds.has(character.id));
            } else {
              setSelectedCharacter(character);
            }
          }}>
      <CardContent className="p-5 relative">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/3 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        <div className="flex items-center gap-5 relative">
          {/* Selection Checkbox */}
          {isSelectionMode && (
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              selectedCharacterIds.has(character.id)
                ? 'bg-accent border-accent text-accent-foreground'
                : 'bg-background border-border hover:border-[var(--accent)]'
            }`}>
              {selectedCharacterIds.has(character.id) && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
          {/* Premium Avatar */}
          <div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 via-muted/20 to-[var(--accent)]/15 flex items-center justify-center flex-shrink-0 border border-[var(--accent)]/20 shadow-md group-hover:shadow-lg transition-shadow duration-200 cursor-pointer group/avatar relative"
            onClick={(e) => handlePortraitClick(character, e)}
          >
            {character.imageUrl ? (
              <>
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-105 group-hover/avatar:brightness-75"
                />
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera className="h-4 w-4 text-accent-foreground" />
                </div>
              </>
            ) : (
              <div className="w-10 h-10 bg-[var(--accent)]/20 rounded-full flex items-center justify-center group-hover/avatar:bg-[var(--accent)]/30 transition-all duration-200">
                <Camera className="h-6 w-6 text-[var(--accent)]/70 group-hover/avatar:text-[var(--accent)]/90 group-hover/avatar:scale-110 transition-all duration-200" />
              </div>
            )}
          </div>

          {/* Premium Character Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-xl group-hover:text-[var(--accent)] transition-colors truncate">
                {character.name}
              </h3>
              {character.title && (
                <span className="text-[var(--accent)]/70 text-sm font-medium italic">"{character.title}"</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="text-xs bg-accent text-accent-foreground font-medium shadow-sm">
                Character
              </Badge>
              {character.race && (
                <Badge variant="outline" className="text-xs bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]/80 hover:bg-[var(--accent)]/10 transition-colors font-medium">
                  {character.race}
                </Badge>
              )}
              {character.class && (
                <Badge variant="outline" className="text-xs bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]/80 hover:bg-[var(--accent)]/10 transition-colors font-medium">
                  {character.class}
                </Badge>
              )}
              {character.age && (
                <Badge variant="outline" className="text-xs bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]/80 hover:bg-[var(--accent)]/10 transition-colors font-medium">
                  Age {character.age}
                </Badge>
              )}
            </div>

            {/* Enhanced Description or Call to Action */}
            {character.description ? (
              <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed font-medium">
                {character.description}
              </p>
            ) : (
              <p className="text-sm text-[var(--accent)]/60 italic font-medium">
                Ready to develop • Click to add details and bring them to life
              </p>
            )}

            {/* Character Completeness Mini-Indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1 flex-1 bg-muted/30 rounded-full overflow-hidden max-w-32">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 transition-all duration-300"
                  style={{
                    width: `${getCompletionPercentage(character)}%`
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {getCompletionPercentage(character)}%
              </span>
            </div>
          </div>

          {/* Quick Actions - Hidden in selection mode */}
          {!isSelectionMode && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors rounded-xl"
                      onClick={(e) => { e.stopPropagation(); handleEditFromList(character); }}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-xl"
                      onClick={(e) => handleIndividualDelete(character, e)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Characters
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-muted-foreground">
                {characters.length} {characters.length === 1 ? 'character' : 'characters'} in your world
              </span>
              {filteredCharacters.length !== characters.length && (
                <span className="text-sm text-[var(--accent)]">
                  ({filteredCharacters.length} visible)
                </span>
              )}
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsV2WizardOpen(true)} 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="p-1 bg-white/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="font-semibold tracking-wide">Create Character</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters by name, role, or race..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-accent/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Selection Mode Toggle */}
            <Button
              variant={isSelectionMode ? "default" : "outline"}
              size="sm"
              onClick={toggleSelectionMode}
              className="h-9"
            >
              {isSelectionMode ? 'Cancel Select' : 'Select'}
            </Button>

            {/* Bulk Actions - Only show in selection mode */}
            {isSelectionMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-9"
                  disabled={filteredCharacters.length === 0}
                >
                  {selectedCharacterIds.size === filteredCharacters.length ? 'Deselect All' : `Select All (${filteredCharacters.length})`}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedCharacterIds.size === 0 || bulkDeleteMutation.isPending}
                  className="h-9"
                >
                  {bulkDeleteMutation.isPending ? 'Deleting...' : `Delete Selected (${selectedCharacterIds.size})`}
                </Button>
              </>
            )}

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                  Alphabetical Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('recently-added')}>
                  Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('recently-edited')}>
                  Recently Edited
                </DropdownMenuItem>
                <hr className="my-1" />
                <DropdownMenuItem onClick={() => setSortBy('by-completion')}>
                  Completion Level
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('by-role')}>
                  Story Role
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('by-race')}>
                  Race/Species
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('by-development-level')}>
                  Character Development
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('by-trait-complexity')}>
                  Trait Complexity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('by-relationship-count')}>
                  Relationship Depth
                </DropdownMenuItem>
                <hr className="my-1" />
                <DropdownMenuItem onClick={() => setSortBy('by-narrative-importance')}>
                  Narrative Importance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('protagonists-first')}>
                  Protagonists First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('antagonists-first')}>
                  Antagonists First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border/50 rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Characters Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground">Loading characters...</p>
          </div>
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Users className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {characters.length === 0 ? 'No characters yet' : 'No characters match your search'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {characters.length === 0 
                ? 'Create your first character to start building your story world.'
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
          {characters.length === 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <Button 
                onClick={() => setIsV2WizardOpen(true)} 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-white/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create First Character</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-3"
        }>
          {filteredCharacters.map((character) => 
            viewMode === 'grid' ? (
              <CharacterCard key={character.id} character={character} />
            ) : (
              <CharacterListItem key={character.id} character={character} />
            )
          )}
        </div>
      )}

      {/* REMOVED OLD CHARACTER CREATION WIZARD - Using V3 for all creation */}

      {/* Portrait Modal - Keep this for editing existing characters */}
      {portraitCharacter && (
        <CharacterPortraitModal
          character={portraitCharacter}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitCharacter(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Unified Character Creation Wizard - Primary Creation Method */}
      <CharacterWizardUnified
        isOpen={isV2WizardOpen}
        onClose={() => setIsV2WizardOpen(false)}
        projectId={projectId}
        onComplete={(newCharacter) => {
          setSelectedCharacter(newCharacter);
          setIsV2WizardOpen(false);
          // Force update to show the character card view
          queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/characters`] });
        }}
      />

      {/* REMOVED: Dead code - CharacterTemplatesV2 was never opened */}

      {/* REMOVED: Legacy CharacterTemplates modal - replaced by CharacterWizardUnified */}
    </div>
  );
}