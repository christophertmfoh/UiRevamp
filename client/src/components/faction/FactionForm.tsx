import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Upload, User, Settings, Target, Languages, Palette } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Faction } from '../lib/types';

interface FactionFormProps {
  projectId: string;
  onCancel: () => void;
  faction?: Faction;
}

export function FactionForm({ projectId, onCancel, faction }: FactionFormProps) {
  const [formData, setFormData] = useState({
    name: faction?.name || '',
    title: faction?.title || '',
    race: faction?.race || '',
    class: faction?.class || '',
    age: faction?.age || '',
    role: faction?.role || '',
    
    // Physical Appearance
    physicalDescription: faction?.physicalDescription || '',
    facialFeatures: faction?.facialFeatures || '',
    hair: faction?.hair || '',
    skin: faction?.skin || '',
    attire: faction?.attire || '',
    distinguishingMarks: faction?.distinguishingMarks || '',
    
    // Core Faction Details
    description: faction?.description || '',
    personality: faction?.personality || '',
    backstory: faction?.backstory || '',
    
    // Psychological Profile
    personalityTraits: faction?.personalityTraits?.join(', ') || '',
    motivations: faction?.motivations || '',
    fears: faction?.fears || '',
    secrets: faction?.secrets || '',
    copingMechanisms: faction?.copingMechanisms || '',
    vulnerabilities: faction?.vulnerabilities || '',
    
    // Background & History
    background: faction?.background || '',
    academicHistory: faction?.academicHistory || '',
    personalStruggle: faction?.personalStruggle || '',
    
    // Abilities & Skills
    abilities: faction?.abilities?.join(', ') || '',
    skills: faction?.skills?.join(', ') || '',
    specialAbilities: faction?.specialAbilities || '',
    
    // Story Elements
    goals: faction?.goals || '',
    conflictSources: faction?.conflictSources || '',
    connectionToEvents: faction?.connectionToEvents || '',
    
    // Language & Communication
    languages: faction?.languages?.join(', ') || '',
    accent: faction?.accent || '',
    speechPatterns: faction?.speechPatterns || '',
    
    // Meta Information
    archetypes: faction?.archetypes?.join(', ') || '',
    tags: faction?.tags?.join(', ') || '',
    proseVibe: faction?.proseVibe || '',
    narrativeRole: faction?.narrativeRole || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', `/api/projects/${projectId}/factions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', `/api/factions/${faction?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      id: faction?.id || Date.now().toString(),
      projectId,
      name: formData.name,
      title: formData.title,
      race: formData.race,
      class: formData.class,
      age: formData.age,
      role: formData.role,
      physicalDescription: formData.physicalDescription,
      facialFeatures: formData.facialFeatures,
      hair: formData.hair,
      skin: formData.skin,
      attire: formData.attire,
      distinguishingMarks: formData.distinguishingMarks,
      description: formData.description,
      personality: formData.personality,
      backstory: formData.backstory,
      personalityTraits: formData.personalityTraits.split(',').map(s => s.trim()).filter(Boolean),
      motivations: formData.motivations,
      fears: formData.fears,
      secrets: formData.secrets,
      copingMechanisms: formData.copingMechanisms,
      vulnerabilities: formData.vulnerabilities,
      background: formData.background,
      academicHistory: formData.academicHistory,
      personalStruggle: formData.personalStruggle,
      abilities: formData.abilities.split(',').map(s => s.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      specialAbilities: formData.specialAbilities,
      goals: formData.goals,
      conflictSources: formData.conflictSources,
      connectionToEvents: formData.connectionToEvents,
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      accent: formData.accent,
      speechPatterns: formData.speechPatterns,
      archetypes: formData.archetypes.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      proseVibe: formData.proseVibe,
      narrativeRole: formData.narrativeRole,
      isModelTrained: false,
      imageUrl: '',
    };

    if (faction) {
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
          Back to Factions
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Faction'}
          </Button>
        </div>
      </div>

      <Card className="creative-card">
        <div className="p-6">
          <h1 className="font-title text-3xl mb-6">
            {faction ? 'Edit Faction' : 'Create New Faction'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="physical" className="flex items-center gap-1">
                  <Palette className="h-3 w-3" />
                  Physical
                </TabsTrigger>
                <TabsTrigger value="psychology" className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Psychology
                </TabsTrigger>
                <TabsTrigger value="abilities" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Abilities
                </TabsTrigger>
                <TabsTrigger value="story" className="flex items-center gap-1">
                  <Languages className="h-3 w-3" />
                  Story
                </TabsTrigger>
                <TabsTrigger value="meta" className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Meta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Faction's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g., Lord, Dr., Captain"
                    />
                  </div>
                  <div>
                    <Label htmlFor="race">Race/Species</Label>
                    <Input
                      id="race"
                      value={formData.race}
                      onChange={(e) => updateField('race', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="class">Class/Profession</Label>
                    <Input
                      id="class"
                      value={formData.class}
                      onChange={(e) => updateField('class', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      placeholder="e.g., Protagonist, Antagonist, Supporting"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">Faction Image</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload an image or generate one with AI (coming soon)
                  </p>
                  <Button type="button" variant="outline" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="physical" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="physicalDescription">Physical Description</Label>
                    <Textarea
                      id="physicalDescription"
                      value={formData.physicalDescription}
                      onChange={(e) => updateField('physicalDescription', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facialFeatures">Facial Features</Label>
                    <Textarea
                      id="facialFeatures"
                      value={formData.facialFeatures}
                      onChange={(e) => updateField('facialFeatures', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hair">Hair</Label>
                    <Input
                      id="hair"
                      value={formData.hair}
                      onChange={(e) => updateField('hair', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skin">Skin</Label>
                    <Input
                      id="skin"
                      value={formData.skin}
                      onChange={(e) => updateField('skin', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="attire">Attire</Label>
                    <Textarea
                      id="attire"
                      value={formData.attire}
                      onChange={(e) => updateField('attire', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="distinguishingMarks">Distinguishing Marks</Label>
                    <Textarea
                      id="distinguishingMarks"
                      value={formData.distinguishingMarks}
                      onChange={(e) => updateField('distinguishingMarks', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="psychology" className="space-y-4">
                <div>
                  <Label htmlFor="personality">Personality</Label>
                  <Textarea
                    id="personality"
                    value={formData.personality}
                    onChange={(e) => updateField('personality', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="personalityTraits">Personality Traits (comma-separated)</Label>
                  <Input
                    id="personalityTraits"
                    value={formData.personalityTraits}
                    onChange={(e) => updateField('personalityTraits', e.target.value)}
                    placeholder="brave, curious, stubborn, compassionate"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motivations">Motivations</Label>
                    <Textarea
                      id="motivations"
                      value={formData.motivations}
                      onChange={(e) => updateField('motivations', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fears">Fears</Label>
                    <Textarea
                      id="fears"
                      value={formData.fears}
                      onChange={(e) => updateField('fears', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secrets">Secrets</Label>
                    <Textarea
                      id="secrets"
                      value={formData.secrets}
                      onChange={(e) => updateField('secrets', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vulnerabilities">Vulnerabilities</Label>
                    <Textarea
                      id="vulnerabilities"
                      value={formData.vulnerabilities}
                      onChange={(e) => updateField('vulnerabilities', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backstory">Backstory</Label>
                  <Textarea
                    id="backstory"
                    value={formData.backstory}
                    onChange={(e) => updateField('backstory', e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="abilities" className="space-y-4">
                <div>
                  <Label htmlFor="abilities">Abilities (comma-separated)</Label>
                  <Input
                    id="abilities"
                    value={formData.abilities}
                    onChange={(e) => updateField('abilities', e.target.value)}
                    placeholder="telepathy, super strength, magic, leadership"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => updateField('skills', e.target.value)}
                    placeholder="swordplay, diplomacy, investigation, medicine"
                  />
                </div>

                <div>
                  <Label htmlFor="specialAbilities">Special Abilities</Label>
                  <Textarea
                    id="specialAbilities"
                    value={formData.specialAbilities}
                    onChange={(e) => updateField('specialAbilities', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => updateField('languages', e.target.value)}
                    placeholder="Common, Elvish, Draconic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accent">Accent</Label>
                    <Input
                      id="accent"
                      value={formData.accent}
                      onChange={(e) => updateField('accent', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="speechPatterns">Speech Patterns</Label>
                    <Input
                      id="speechPatterns"
                      value={formData.speechPatterns}
                      onChange={(e) => updateField('speechPatterns', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="story" className="space-y-4">
                <div>
                  <Label htmlFor="goals">Goals</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => updateField('goals', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="conflictSources">Conflict Sources</Label>
                  <Textarea
                    id="conflictSources"
                    value={formData.conflictSources}
                    onChange={(e) => updateField('conflictSources', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="connectionToEvents">Connection to Events</Label>
                  <Textarea
                    id="connectionToEvents"
                    value={formData.connectionToEvents}
                    onChange={(e) => updateField('connectionToEvents', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="background">Background</Label>
                    <Textarea
                      id="background"
                      value={formData.background}
                      onChange={(e) => updateField('background', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="academicHistory">Academic History</Label>
                    <Textarea
                      id="academicHistory"
                      value={formData.academicHistory}
                      onChange={(e) => updateField('academicHistory', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="personalStruggle">Personal Struggle</Label>
                  <Textarea
                    id="personalStruggle"
                    value={formData.personalStruggle}
                    onChange={(e) => updateField('personalStruggle', e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="meta" className="space-y-4">
                <div>
                  <Label htmlFor="archetypes">Archetypes (comma-separated)</Label>
                  <Input
                    id="archetypes"
                    value={formData.archetypes}
                    onChange={(e) => updateField('archetypes', e.target.value)}
                    placeholder="Hero, Mentor, Trickster, Sage"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                    placeholder="major faction, love interest, comic relief"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proseVibe">Prose Vibe</Label>
                    <Input
                      id="proseVibe"
                      value={formData.proseVibe}
                      onChange={(e) => updateField('proseVibe', e.target.value)}
                      placeholder="mysterious, comical, tragic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="narrativeRole">Narrative Role</Label>
                    <Input
                      id="narrativeRole"
                      value={formData.narrativeRole}
                      onChange={(e) => updateField('narrativeRole', e.target.value)}
                      placeholder="catalyst, obstacle, ally"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>


          </form>
        </div>
      </Card>
    </div>
  );
}