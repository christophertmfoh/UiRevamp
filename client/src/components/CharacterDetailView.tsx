import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, User, Settings, Target, Languages, Palette, Book } from 'lucide-react';
import type { Character } from '../lib/types';

interface CharacterDetailViewProps {
  character: Character;
  onBack: () => void;
  onEdit: (character: Character) => void;
}

export function CharacterDetailView({ character, onBack, onEdit }: CharacterDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Button>
        <Button onClick={() => onEdit(character)} className="interactive-warm gap-2">
          <Edit className="h-4 w-4" />
          Edit Character
        </Button>
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
                <Badge variant="default" className="px-3 py-1">
                  {character.role}
                </Badge>
                {character.race && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {character.race}
                  </Badge>
                )}
                {character.class && (
                  <Badge variant="outline" className="px-3 py-1">
                    {character.class}
                  </Badge>
                )}
                {character.age && (
                  <Badge variant="outline" className="px-3 py-1">
                    Age: {character.age}
                  </Badge>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {character.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {character.abilities?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Abilities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {character.skills?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {character.languages?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Details Tabs */}
      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personality" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Psychology
          </TabsTrigger>
          <TabsTrigger value="physical" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Physical
          </TabsTrigger>
          <TabsTrigger value="abilities" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Abilities
          </TabsTrigger>
          <TabsTrigger value="background" className="flex items-center gap-1">
            <Book className="h-3 w-3" />
            Background
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

        <TabsContent value="personality" className="space-y-4">
          <div className="grid gap-4">
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="text-lg">Personality Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {character.personality && (
                  <div>
                    <h4 className="font-semibold mb-2">Core Personality</h4>
                    <p className="text-muted-foreground">{character.personality}</p>
                  </div>
                )}

                {character.personalityTraits && character.personalityTraits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Personality Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {character.personalityTraits.map((trait, index) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

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
        </TabsContent>

        <TabsContent value="physical" className="space-y-4">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="text-lg">Physical Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.physicalDescription && (
                <div>
                  <h4 className="font-semibold mb-2">Overall Description</h4>
                  <p className="text-muted-foreground">{character.physicalDescription}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {character.distinguishingMarks && (
                <div>
                  <h4 className="font-semibold mb-2">Distinguishing Marks</h4>
                  <p className="text-muted-foreground">{character.distinguishingMarks}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abilities" className="space-y-4">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="text-lg">Abilities & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.abilities && character.abilities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Abilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.abilities.map((ability, index) => (
                      <Badge key={index} variant="default">
                        {ability}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {character.skills && character.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {character.specialAbilities && (
                <div>
                  <h4 className="font-semibold mb-2">Special Abilities</h4>
                  <p className="text-muted-foreground">{character.specialAbilities}</p>
                </div>
              )}

              {character.languages && character.languages.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background" className="space-y-4">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="text-lg">Background & History</CardTitle>
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

              {character.personalStruggle && (
                <div>
                  <h4 className="font-semibold mb-2">Personal Struggle</h4>
                  <p className="text-muted-foreground">{character.personalStruggle}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="space-y-4">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="text-lg">Story Elements</CardTitle>
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

              {character.connectionToEvents && (
                <div>
                  <h4 className="font-semibold mb-2">Connection to Events</h4>
                  <p className="text-muted-foreground">{character.connectionToEvents}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="text-lg">Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.archetypes && character.archetypes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Character Archetypes</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.archetypes.map((archetype, index) => (
                      <Badge key={index} variant="default">
                        {archetype}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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

              {character.tags && character.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {character.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}