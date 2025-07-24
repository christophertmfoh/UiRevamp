import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Item } from '@/lib/types';

interface ItemFormProps {
  projectId: string;
  onCancel: () => void;
  item?: Item;
}

export function ItemForm({ projectId, onCancel, item }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    history: item?.history || '',
    powers: item?.powers || '',
    significance: item?.significance || '',
    tags: item?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (itemData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/items`, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'items'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (itemData: any) => 
      apiRequest('PUT', `/api/items/${item?.id}`, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'items'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      name: formData.name,
      description: formData.description,
      history: formData.history,
      powers: formData.powers,
      significance: formData.significance,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (item) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Item'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {item ? 'Edit Item' : 'Create New Item'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                placeholder="Enter item name..."
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the item..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="history">History</Label>
              <Textarea
                id="history"
                value={formData.history}
                onChange={(e) => updateField('history', e.target.value)}
                placeholder="Historical background of the item..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="powers">Powers</Label>
              <Textarea
                id="powers"
                value={formData.powers}
                onChange={(e) => updateField('powers', e.target.value)}
                placeholder="Special powers or abilities of the item..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="significance">Significance</Label>
              <Textarea
                id="significance"
                value={formData.significance}
                onChange={(e) => updateField('significance', e.target.value)}
                placeholder="Why is this item important to your story..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="Enter tags separated by commas..."
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}