import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, User, Eye, Brain, Zap, BookOpen, Users, Settings, PenTool } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Language } from '../lib/types';

interface LanguageFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  language?: Language;
}

export function LanguageFormExpanded({ projectId, onCancel, language }: LanguageFormExpandedProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: language?.name || '',
    nicknames: language?.nicknames || '',
    title: language?.title || '',
    aliases: language?.aliases || '',
    race: language?.race || '',
    ethnicity: language?.ethnicity || '',
    class: language?.class || '',
    profession: language?.profession || '',
    occupation: language?.occupation || '',
    age: language?.age || '',
    birthdate: language?.birthdate || '',
    zodiacSign: language?.zodiacSign || '',
    role: language?.role || '',
    
    // Physical Appearance
    physicalDescription: language?.physicalDescription || '',
    height: language?.height || '',
    weight: language?.weight || '',
    build: language?.build || '',
    bodyType: language?.bodyType || '',
    facialFeatures: language?.facialFeatures || '',
    eyes: language?.eyes || '',
    eyeColor: language?.eyeColor || '',
    hair: language?.hair || '',
    hairColor: language?.hairColor || '',
    hairStyle: language?.hairStyle || '',
    facialHair: language?.facialHair || '',
    skin: language?.skin || '',
    skinTone: language?.skinTone || '',
    complexion: language?.complexion || '',
    scars: language?.scars || '',
    tattoos: language?.tattoos || '',
    piercings: language?.piercings || '',
    birthmarks: language?.birthmarks || '',
    distinguishingMarks: language?.distinguishingMarks || '',
    attire: language?.attire || '',
    clothingStyle: language?.clothingStyle || '',
    accessories: language?.accessories || '',
    posture: language?.posture || '',
    gait: language?.gait || '',
    gestures: language?.gestures || '',
    mannerisms: language?.mannerisms || '',
    
    // Core Language Details
    description: language?.description || '',
    languageSummary: language?.languageSummary || '',
    oneLine: language?.oneLine || '',
    
    // Personality
    personality: language?.personality || '',
    personalityTraits: language?.personalityTraits?.join(', ') || '',
    temperament: language?.temperament || '',
    disposition: language?.disposition || '',
    worldview: language?.worldview || '',
    beliefs: language?.beliefs || '',
    values: language?.values || '',
    principles: language?.principles || '',
    morals: language?.morals || '',
    ethics: language?.ethics || '',
    virtues: language?.virtues || '',
    vices: language?.vices || '',
    habits: language?.habits || '',
    quirks: language?.quirks || '',
    idiosyncrasies: language?.idiosyncrasies || '',
    petPeeves: language?.petPeeves || '',
    likes: language?.likes || '',
    dislikes: language?.dislikes || '',
    hobbies: language?.hobbies || '',
    interests: language?.interests || '',
    passions: language?.passions || '',
    
    // Psychological Profile
    motivations: language?.motivations || '',
    desires: language?.desires || '',
    needs: language?.needs || '',
    drives: language?.drives || '',
    ambitions: language?.ambitions || '',
    fears: language?.fears || '',
    phobias: language?.phobias || '',
    anxieties: language?.anxieties || '',
    insecurities: language?.insecurities || '',
    secrets: language?.secrets || '',
    shame: language?.shame || '',
    guilt: language?.guilt || '',
    regrets: language?.regrets || '',
    trauma: language?.trauma || '',
    wounds: language?.wounds || '',
    copingMechanisms: language?.copingMechanisms || '',
    defenses: language?.defenses || '',
    vulnerabilities: language?.vulnerabilities || '',
    weaknesses: language?.weaknesses || '',
    blindSpots: language?.blindSpots || '',
    mentalHealth: language?.mentalHealth || '',
    emotionalState: language?.emotionalState || '',
    maturityLevel: language?.maturityLevel || '',
    intelligenceType: language?.intelligenceType || '',
    learningStyle: language?.learningStyle || '',
    
    // Background & History
    background: language?.background || '',
    backstory: language?.backstory || '',
    origin: language?.origin || '',
    upbringing: language?.upbringing || '',
    childhood: language?.childhood || '',
    familyHistory: language?.familyHistory || '',
    socialClass: language?.socialClass || '',
    economicStatus: language?.economicStatus || '',
    education: language?.education || '',
    academicHistory: language?.academicHistory || '',
    formativeEvents: language?.formativeEvents || '',
    lifeChangingMoments: language?.lifeChangingMoments || '',
    personalStruggle: language?.personalStruggle || '',
    challenges: language?.challenges || '',
    achievements: language?.achievements || '',
    failures: language?.failures || '',
    losses: language?.losses || '',
    victories: language?.victories || '',
    reputation: language?.reputation || '',
    
    // Abilities & Skills
    abilities: language?.abilities?.join(', ') || '',
    skills: language?.skills?.join(', ') || '',
    talents: language?.talents?.join(', ') || '',
    expertise: language?.expertise?.join(', ') || '',
    specialAbilities: language?.specialAbilities || '',
    powers: language?.powers || '',
    magicalAbilities: language?.magicalAbilities || '',
    magicType: language?.magicType || '',
    magicSource: language?.magicSource || '',
    magicLimitations: language?.magicLimitations || '',
    superpowers: language?.superpowers || '',
    strengths: language?.strengths || '',
    competencies: language?.competencies || '',
    training: language?.training || '',
    experience: language?.experience || '',
    
    // Story Elements
    goals: language?.goals || '',
    objectives: language?.objectives || '',
    wants: language?.wants || '',
    obstacles: language?.obstacles || '',
    conflicts: language?.conflicts || '',
    conflictSources: language?.conflictSources || '',
    stakes: language?.stakes || '',
    consequences: language?.consequences || '',
    arc: language?.arc || '',
    journey: language?.journey || '',
    transformation: language?.transformation || '',
    growth: language?.growth || '',
    allies: language?.allies || '',
    enemies: language?.enemies || '',
    mentors: language?.mentors || '',
    rivals: language?.rivals || '',
    connectionToEvents: language?.connectionToEvents || '',
    plotRelevance: language?.plotRelevance || '',
    storyFunction: language?.storyFunction || '',
    
    // Language & Communication
    languages: language?.languages?.join(', ') || '',
    nativeLanguage: language?.nativeLanguage || '',
    accent: language?.accent || '',
    dialect: language?.dialect || '',
    voiceDescription: language?.voiceDescription || '',
    speechPatterns: language?.speechPatterns || '',
    vocabulary: language?.vocabulary || '',
    catchphrases: language?.catchphrases || '',
    slang: language?.slang || '',
    communicationStyle: language?.communicationStyle || '',
    
    // Social & Cultural
    family: language?.family || '',
    parents: language?.parents || '',
    siblings: language?.siblings || '',
    spouse: language?.spouse || '',
    children: language?.children || '',
    friends: language?.friends || '',
    socialCircle: language?.socialCircle || '',
    community: language?.community || '',
    culture: language?.culture || '',
    traditions: language?.traditions || '',
    customs: language?.customs || '',
    religion: language?.religion || '',
    spirituality: language?.spirituality || '',
    politicalViews: language?.politicalViews || '',
    
    // Meta Information
    archetypes: language?.archetypes?.join(', ') || '',
    tropes: language?.tropes?.join(', ') || '',
    inspiration: language?.inspiration || '',
    basedOn: language?.basedOn || '',
    tags: language?.tags?.join(', ') || '',
    genre: language?.genre || '',
    proseVibe: language?.proseVibe || '',
    narrativeRole: language?.narrativeRole || '',
    languageType: language?.languageType || '',
    importance: language?.importance || '',
    screenTime: language?.screenTime || '',
    firstAppearance: language?.firstAppearance || '',
    lastAppearance: language?.lastAppearance || '',
    
    // Writer's Notes
    notes: language?.notes || '',
    development: language?.development || '',
    evolution: language?.evolution || '',
    alternatives: language?.alternatives || '',
    unused: language?.unused || '',
    research: language?.research || '',
    references: language?.references || '',
    mood: language?.mood || '',
    theme: language?.theme || '',
    symbolism: language?.symbolism || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/projects/${projectId}/languages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create language');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
      onCancel();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/languages/${language?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update language');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
      onCancel();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      projectId,
      ...formData,
      personalityTraits: formData.personalityTraits.split(',').map(s => s.trim()).filter(Boolean),
      abilities: formData.abilities.split(',').map(s => s.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      talents: formData.talents.split(',').map(s => s.trim()).filter(Boolean),
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      archetypes: formData.archetypes.split(',').map(s => s.trim()).filter(Boolean),
      tropes: formData.tropes.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      isModelTrained: false,
      imageUrl: '',
    };

    if (language) {
      updateMutation.mutate(processedData);
    } else {
      // Generate ID for new language
      const newLanguageData = {
        ...processedData,
        id: Date.now().toString(),
      };
      createMutation.mutate(newLanguageData);
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
          Back to Languages
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Language'}
          </Button>
        </div>
      </div>

      <Card className="creative-card">
        <div className="p-6">
          <h1 className="font-title text-3xl mb-6">
            {language ? 'Edit Language' : 'Create New Language'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="identity" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Identity
                </TabsTrigger>
                <TabsTrigger value="physical" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Physical
                </TabsTrigger>
                <TabsTrigger value="personality" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  Personality
                </TabsTrigger>
                <TabsTrigger value="psychology" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  Psychology
                </TabsTrigger>
                <TabsTrigger value="background" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Background
                </TabsTrigger>
                <TabsTrigger value="abilities" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Abilities
                </TabsTrigger>
                <TabsTrigger value="story" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Story
                </TabsTrigger>
                <TabsTrigger value="meta" className="flex items-center gap-1">
                  <PenTool className="h-3 w-3" />
                  Meta
                </TabsTrigger>
              </TabsList>

              {/* Identity Tab */}
              <TabsContent value="identity" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Language's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nicknames">Nicknames</Label>
                    <Input
                      id="nicknames"
                      value={formData.nicknames}
                      onChange={(e) => updateField('nicknames', e.target.value)}
                      placeholder="Pet names, shortened names"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Lord, Dr., Captain, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="aliases">Aliases</Label>
                    <Input
                      id="aliases"
                      value={formData.aliases}
                      onChange={(e) => updateField('aliases', e.target.value)}
                      placeholder="Code names, false identities"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role in Story</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      placeholder="Protagonist, Antagonist, Supporting"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="race">Race/Species</Label>
                    <Input
                      id="race"
                      value={formData.race}
                      onChange={(e) => updateField('race', e.target.value)}
                      placeholder="Human, Elf, Dwarf, Alien, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="ethnicity">Ethnicity/Culture</Label>
                    <Input
                      id="ethnicity"
                      value={formData.ethnicity}
                      onChange={(e) => updateField('ethnicity', e.target.value)}
                      placeholder="Cultural/ethnic background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      placeholder="25, mid-thirties, ancient"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <Input
                      id="birthdate"
                      value={formData.birthdate}
                      onChange={(e) => updateField('birthdate', e.target.value)}
                      placeholder="March 15, 1985"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="class">Class</Label>
                    <Input
                      id="class"
                      value={formData.class}
                      onChange={(e) => updateField('class', e.target.value)}
                      placeholder="Warrior, Mage, Rogue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => updateField('profession', e.target.value)}
                      placeholder="Doctor, Teacher, Blacksmith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Current Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => updateField('occupation', e.target.value)}
                      placeholder="Current job or role"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oneLine">One-Line Description</Label>
                    <Input
                      id="oneLine"
                      value={formData.oneLine}
                      onChange={(e) => updateField('oneLine', e.target.value)}
                      placeholder="A single sentence that captures the essence of this language"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Language Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Overall description of the language"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="languageSummary">Language Summary</Label>
                    <Textarea
                      id="languageSummary"
                      value={formData.languageSummary}
                      onChange={(e) => updateField('languageSummary', e.target.value)}
                      placeholder="A comprehensive summary of who this language is"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Personality Tab */}
              <TabsContent value="personality" className="space-y-6">
                <div>
                  <Label htmlFor="personality">Overall Personality</Label>
                  <Textarea
                    id="personality"
                    value={formData.personality}
                    onChange={(e) => updateField('personality', e.target.value)}
                    placeholder="Describe the language's overall personality, temperament, and worldview"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personalityTraits">Personality Traits (comma-separated)</Label>
                    <Input
                      id="personalityTraits"
                      value={formData.personalityTraits}
                      onChange={(e) => updateField('personalityTraits', e.target.value)}
                      placeholder="brave, witty, stubborn, loyal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperament">Temperament</Label>
                    <Input
                      id="temperament"
                      value={formData.temperament}
                      onChange={(e) => updateField('temperament', e.target.value)}
                      placeholder="calm, fiery, melancholic, optimistic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="beliefs">Beliefs & Values</Label>
                    <Textarea
                      id="beliefs"
                      value={formData.beliefs}
                      onChange={(e) => updateField('beliefs', e.target.value)}
                      placeholder="What they believe in, their core values"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="worldview">Worldview</Label>
                    <Textarea
                      id="worldview"
                      value={formData.worldview}
                      onChange={(e) => updateField('worldview', e.target.value)}
                      placeholder="How they see the world, their philosophy"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="likes">Likes</Label>
                    <Textarea
                      id="likes"
                      value={formData.likes}
                      onChange={(e) => updateField('likes', e.target.value)}
                      placeholder="Things they enjoy"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dislikes">Dislikes</Label>
                    <Textarea
                      id="dislikes"
                      value={formData.dislikes}
                      onChange={(e) => updateField('dislikes', e.target.value)}
                      placeholder="Things they hate or avoid"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quirks">Quirks & Habits</Label>
                    <Textarea
                      id="quirks"
                      value={formData.quirks}
                      onChange={(e) => updateField('quirks', e.target.value)}
                      placeholder="Unique mannerisms, habits"
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Psychology Tab */}
              <TabsContent value="psychology" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motivations">Motivations</Label>
                    <Textarea
                      id="motivations"
                      value={formData.motivations}
                      onChange={(e) => updateField('motivations', e.target.value)}
                      placeholder="What drives them, their deepest desires"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fears">Fears</Label>
                    <Textarea
                      id="fears"
                      value={formData.fears}
                      onChange={(e) => updateField('fears', e.target.value)}
                      placeholder="What they're afraid of, phobias"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secrets">Secrets</Label>
                    <Textarea
                      id="secrets"
                      value={formData.secrets}
                      onChange={(e) => updateField('secrets', e.target.value)}
                      placeholder="What they're hiding, dark secrets"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="trauma">Trauma & Wounds</Label>
                    <Textarea
                      id="trauma"
                      value={formData.trauma}
                      onChange={(e) => updateField('trauma', e.target.value)}
                      placeholder="Past hurts, emotional wounds, trauma"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vulnerabilities">Vulnerabilities</Label>
                    <Textarea
                      id="vulnerabilities"
                      value={formData.vulnerabilities}
                      onChange={(e) => updateField('vulnerabilities', e.target.value)}
                      placeholder="Emotional weak points, what can hurt them"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="copingMechanisms">Coping Mechanisms</Label>
                    <Textarea
                      id="copingMechanisms"
                      value={formData.copingMechanisms}
                      onChange={(e) => updateField('copingMechanisms', e.target.value)}
                      placeholder="How they deal with stress, pain, difficulty"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Background Tab */}
              <TabsContent value="background" className="space-y-6">
                <div>
                  <Label htmlFor="backstory">Backstory</Label>
                  <Textarea
                    id="backstory"
                    value={formData.backstory}
                    onChange={(e) => updateField('backstory', e.target.value)}
                    placeholder="Their life story, history, background"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="childhood">Childhood</Label>
                    <Textarea
                      id="childhood"
                      value={formData.childhood}
                      onChange={(e) => updateField('childhood', e.target.value)}
                      placeholder="Their early years, formative experiences"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="family">Family</Label>
                    <Textarea
                      id="family"
                      value={formData.family}
                      onChange={(e) => updateField('family', e.target.value)}
                      placeholder="Parents, siblings, family relationships"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => updateField('education', e.target.value)}
                      placeholder="Schooling, training, mentors"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="formativeEvents">Formative Events</Label>
                    <Textarea
                      id="formativeEvents"
                      value={formData.formativeEvents}
                      onChange={(e) => updateField('formativeEvents', e.target.value)}
                      placeholder="Key events that shaped who they are"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Abilities Tab */}
              <TabsContent value="abilities" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="abilities">Abilities (comma-separated)</Label>
                    <Input
                      id="abilities"
                      value={formData.abilities}
                      onChange={(e) => updateField('abilities', e.target.value)}
                      placeholder="flight, telepathy, super strength"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => updateField('skills', e.target.value)}
                      placeholder="swordsmanship, medicine, persuasion"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="talents">Talents (comma-separated)</Label>
                    <Input
                      id="talents"
                      value={formData.talents}
                      onChange={(e) => updateField('talents', e.target.value)}
                      placeholder="music, art, leadership"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strengths">Strengths</Label>
                    <Input
                      id="strengths"
                      value={formData.strengths}
                      onChange={(e) => updateField('strengths', e.target.value)}
                      placeholder="determination, intelligence, empathy"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialAbilities">Special Abilities</Label>
                  <Textarea
                    id="specialAbilities"
                    value={formData.specialAbilities}
                    onChange={(e) => updateField('specialAbilities', e.target.value)}
                    placeholder="Detailed description of unique powers or abilities"
                    rows={4}
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Magic & Supernatural</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="magicalAbilities">Magical Abilities</Label>
                      <Textarea
                        id="magicalAbilities"
                        value={formData.magicalAbilities}
                        onChange={(e) => updateField('magicalAbilities', e.target.value)}
                        placeholder="Specific magical powers and spells"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="magicType">Magic Type</Label>
                      <Input
                        id="magicType"
                        value={formData.magicType}
                        onChange={(e) => updateField('magicType', e.target.value)}
                        placeholder="Elemental, Divine, Arcane, etc."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="magicSource">Magic Source</Label>
                      <Textarea
                        id="magicSource"
                        value={formData.magicSource}
                        onChange={(e) => updateField('magicSource', e.target.value)}
                        placeholder="Where their magic comes from (bloodline, training, artifact, etc.)"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="magicLimitations">Magic Limitations</Label>
                      <Textarea
                        id="magicLimitations"
                        value={formData.magicLimitations}
                        onChange={(e) => updateField('magicLimitations', e.target.value)}
                        placeholder="What restricts or limits their magical abilities"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Story Tab */}
              <TabsContent value="story" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => updateField('goals', e.target.value)}
                      placeholder="What they want to achieve"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="obstacles">Obstacles</Label>
                    <Textarea
                      id="obstacles"
                      value={formData.obstacles}
                      onChange={(e) => updateField('obstacles', e.target.value)}
                      placeholder="What stands in their way"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arc">Language Arc</Label>
                    <Textarea
                      id="arc"
                      value={formData.arc}
                      onChange={(e) => updateField('arc', e.target.value)}
                      placeholder="How they change throughout the story"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="conflicts">Conflicts</Label>
                    <Textarea
                      id="conflicts"
                      value={formData.conflicts}
                      onChange={(e) => updateField('conflicts', e.target.value)}
                      placeholder="Internal and external conflicts"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="allies">Allies & Friends</Label>
                    <Textarea
                      id="allies"
                      value={formData.allies}
                      onChange={(e) => updateField('allies', e.target.value)}
                      placeholder="Who supports them"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="enemies">Enemies & Rivals</Label>
                    <Textarea
                      id="enemies"
                      value={formData.enemies}
                      onChange={(e) => updateField('enemies', e.target.value)}
                      placeholder="Who opposes them"
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="physical" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      placeholder="5'8&quot;, tall, short"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight/Build</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      placeholder="Lean, muscular, heavy-set"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eyeColor">Eye Color</Label>
                    <Input
                      id="eyeColor"
                      value={formData.eyeColor}
                      onChange={(e) => updateField('eyeColor', e.target.value)}
                      placeholder="Brown, blue, green, hazel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hairColor">Hair Color</Label>
                    <Input
                      id="hairColor"
                      value={formData.hairColor}
                      onChange={(e) => updateField('hairColor', e.target.value)}
                      placeholder="Blonde, brunette, black, red"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hairStyle">Hair Style</Label>
                    <Input
                      id="hairStyle"
                      value={formData.hairStyle}
                      onChange={(e) => updateField('hairStyle', e.target.value)}
                      placeholder="Long, short, curly, straight"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skinTone">Skin Tone</Label>
                    <Input
                      id="skinTone"
                      value={formData.skinTone}
                      onChange={(e) => updateField('skinTone', e.target.value)}
                      placeholder="Fair, olive, dark, tanned"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="physicalDescription">Overall Physical Description</Label>
                  <Textarea
                    id="physicalDescription"
                    value={formData.physicalDescription}
                    onChange={(e) => updateField('physicalDescription', e.target.value)}
                    placeholder="Detailed physical appearance description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="distinguishingMarks">Distinguishing Marks</Label>
                    <Textarea
                      id="distinguishingMarks"
                      value={formData.distinguishingMarks}
                      onChange={(e) => updateField('distinguishingMarks', e.target.value)}
                      placeholder="Scars, tattoos, birthmarks, etc."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clothingStyle">Clothing Style</Label>
                    <Textarea
                      id="clothingStyle"
                      value={formData.clothingStyle}
                      onChange={(e) => updateField('clothingStyle', e.target.value)}
                      placeholder="How they typically dress"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>


              <TabsContent value="meta" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => updateField('tags', e.target.value)}
                      placeholder="major language, love interest, comic relief"
                    />
                  </div>
                  <div>
                    <Label htmlFor="archetypes">Archetypes (comma-separated)</Label>
                    <Input
                      id="archetypes"
                      value={formData.archetypes}
                      onChange={(e) => updateField('archetypes', e.target.value)}
                      placeholder="Hero, Mentor, Trickster, Sage"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Writer's Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Personal notes about this language's development, inspiration, changes, etc."
                    rows={6}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </Card>
    </div>
  );
}