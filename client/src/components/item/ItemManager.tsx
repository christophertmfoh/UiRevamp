import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Item, Project } from '../../lib/types';
import { ItemDetailView } from './ItemDetailView';
import { ItemPortraitModal } from './ItemPortraitModal';
import { ItemGenerationModal, type ItemGenerationOptions } from './ItemGenerationModal';
import { generateContextualItem } from '../../lib/services/itemGeneration';

interface ItemManagerProps {
  projectId: string;
  selectedItemId?: string | null;
  onClearSelection?: () => void;
}

export function ItemManager({ projectId, selectedItemId, onClearSelection }: ItemManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitItem, setPortraitItem] = useState<Item | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ['/api/projects', projectId, 'items'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select item if selectedItemId is provided
  useEffect(() => {
    if (selectedItemId && items.length > 0) {
      const item = items.find(item => item.id === selectedItemId);
      if (item) {
        setSelectedItem(item);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedItemId, items, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => 
      apiRequest('DELETE', `/api/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'items'] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: (item: Item) => 
      apiRequest('PUT', `/api/items/${item.id}`, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'items'] });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (item: Partial<Item>) => {
      console.log('Mutation: Creating item with data:', item);
      const response = await apiRequest('POST', `/api/projects/${projectId}/items`, item);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newItem: Item) => {
      console.log('Item created successfully, setting as selected:', newItem);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'items'] });
      // Open the newly created item in the editor
      setSelectedItem(newItem);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create item:', error);
    }
  });

  const filteredItems = items.filter((item: Item) =>
    (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.role && item.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.race && item.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.occupation && item.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
  };

  const handleDelete = (item: Item) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteMutation.mutate(item.id, {
        onSuccess: () => {
          // Navigate back to the item list after successful deletion
          setSelectedItem(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedItem(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateItem = async (options: ItemGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side item generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/items/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate item');
      }
      
      const generatedItem = await response.json();
      console.log('Generated item data:', generatedItem);
      
      // Create the item with generated data and ensure it has the projectId
      const itemToCreate = {
        ...generatedItem,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedItem.name || `Generated ${options.itemType || 'Item'}`
      };
      
      console.log('Creating item with data:', itemToCreate);
      
      // Create the item - this will automatically open it in the editor on success
      const createdItem = await createItemMutation.mutateAsync(itemToCreate);
      console.log('Item creation completed, created item:', createdItem);
      
      // Explicitly set the item and ensure we're not in creating mode
      setSelectedItem(createdItem);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating item:', error);
      alert(`Failed to generate item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the item list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'items'] });
    setSelectedItem(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (item: Item, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitItem(item);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitItem) {
      updateItemMutation.mutate({ 
        ...portraitItem, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitItem.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitItem) {
      updateItemMutation.mutate({ 
        ...portraitItem, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitItem.portraits || []
      });
    }
  };

  // Show item detail view (which handles both viewing and editing)
  if (selectedItem || isCreating) {
    return (
      <ItemDetailView
        projectId={projectId}
        item={selectedItem}
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
          <h2 className="font-title text-2xl">Items</h2>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Item
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Item List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {items.length === 0 ? 'No Items Created' : 'No Items Found'}
          </h3>
          <p className="mb-6">
            {items.length === 0 
              ? 'Start building your cast of items to bring your world to life.'
              : 'Try adjusting your search terms to find the item you\'re looking for.'
            }
          </p>
          {items.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item: Item) => (
            <Card 
              key={item.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Item Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(item, e)}
                  >
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
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

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{item.name || 'Unnamed Item'}</h3>
                        {item.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{item.title}"</p>
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
                              handleEdit(item);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
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
                      {item.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {item.role}
                        </Badge>
                      )}
                      {item.class && (
                        <Badge variant="outline" className="text-xs">
                          {item.class}
                        </Badge>
                      )}
                      {item.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {item.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {item.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{item.oneLine}"
                      </p>
                    )}
                    
                    {item.description && !item.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Item Portrait Modal */}
      {portraitItem && (
        <ItemPortraitModal
          item={portraitItem}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitItem(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Item Generation Modal */}
      <ItemGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateItem}
        isGenerating={isGenerating}
      />
    </div>
  );
}
