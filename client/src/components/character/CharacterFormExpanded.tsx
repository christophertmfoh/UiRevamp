import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../lib/types';

interface CharacterFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  character?: Character;
}

export function CharacterFormExpanded({ projectId, onCancel, character }: CharacterFormExpandedProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: character?.name || '',
    nicknames: character?.nicknames || '',
    title: character?.title || '',
    aliases: character?.aliases || '',
    race: character?.race || '',
    ethnicity: character?.ethnicity || '',
    class: character?.class || '',
    profession: character?.profession || '',
    occupation: character?.occupation || '',
    age: character?.age || '',
    birthdate: character?.birthdate || '',
    zodiacSign: character?.zodiacSign || '',
    role: character?.role || '',
    
    // Physical Appearance
    physicalDescription: character?.physicalDescription || '',
    height: character?.height || '',
    weight: character?.weight || '',
    build: character?.build || '',
    bodyType: character?.bodyType || '',
    facialFeatures: character?.facialFeatures || '',
    eyes: character?.eyes || '',
    eyeColor: character?.eyeColor || '',
    hair: character?.hair || '',
    hairColor: character?.hairColor || '',
    hairStyle: character?.hairStyle || '',
    facialHair: character?.facialHair || '',
    skin: character?.skin || '',
    skinTone: character?.skinTone || '',
    complexion: character?.complexion || '',
    scars: character?.scars || '',
    tattoos: character?.tattoos || '',
    piercings: character?.piercings || '',
    birthmarks: character?.birthmarks || '',
    distinguishingMarks: character?.distinguishingMarks || '',
    attire: character?.attire || '',
    clothingStyle: character?.clothingStyle || '',
    accessories: character?.accessories || '',
    posture: character?.posture || '',
    gait: character?.gait || '',
    gestures: character?.gestures || '',
    mannerisms: character?.mannerisms || '',
    
    // Core Character Details
    description: character?.description || '',
    characterSummary: character?.characterSummary || '',
    oneLine: character?.oneLine || '',
    
    // Personality
    personality: character?.personality || '',
    personalityTraits: character?.personalityTraits?.join(', ') || '',
    temperament: character?.temperament || '',
    disposition: character?.disposition || '',
    worldview: character?.worldview || '',
    beliefs: character?.beliefs || '',
    values: character?.values || '',
    principles: character?.principles || '',
    morals: character?.morals || '',
    ethics: character?.ethics || '',
    virtues: character?.virtues || '',
    vices: character?.vices || '',
    habits: character?.habits || '',
    quirks: character?.quirks || '',
    idiosyncrasies: character?.idiosyncrasies || '',
    petPeeves: character?.petPeeves || '',
    likes: character?.likes || '',
    dislikes: character?.dislikes || '',
    hobbies: character?.hobbies || '',
    interests: character?.interests || '',
    passions: character?.passions || '',
    
    // Psychological Profile
    motivations: character?.motivations || '',
    desires: character?.desires || '',
    needs: character?.needs || '',
    drives: character?.drives || '',
    ambitions: character?.ambitions || '',
    fears: character?.fears || '',
    phobias: character?.phobias || '',
    anxieties: character?.anxieties || '',
    insecurities: character?.insecurities || '',
    secrets: character?.secrets || '',
    shame: character?.shame || '',
    guilt: character?.guilt || '',
    regrets: character?.regrets || '',
    trauma: character?.trauma || '',
    wounds: character?.wounds || '',
    copingMechanisms: character?.copingMechanisms || '',
    defenses: character?.defenses || '',
    vulnerabilities: character?.vulnerabilities || '',
    weaknesses: character?.weaknesses || '',
    blindSpots: character?.blindSpots || '',
    mentalHealth: character?.mentalHealth || '',
    emotionalState: character?.emotionalState || '',
    maturityLevel: character?.maturityLevel || '',
    intelligenceType: character?.intelligenceType || '',
    learningStyle: character?.learningStyle || '',
    
    // Background & History
    background: character?.background || '',
    backstory: character?.backstory || '',
    origin: character?.origin || '',
    upbringing: character?.upbringing || '',
    childhood: character?.childhood || '',
    familyHistory: character?.familyHistory || '',
    socialClass: character?.socialClass || '',
    economicStatus: character?.economicStatus || '',
    education: character?.education || '',
    academicHistory: character?.academicHistory || '',
    formativeEvents: character?.formativeEvents || '',
    lifeChangingMoments: character?.lifeChangingMoments || '',
    personalStruggle: character?.personalStruggle || '',
    challenges: character?.challenges || '',
    achievements: character?.achievements || '',
    failures: character?.failures || '',
    losses: character?.losses || '',
    victories: character?.victories || '',
    reputation: character?.reputation || '',
    
    // Abilities & Skills
    abilities: character?.abilities?.join(', ') || '',
    skills: character?.skills?.join(', ') || '',
    talents: character?.talents?.join(', ') || '',
    expertise: character?.expertise?.join(', ') || '',
    specialAbilities: character?.specialAbilities || '',
    powers: character?.powers || '',
    magicalAbilities: character?.magicalAbilities || '',
    magicType: character?.magicType || '',
    magicSource: character?.magicSource || '',
    magicLimitations: character?.magicLimitations || '',
    superpowers: character?.superpowers || '',
    strengths: character?.strengths || '',
    competencies: character?.competencies || '',
    training: character?.training || '',
    experience: character?.experience || '',
    
    // Story Elements
    goals: character?.goals || '',
    objectives: character?.objectives || '',
    wants: character?.wants || '',
    obstacles: character?.obstacles || '',
    conflicts: character?.conflicts || '',
    conflictSources: character?.conflictSources || '',
    stakes: character?.stakes || '',
    consequences: character?.consequences || '',
    arc: character?.arc || '',
    journey: character?.journey || '',
    transformation: character?.transformation || '',
    growth: character?.growth || '',
    allies: character?.allies || '',
    enemies: character?.enemies || '',
    mentors: character?.mentors || '',
    rivals: character?.rivals || '',
    connectionToEvents: character?.connectionToEvents || '',
    plotRelevance: character?.plotRelevance || '',
    storyFunction: character?.storyFunction || '',
    
    // Language & Communication
    languages: character?.languages?.join(', ') || '',
    nativeLanguage: character?.nativeLanguage || '',
    accent: character?.accent || '',
    dialect: character?.dialect || '',
    voiceDescription: character?.voiceDescription || '',
    speechPatterns: character?.speechPatterns || '',
    vocabulary: character?.vocabulary || '',
    catchphrases: character?.catchphrases || '',
    slang: character?.slang || '',
    communicationStyle: character?.communicationStyle || '',
    
    // Social & Cultural
    family: character?.family || '',
    parents: character?.parents || '',
    siblings: character?.siblings || '',
    spouse: character?.spouse || '',
    children: character?.children || '',
    friends: character?.friends || '',
    socialCircle: character?.socialCircle || '',
    community: character?.community || '',
    culture: character?.culture || '',
    traditions: character?.traditions || '',
    customs: character?.customs || '',
    religion: character?.religion || '',
    spirituality: character?.spirituality || '',
    politicalViews: character?.politicalViews || '',
    
    // Meta Information
    archetypes: character?.archetypes?.join(', ') || '',
    tropes: character?.tropes?.join(', ') || '',
    inspiration: character?.inspiration || '',
    basedOn: character?.basedOn || '',
    tags: character?.tags?.join(', ') || '',
    genre: character?.genre || '',
    proseVibe: character?.proseVibe || '',
    narrativeRole: character?.narrativeRole || '',
    characterType: character?.characterType || '',
    importance: character?.importance || '',
    screenTime: character?.screenTime || '',
    firstAppearance: character?.firstAppearance || '',
    lastAppearance: character?.lastAppearance || '',
    
    // Writer's Notes
    notes: character?.notes || '',
    development: character?.development || '',
    evolution: character?.evolution || '',
    alternatives: character?.alternatives || '',
    unused: character?.unused || '',
    research: character?.research || '',
    references: character?.references || '',
    mood: character?.mood || '',
    theme: character?.theme || '',
    symbolism: character?.symbolism || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/projects/${projectId}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create character');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onCancel();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/characters/${character?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update character');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
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

    if (character) {
      updateMutation.mutate(processedData);
    } else {
      // Generate ID for new character
      const newCharacterData = {
        ...processedData,
        id: Date.now().toString(),
      };
      createMutation.mutate(newCharacterData);
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
          Back to Characters
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Character'}
          </Button>
        </div>
      </div>

      <Card className="creative-card">
        <div className="p-6">
          <h1 className="font-title text-3xl mb-6">
            {character ? 'Edit Character' : 'Create New Character'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="grid w-full grid-cols-8 gap-1 bg-transparent">
                <TabsTrigger 
                  value="identity"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Identity
                </TabsTrigger>
                <TabsTrigger 
                  value="physical"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Physical
                </TabsTrigger>
                <TabsTrigger 
                  value="personality"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Personality
                </TabsTrigger>
                <TabsTrigger 
                  value="psychology"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Psychology
                </TabsTrigger>
                <TabsTrigger 
                  value="background"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Background
                </TabsTrigger>
                <TabsTrigger 
                  value="abilities"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Abilities
                </TabsTrigger>
                <TabsTrigger 
                  value="story"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
                  Story
                </TabsTrigger>
                <TabsTrigger 
                  value="meta"
                  className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                >
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
                      placeholder="Character's full name"
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
                      placeholder="A single sentence that captures the essence of this character"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Character Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Overall description of the character"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="characterSummary">Character Summary</Label>
                    <Textarea
                      id="characterSummary"
                      value={formData.characterSummary}
                      onChange={(e) => updateField('characterSummary', e.target.value)}
                      placeholder="A comprehensive summary of who this character is"
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
                    placeholder="Describe the character's overall personality, temperament, and worldview"
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
                    <Label htmlFor="arc">Character Arc</Label>
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
                      placeholder="major character, love interest, comic relief"
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
                    placeholder="Personal notes about this character's development, inspiration, changes, etc."
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