import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, TrendingUp, Target, ArrowRight, BookOpen, Zap, Calendar, Edit, Trash2 } from 'lucide-react';

interface ArcMilestone {
  id: string;
  title: string;
  description: string;
  chapter: string;
  progress: number; // 0-100
  status: 'planned' | 'in-progress' | 'completed' | 'revised';
  emotions: string[];
  growthType: 'internal' | 'external' | 'relationship' | 'skill';
  notes: string;
}

interface CharacterArc {
  id: string;
  name: string;
  description: string;
  startingPoint: string;
  endingPoint: string;
  theme: string;
  overallProgress: number;
  milestones: ArcMilestone[];
}

interface CharacterArcTrackerProps {
  characterName: string;
  onUpdateArcs: (arcs: CharacterArc[]) => void;
}

const ARC_THEMES = [
  'Redemption',
  'Coming of Age',
  'Fall from Grace',
  'Self-Discovery',
  'Overcoming Fear',
  'Learning to Trust',
  'Finding Purpose',
  'Accepting Responsibility',
  'Breaking Free',
  'Finding Balance',
  'Forgiveness',
  'Sacrifice'
];

const GROWTH_TYPES = [
  { value: 'internal', label: 'Internal Growth', color: 'bg-purple-500' },
  { value: 'external', label: 'External Change', color: 'bg-blue-500' },
  { value: 'relationship', label: 'Relationship', color: 'bg-green-500' },
  { value: 'skill', label: 'Skill/Ability', color: 'bg-orange-500' }
];

export function CharacterArcTracker({ characterName, onUpdateArcs }: CharacterArcTrackerProps) {
  const [arcs, setArcs] = useState<CharacterArc[]>([]);
  const [isAddingArc, setIsAddingArc] = useState(false);
  const [editingArc, setEditingArc] = useState<CharacterArc | null>(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState<string | null>(null);
  const [newArc, setNewArc] = useState<Partial<CharacterArc>>({});
  const [newMilestone, setNewMilestone] = useState<Partial<ArcMilestone>>({
    progress: 0,
    status: 'planned',
    growthType: 'internal',
    emotions: []
  });

  const handleAddArc = () => {
    if (newArc.name && newArc.description) {
      const arc: CharacterArc = {
        id: Date.now().toString(),
        name: newArc.name,
        description: newArc.description,
        startingPoint: newArc.startingPoint || '',
        endingPoint: newArc.endingPoint || '',
        theme: newArc.theme || '',
        overallProgress: 0,
        milestones: []
      };

      const updatedArcs = [...arcs, arc];
      setArcs(updatedArcs);
      onUpdateArcs(updatedArcs);
      setNewArc({});
      setIsAddingArc(false);
    }
  };

  const handleAddMilestone = (arcId: string) => {
    if (newMilestone.title && newMilestone.description) {
      const milestone: ArcMilestone = {
        id: Date.now().toString(),
        title: newMilestone.title,
        description: newMilestone.description,
        chapter: newMilestone.chapter || '',
        progress: newMilestone.progress || 0,
        status: newMilestone.status as ArcMilestone['status'] || 'planned',
        emotions: typeof newMilestone.emotions === 'string' 
          ? (newMilestone.emotions as string).split(',').map(e => e.trim()).filter(Boolean)
          : [],
        growthType: newMilestone.growthType as ArcMilestone['growthType'] || 'internal',
        notes: newMilestone.notes || ''
      };

      const updatedArcs = arcs.map(arc => {
        if (arc.id === arcId) {
          const updatedMilestones = [...arc.milestones, milestone];
          return {
            ...arc,
            milestones: updatedMilestones,
            overallProgress: Math.round(updatedMilestones.reduce((sum, m) => sum + m.progress, 0) / updatedMilestones.length)
          };
        }
        return arc;
      });

      setArcs(updatedArcs);
      onUpdateArcs(updatedArcs);
      setNewMilestone({ progress: 0, status: 'planned', growthType: 'internal', emotions: [] });
      setIsAddingMilestone(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-gray-200 text-gray-800';
      case 'in-progress': return 'bg-blue-200 text-blue-800';
      case 'completed': return 'bg-green-200 text-green-800';
      case 'revised': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getGrowthTypeInfo = (type: string) => {
    return GROWTH_TYPES.find(t => t.value === type) || GROWTH_TYPES[0];
  };

  const ArcCard = ({ arc }: { arc: CharacterArc }) => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              {arc.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{arc.description}</p>
            {arc.theme && (
              <Badge variant="outline" className="mt-2">
                {arc.theme}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{arc.overallProgress}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
        <Progress value={arc.overallProgress} className="mt-3" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Journey Points */}
        {(arc.startingPoint || arc.endingPoint) && (
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label className="text-xs font-semibold text-muted-foreground">Starting Point</Label>
              <p className="text-sm">{arc.startingPoint || 'Not defined'}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <Label className="text-xs font-semibold text-muted-foreground">Ending Point</Label>
              <p className="text-sm">{arc.endingPoint || 'Not defined'}</p>
            </div>
          </div>
        )}

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Arc Milestones</h4>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsAddingMilestone(arc.id)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Milestone
            </Button>
          </div>

          {arc.milestones.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No milestones yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {arc.milestones.map((milestone, index) => {
                const growthType = getGrowthTypeInfo(milestone.growthType);
                return (
                  <div key={milestone.id} className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-6 h-6 rounded-full ${growthType.color} text-white text-xs flex items-center justify-center font-bold`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium">{milestone.title}</h5>
                          <Badge className={`text-xs ${getStatusColor(milestone.status)}`}>
                            {milestone.status}
                          </Badge>
                          {milestone.chapter && (
                            <Badge variant="outline" className="text-xs">
                              Ch. {milestone.chapter}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Progress:</span>
                            <div className="w-16">
                              <Progress value={milestone.progress} className="h-1" />
                            </div>
                            <span className="text-xs font-medium">{milestone.progress}%</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {growthType.label}
                          </Badge>
                        </div>
                        {milestone.emotions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {milestone.emotions.map(emotion => (
                              <span key={emotion} className="text-xs px-2 py-1 bg-muted/60 rounded-full">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Character Arc Tracker</h3>
          <p className="text-sm text-muted-foreground">
            Track {characterName}'s growth and development throughout the story
          </p>
        </div>
        <Button onClick={() => setIsAddingArc(true)} className="interactive-warm">
          <Plus className="h-4 w-4 mr-2" />
          Add Arc
        </Button>
      </div>

      {/* Arcs */}
      {arcs.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="font-semibold mb-2">No character arcs yet</h4>
          <p className="text-muted-foreground mb-4">
            Start mapping {characterName}'s journey by creating their first character arc.
          </p>
          <Button onClick={() => setIsAddingArc(true)} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Create First Arc
          </Button>
        </Card>
      ) : (
        arcs.map(arc => <ArcCard key={arc.id} arc={arc} />)
      )}

      {/* Add Arc Modal */}
      <Dialog open={isAddingArc} onOpenChange={setIsAddingArc}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Character Arc</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="arc-name">Arc Name</Label>
              <Input
                id="arc-name"
                value={newArc.name || ''}
                onChange={(e) => setNewArc(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Learning to Trust"
              />
            </div>

            <div>
              <Label htmlFor="arc-theme">Theme (Optional)</Label>
              <Select
                value={newArc.theme || ''}
                onValueChange={(value) => setNewArc(prev => ({ ...prev, theme: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {ARC_THEMES.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="arc-description">Description</Label>
              <Textarea
                id="arc-description"
                value={newArc.description || ''}
                onChange={(e) => setNewArc(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this character's journey..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="arc-start">Starting Point</Label>
                <Input
                  id="arc-start"
                  value={newArc.startingPoint || ''}
                  onChange={(e) => setNewArc(prev => ({ ...prev, startingPoint: e.target.value }))}
                  placeholder="Where does this arc begin?"
                />
              </div>
              <div>
                <Label htmlFor="arc-end">Ending Point</Label>
                <Input
                  id="arc-end"
                  value={newArc.endingPoint || ''}
                  onChange={(e) => setNewArc(prev => ({ ...prev, endingPoint: e.target.value }))}
                  placeholder="Where should this arc end?"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setIsAddingArc(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddArc}
                disabled={!newArc.name || !newArc.description}
                className="interactive-warm"
              >
                Create Arc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Milestone Modal */}
      {isAddingMilestone && (
        <Dialog open={!!isAddingMilestone} onOpenChange={() => setIsAddingMilestone(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Arc Milestone</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="milestone-title">Milestone Title</Label>
                <Input
                  id="milestone-title"
                  value={newMilestone.title || ''}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., First Act of Trust"
                />
              </div>

              <div>
                <Label htmlFor="milestone-description">Description</Label>
                <Textarea
                  id="milestone-description"
                  value={newMilestone.description || ''}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What happens in this milestone?"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="milestone-chapter">Chapter</Label>
                  <Input
                    id="milestone-chapter"
                    value={newMilestone.chapter || ''}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, chapter: e.target.value }))}
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <Label htmlFor="milestone-progress">Progress %</Label>
                  <Input
                    id="milestone-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={newMilestone.progress || 0}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="milestone-status">Status</Label>
                  <Select
                    value={newMilestone.status || ''}
                    onValueChange={(value) => setNewMilestone(prev => ({ ...prev, status: value as ArcMilestone['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="revised">Revised</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="milestone-growth">Growth Type</Label>
                  <Select
                    value={newMilestone.growthType || ''}
                    onValueChange={(value) => setNewMilestone(prev => ({ ...prev, growthType: value as ArcMilestone['growthType'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GROWTH_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="milestone-emotions">Emotions (comma-separated)</Label>
                <Input
                  id="milestone-emotions"
                  value={Array.isArray(newMilestone.emotions) ? newMilestone.emotions.join(', ') : (newMilestone.emotions as string | undefined) || ''}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, emotions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  placeholder="e.g., hope, fear, determination"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setIsAddingMilestone(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => isAddingMilestone && handleAddMilestone(isAddingMilestone)}
                  disabled={!newMilestone.title || !newMilestone.description}
                  className="interactive-warm"
                >
                  Add Milestone
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}