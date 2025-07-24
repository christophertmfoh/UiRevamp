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
import type { TimelineEvent } from '../lib/types';

interface TimelineEventFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  timelineevent?: TimelineEvent;
}

export function TimelineEventFormExpanded({ projectId, onCancel, timelineevent }: TimelineEventFormExpandedProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: timelineevent?.name || '',
    nicknames: timelineevent?.nicknames || '',
    title: timelineevent?.title || '',
    aliases: timelineevent?.aliases || '',
    race: timelineevent?.race || '',
    ethnicity: timelineevent?.ethnicity || '',
    class: timelineevent?.class || '',
    profession: timelineevent?.profession || '',
    occupation: timelineevent?.occupation || '',
    age: timelineevent?.age || '',
    birthdate: timelineevent?.birthdate || '',
    zodiacSign: timelineevent?.zodiacSign || '',
    role: timelineevent?.role || '',
    
    // Physical Appearance
    physicalDescription: timelineevent?.physicalDescription || '',
    height: timelineevent?.height || '',
    weight: timelineevent?.weight || '',
    build: timelineevent?.build || '',
    bodyType: timelineevent?.bodyType || '',
    facialFeatures: timelineevent?.facialFeatures || '',
    eyes: timelineevent?.eyes || '',
    eyeColor: timelineevent?.eyeColor || '',
    hair: timelineevent?.hair || '',
    hairColor: timelineevent?.hairColor || '',
    hairStyle: timelineevent?.hairStyle || '',
    facialHair: timelineevent?.facialHair || '',
    skin: timelineevent?.skin || '',
    skinTone: timelineevent?.skinTone || '',
    complexion: timelineevent?.complexion || '',
    scars: timelineevent?.scars || '',
    tattoos: timelineevent?.tattoos || '',
    piercings: timelineevent?.piercings || '',
    birthmarks: timelineevent?.birthmarks || '',
    distinguishingMarks: timelineevent?.distinguishingMarks || '',
    attire: timelineevent?.attire || '',
    clothingStyle: timelineevent?.clothingStyle || '',
    accessories: timelineevent?.accessories || '',
    posture: timelineevent?.posture || '',
    gait: timelineevent?.gait || '',
    gestures: timelineevent?.gestures || '',
    mannerisms: timelineevent?.mannerisms || '',
    
    // Core TimelineEvent Details
    description: timelineevent?.description || '',
    timelineeventSummary: timelineevent?.timelineeventSummary || '',
    oneLine: timelineevent?.oneLine || '',
    
    // Personality
    personality: timelineevent?.personality || '',
    personalityTraits: timelineevent?.personalityTraits?.join(', ') || '',
    temperament: timelineevent?.temperament || '',
    disposition: timelineevent?.disposition || '',
    worldview: timelineevent?.worldview || '',
    beliefs: timelineevent?.beliefs || '',
    values: timelineevent?.values || '',
    principles: timelineevent?.principles || '',
    morals: timelineevent?.morals || '',
    ethics: timelineevent?.ethics || '',
    virtues: timelineevent?.virtues || '',
    vices: timelineevent?.vices || '',
    habits: timelineevent?.habits || '',
    quirks: timelineevent?.quirks || '',
    idiosyncrasies: timelineevent?.idiosyncrasies || '',
    petPeeves: timelineevent?.petPeeves || '',
    likes: timelineevent?.likes || '',
    dislikes: timelineevent?.dislikes || '',
    hobbies: timelineevent?.hobbies || '',
    interests: timelineevent?.interests || '',
    passions: timelineevent?.passions || '',
    
    // Psychological Profile
    motivations: timelineevent?.motivations || '',
    desires: timelineevent?.desires || '',
    needs: timelineevent?.needs || '',
    drives: timelineevent?.drives || '',
    ambitions: timelineevent?.ambitions || '',
    fears: timelineevent?.fears || '',
    phobias: timelineevent?.phobias || '',
    anxieties: timelineevent?.anxieties || '',
    insecurities: timelineevent?.insecurities || '',
    secrets: timelineevent?.secrets || '',
    shame: timelineevent?.shame || '',
    guilt: timelineevent?.guilt || '',
    regrets: timelineevent?.regrets || '',
    trauma: timelineevent?.trauma || '',
    wounds: timelineevent?.wounds || '',
    copingMechanisms: timelineevent?.copingMechanisms || '',
    defenses: timelineevent?.defenses || '',
    vulnerabilities: timelineevent?.vulnerabilities || '',
    weaknesses: timelineevent?.weaknesses || '',
    blindSpots: timelineevent?.blindSpots || '',
    mentalHealth: timelineevent?.mentalHealth || '',
    emotionalState: timelineevent?.emotionalState || '',
    maturityLevel: timelineevent?.maturityLevel || '',
    intelligenceType: timelineevent?.intelligenceType || '',
    learningStyle: timelineevent?.learningStyle || '',
    
    // Background & History
    background: timelineevent?.background || '',
    backstory: timelineevent?.backstory || '',
    origin: timelineevent?.origin || '',
    upbringing: timelineevent?.upbringing || '',
    childhood: timelineevent?.childhood || '',
    familyHistory: timelineevent?.familyHistory || '',
    socialClass: timelineevent?.socialClass || '',
    economicStatus: timelineevent?.economicStatus || '',
    education: timelineevent?.education || '',
    academicHistory: timelineevent?.academicHistory || '',
    formativeEvents: timelineevent?.formativeEvents || '',
    lifeChangingMoments: timelineevent?.lifeChangingMoments || '',
    personalStruggle: timelineevent?.personalStruggle || '',
    challenges: timelineevent?.challenges || '',
    achievements: timelineevent?.achievements || '',
    failures: timelineevent?.failures || '',
    losses: timelineevent?.losses || '',
    victories: timelineevent?.victories || '',
    reputation: timelineevent?.reputation || '',
    
    // Abilities & Skills
    abilities: timelineevent?.abilities?.join(', ') || '',
    skills: timelineevent?.skills?.join(', ') || '',
    talents: timelineevent?.talents?.join(', ') || '',
    expertise: timelineevent?.expertise?.join(', ') || '',
    specialAbilities: timelineevent?.specialAbilities || '',
    powers: timelineevent?.powers || '',
    magicalAbilities: timelineevent?.magicalAbilities || '',
    magicType: timelineevent?.magicType || '',
    magicSource: timelineevent?.magicSource || '',
    magicLimitations: timelineevent?.magicLimitations || '',
    superpowers: timelineevent?.superpowers || '',
    strengths: timelineevent?.strengths || '',
    competencies: timelineevent?.competencies || '',
    training: timelineevent?.training || '',
    experience: timelineevent?.experience || '',
    
    // Story Elements
    goals: timelineevent?.goals || '',
    objectives: timelineevent?.objectives || '',
    wants: timelineevent?.wants || '',
    obstacles: timelineevent?.obstacles || '',
    conflicts: timelineevent?.conflicts || '',
    conflictSources: timelineevent?.conflictSources || '',
    stakes: timelineevent?.stakes || '',
    consequences: timelineevent?.consequences || '',
    arc: timelineevent?.arc || '',
    journey: timelineevent?.journey || '',
    transformation: timelineevent?.transformation || '',
    growth: timelineevent?.growth || '',
    allies: timelineevent?.allies || '',
    enemies: timelineevent?.enemies || '',
    mentors: timelineevent?.mentors || '',
    rivals: timelineevent?.rivals || '',
    connectionToEvents: timelineevent?.connectionToEvents || '',
    plotRelevance: timelineevent?.plotRelevance || '',
    storyFunction: timelineevent?.storyFunction || '',
    
    // Language & Communication
    languages: timelineevent?.languages?.join(', ') || '',
    nativeLanguage: timelineevent?.nativeLanguage || '',
    accent: timelineevent?.accent || '',
    dialect: timelineevent?.dialect || '',
    voiceDescription: timelineevent?.voiceDescription || '',
    speechPatterns: timelineevent?.speechPatterns || '',
    vocabulary: timelineevent?.vocabulary || '',
    catchphrases: timelineevent?.catchphrases || '',
    slang: timelineevent?.slang || '',
    communicationStyle: timelineevent?.communicationStyle || '',
    
    // Social & Cultural
    family: timelineevent?.family || '',
    parents: timelineevent?.parents || '',
    siblings: timelineevent?.siblings || '',
    spouse: timelineevent?.spouse || '',
    children: timelineevent?.children || '',
    friends: timelineevent?.friends || '',
    socialCircle: timelineevent?.socialCircle || '',
    community: timelineevent?.community || '',
    culture: timelineevent?.culture || '',
    traditions: timelineevent?.traditions || '',
    customs: timelineevent?.customs || '',
    religion: timelineevent?.religion || '',
    spirituality: timelineevent?.spirituality || '',
    politicalViews: timelineevent?.politicalViews || '',
    
    // Meta Information
    archetypes: timelineevent?.archetypes?.join(', ') || '',
    tropes: timelineevent?.tropes?.join(', ') || '',
    inspiration: timelineevent?.inspiration || '',
    basedOn: timelineevent?.basedOn || '',
    tags: timelineevent?.tags?.join(', ') || '',
    genre: timelineevent?.genre || '',
    proseVibe: timelineevent?.proseVibe || '',
    narrativeRole: timelineevent?.narrativeRole || '',
    timelineeventType: timelineevent?.timelineeventType || '',
    importance: timelineevent?.importance || '',
    screenTime: timelineevent?.screenTime || '',
    firstAppearance: timelineevent?.firstAppearance || '',
    lastAppearance: timelineevent?.lastAppearance || '',
    
    // Writer's Notes
    notes: timelineevent?.notes || '',
    development: timelineevent?.development || '',
    evolution: timelineevent?.evolution || '',
    alternatives: timelineevent?.alternatives || '',
    unused: timelineevent?.unused || '',
    research: timelineevent?.research || '',
    references: timelineevent?.references || '',
    mood: timelineevent?.mood || '',
    theme: timelineevent?.theme || '',
    symbolism: timelineevent?.symbolism || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/projects/${projectId}/timelineevents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create timelineevent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timelineevents'] });
      onCancel();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/timelineevents/${timelineevent?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update timelineevent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timelineevents'] });
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

    if (timelineevent) {
      updateMutation.mutate(processedData);
    } else {
      // Generate ID for new timelineevent
      const newTimelineEventData = {
        ...processedData,
        id: Date.now().toString(),
      };
      createMutation.mutate(newTimelineEventData);
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
          Back to TimelineEvents
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save TimelineEvent'}
          </Button>
        </div>
      </div>

      <Card className="creative-card">
        <div className="p-6">
          <h1 className="font-title text-3xl mb-6">
            {timelineevent ? 'Edit TimelineEvent' : 'Create New TimelineEvent'}
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
                      placeholder="TimelineEvent's full name"
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
                      placeholder="A single sentence that captures the essence of this timelineevent"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">TimelineEvent Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Overall description of the timelineevent"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timelineeventSummary">TimelineEvent Summary</Label>
                    <Textarea
                      id="timelineeventSummary"
                      value={formData.timelineeventSummary}
                      onChange={(e) => updateField('timelineeventSummary', e.target.value)}
                      placeholder="A comprehensive summary of who this timelineevent is"
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
                    placeholder="Describe the timelineevent's overall personality, temperament, and worldview"
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
                    <Label htmlFor="arc">TimelineEvent Arc</Label>
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
                      placeholder="major timelineevent, love interest, comic relief"
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
                    placeholder="Personal notes about this timelineevent's development, inspiration, changes, etc."
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