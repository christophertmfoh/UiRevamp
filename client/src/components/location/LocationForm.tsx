import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, Plus, MapPin, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Location form schema matching database schema
const locationFormSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  description: z.string().min(1, 'Description is required'),
  history: z.string().optional(),
  significance: z.string().optional(),
  atmosphere: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type LocationFormData = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  projectId: string;
  onCancel: () => void;
  location?: any;
}

export function LocationForm({ projectId, onCancel, location }: LocationFormProps) {
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: location?.name || '',
      description: location?.description || '',
      history: location?.history || '',
      significance: location?.significance || '',
      atmosphere: location?.atmosphere || '',
      tags: location?.tags || [],
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const endpoint = location 
        ? `/api/locations/${location.id}` 
        : '/api/locations';
      
      const method = location ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          projectId,
          id: location?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save location');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      toast({
        title: location ? 'Location Updated' : 'Location Created',
        description: `${form.getValues('name')} has been ${location ? 'updated' : 'created'} successfully.`,
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${location ? 'update' : 'create'} location. Please try again.`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: LocationFormData) => {
    saveMutation.mutate(data);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues('tags').includes(tagInput.trim())) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={form.handleSubmit(handleSubmit)} 
            disabled={saveMutation.isPending}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : (location ? 'Update Location' : 'Create Location')}
          </Button>
          <Button onClick={onCancel} variant="outline" className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          {/* Basic Information */}
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location name..." {...field} className="creative-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="significance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Significance</FormLabel>
                      <FormControl>
                        <Input placeholder="Why is this place important?" {...field} className="creative-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe this location in detail..."
                        className="creative-input min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>History</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What is this location's past? How was it founded?" {...field} className="creative-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="atmosphere"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atmosphere</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What does it feel like to be here? Mood, energy, vibe..." {...field} className="creative-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>



          {/* Tags */}
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Tags & Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="creative-input"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {form.watch('tags').length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.watch('tags').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  );
}