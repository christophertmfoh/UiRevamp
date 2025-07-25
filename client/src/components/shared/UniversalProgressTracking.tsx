import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, Plus, Edit2, Trash2, CheckCircle, Clock, Target, Star } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { showErrorToast, showSuccessToast } from '@/lib/utils/errorHandling';

interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

interface UniversalProgressTrackingProps {
  entity: any;
  entityType: string;
  projectId: string;
}

const MILESTONE_CATEGORIES = {
  character: ['development', 'story-arc', 'relationships', 'skills', 'backstory'],
  location: ['exploration', 'development', 'events', 'political-changes', 'economic-growth'],
  faction: ['expansion', 'political-moves', 'military-campaigns', 'alliances', 'internal-changes'],
  item: ['discovery', 'power-growth', 'ownership-changes', 'legend-building', 'modifications'],
  organization: ['growth', 'influence-expansion', 'projects', 'restructuring', 'achievements']
};

const DEFAULT_CATEGORIES = ['development', 'story-progression', 'significance', 'relationships'];

const MILESTONE_ICONS = {
  development: Target,
  'story-arc': TrendingUp,
  relationships: Star,
  exploration: CheckCircle,
  expansion: TrendingUp
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const STATUS_COLORS = {
  'not-started': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'on-hold': 'bg-yellow-100 text-yellow-800'
};

export function UniversalProgressTracking({
  entity,
  entityType,
  projectId
}: UniversalProgressTrackingProps) {
  const [milestones, setMilestones] = useState<ProgressMilestone[]>(entity.progressMilestones || []);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Partial<ProgressMilestone>>({
    category: '',
    status: 'not-started',
    priority: 'medium',
    progress: 0
  });

  const queryClient = useQueryClient();
  const categories = MILESTONE_CATEGORIES[entityType] || DEFAULT_CATEGORIES;

  const saveMilestonesMutation = useMutation({
    mutationFn: async (updatedMilestones: ProgressMilestone[]) => {
      return await apiRequest('PUT', `/api/${entityType}s/${entity.id}`, {
        ...entity,
        progressMilestones: updatedMilestones
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entityType}s`] });
      showSuccessToast('Progress milestones updated successfully!');
    },
    onError: (error) => {
      showErrorToast(`Failed to update milestones: ${error.message}`);
    }
  });

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.category) {
      showErrorToast('Please fill in required fields');
      return;
    }

    const milestone: ProgressMilestone = {
      id: Date.now().toString(),
      title: newMilestone.title!,
      description: newMilestone.description || '',
      category: newMilestone.category!,
      status: newMilestone.status || 'not-started',
      priority: newMilestone.priority || 'medium',
      progress: newMilestone.progress || 0,
      targetDate: newMilestone.targetDate,
      notes: newMilestone.notes
    };

    const updatedMilestones = [...milestones, milestone];
    setMilestones(updatedMilestones);
    saveMilestonesMutation.mutate(updatedMilestones);
    
    setNewMilestone({
      category: '',
      status: 'not-started',
      priority: 'medium',
      progress: 0
    });
    setIsAddingMilestone(false);
  };

  const updateMilestoneProgress = (milestoneId: string, progress: number) => {
    const updatedMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        const newStatus = progress === 100 ? 'completed' : (progress > 0 ? 'in-progress' : 'not-started');
        return {
          ...m,
          progress,
          status: newStatus,
          completedDate: progress === 100 ? new Date().toISOString() : undefined
        };
      }
      return m;
    });
    setMilestones(updatedMilestones);
    saveMilestonesMutation.mutate(updatedMilestones);
  };

  const removeMilestone = (milestoneId: string) => {
    const updatedMilestones = milestones.filter(m => m.id !== milestoneId);
    setMilestones(updatedMilestones);
    saveMilestonesMutation.mutate(updatedMilestones);
  };

  const calculateOverallProgress = () => {
    if (milestones.length === 0) return 0;
    const totalProgress = milestones.reduce((sum, m) => sum + m.progress, 0);
    return Math.round(totalProgress / milestones.length);
  };

  const getMilestoneIcon = (category: string) => {
    const Icon = MILESTONE_ICONS[category as keyof typeof MILESTONE_ICONS] || Target;
    return Icon;
  };

  const overallProgress = calculateOverallProgress();
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Progress Tracking
          </CardTitle>
          <Dialog open={isAddingMilestone} onOpenChange={setIsAddingMilestone}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Progress Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Milestone title"
                    value={newMilestone.title || ''}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe this milestone..."
                    value={newMilestone.description || ''}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={newMilestone.category || ''} 
                      onValueChange={(value) => setNewMilestone(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={newMilestone.priority || 'medium'} 
                      onValueChange={(value) => setNewMilestone(prev => ({ ...prev, priority: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newMilestone.targetDate || ''}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingMilestone(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddMilestone} className="flex-1">
                    Add Milestone
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{completedMilestones}/{milestones.length} milestones</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{overallProgress}% complete</span>
            <span>{milestones.length} total milestones</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map((milestone) => {
              const Icon = getMilestoneIcon(milestone.category);
              return (
                <div key={milestone.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {milestone.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">
                            {milestone.category.replace('-', ' ')}
                          </Badge>
                          <Badge className={STATUS_COLORS[milestone.status]}>
                            {milestone.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={PRIORITY_COLORS[milestone.priority]}>
                            {milestone.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMilestone(milestone.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                    <div className="flex gap-2">
                      {[0, 25, 50, 75, 100].map(value => (
                        <Button
                          key={value}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => updateMilestoneProgress(milestone.id, value)}
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  {milestone.targetDate && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Target: {new Date(milestone.targetDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              No progress milestones set yet
            </p>
            <Button variant="outline" onClick={() => setIsAddingMilestone(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Milestone
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}