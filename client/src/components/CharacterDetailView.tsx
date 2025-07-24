import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, X, User, Eye, Brain, Zap, BookOpen, Users, Settings, PenTool } from 'lucide-react';
import type { Character } from '../lib/types';
import { CharacterFormExpanded } from './CharacterFormExpanded';

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
      <CharacterFormExpanded
        projectId={projectId}
        character={character || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing character, show the form
  if (isEditing) {
    return (
      <CharacterFormExpanded
        projectId={projectId}
        character={character}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Helper function to render a field if it has content
  const renderField = (label: string, value: string | undefined, className = "") => {
    if (!value || value.trim().length === 0) return null;
    return (
      <div className={className}>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{value.trim()}</p>
      </div>
    );
  };

  // Helper function to render array fields as badges
  const renderArrayField = (label: string, values: string[] | undefined, variant: "default" | "secondary" | "outline" = "outline") => {
    if (!values?.length || !values.some(v => v?.trim())) return null;
    const filteredValues = values.filter(v => v?.trim());
    if (filteredValues.length === 0) return null;
    
    return (
      <div>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <div className="flex flex-wrap gap-2">
          {filteredValues.map((value, index) => (
            <Badge key={index} variant={variant} className="text-sm">
              {value.trim()}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to check if a section has any content
  const hasContent = (fields: (string | string[] | undefined)[]) => {
    return fields.some(field => {
      if (Array.isArray(field)) return field.length > 0 && field.some(item => item?.trim());
      return field && field.trim().length > 0;
    });
  };

  // For debugging - always show all sections if any basic character data exists
  // This ensures ALL sections are visible so user can see all their entered information
  const hasAnyData = character.name || character.description || character.role || character.age || character.race;
  
  const identityFields = hasAnyData; // Always show if character has any basic data
  const physicalFields = hasAnyData; // Always show if character has any basic data
  const personalityFields = hasAnyData; // Always show if character has any basic data
  const psychologyFields = hasAnyData; // Always show if character has any basic data
  const backgroundFields = hasAnyData; // Always show if character has any basic data
  const abilitiesFields = hasAnyData; // Always show if character has any basic data
  const storyFields = hasAnyData; // Always show if character has any basic data
  const languageFields = hasAnyData; // Always show if character has any basic data
  const socialFields = hasAnyData; // Always show if character has any basic data
  const metaFields = hasAnyData; // Always show if character has any basic data

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
                {character.name || 'Unnamed Character'}
              </h1>
              
              {character.title && (
                <p className="text-lg text-muted-foreground mb-3 italic">"{character.title}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {character.role && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {character.role}
                  </Badge>
                )}
                {character.race && (
                  <Badge variant="secondary" className="text-sm">
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
                {character.occupation && (
                  <Badge variant="outline" className="text-sm">
                    {character.occupation}
                  </Badge>
                )}
              </div>

              {character.oneLine && (
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{character.oneLine}"
                </p>
              )}
              
              {character.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {character.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content Sections - Mirror the exact 8 tabs from the editor */}
      <div className="space-y-6">
        
        {/* Identity Section - Tab 1 */}
        {identityFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Identity tab from editor */}
              <div className="grid grid-cols-2 gap-4">
                {renderField("Name", character.name)}
                {renderField("Nicknames", character.nicknames)}
                {renderField("Title", character.title)}
                {renderField("Aliases", character.aliases)}
                {renderField("Role in Story", character.role)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Race/Species", character.race)}
                {renderField("Ethnicity/Culture", character.ethnicity)}
                {renderField("Age", character.age)}
                {renderField("Birth Date", character.birthdate)}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {renderField("Class", character.class)}
                {renderField("Profession", character.profession)}
                {renderField("Current Occupation", character.occupation)}
              </div>
              
              <div className="space-y-4">
                {renderField("One-Line Description", character.oneLine)}
                {renderField("Character Description", character.description)}
                {renderField("Character Summary", character.characterSummary)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Physical Section - Tab 2 */}
        {physicalFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Physical Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Physical tab from editor */}
              <div className="grid grid-cols-2 gap-4">
                {renderField("Height", character.height)}
                {renderField("Weight/Build", character.weight)}
                {renderField("Eye Color", character.eyeColor)}
                {renderField("Hair Color", character.hairColor)}
                {renderField("Hair Style", character.hairStyle)}
                {renderField("Skin Tone", character.skinTone)}
              </div>
              
              <div>
                {renderField("Overall Physical Description", character.physicalDescription)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Distinguishing Marks", character.distinguishingMarks)}
                {renderField("Clothing Style", character.clothingStyle)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personality Section - Tab 3 */}
        {personalityFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Personality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Personality tab from editor */}
              <div>
                {renderField("Overall Personality", character.personality)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderArrayField("Personality Traits", character.personalityTraits)}
                {renderField("Temperament", character.temperament)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Beliefs & Values", character.beliefs)}
                {renderField("Worldview", character.worldview)}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {renderField("Likes", character.likes)}
                {renderField("Dislikes", character.dislikes)}
                {renderField("Quirks & Habits", character.quirks)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Psychology Section - Tab 4 */}
        {psychologyFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Psychology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Psychology tab from editor */}
              <div className="grid grid-cols-2 gap-4">
                {renderField("Motivations", character.motivations)}
                {renderField("Fears", character.fears)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Secrets", character.secrets)}
                {renderField("Trauma & Wounds", character.trauma)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Vulnerabilities", character.vulnerabilities)}
                {renderField("Coping Mechanisms", character.copingMechanisms)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Background Section - Tab 5 */}
        {backgroundFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Background & History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Background tab from editor */}
              <div>
                {renderField("Backstory", character.backstory)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Childhood", character.childhood)}
                {renderField("Family", character.family)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Education", character.education)}
                {renderField("Formative Events", character.formativeEvents)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Abilities Section - Tab 6 */}
        {abilitiesFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Abilities & Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Abilities tab from editor */}
              <div className="grid grid-cols-2 gap-4">
                {renderArrayField("Abilities", character.abilities)}
                {renderArrayField("Skills", character.skills)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderArrayField("Talents", character.talents)}
                {renderField("Strengths", character.strengths)}
              </div>
              
              <div>
                {renderField("Special Abilities", character.specialAbilities)}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Magic & Supernatural</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {renderField("Magical Abilities", character.magicalAbilities)}
                  {renderField("Magic Type", character.magicType)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {renderField("Magic Source", character.magicSource)}
                  {renderField("Magic Limitations", character.magicLimitations)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Story Section - Tab 7 */}
        {storyFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Story Role & Arc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exact mirror of Story tab from editor */}
              <div className="grid grid-cols-2 gap-4">
                {renderField("Goals", character.goals)}
                {renderField("Obstacles", character.obstacles)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Character Arc", character.arc)}
                {renderField("Conflicts", character.conflicts)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderField("Allies & Friends", character.allies)}
                {renderField("Enemies & Rivals", character.enemies)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Language & Communication Section - Tab 8 (part 1) */}
        {languageFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Language & Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Languages */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Languages", character.languages)}
                {renderField("Native Language", character.nativeLanguage)}
                {renderField("Accent", character.accent)}
                {renderField("Dialect", character.dialect)}
              </div>
              
              {/* Voice & Speech */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Voice Description", character.voiceDescription)}
                {renderField("Speech Patterns", character.speechPatterns)}
                {renderField("Vocabulary", character.vocabulary)}
                {renderField("Communication Style", character.communicationStyle)}
              </div>
              
              {/* Expressions */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Catchphrases", character.catchphrases)}
                {renderField("Slang", character.slang)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social & Cultural Section - Tab 8 (part 2) */}
        {socialFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social & Cultural
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Family */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Family", character.family)}
                {renderField("Parents", character.parents)}
                {renderField("Siblings", character.siblings)}
                {renderField("Spouse", character.spouse)}
                {renderField("Children", character.children)}
              </div>
              
              {/* Social Network */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Friends", character.friends)}
                {renderField("Social Circle", character.socialCircle)}
                {renderField("Community", character.community)}
              </div>
              
              {/* Cultural Background */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Culture", character.culture)}
                {renderField("Traditions", character.traditions)}
                {renderField("Customs", character.customs)}
              </div>
              
              {/* Beliefs */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Religion", character.religion)}
                {renderField("Spirituality", character.spirituality)}
                {renderField("Political Views", character.politicalViews)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meta Section - Tab 8 */}
        {metaFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Meta Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exact mirror of Meta tab from editor */}
              <div className="grid grid-cols-2 gap-4">
                {renderArrayField("Tags", character.tags)}
                {renderField("Inspiration", character.inspiration)}
              </div>
              
              <div>
                {renderField("Notes", character.notes)}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}