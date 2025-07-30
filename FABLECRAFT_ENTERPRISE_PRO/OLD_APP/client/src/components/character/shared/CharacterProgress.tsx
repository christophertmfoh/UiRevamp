/**
 * Character Progress Component
 * Shows completion status and development progress
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, Star } from 'lucide-react';

interface ProgressStats {
  total: number;
  filled: number;
  percentage: number;
}

interface CharacterProgressProps {
  stats: ProgressStats;
  mode?: 'compact' | 'detailed';
  showReadiness?: boolean;
}

export function CharacterProgress({ 
  stats, 
  mode = 'compact',
  showReadiness = true 
}: CharacterProgressProps) {
  const getReadinessLevel = () => {
    if (stats.percentage >= 80) return { level: 'Story Ready', color: 'bg-green-500', icon: CheckCircle };
    if (stats.percentage >= 60) return { level: 'Well Developed', color: 'bg-blue-500', icon: Star };
    if (stats.percentage >= 40) return { level: 'In Progress', color: 'bg-yellow-500', icon: Circle };
    return { level: 'Early Stage', color: 'bg-gray-500', icon: Circle };
  };

  const readiness = getReadinessLevel();
  const ReadinessIcon = readiness.icon;

  if (mode === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Progress value={stats.percentage} className="h-2" />
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {stats.filled}/{stats.total} ({stats.percentage}%)
        </div>
        {showReadiness && (
          <Badge variant="secondary" className="gap-1 whitespace-nowrap">
            <div className={`w-2 h-2 rounded-full ${readiness.color}`} />
            {readiness.level}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Character Development</h4>
            <Badge variant="outline" className="gap-1">
              <ReadinessIcon className="h-3 w-3" />
              {readiness.level}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span className="font-medium">{stats.percentage}%</span>
            </div>
            <Progress value={stats.percentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.filled} fields completed</span>
              <span>{stats.total - stats.filled} remaining</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{stats.filled}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Fields</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickProgress({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={percentage} className="h-1 flex-1" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {percentage}%
      </span>
    </div>
  );
}