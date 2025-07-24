import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Creature } from '../lib/types';

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
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {creature.imageUrl ? (
              <img 
                src={creature.imageUrl} 
                alt={creature.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Creature Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {creature.name}
                  {creature.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({creature.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {creature.role}
                  </Badge>
                  {creature.race && (
                    <Badge variant="outline" className="text-xs">
                      {creature.race}
                    </Badge>
                  )}
                  {creature.class && (
                    <Badge variant="outline" className="text-xs">
                      {creature.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Creature Information */}
                <div className="mt-3 space-y-3">
                  {creature.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{creature.description}</p>
                    </div>
                  )}
                  
                  {creature.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{creature.personality}</p>
                    </div>
                  )}
                  
                  {creature.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{creature.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(creature.hair || creature.skin || creature.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {creature.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {creature.hair}</Badge>
                      )}
                      {creature.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {creature.skin}</Badge>
                      )}
                      {creature.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {creature.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Creature Traits */}
                {creature.personalityTraits && creature.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {creature.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {creature.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{creature.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((creature.abilities && creature.abilities.length > 0) || (creature.skills && creature.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {creature.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {creature.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((creature.abilities?.length || 0) + (creature.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((creature.abilities?.length || 0) + (creature.skills?.length || 0)) - 6} more
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

              </div>
            </div>
          </div>
        </div>

        {/* Creature Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {creature.abilities && creature.abilities.length > 0 && (
              <span>{creature.abilities.length} abilities</span>
            )}
            {creature.skills && creature.skills.length > 0 && (
              <span>{creature.skills.length} skills</span>
            )}
            {creature.languages && creature.languages.length > 0 && (
              <span>{creature.languages.length} languages</span>
            )}
            {creature.relationships && creature.relationships.length > 0 && (
              <span>{creature.relationships.length} relationships</span>
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