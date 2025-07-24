import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Bug, ChevronRight } from 'lucide-react';
import type { Creature } from '@/lib/types';

interface CreatureCardProps {
  creature: Creature;
  onSelect: (creature: Creature) => void;
  onEdit: (creature: Creature) => void;
  onDelete: (creature: Creature) => void;
}

export function CreatureCard({ creature, onSelect, onEdit, onDelete }: CreatureCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(creature)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Creature Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0">
            {creature.displayImageId ? (
              <img 
                src={creature.imageUrl} 
                alt={creature.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Bug className="h-10 w-10 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* Creature Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {creature.name}
                  {creature.species && (
                    <span className="text-muted-foreground font-normal ml-2 text-sm">
                      ({creature.species})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  {creature.classification && (
                    <Badge variant="secondary" className="text-xs">
                      {creature.classification}
                    </Badge>
                  )}
                  {creature.threat && (
                    <Badge 
                      variant={creature.threat.toLowerCase().includes('high') || creature.threat.toLowerCase().includes('extreme') ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {creature.threat}
                    </Badge>
                  )}
                  {creature.tags && creature.tags.length > 0 && (
                    <>
                      {creature.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {creature.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{creature.tags.length - 2} more</span>
                      )}
                    </>
                  )}
                </div>

                {/* Creature-specific Information */}
                <div className="mt-3 space-y-3">
                  {creature.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{creature.description}</p>
                    </div>
                  )}
                  
                  {creature.habitat && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Habitat</h5>
                      <p className="text-sm line-clamp-2">{creature.habitat}</p>
                    </div>
                  )}

                  {creature.abilities && creature.abilities.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Key Abilities</h5>
                      <p className="text-sm line-clamp-1">{creature.abilities.slice(0, 3).join(', ')}</p>
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
                    onEdit(creature);
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
                    onDelete(creature);
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