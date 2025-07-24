import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, X, User, Upload } from 'lucide-react';
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
    if (!value?.trim()) return null;
    return (
      <div className={className}>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <p className="text-muted-foreground leading-relaxed">{value}</p>
      </div>
    );
  };

  // Helper function to render array fields as badges
  const renderArrayField = (label: string, values: string[] | undefined, variant: "default" | "secondary" | "outline" = "outline") => {
    if (!values?.length) return null;
    return (
      <div>
        <h4 className="font-semibold mb-2 text-foreground">{label}</h4>
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <Badge key={index} variant={variant} className="text-sm">
              {value}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to check if a section has any content
  const hasContent = (fields: (string | string[] | undefined)[]) => {
    return fields.some(field => {
      if (Array.isArray(field)) return field.length > 0;
      return field?.trim();
    });
  };

  // Define sections matching the 8 tabs from the form
  const identityFields = hasContent([
    character.name, character.nicknames, character.title, character.aliases,
    character.race, character.ethnicity, character.class, character.profession,
    character.occupation, character.gender, character.sexuality, character.pronouns,
    character.age, character.birthdate, character.birthplace, character.currentResidence,
    character.oneLine, character.description
  ]);

  const physicalFields = hasContent([
    character.physicalDescription, character.height, character.weight, character.build,
    character.facialFeatures, character.hair, character.eyes, character.skin,
    character.distinguishingMarks, character.attire, character.accessories,
    character.scent, character.voiceDescription, character.accent, character.mannerisms
  ]);

  const personalityFields = hasContent([
    character.personality, character.temperament, character.coreTraits,
    character.humorStyle, character.speechPatterns, character.decisionMaking,
    character.stressResponse, character.relaxationMethods, character.socialBehavior,
    character.leadership, character.creativity, character.traditions
  ]);

  const psychologyFields = hasContent([
    character.motivations, character.goals, character.fears, character.insecurities,
    character.moralCode, character.beliefs, character.philosophy, character.mentalDisorders,
    character.coping, character.triggers, character.regrets, character.secrets,
    character.hopes, character.pride
  ]);

  const backgroundFields = hasContent([
    character.backstory, character.background, character.childhoood, character.family,
    character.education, character.academicHistory, character.career, character.relationships,
    character.allies, character.enemies, character.mentors, character.students,
    character.romanticHistory, character.socialStatus, character.reputation,
    character.significantEvents
  ]);

  const abilitiesFields = hasContent([
    character.abilities, character.skills, character.specialAbilities,
    character.magicalAbilities, character.magicType, character.magicSource,
    character.magicLimitations, character.talents, character.expertise,
    character.training, character.weaknesses, character.languages
  ]);

  const storyFields = hasContent([
    character.role, character.narrativeRole, character.characterArc,
    character.relationships, character.conflictSources, character.connectionToEvents,
    character.plotSignificance, character.thematicRole, character.growth,
    character.challenges
  ]);

  const metaFields = hasContent([
    character.tags, character.archetypes, character.inspirations,
    character.proseVibe, character.voiceStyle, character.notes,
    character.authorNotes, character.version
  ]);

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

      {/* Dynamic Content Sections - Only show sections with content */}
      <div className="space-y-6">
        
        {/* Identity Section */}
        {identityFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Full Name", character.name)}
                {renderField("Nicknames", character.nicknames)}
                {renderField("Title/Honorific", character.title)}
                {renderField("Aliases", character.aliases)}
                {renderField("Race/Species", character.race)}
                {renderField("Ethnicity", character.ethnicity)}
                {renderField("Class", character.class)}
                {renderField("Profession", character.profession)}
                {renderField("Occupation", character.occupation)}
                {renderField("Gender", character.gender)}
                {renderField("Sexuality", character.sexuality)}
                {renderField("Pronouns", character.pronouns)}
                {renderField("Age", character.age)}
                {renderField("Birthdate", character.birthdate)}
                {renderField("Birthplace", character.birthplace)}
                {renderField("Current Residence", character.currentResidence)}
              </div>
              {renderField("One-Line Description", character.oneLine, "md:col-span-2")}
              {renderField("Full Description", character.description, "md:col-span-2")}
            </CardContent>
          </Card>
        )}

        {/* Physical Section */}
        {physicalFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Physical Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Height", character.height)}
                {renderField("Weight", character.weight)}
                {renderField("Build", character.build)}
                {renderField("Hair", character.hair)}
                {renderField("Eyes", character.eyes)}
                {renderField("Skin", character.skin)}
                {renderField("Distinguishing Marks", character.distinguishingMarks)}
                {renderField("Attire", character.attire)}
                {renderField("Accessories", character.accessories)}
                {renderField("Scent", character.scent)}
                {renderField("Voice", character.voiceDescription)}
                {renderField("Accent", character.accent)}
                {renderField("Mannerisms", character.mannerisms)}
              </div>
              {renderField("Physical Description", character.physicalDescription, "md:col-span-2")}
              {renderField("Facial Features", character.facialFeatures, "md:col-span-2")}
            </CardContent>
          </Card>
        )}

        {/* Personality Section */}
        {personalityFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Temperament", character.temperament)}
                {renderField("Humor Style", character.humorStyle)}
                {renderField("Decision Making", character.decisionMaking)}
                {renderField("Stress Response", character.stressResponse)}
                {renderField("Relaxation Methods", character.relaxationMethods)}
                {renderField("Social Behavior", character.socialBehavior)}
                {renderField("Leadership Style", character.leadership)}
                {renderField("Creativity", character.creativity)}
                {renderField("Traditions", character.traditions)}
              </div>
              {renderField("Overall Personality", character.personality, "md:col-span-2")}
              {renderField("Core Traits", character.coreTraits, "md:col-span-2")}
              {renderField("Speech Patterns", character.speechPatterns, "md:col-span-2")}
            </CardContent>
          </Card>
        )}

        {/* Psychology Section */}
        {psychologyFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Psychology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Motivations", character.motivations)}
                {renderField("Goals", character.goals)}
                {renderField("Fears", character.fears)}
                {renderField("Insecurities", character.insecurities)}
                {renderField("Moral Code", character.moralCode)}
                {renderField("Beliefs", character.beliefs)}
                {renderField("Philosophy", character.philosophy)}
                {renderField("Mental Disorders", character.mentalDisorders)}
                {renderField("Coping Mechanisms", character.coping)}
                {renderField("Triggers", character.triggers)}
                {renderField("Regrets", character.regrets)}
                {renderField("Secrets", character.secrets)}
                {renderField("Hopes", character.hopes)}
                {renderField("Pride", character.pride)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Background Section */}
        {backgroundFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Childhood", character.childhoood)}
                {renderField("Family", character.family)}
                {renderField("Education", character.education)}
                {renderField("Academic History", character.academicHistory)}
                {renderField("Career", character.career)}
                {renderField("Allies", character.allies)}
                {renderField("Enemies", character.enemies)}
                {renderField("Mentors", character.mentors)}
                {renderField("Students", character.students)}
                {renderField("Romantic History", character.romanticHistory)}
                {renderField("Social Status", character.socialStatus)}
                {renderField("Reputation", character.reputation)}
              </div>
              {renderField("Backstory", character.backstory, "md:col-span-2")}
              {renderField("Background", character.background, "md:col-span-2")}
              {renderField("Relationships", character.relationships, "md:col-span-2")}
              {renderField("Significant Events", character.significantEvents, "md:col-span-2")}
            </CardContent>
          </Card>
        )}

        {/* Abilities Section */}
        {abilitiesFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Abilities & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Abilities", character.abilities)}
                {renderArrayField("Skills", character.skills)}
                {renderArrayField("Languages", character.languages)}
                {renderField("Special Abilities", character.specialAbilities)}
                {renderField("Magical Abilities", character.magicalAbilities)}
                {renderField("Magic Type", character.magicType)}
                {renderField("Magic Source", character.magicSource)}
                {renderField("Magic Limitations", character.magicLimitations)}
                {renderField("Talents", character.talents)}
                {renderField("Expertise", character.expertise)}
                {renderField("Training", character.training)}
                {renderField("Weaknesses", character.weaknesses)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Story Section */}
        {storyFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Story Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Role", character.role)}
                {renderField("Narrative Role", character.narrativeRole)}
                {renderField("Character Arc", character.characterArc)}
                {renderField("Conflict Sources", character.conflictSources)}
                {renderField("Connection to Events", character.connectionToEvents)}
                {renderField("Plot Significance", character.plotSignificance)}
                {renderField("Thematic Role", character.thematicRole)}
                {renderField("Growth", character.growth)}
                {renderField("Challenges", character.challenges)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meta Section */}
        {metaFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Tags", character.tags)}
                {renderArrayField("Archetypes", character.archetypes, "secondary")}
                {renderField("Inspirations", character.inspirations)}
                {renderField("Prose Vibe", character.proseVibe)}
                {renderField("Voice Style", character.voiceStyle)}
                {renderField("Version", character.version)}
              </div>
              {renderField("Notes", character.notes, "md:col-span-2")}
              {renderField("Author Notes", character.authorNotes, "md:col-span-2")}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}