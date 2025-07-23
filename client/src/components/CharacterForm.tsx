import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Upload, User, Settings, Target, Languages, Palette } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../lib/types';

interface CharacterFormProps {
  projectId: string;
  onCancel: () => void;
  character?: Character;
}

export function CharacterForm({ projectId, onCancel, character }: CharacterFormProps) {
  const [formData, setFormData] = useState({
    name: character?.name || '',
    title: character?.title || '',
    race: character?.race || '',
    class: character?.class || '',
    age: character?.age || '',
    role: character?.role || '',
    
    // Physical Appearance
    physicalDescription: character?.physicalDescription || '',
    facialFeatures: character?.facialFeatures || '',
    hair: character?.hair || '',
    skin: character?.skin || '',
    attire: character?.attire || '',
    distinguishingMarks: character?.distinguishingMarks || '',
    
    // Core Character Details
    description: character?.description || '',
    personality: character?.personality || '',
    backstory: character?.backstory || '',
    
    // Psychological Profile
    personalityTraits: character?.personalityTraits?.join(', ') || '',
    motivations: character?.motivations || '',
    fears: character?.fears || '',
    secrets: character?.secrets || '',
    copingMechanisms: character?.copingMechanisms || '',
    vulnerabilities: character?.vulnerabilities || '',
    
    // Background & History
    background: character?.background || '',
    academicHistory: character?.academicHistory || '',
    personalStruggle: character?.personalStruggle || '',
    
    // Abilities & Skills
    abilities: character?.abilities?.join(', ') || '',
    skills: character?.skills?.join(', ') || '',
    specialAbilities: character?.specialAbilities || '',
    
    // Story Elements
    goals: character?.goals || '',
    conflictSources: character?.conflictSources || '',
    connectionToEvents: character?.connectionToEvents || '',
    
    // Language & Communication
    languages: character?.languages?.join(', ') || '',
    accent: character?.accent || '',
    speechPatterns: character?.speechPatterns || '',
    
    // Meta Information
    archetypes: character?.archetypes?.join(', ') || '',
    tags: character?.tags?.join(', ') || '',
    proseVibe: character?.proseVibe || '',
    narrativeRole: character?.narrativeRole || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', `/api/projects/${projectId}/characters`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', `/api/characters/${character?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      projectId,
      personalityTraits: formData.personalityTraits.split(',').map(s => s.trim()).filter(Boolean),
      abilities: formData.abilities.split(',').map(s => s.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      archetypes: formData.archetypes.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (character) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-title text-2xl">
              {character ? 'Edit Character' : 'Create New Character'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

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
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
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
                  <h3 className="text-lg font-semibold mb-2">Character Image</h3>
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
                    placeholder="major character, love interest, comic relief"
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="interactive-warm" disabled={isLoading}>
                {isLoading ? 'Saving...' : character ? 'Update Character' : 'Create Character'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}