import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { MagicSystem } from '../lib/types';

interface MagicSystemCardProps {
  magicsystem: MagicSystem;
  onSelect: (magicsystem: MagicSystem) => void;
  onEdit: (magicsystem: MagicSystem) => void;
  onDelete: (magicsystem: MagicSystem) => void;
}

export function MagicSystemCard({ magicsystem, onSelect, onEdit, onDelete }: MagicSystemCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(magicsystem)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* MagicSystem Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {magicsystem.imageUrl ? (
              <img 
                src={magicsystem.imageUrl} 
                alt={magicsystem.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* MagicSystem Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {magicsystem.name}
                  {magicsystem.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({magicsystem.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {magicsystem.role}
                  </Badge>
                  {magicsystem.race && (
                    <Badge variant="outline" className="text-xs">
                      {magicsystem.race}
                    </Badge>
                  )}
                  {magicsystem.class && (
                    <Badge variant="outline" className="text-xs">
                      {magicsystem.class}
                    </Badge>
                  )}
                </div>

                {/* Extended MagicSystem Information */}
                <div className="mt-3 space-y-3">
                  {magicsystem.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{magicsystem.description}</p>
                    </div>
                  )}
                  
                  {magicsystem.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{magicsystem.personality}</p>
                    </div>
                  )}
                  
                  {magicsystem.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{magicsystem.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(magicsystem.hair || magicsystem.skin || magicsystem.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {magicsystem.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {magicsystem.hair}</Badge>
                      )}
                      {magicsystem.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {magicsystem.skin}</Badge>
                      )}
                      {magicsystem.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {magicsystem.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* MagicSystem Traits */}
                {magicsystem.personalityTraits && magicsystem.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {magicsystem.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {magicsystem.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{magicsystem.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((magicsystem.abilities && magicsystem.abilities.length > 0) || (magicsystem.skills && magicsystem.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {magicsystem.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {magicsystem.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((magicsystem.abilities?.length || 0) + (magicsystem.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((magicsystem.abilities?.length || 0) + (magicsystem.skills?.length || 0)) - 6} more
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
                    onEdit(magicsystem);
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
                    onDelete(magicsystem);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* MagicSystem Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {magicsystem.abilities && magicsystem.abilities.length > 0 && (
              <span>{magicsystem.abilities.length} abilities</span>
            )}
            {magicsystem.skills && magicsystem.skills.length > 0 && (
              <span>{magicsystem.skills.length} skills</span>
            )}
            {magicsystem.languages && magicsystem.languages.length > 0 && (
              <span>{magicsystem.languages.length} languages</span>
            )}
            {magicsystem.relationships && magicsystem.relationships.length > 0 && (
              <span>{magicsystem.relationships.length} relationships</span>
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