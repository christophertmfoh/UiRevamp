import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Crown } from 'lucide-react';

interface Faction {
  id: string;
  name: string;
  description: string;
  goals: string;
  leadership: string;
  tags: string[];
  imageGallery?: any[];
  displayImageId?: number | null;
}

interface FactionCardProps {
  faction: Faction;
  onClick: () => void;
}

export function FactionCard({ faction, onClick }: FactionCardProps) {
  const displayImage = faction.imageGallery?.find(img => img.id === faction.displayImageId) || faction.imageGallery?.[0];

  return (
    <Card 
      className="creative-card cursor-pointer hover:shadow-lg transition-all duration-300 group" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-title text-lg leading-tight group-hover:text-accent transition-colors">
              {faction.name}
            </h3>
            {faction.leadership && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Crown className="h-3 w-3 mr-1" />
                <span className="truncate">{faction.leadership}</span>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center overflow-hidden">
              {displayImage?.url ? (
                <img 
                  src={displayImage.url} 
                  alt={faction.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {faction.description || 'A faction in your world...'}
          </p>
          
          {faction.goals && (
            <div className="flex items-start text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{faction.goals}</span>
            </div>
          )}
          
          {faction.tags && faction.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {faction.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                  {tag}
                </Badge>
              ))}
              {faction.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{faction.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}