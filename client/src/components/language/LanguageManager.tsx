import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Language, Project } from '../../lib/types';
import { LanguageDetailView } from './LanguageDetailView';
import { LanguagePortraitModal } from './LanguagePortraitModal';
import { LanguageGenerationModal, type LanguageGenerationOptions } from './LanguageGenerationModal';
import { generateContextualLanguage } from '../../lib/services/languageGeneration';

interface LanguageManagerProps {
  projectId: string;
  selectedLanguageId?: string | null;
  onClearSelection?: () => void;
}

export function LanguageManager({ projectId, selectedLanguageId, onClearSelection }: LanguageManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitLanguage, setPortraitLanguage] = useState<Language | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: languages = [], isLoading } = useQuery<Language[]>({
    queryKey: ['/api/projects', projectId, 'languages'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select language if selectedLanguageId is provided
  useEffect(() => {
    if (selectedLanguageId && languages.length > 0) {
      const language = languages.find(c => c.id === selectedLanguageId);
      if (language) {
        setSelectedLanguage(language);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedLanguageId, languages, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (languageId: string) => 
      apiRequest('DELETE', `/api/languages/${languageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
    },
  });

  const updateLanguageMutation = useMutation({
    mutationFn: (language: Language) => 
      apiRequest('PUT', `/api/languages/${language.id}`, language),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
    },
  });

  const createLanguageMutation = useMutation({
    mutationFn: async (language: Partial<Language>) => {
      console.log('Mutation: Creating language with data:', language);
      const response = await apiRequest('POST', `/api/projects/${projectId}/languages`, language);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newLanguage: Language) => {
      console.log('Language created successfully, setting as selected:', newLanguage);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
      // Open the newly created language in the editor
      setSelectedLanguage(newLanguage);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create language:', error);
    }
  });

  const filteredLanguages = languages.filter((language: Language) =>
    (language.name && language.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (language.role && language.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (language.race && language.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (language.occupation && language.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleDelete = (language: Language) => {
    if (confirm(`Are you sure you want to delete ${language.name}?`)) {
      deleteMutation.mutate(language.id, {
        onSuccess: () => {
          // Navigate back to the language list after successful deletion
          setSelectedLanguage(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedLanguage(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateLanguage = async (options: LanguageGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side language generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/languages/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate language');
      }
      
      const generatedLanguage = await response.json();
      console.log('Generated language data:', generatedLanguage);
      
      // Create the language with generated data and ensure it has the projectId
      const languageToCreate = {
        ...generatedLanguage,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedLanguage.name || `Generated ${options.languageType || 'Language'}`
      };
      
      console.log('Creating language with data:', languageToCreate);
      
      // Create the language - this will automatically open it in the editor on success
      const createdLanguage = await createLanguageMutation.mutateAsync(languageToCreate);
      console.log('Language creation completed, created language:', createdLanguage);
      
      // Explicitly set the language and ensure we're not in creating mode
      setSelectedLanguage(createdLanguage);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating language:', error);
      alert(`Failed to generate language: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the language list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
    setSelectedLanguage(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (language: Language, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitLanguage(language);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitLanguage) {
      updateLanguageMutation.mutate({ 
        ...portraitLanguage, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitLanguage.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitLanguage) {
      updateLanguageMutation.mutate({ 
        ...portraitLanguage, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitLanguage.portraits || []
      });
    }
  };

  // Show language detail view (which handles both viewing and editing)
  if (selectedLanguage || isCreating) {
    return (
      <LanguageDetailView
        projectId={projectId}
        language={selectedLanguage}
        isCreating={isCreating}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Languages</h2>
          <p className="text-muted-foreground">
            {languages.length} {languages.length === 1 ? 'language' : 'languages'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Language
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search languages by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Language List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading languages...</p>
        </div>
      ) : filteredLanguages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {languages.length === 0 ? 'No Languages Created' : 'No Languages Found'}
          </h3>
          <p className="mb-6">
            {languages.length === 0 
              ? 'Start building your cast of languages to bring your world to life.'
              : 'Try adjusting your search terms to find the language you\'re looking for.'
            }
          </p>
          {languages.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Language
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLanguages.map((language: Language) => (
            <Card 
              key={language.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(language)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Language Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(language, e)}
                  >
                    {language.imageUrl ? (
                      <img 
                        src={language.imageUrl} 
                        alt={language.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Edit className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Language Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{language.name || 'Unnamed Language'}</h3>
                        {language.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{language.title}"</p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(language);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(language);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges - same as header */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {language.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {language.role}
                        </Badge>
                      )}
                      {language.class && (
                        <Badge variant="outline" className="text-xs">
                          {language.class}
                        </Badge>
                      )}
                      {language.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {language.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {language.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{language.oneLine}"
                      </p>
                    )}
                    
                    {language.description && !language.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {language.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Language Portrait Modal */}
      {portraitLanguage && (
        <LanguagePortraitModal
          language={portraitLanguage}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitLanguage(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Language Generation Modal */}
      <LanguageGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateLanguage}
        isGenerating={isGenerating}
      />
    </div>
  );
}
