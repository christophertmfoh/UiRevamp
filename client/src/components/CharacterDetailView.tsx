import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, X, User } from 'lucide-react';
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

  // Define sections based on actual fields from the Character type
  const identityFields = hasContent([
    character.name, character.nicknames, character.title, character.aliases,
    character.race, character.ethnicity, character.class, character.profession,
    character.occupation, character.age, character.birthdate, character.zodiacSign,
    character.role, character.oneLine, character.description, character.characterSummary
  ]);

  const physicalFields = hasContent([
    character.physicalDescription, character.height, character.weight, character.build,
    character.bodyType, character.facialFeatures, character.eyes, character.eyeColor,
    character.hair, character.hairColor, character.hairStyle, character.facialHair,
    character.skin, character.skinTone, character.complexion, character.scars,
    character.tattoos, character.piercings, character.birthmarks, character.distinguishingMarks,
    character.attire, character.clothingStyle, character.accessories,
    character.posture, character.gait, character.gestures, character.mannerisms
  ]);

  const personalityFields = hasContent([
    character.personality, character.personalityTraits, character.temperament,
    character.disposition, character.worldview, character.beliefs, character.values,
    character.principles, character.morals, character.ethics, character.virtues,
    character.vices, character.habits, character.quirks, character.idiosyncrasies,
    character.petPeeves, character.likes, character.dislikes, character.hobbies,
    character.interests, character.passions
  ]);

  const psychologyFields = hasContent([
    character.motivations, character.desires, character.needs, character.drives,
    character.ambitions, character.fears, character.phobias, character.anxieties,
    character.insecurities, character.secrets, character.shame, character.guilt,
    character.regrets, character.trauma, character.wounds, character.copingMechanisms,
    character.defenses, character.vulnerabilities, character.weaknesses,
    character.blindSpots, character.mentalHealth, character.emotionalState,
    character.maturityLevel, character.intelligenceType, character.learningStyle
  ]);

  const backgroundFields = hasContent([
    character.background, character.backstory, character.origin, character.upbringing,
    character.childhood, character.familyHistory, character.socialClass,
    character.economicStatus, character.education, character.academicHistory,
    character.formativeEvents, character.lifeChangingMoments, character.personalStruggle,
    character.challenges, character.achievements, character.failures, character.losses,
    character.victories, character.reputation, character.family, character.parents,
    character.siblings, character.spouse, character.children, character.friends,
    character.socialCircle, character.community, character.culture, character.traditions,
    character.customs, character.religion, character.spirituality, character.politicalViews
  ]);

  const abilitiesFields = hasContent([
    character.abilities, character.skills, character.talents, character.expertise,
    character.specialAbilities, character.powers, character.magicalAbilities,
    character.magicType, character.magicSource, character.magicLimitations,
    character.superpowers, character.strengths, character.competencies,
    character.training, character.experience, character.languages, character.nativeLanguage
  ]);

  const storyFields = hasContent([
    character.role, character.goals, character.objectives, character.wants,
    character.obstacles, character.conflicts, character.conflictSources,
    character.stakes, character.consequences, character.arc, character.journey,
    character.transformation, character.growth, character.relationships,
    character.allies, character.enemies, character.mentors, character.rivals,
    character.connectionToEvents, character.plotRelevance, character.storyFunction
  ]);

  const metaFields = hasContent([
    character.tags, character.archetypes, character.tropes, character.inspiration,
    character.basedOn, character.proseVibe, character.notes
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
                {renderField("Age", character.age)}
                {renderField("Birthdate", character.birthdate)}
                {renderField("Zodiac Sign", character.zodiacSign)}
                {renderField("Role", character.role)}
              </div>
              {renderField("One-Line Description", character.oneLine, "md:col-span-2")}
              {renderField("Character Summary", character.characterSummary, "md:col-span-2")}
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
                {renderField("Body Type", character.bodyType)}
                {renderField("Eyes", character.eyes)}
                {renderField("Eye Color", character.eyeColor)}
                {renderField("Hair", character.hair)}
                {renderField("Hair Color", character.hairColor)}
                {renderField("Hair Style", character.hairStyle)}
                {renderField("Facial Hair", character.facialHair)}
                {renderField("Skin", character.skin)}
                {renderField("Skin Tone", character.skinTone)}
                {renderField("Complexion", character.complexion)}
                {renderField("Scars", character.scars)}
                {renderField("Tattoos", character.tattoos)}
                {renderField("Piercings", character.piercings)}
                {renderField("Birthmarks", character.birthmarks)}
                {renderField("Distinguishing Marks", character.distinguishingMarks)}
                {renderField("Attire", character.attire)}
                {renderField("Clothing Style", character.clothingStyle)}
                {renderField("Accessories", character.accessories)}
                {renderField("Posture", character.posture)}
                {renderField("Gait", character.gait)}
                {renderField("Gestures", character.gestures)}
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
                {renderArrayField("Personality Traits", character.personalityTraits)}
                {renderField("Temperament", character.temperament)}
                {renderField("Disposition", character.disposition)}
                {renderField("Worldview", character.worldview)}
                {renderField("Beliefs", character.beliefs)}
                {renderField("Values", character.values)}
                {renderField("Principles", character.principles)}
                {renderField("Morals", character.morals)}
                {renderField("Ethics", character.ethics)}
                {renderField("Virtues", character.virtues)}
                {renderField("Vices", character.vices)}
                {renderField("Habits", character.habits)}
                {renderField("Quirks", character.quirks)}
                {renderField("Idiosyncrasies", character.idiosyncrasies)}
                {renderField("Pet Peeves", character.petPeeves)}
                {renderField("Likes", character.likes)}
                {renderField("Dislikes", character.dislikes)}
                {renderField("Hobbies", character.hobbies)}
                {renderField("Interests", character.interests)}
                {renderField("Passions", character.passions)}
              </div>
              {renderField("Overall Personality", character.personality, "md:col-span-2")}
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
                {renderField("Desires", character.desires)}
                {renderField("Needs", character.needs)}
                {renderField("Drives", character.drives)}
                {renderField("Ambitions", character.ambitions)}
                {renderField("Fears", character.fears)}
                {renderField("Phobias", character.phobias)}
                {renderField("Anxieties", character.anxieties)}
                {renderField("Insecurities", character.insecurities)}
                {renderField("Secrets", character.secrets)}
                {renderField("Shame", character.shame)}
                {renderField("Guilt", character.guilt)}
                {renderField("Regrets", character.regrets)}
                {renderField("Trauma", character.trauma)}
                {renderField("Wounds", character.wounds)}
                {renderField("Coping Mechanisms", character.copingMechanisms)}
                {renderField("Defenses", character.defenses)}
                {renderField("Vulnerabilities", character.vulnerabilities)}
                {renderField("Weaknesses", character.weaknesses)}
                {renderField("Blind Spots", character.blindSpots)}
                {renderField("Mental Health", character.mentalHealth)}
                {renderField("Emotional State", character.emotionalState)}
                {renderField("Maturity Level", character.maturityLevel)}
                {renderField("Intelligence Type", character.intelligenceType)}
                {renderField("Learning Style", character.learningStyle)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Background Section */}
        {backgroundFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Background & History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Origin", character.origin)}
                {renderField("Upbringing", character.upbringing)}
                {renderField("Childhood", character.childhood)}
                {renderField("Family History", character.familyHistory)}
                {renderField("Social Class", character.socialClass)}
                {renderField("Economic Status", character.economicStatus)}
                {renderField("Education", character.education)}
                {renderField("Academic History", character.academicHistory)}
                {renderField("Personal Struggle", character.personalStruggle)}
                {renderField("Achievements", character.achievements)}
                {renderField("Failures", character.failures)}
                {renderField("Losses", character.losses)}
                {renderField("Victories", character.victories)}
                {renderField("Reputation", character.reputation)}
                {renderField("Family", character.family)}
                {renderField("Parents", character.parents)}
                {renderField("Siblings", character.siblings)}
                {renderField("Spouse", character.spouse)}
                {renderField("Children", character.children)}
                {renderField("Friends", character.friends)}
                {renderField("Social Circle", character.socialCircle)}
                {renderField("Community", character.community)}
                {renderField("Culture", character.culture)}
                {renderField("Traditions", character.traditions)}
                {renderField("Customs", character.customs)}
                {renderField("Religion", character.religion)}
                {renderField("Spirituality", character.spirituality)}
                {renderField("Political Views", character.politicalViews)}
              </div>
              {renderField("Background", character.background, "md:col-span-2")}
              {renderField("Backstory", character.backstory, "md:col-span-2")}
              {renderField("Formative Events", character.formativeEvents, "md:col-span-2")}
              {renderField("Life Changing Moments", character.lifeChangingMoments, "md:col-span-2")}
              {renderField("Challenges", character.challenges, "md:col-span-2")}
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
                {renderArrayField("Talents", character.talents)}
                {renderArrayField("Expertise", character.expertise)}
                {renderArrayField("Languages", character.languages)}
                {renderField("Native Language", character.nativeLanguage)}
                {renderField("Special Abilities", character.specialAbilities)}
                {renderField("Powers", character.powers)}
                {renderField("Magical Abilities", character.magicalAbilities)}
                {renderField("Magic Type", character.magicType)}
                {renderField("Magic Source", character.magicSource)}
                {renderField("Magic Limitations", character.magicLimitations)}
                {renderField("Superpowers", character.superpowers)}
                {renderField("Strengths", character.strengths)}
                {renderField("Competencies", character.competencies)}
                {renderField("Training", character.training)}
                {renderField("Experience", character.experience)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Story Section */}
        {storyFields && (
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Story Role & Arc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Role", character.role)}
                {renderField("Goals", character.goals)}
                {renderField("Objectives", character.objectives)}
                {renderField("Wants", character.wants)}
                {renderField("Obstacles", character.obstacles)}
                {renderField("Conflicts", character.conflicts)}
                {renderField("Conflict Sources", character.conflictSources)}
                {renderField("Stakes", character.stakes)}
                {renderField("Consequences", character.consequences)}
                {renderField("Arc", character.arc)}
                {renderField("Journey", character.journey)}
                {renderField("Transformation", character.transformation)}
                {renderField("Growth", character.growth)}
                {renderField("Allies", character.allies)}
                {renderField("Enemies", character.enemies)}
                {renderField("Mentors", character.mentors)}
                {renderField("Rivals", character.rivals)}
                {renderField("Connection to Events", character.connectionToEvents)}
                {renderField("Plot Relevance", character.plotRelevance)}
                {renderField("Story Function", character.storyFunction)}
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
                {renderArrayField("Tropes", character.tropes, "outline")}
                {renderField("Inspiration", character.inspiration)}
                {renderField("Based On", character.basedOn)}
                {renderField("Prose Vibe", character.proseVibe)}
              </div>
              {renderField("Notes", character.notes, "md:col-span-2")}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}