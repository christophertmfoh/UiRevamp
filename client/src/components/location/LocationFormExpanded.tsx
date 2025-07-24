import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Sparkles, Image } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Location } from '../../lib/types';

const locationFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  history: z.string().optional(),
  significance: z.string().optional(),
  atmosphere: z.string().optional(),
  tags: z.string().optional(),
});

type LocationFormData = z.infer<typeof locationFormSchema>;

interface LocationFormExpandedProps {
  projectId: string;
  location?: Location;
  onCancel: () => void;
}

export function LocationFormExpanded({ projectId, location, onCancel }: LocationFormExpandedProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: location?.name || '',
      description: location?.description || '',
      history: location?.history || '',
      significance: location?.significance || '',
      atmosphere: location?.atmosphere || '',
      tags: location?.tags?.join(', ') || '',
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const locationData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        projectId,
      };

      if (location?.id) {
        return apiRequest('PUT', `/api/locations/${location.id}`, locationData);
      } else {
        return apiRequest('POST', `/api/projects/${projectId}/locations`, locationData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      onCancel(); // Return to list view
    },
    onError: (error) => {
      console.error('Failed to save location:', error);
    },
  });

  const onSubmit = (data: LocationFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="interactive-warm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Locations
          </Button>
          <div>
            <h1 className="font-title text-2xl">
              {location ? 'Edit Location' : 'New Location'}
            </h1>
            <p className="text-muted-foreground">
              {location ? 'Update location details' : 'Create a new location for your story'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            form="location-form"
            disabled={saveMutation.isPending}
            className="interactive-warm"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Location'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form id="location-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the location..."
                        rows={4}
                        {...field} 
                      />
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
                      <Input placeholder="e.g., mysterious, peaceful, dangerous..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What is the history of this location?"
                        rows={3}
                        {...field} 
                      />
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
                      <Textarea 
                        placeholder="Why is this location important to your story?"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., forest, magical, ancient, dangerous..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}