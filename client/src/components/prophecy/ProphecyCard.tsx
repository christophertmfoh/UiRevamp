import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Prophecy } from '../lib/types';

interface ProphecyCardProps {
  prophecy: Prophecy;
  onSelect: (prophecy: Prophecy) => void;
  onEdit: (prophecy: Prophecy) => void;
  onDelete: (prophecy: Prophecy) => void;
}

export function ProphecyCard({ prophecy, onSelect, onEdit, onDelete }: ProphecyCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(prophecy)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Prophecy Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {prophecy.imageUrl ? (
              <img 
                src={prophecy.imageUrl} 
                alt={prophecy.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Prophecy Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {prophecy.name}
                  {prophecy.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({prophecy.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {prophecy.role}
                  </Badge>
                  {prophecy.race && (
                    <Badge variant="outline" className="text-xs">
                      {prophecy.race}
                    </Badge>
                  )}
                  {prophecy.class && (
                    <Badge variant="outline" className="text-xs">
                      {prophecy.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Prophecy Information */}
                <div className="mt-3 space-y-3">
                  {prophecy.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{prophecy.description}</p>
                    </div>
                  )}
                  
                  {prophecy.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{prophecy.personality}</p>
                    </div>
                  )}
                  
                  {prophecy.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{prophecy.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(prophecy.hair || prophecy.skin || prophecy.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {prophecy.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {prophecy.hair}</Badge>
                      )}
                      {prophecy.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {prophecy.skin}</Badge>
                      )}
                      {prophecy.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {prophecy.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Prophecy Traits */}
                {prophecy.personalityTraits && prophecy.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {prophecy.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {prophecy.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{prophecy.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((prophecy.abilities && prophecy.abilities.length > 0) || (prophecy.skills && prophecy.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {prophecy.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {prophecy.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((prophecy.abilities?.length || 0) + (prophecy.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((prophecy.abilities?.length || 0) + (prophecy.skills?.length || 0)) - 6} more
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
                    onEdit(prophecy);
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
                    onDelete(prophecy);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Prophecy Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {prophecy.abilities && prophecy.abilities.length > 0 && (
              <span>{prophecy.abilities.length} abilities</span>
            )}
            {prophecy.skills && prophecy.skills.length > 0 && (
              <span>{prophecy.skills.length} skills</span>
            )}
            {prophecy.languages && prophecy.languages.length > 0 && (
              <span>{prophecy.languages.length} languages</span>
            )}
            {prophecy.relationships && prophecy.relationships.length > 0 && (
              <span>{prophecy.relationships.length} relationships</span>
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