import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Zap, Shield, Target, TrendingUp, Users, BookOpen } from 'lucide-react';
import type { Character } from '../../lib/types';

interface CharacterInsightsProps {
  character: Character;
}

export function CharacterInsights({ character }: CharacterInsightsProps) {
  // Calculate character completeness score
  const calculateCompleteness = () => {
    const fields = [
      character.physicalDescription,
      character.personality,
      character.background,
      character.goals,
      character.motivations,
      character.fears,
      character.strengths,
      character.weaknesses
    ];
    
    const filledFields = fields.filter(field => field && field.trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Extract key traits for analysis
  const getKeyTraits = () => {
    const traits = [];
    if (character.personalityTraits && character.personalityTraits.length > 0) {
      traits.push(...character.personalityTraits.slice(0, 3));
    }
    return traits;
  };

  // Get character archetype analysis
  const getArchetypeInfo = () => {
    const archetype = character.archetype || character.role;
    const archetypeMap: Record<string, { color: string; description: string; icon: React.ComponentType<any> }> = {
      'hero': { color: 'bg-blue-500', description: 'Natural leader with strong moral compass', icon: Shield },
      'mentor': { color: 'bg-purple-500', description: 'Wise guide who shares knowledge', icon: BookOpen },
      'outlaw': { color: 'bg-red-500', description: 'Rebel who challenges the status quo', icon: Zap },
      'explorer': { color: 'bg-green-500', description: 'Adventurous spirit seeking new experiences', icon: Target },
      'creator': { color: 'bg-orange-500', description: 'Innovative mind that builds and creates', icon: Brain },
      'caregiver': { color: 'bg-pink-500', description: 'Nurturing soul focused on helping others', icon: Heart },
      'ruler': { color: 'bg-yellow-500', description: 'Natural leader who takes charge', icon: Users },
      'sage': { color: 'bg-indigo-500', description: 'Seeker of truth and wisdom', icon: BookOpen }
    };

    return archetypeMap[archetype?.toLowerCase() || ''] || {
      color: 'bg-gray-500',
      description: 'Unique character with undefined archetype',
      icon: Users
    };
  };

  // Analyze character depth
  const analyzeDepth = () => {
    const psychologicalFields = [
      character.motivations,
      character.fears,
      character.trauma,
      character.secrets,
      character.values,
      character.beliefs
    ];

    const filledPsychFields = psychologicalFields.filter(field => field && field.trim()).length;
    const depthScore = Math.round((filledPsychFields / psychologicalFields.length) * 100);

    let depthLevel = 'Surface';
    let depthColor = 'text-red-500';
    
    if (depthScore >= 80) {
      depthLevel = 'Very Deep';
      depthColor = 'text-green-500';
    } else if (depthScore >= 60) {
      depthLevel = 'Deep';
      depthColor = 'text-blue-500';
    } else if (depthScore >= 40) {
      depthLevel = 'Moderate';
      depthColor = 'text-yellow-500';
    }

    return { depthScore, depthLevel, depthColor };
  };

  const completenessScore = calculateCompleteness();
  const keyTraits = getKeyTraits();
  const archetypeInfo = getArchetypeInfo();
  const depthAnalysis = analyzeDepth();
  const ArchetypeIcon = archetypeInfo.icon;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Character Insights</h3>
        <p className="text-sm text-muted-foreground mb-6">
          AI-powered analysis of {character.name}'s development and narrative potential
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completeness Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Development Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-accent">{completenessScore}%</span>
                <span className="text-sm text-muted-foreground">Complete</span>
              </div>
              <Progress value={completenessScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completenessScore >= 80 
                  ? "Fully developed character ready for story" 
                  : completenessScore >= 60 
                    ? "Well-developed with room for enhancement"
                    : "Needs more development in key areas"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Psychological Depth */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Psychological Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-lg font-bold ${depthAnalysis.depthColor}`}>
                  {depthAnalysis.depthLevel}
                </span>
                <span className="text-sm text-muted-foreground">
                  {depthAnalysis.depthScore}%
                </span>
              </div>
              <Progress value={depthAnalysis.depthScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on motivations, fears, trauma, and values complexity
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Character Archetype */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArchetypeIcon className="h-4 w-4" />
            Character Archetype
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${archetypeInfo.color} text-white`}>
              <ArchetypeIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold capitalize">
                {character.archetype || character.role || 'Undefined'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {archetypeInfo.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Traits */}
      {keyTraits.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Personality Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keyTraits.map((trait, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Story Readiness Assessment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            Story Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">
                  {character.goals ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Clear Goals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-500">
                  {character.conflicts ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Conflicts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-500">
                  {character.arc ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Character Arc</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">
                  {character.relationships ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Relationships</div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                {completenessScore >= 70 
                  ? "Character is ready for active storytelling" 
                  : "Consider developing missing elements before writing"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}