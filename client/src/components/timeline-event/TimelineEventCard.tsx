import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { TimelineEvent } from '../lib/types';

interface TimelineEventCardProps {
  timelineevent: TimelineEvent;
  onSelect: (timelineevent: TimelineEvent) => void;
  onEdit: (timelineevent: TimelineEvent) => void;
  onDelete: (timelineevent: TimelineEvent) => void;
}

export function TimelineEventCard({ timelineevent, onSelect, onEdit, onDelete }: TimelineEventCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(timelineevent)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* TimelineEvent Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {timelineevent.imageUrl ? (
              <img 
                src={timelineevent.imageUrl} 
                alt={timelineevent.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* TimelineEvent Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {timelineevent.name}
                  {timelineevent.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({timelineevent.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {timelineevent.role}
                  </Badge>
                  {timelineevent.race && (
                    <Badge variant="outline" className="text-xs">
                      {timelineevent.race}
                    </Badge>
                  )}
                  {timelineevent.class && (
                    <Badge variant="outline" className="text-xs">
                      {timelineevent.class}
                    </Badge>
                  )}
                </div>

                {/* Extended TimelineEvent Information */}
                <div className="mt-3 space-y-3">
                  {timelineevent.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{timelineevent.description}</p>
                    </div>
                  )}
                  
                  {timelineevent.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{timelineevent.personality}</p>
                    </div>
                  )}
                  
                  {timelineevent.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{timelineevent.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(timelineevent.hair || timelineevent.skin || timelineevent.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {timelineevent.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {timelineevent.hair}</Badge>
                      )}
                      {timelineevent.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {timelineevent.skin}</Badge>
                      )}
                      {timelineevent.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {timelineevent.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* TimelineEvent Traits */}
                {timelineevent.personalityTraits && timelineevent.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {timelineevent.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {timelineevent.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{timelineevent.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((timelineevent.abilities && timelineevent.abilities.length > 0) || (timelineevent.skills && timelineevent.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {timelineevent.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {timelineevent.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((timelineevent.abilities?.length || 0) + (timelineevent.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((timelineevent.abilities?.length || 0) + (timelineevent.skills?.length || 0)) - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(timelineevent);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(timelineevent);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* TimelineEvent Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {timelineevent.abilities && timelineevent.abilities.length > 0 && (
              <span>{timelineevent.abilities.length} abilities</span>
            )}
            {timelineevent.skills && timelineevent.skills.length > 0 && (
              <span>{timelineevent.skills.length} skills</span>
            )}
            {timelineevent.languages && timelineevent.languages.length > 0 && (
              <span>{timelineevent.languages.length} languages</span>
            )}
            {timelineevent.relationships && timelineevent.relationships.length > 0 && (
              <span>{timelineevent.relationships.length} relationships</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Click to view details</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}