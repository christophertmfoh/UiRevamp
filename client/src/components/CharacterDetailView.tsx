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

  // Define sections matching EXACTLY the 8 tabs from CharacterFormExpanded
  const identityFields = hasContent([
    character.name, character.nicknames, character.title, character.aliases,
    character.race, character.ethnicity, character.class, character.profession,
    character.occupation, character.age, character.birthdate, character.zodiacSign,
    character.role, character.description, character.characterSummary, character.oneLine
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
    character.victories, character.reputation
  ]);

  const abilitiesFields = hasContent([
    character.abilities, character.skills, character.talents, character.expertise,
    character.specialAbilities, character.powers, character.magicalAbilities,
    character.magicType, character.magicSource, character.magicLimitations,
    character.superpowers, character.strengths, character.competencies,
    character.training, character.experience
  ]);

  const storyFields = hasContent([
    character.goals, character.objectives, character.wants, character.obstacles,
    character.conflicts, character.conflictSources, character.stakes, character.consequences,
    character.arc, character.journey, character.transformation, character.growth,
    character.allies, character.enemies, character.mentors, character.rivals,
    character.connectionToEvents, character.plotRelevance, character.storyFunction
  ]);

  const languageFields = hasContent([
    character.languages, character.nativeLanguage, character.accent, character.dialect,
    character.voiceDescription, character.speechPatterns, character.vocabulary,
    character.catchphrases, character.slang, character.communicationStyle
  ]);

  const socialFields = hasContent([
    character.family, character.parents, character.siblings, character.spouse,
    character.children, character.friends, character.socialCircle, character.community,
    character.culture, character.traditions, character.customs, character.religion,
    character.spirituality, character.politicalViews
  ]);

  const metaFields = hasContent([
    character.archetypes, character.tropes, character.inspiration, character.basedOn,
    character.tags, character.genre, character.proseVibe, character.narrativeRole,
    character.characterType, character.importance, character.screenTime,
    character.firstAppearance, character.lastAppearance, character.notes,
    character.development, character.evolution, character.alternatives,
    character.unused, character.research, character.references, character.mood,
    character.theme, character.symbolism
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
              {/* Basic Names */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Name", character.name)}
                {renderField("Nicknames", character.nicknames)}
                {renderField("Title", character.title)}
                {renderField("Aliases", character.aliases)}
                {renderField("Role in Story", character.role)}
              </div>
              
              {/* Demographics */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Race/Species", character.race)}
                {renderField("Ethnicity/Culture", character.ethnicity)}
                {renderField("Age", character.age)}
                {renderField("Birth Date", character.birthdate)}
                {renderField("Zodiac Sign", character.zodiacSign)}
              </div>
              
              {/* Professional */}
              <div className="grid gap-4 md:grid-cols-3">
                {renderField("Class", character.class)}
                {renderField("Profession", character.profession)}
                {renderField("Current Occupation", character.occupation)}
              </div>
              
              {/* Descriptions */}
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
              {/* Overall Description */}
              <div>
                {renderField("Physical Description", character.physicalDescription)}
              </div>
              
              {/* Basic Measurements */}
              <div className="grid gap-4 md:grid-cols-3">
                {renderField("Height", character.height)}
                {renderField("Weight", character.weight)}
                {renderField("Build", character.build)}
                {renderField("Body Type", character.bodyType)}
              </div>
              
              {/* Facial Features */}
              <div className="space-y-4">
                {renderField("Facial Features", character.facialFeatures)}
                <div className="grid gap-4 md:grid-cols-2">
                  {renderField("Eyes", character.eyes)}
                  {renderField("Eye Color", character.eyeColor)}
                </div>
              </div>
              
              {/* Hair */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Hair", character.hair)}
                {renderField("Hair Color", character.hairColor)}
                {renderField("Hair Style", character.hairStyle)}
                {renderField("Facial Hair", character.facialHair)}
              </div>
              
              {/* Skin */}
              <div className="grid gap-4 md:grid-cols-3">
                {renderField("Skin", character.skin)}
                {renderField("Skin Tone", character.skinTone)}
                {renderField("Complexion", character.complexion)}
              </div>
              
              {/* Distinguishing Features */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Scars", character.scars)}
                {renderField("Tattoos", character.tattoos)}
                {renderField("Piercings", character.piercings)}
                {renderField("Birthmarks", character.birthmarks)}
                {renderField("Distinguishing Marks", character.distinguishingMarks)}
              </div>
              
              {/* Style & Presentation */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Attire", character.attire)}
                {renderField("Clothing Style", character.clothingStyle)}
                {renderField("Accessories", character.accessories)}
              </div>
              
              {/* Movement & Behavior */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Posture", character.posture)}
                {renderField("Gait", character.gait)}
                {renderField("Gestures", character.gestures)}
                {renderField("Mannerisms", character.mannerisms)}
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
              {/* Overall Personality */}
              <div>
                {renderField("Overall Personality", character.personality)}
              </div>
              
              {/* Core Traits */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Personality Traits", character.personalityTraits)}
                {renderField("Temperament", character.temperament)}
              </div>
              
              {/* Beliefs & Values */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Beliefs & Values", character.beliefs)}
                {renderField("Worldview", character.worldview)}
              </div>
              
              {/* Moral Framework */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Values", character.values)}
                {renderField("Principles", character.principles)}
                {renderField("Morals", character.morals)}
                {renderField("Ethics", character.ethics)}
                {renderField("Virtues", character.virtues)}
                {renderField("Vices", character.vices)}
              </div>
              
              {/* Behavioral Patterns */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Habits", character.habits)}
                {renderField("Quirks", character.quirks)}
                {renderField("Idiosyncrasies", character.idiosyncrasies)}
                {renderField("Pet Peeves", character.petPeeves)}
              </div>
              
              {/* Preferences */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Likes", character.likes)}
                {renderField("Dislikes", character.dislikes)}
                {renderField("Hobbies", character.hobbies)}
                {renderField("Interests", character.interests)}
                {renderField("Passions", character.passions)}
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
              {/* Core Drives */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Motivations", character.motivations)}
                {renderField("Desires", character.desires)}
                {renderField("Needs", character.needs)}
                {renderField("Drives", character.drives)}
                {renderField("Ambitions", character.ambitions)}
              </div>
              
              {/* Fears & Anxieties */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Fears", character.fears)}
                {renderField("Phobias", character.phobias)}
                {renderField("Anxieties", character.anxieties)}
                {renderField("Insecurities", character.insecurities)}
              </div>
              
              {/* Inner Life */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Secrets", character.secrets)}
                {renderField("Shame", character.shame)}
                {renderField("Guilt", character.guilt)}
                {renderField("Regrets", character.regrets)}
              </div>
              
              {/* Trauma & Healing */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Trauma", character.trauma)}
                {renderField("Wounds", character.wounds)}
                {renderField("Coping Mechanisms", character.copingMechanisms)}
                {renderField("Defenses", character.defenses)}
              </div>
              
              {/* Vulnerabilities */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Vulnerabilities", character.vulnerabilities)}
                {renderField("Weaknesses", character.weaknesses)}
                {renderField("Blind Spots", character.blindSpots)}
              </div>
              
              {/* Mental Framework */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Mental Health", character.mentalHealth)}
                {renderField("Emotional State", character.emotionalState)}
                {renderField("Maturity Level", character.maturityLevel)}
                {renderField("Intelligence Type", character.intelligenceType)}
                {renderField("Learning Style", character.learningStyle)}
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
              {/* Core Background */}
              <div className="space-y-4">
                {renderField("Background", character.background)}
                {renderField("Backstory", character.backstory)}
              </div>
              
              {/* Origins */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Origin", character.origin)}
                {renderField("Upbringing", character.upbringing)}
                {renderField("Childhood", character.childhood)}
                {renderField("Family History", character.familyHistory)}
              </div>
              
              {/* Social Status */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Social Class", character.socialClass)}
                {renderField("Economic Status", character.economicStatus)}
              </div>
              
              {/* Education */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Education", character.education)}
                {renderField("Academic History", character.academicHistory)}
              </div>
              
              {/* Life Events */}
              <div className="space-y-4">
                {renderField("Formative Events", character.formativeEvents)}
                {renderField("Life Changing Moments", character.lifeChangingMoments)}
              </div>
              
              {/* Experiences */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Personal Struggle", character.personalStruggle)}
                {renderField("Challenges", character.challenges)}
                {renderField("Achievements", character.achievements)}
                {renderField("Failures", character.failures)}
                {renderField("Losses", character.losses)}
                {renderField("Victories", character.victories)}
                {renderField("Reputation", character.reputation)}
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
              {/* Core Abilities */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Abilities", character.abilities)}
                {renderArrayField("Skills", character.skills)}
                {renderArrayField("Talents", character.talents)}
                {renderArrayField("Expertise", character.expertise)}
              </div>
              
              {/* Special Powers */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Special Abilities", character.specialAbilities)}
                {renderField("Powers", character.powers)}
                {renderField("Superpowers", character.superpowers)}
              </div>
              
              {/* Magic System */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Magical Abilities", character.magicalAbilities)}
                {renderField("Magic Type", character.magicType)}
                {renderField("Magic Source", character.magicSource)}
                {renderField("Magic Limitations", character.magicLimitations)}
              </div>
              
              {/* General Competencies */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Strengths", character.strengths)}
                {renderField("Competencies", character.competencies)}
                {renderField("Training", character.training)}
                {renderField("Experience", character.experience)}
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
              {/* Goals & Objectives */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Goals", character.goals)}
                {renderField("Objectives", character.objectives)}
                {renderField("Wants", character.wants)}
              </div>
              
              {/* Conflicts & Obstacles */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Obstacles", character.obstacles)}
                {renderField("Conflicts", character.conflicts)}
                {renderField("Conflict Sources", character.conflictSources)}
                {renderField("Stakes", character.stakes)}
                {renderField("Consequences", character.consequences)}
              </div>
              
              {/* Character Development */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Arc", character.arc)}
                {renderField("Journey", character.journey)}
                {renderField("Transformation", character.transformation)}
                {renderField("Growth", character.growth)}
              </div>
              
              {/* Relationships */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Allies", character.allies)}
                {renderField("Enemies", character.enemies)}
                {renderField("Mentors", character.mentors)}
                {renderField("Rivals", character.rivals)}
              </div>
              
              {/* Plot Integration */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Connection to Events", character.connectionToEvents)}
                {renderField("Plot Relevance", character.plotRelevance)}
                {renderField("Story Function", character.storyFunction)}
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
            <CardContent className="space-y-6">
              {/* Character Analysis */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Archetypes", character.archetypes, "secondary")}
                {renderArrayField("Tropes", character.tropes, "outline")}
                {renderField("Inspiration", character.inspiration)}
                {renderField("Based On", character.basedOn)}
              </div>
              
              {/* Classification */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderArrayField("Tags", character.tags)}
                {renderField("Genre", character.genre)}
                {renderField("Prose Vibe", character.proseVibe)}
                {renderField("Narrative Role", character.narrativeRole)}
                {renderField("Character Type", character.characterType)}
              </div>
              
              {/* Story Mechanics */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("Importance", character.importance)}
                {renderField("Screen Time", character.screenTime)}
                {renderField("First Appearance", character.firstAppearance)}
                {renderField("Last Appearance", character.lastAppearance)}
              </div>
              
              {/* Writer's Notes */}
              <div className="space-y-4">
                {renderField("Notes", character.notes)}
                {renderField("Development", character.development)}
                {renderField("Evolution", character.evolution)}
                {renderField("Alternatives", character.alternatives)}
                {renderField("Unused", character.unused)}
                {renderField("Research", character.research)}
                {renderField("References", character.references)}
              </div>
              
              {/* Thematic Elements */}
              <div className="grid gap-4 md:grid-cols-3">
                {renderField("Mood", character.mood)}
                {renderField("Theme", character.theme)}
                {renderField("Symbolism", character.symbolism)}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}