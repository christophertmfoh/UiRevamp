import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Shield, Target, Users, DollarSign, Clock, Settings } from 'lucide-react';
import type { Faction } from '../../lib/types';

interface FactionFormProps {
  projectId: string;
  onCancel: () => void;
  faction?: Faction;
}

export function FactionForm({ projectId, onCancel, faction }: FactionFormProps) {
  const [formData, setFormData] = useState({
    name: faction?.name || '',
    type: faction?.type || '',
    description: faction?.description || '',
    ideology: faction?.ideology || '',
    goals: faction?.goals || '',
    methods: faction?.methods || '',
    leadership: faction?.leadership || '',
    resources: faction?.resources || '',
    relationships: faction?.relationships || '',
    status: faction?.status || '',
    tags: faction?.tags?.join(', ') || ''
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = faction 
        ? `/api/projects/${projectId}/factions/${faction.id}`
        : `/api/projects/${projectId}/factions`;
      
      const response = await fetch(endpoint, {
        method: faction ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save faction');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
      onCancel();
    }
  });

  const handleSave = () => {
    const cleanedData = { ...formData } as any;
    
    // Convert tags string to array
    if (cleanedData.tags) {
      cleanedData.tags = cleanedData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    } else {
      cleanedData.tags = [];
    }
    
    // Clean empty strings to prevent database errors
    Object.keys(cleanedData).forEach((key: string) => {
      if (cleanedData[key] === '') {
        delete cleanedData[key];
      }
    });

    saveMutation.mutate(cleanedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Factions
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {faction ? `Edit ${faction.name}` : 'Create New Faction'}
            </h1>
            <p className="text-muted-foreground">
              {faction ? 'Modify faction details' : 'Add a new faction to your world'}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saveMutation.isPending || !formData.name}
          className="bg-accent hover:bg-accent/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : faction ? 'Save Changes' : 'Create Faction'}
        </Button>
      </div>

      {/* Form Content with Tabs */}
      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="identity" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Identity
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Goals & Methods
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="power" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Power & Resources
          </TabsTrigger>
          <TabsTrigger value="relations" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Relations & History
          </TabsTrigger>
          <TabsTrigger value="meta" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Status & Meta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter faction name..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium">
                Faction Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select faction type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Military Force">Military Force</SelectItem>
                  <SelectItem value="Political Party">Political Party</SelectItem>
                  <SelectItem value="Religious Order">Religious Order</SelectItem>
                  <SelectItem value="Trading Guild">Trading Guild</SelectItem>
                  <SelectItem value="Criminal Organization">Criminal Organization</SelectItem>
                  <SelectItem value="Rebel Group">Rebel Group</SelectItem>
                  <SelectItem value="Noble House">Noble House</SelectItem>
                  <SelectItem value="Secret Society">Secret Society</SelectItem>
                  <SelectItem value="Mercenary Company">Mercenary Company</SelectItem>
                  <SelectItem value="Scholar Circle">Scholar Circle</SelectItem>
                  <SelectItem value="Underground Movement">Underground Movement</SelectItem>
                  <SelectItem value="Ancient Order">Ancient Order</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              General Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Overall description of this faction..."
              className="mt-2 min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="ideology" className="text-sm font-medium">
              Core Ideology
            </Label>
            <Textarea
              id="ideology"
              value={formData.ideology}
              onChange={(e) => handleInputChange('ideology', e.target.value)}
              placeholder="What does this faction believe in?"
              className="mt-2 min-h-[100px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div>
            <Label htmlFor="goals" className="text-sm font-medium">
              Goals & Objectives
            </Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              placeholder="What does this faction want to achieve?"
              className="mt-2 min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="methods" className="text-sm font-medium">
              Methods & Operations
            </Label>
            <Textarea
              id="methods"
              value={formData.methods}
              onChange={(e) => handleInputChange('methods', e.target.value)}
              placeholder="How does this faction operate? What tactics do they use?"
              className="mt-2 min-h-[120px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <div>
            <Label htmlFor="leadership" className="text-sm font-medium">
              Leadership & Structure
            </Label>
            <Textarea
              id="leadership"
              value={formData.leadership}
              onChange={(e) => handleInputChange('leadership', e.target.value)}
              placeholder="Who leads this faction? How is it organized?"
              className="mt-2 min-h-[120px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="power" className="space-y-6">
          <div>
            <Label htmlFor="resources" className="text-sm font-medium">
              Resources & Assets
            </Label>
            <Textarea
              id="resources"
              value={formData.resources}
              onChange={(e) => handleInputChange('resources', e.target.value)}
              placeholder="What resources, assets, and capabilities does this faction have?"
              className="mt-2 min-h-[120px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="relations" className="space-y-6">
          <div>
            <Label htmlFor="relationships" className="text-sm font-medium">
              Relationships & Alliances
            </Label>
            <Textarea
              id="relationships"
              value={formData.relationships}
              onChange={(e) => handleInputChange('relationships', e.target.value)}
              placeholder="How does this faction relate to others? Who are their allies and enemies?"
              className="mt-2 min-h-[120px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="meta" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Dormant">Dormant</SelectItem>
                  <SelectItem value="Growing">Growing</SelectItem>
                  <SelectItem value="Declining">Declining</SelectItem>
                  <SelectItem value="Destroyed">Destroyed</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas..."
                className="mt-2"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}