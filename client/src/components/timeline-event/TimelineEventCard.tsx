import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock, ChevronRight } from 'lucide-react';
import type { TimelineEvent } from '@/lib/types';

interface TimelineEventCardProps {
  timelineEvent: TimelineEvent;
  onSelect: (timelineEvent: TimelineEvent) => void;
  onEdit: (timelineEvent: TimelineEvent) => void;
  onDelete: (timelineEvent: TimelineEvent) => void;
}

export function TimelineEventCard({ timelineEvent, onSelect, onEdit, onDelete }: TimelineEventCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(timelineEvent)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Timeline Event Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center flex-shrink-0">
            {timelineEvent.imageUrl ? (
              <img 
                src={timelineEvent.imageUrl} 
                alt={timelineEvent.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Clock className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            )}
          </div>

          {/* Timeline Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {timelineEvent.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {timelineEvent.era}
                  </Badge>
                  {timelineEvent.period && (
                    <Badge variant="outline" className="text-xs">
                      {timelineEvent.period}
                    </Badge>
                  )}
                  {timelineEvent.order && (
                    <Badge variant="outline" className="text-xs">
                      #{timelineEvent.order}
                    </Badge>
                  )}
                  {timelineEvent.tags && timelineEvent.tags.length > 0 && (
                    <>
                      {timelineEvent.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {timelineEvent.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{timelineEvent.tags.length - 2} more</span>
                      )}
                    </>
                  )}
                </div>

                {/* Timeline Event-specific Information */}
                <div className="mt-3 space-y-3">
                  {timelineEvent.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{timelineEvent.description}</p>
                    </div>
                  )}
                  
                  {timelineEvent.significance && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Significance</h5>
                      <p className="text-sm line-clamp-2">{timelineEvent.significance}</p>
                    </div>
                  )}

                  {timelineEvent.participants && timelineEvent.participants.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Participants</h5>
                      <p className="text-sm line-clamp-1">{timelineEvent.participants.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(timelineEvent);
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
                    onDelete(timelineEvent);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}