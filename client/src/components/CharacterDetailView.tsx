import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Save, X, User, Upload } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../lib/types';
import { CharacterForm } from './CharacterForm';

interface CharacterDetailViewProps {
  projectId: string;
  character: Character | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

export function CharacterDetailView({ 
  projectId, 
  character, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: CharacterDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no character, show the form
  if (isCreating || !character) {
    return (
      <CharacterForm
        projectId={projectId}
        character={character || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing character, show the form
  if (isEditing) {
    return (
      <CharacterForm
        projectId={projectId}
        character={character}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Otherwise, show the detailed read-only view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} className="interactive-warm gap-2">
            <Edit className="h-4 w-4" />
            Edit Character
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(character)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Character Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Character Image */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
              {character.imageUrl ? (
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            {/* Character Basic Info */}
            <div className="flex-1">
              <h1 className="font-title text-3xl mb-2">
                {character.name}
                {character.title && (
                  <span className="text-muted-foreground font-normal text-xl ml-2">
                    "{character.title}"
                  </span>
                )}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {character.role}
                </Badge>
                {character.race && (
                  <Badge variant="outline" className="text-sm">
                    {character.race}
                  </Badge>
                )}
                {character.class && (
                  <Badge variant="outline" className="text-sm">
                    {character.class}
                  </Badge>
                )}
                {character.age && (
                  <Badge variant="outline" className="text-sm">
                    Age {character.age}
                  </Badge>
                )}
              </div>

              {character.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {character.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Details - Vertical Layout */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.backstory && (
                <div>
                  <h4 className="font-semibold mb-2">Backstory</h4>
                  <p className="text-muted-foreground">{character.backstory}</p>
                </div>
              )}
              {character.background && (
                <div>
                  <h4 className="font-semibold mb-2">Background</h4>
                  <p className="text-muted-foreground">{character.background}</p>
                </div>
              )}
              {character.academicHistory && (
                <div>
                  <h4 className="font-semibold mb-2">Academic History</h4>
                  <p className="text-muted-foreground">{character.academicHistory}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Languages & Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.languages && character.languages.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">{language}</Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No languages specified</p>
              )}
              {character.accent && (
                <div>
                  <h4 className="font-semibold mb-2">Accent</h4>
                  <p className="text-muted-foreground">{character.accent}</p>
                </div>
              )}
              {character.speechPatterns && (
                <div>
                  <h4 className="font-semibold mb-2">Speech Patterns</h4>
                  <p className="text-muted-foreground">{character.speechPatterns}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Physical Appearance Section */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Physical Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {character.physicalDescription && (
                <div>
                  <h4 className="font-semibold mb-2">Overall Description</h4>
                  <p className="text-muted-foreground">{character.physicalDescription}</p>
                </div>
              )}
              {character.facialFeatures && (
                <div>
                  <h4 className="font-semibold mb-2">Facial Features</h4>
                  <p className="text-muted-foreground">{character.facialFeatures}</p>
                </div>
              )}
              {character.hair && (
                <div>
                  <h4 className="font-semibold mb-2">Hair</h4>
                  <p className="text-muted-foreground">{character.hair}</p>
                </div>
              )}
              {character.skin && (
                <div>
                  <h4 className="font-semibold mb-2">Skin</h4>
                  <p className="text-muted-foreground">{character.skin}</p>
                </div>
              )}
              {character.attire && (
                <div>
                  <h4 className="font-semibold mb-2">Attire</h4>
                  <p className="text-muted-foreground">{character.attire}</p>
                </div>
              )}
              {character.distinguishingMarks && (
                <div>
                  <h4 className="font-semibold mb-2">Distinguishing Marks</h4>
                  <p className="text-muted-foreground">{character.distinguishingMarks}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Psychology Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.personality && (
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-muted-foreground">{character.personality}</p>
                </div>
              )}
              {character.personalityTraits && character.personalityTraits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.personalityTraits.map((trait, index) => (
                      <Badge key={index} variant="outline">{trait}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {character.copingMechanisms && (
                <div>
                  <h4 className="font-semibold mb-2">Coping Mechanisms</h4>
                  <p className="text-muted-foreground">{character.copingMechanisms}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Psychology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.motivations && (
                <div>
                  <h4 className="font-semibold mb-2">Motivations</h4>
                  <p className="text-muted-foreground">{character.motivations}</p>
                </div>
              )}
              {character.fears && (
                <div>
                  <h4 className="font-semibold mb-2">Fears</h4>
                  <p className="text-muted-foreground">{character.fears}</p>
                </div>
              )}
              {character.secrets && (
                <div>
                  <h4 className="font-semibold mb-2">Secrets</h4>
                  <p className="text-muted-foreground">{character.secrets}</p>
                </div>
              )}
              {character.vulnerabilities && (
                <div>
                  <h4 className="font-semibold mb-2">Vulnerabilities</h4>
                  <p className="text-muted-foreground">{character.vulnerabilities}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Abilities & Skills Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.abilities && character.abilities.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-2">General Abilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.abilities.map((ability, index) => (
                      <Badge key={index} variant="secondary">{ability}</Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No abilities specified</p>
              )}
              {character.specialAbilities && (
                <div>
                  <h4 className="font-semibold mb-2">Special Abilities</h4>
                  <p className="text-muted-foreground">{character.specialAbilities}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {character.skills && character.skills.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-2">Acquired Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No skills specified</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Story Elements Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Story Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.goals && (
                <div>
                  <h4 className="font-semibold mb-2">Goals</h4>
                  <p className="text-muted-foreground">{character.goals}</p>
                </div>
              )}
              {character.conflictSources && (
                <div>
                  <h4 className="font-semibold mb-2">Conflict Sources</h4>
                  <p className="text-muted-foreground">{character.conflictSources}</p>
                </div>
              )}
              {character.personalStruggle && (
                <div>
                  <h4 className="font-semibold mb-2">Personal Struggle</h4>
                  <p className="text-muted-foreground">{character.personalStruggle}</p>
                </div>
              )}
              {character.connectionToEvents && (
                <div>
                  <h4 className="font-semibold mb-2">Connection to Events</h4>
                  <p className="text-muted-foreground">{character.connectionToEvents}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              {character.relationships && character.relationships.length > 0 ? (
                <div className="space-y-2">
                  {character.relationships.map((relationship, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{typeof relationship === 'string' ? relationship : `${relationship.characterId} - ${relationship.relationshipType}: ${relationship.description}`}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No relationships specified</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meta Information Section */}
        <Card className="creative-card">
          <CardHeader>
            <CardTitle>Meta Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {character.tags && character.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {character.archetypes && character.archetypes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Archetypes</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.archetypes.map((archetype, index) => (
                      <Badge key={index} variant="secondary">{archetype}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {character.proseVibe && (
                <div>
                  <h4 className="font-semibold mb-2">Prose Vibe</h4>
                  <p className="text-muted-foreground">{character.proseVibe}</p>
                </div>
              )}
              {character.narrativeRole && (
                <div>
                  <h4 className="font-semibold mb-2">Narrative Role</h4>
                  <p className="text-muted-foreground">{character.narrativeRole}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}