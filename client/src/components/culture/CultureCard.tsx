import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Culture } from '../lib/types';

interface CultureCardProps {
  culture: Culture;
  onSelect: (culture: Culture) => void;
  onEdit: (culture: Culture) => void;
  onDelete: (culture: Culture) => void;
}

export function CultureCard({ culture, onSelect, onEdit, onDelete }: CultureCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(culture)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Culture Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {culture.imageUrl ? (
              <img 
                src={culture.imageUrl} 
                alt={culture.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Culture Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {culture.name}
                  {culture.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({culture.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {culture.role}
                  </Badge>
                  {culture.race && (
                    <Badge variant="outline" className="text-xs">
                      {culture.race}
                    </Badge>
                  )}
                  {culture.class && (
                    <Badge variant="outline" className="text-xs">
                      {culture.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Culture Information */}
                <div className="mt-3 space-y-3">
                  {culture.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{culture.description}</p>
                    </div>
                  )}
                  
                  {culture.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{culture.personality}</p>
                    </div>
                  )}
                  
                  {culture.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{culture.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(culture.hair || culture.skin || culture.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {culture.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {culture.hair}</Badge>
                      )}
                      {culture.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {culture.skin}</Badge>
                      )}
                      {culture.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {culture.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Culture Traits */}
                {culture.personalityTraits && culture.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {culture.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {culture.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{culture.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((culture.abilities && culture.abilities.length > 0) || (culture.skills && culture.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {culture.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {culture.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((culture.abilities?.length || 0) + (culture.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((culture.abilities?.length || 0) + (culture.skills?.length || 0)) - 6} more
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
                    onEdit(culture);
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
                    onDelete(culture);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Culture Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {culture.abilities && culture.abilities.length > 0 && (
              <span>{culture.abilities.length} abilities</span>
            )}
            {culture.skills && culture.skills.length > 0 && (
              <span>{culture.skills.length} skills</span>
            )}
            {culture.languages && culture.languages.length > 0 && (
              <span>{culture.languages.length} languages</span>
            )}
            {culture.relationships && culture.relationships.length > 0 && (
              <span>{culture.relationships.length} relationships</span>
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