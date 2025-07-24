import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Theme } from '../lib/types';

interface ThemeCardProps {
  theme: Theme;
  onSelect: (theme: Theme) => void;
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

export function ThemeCard({ theme, onSelect, onEdit, onDelete }: ThemeCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(theme)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Theme Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {theme.imageUrl ? (
              <img 
                src={theme.imageUrl} 
                alt={theme.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Theme Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {theme.name}
                  {theme.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({theme.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {theme.role}
                  </Badge>
                  {theme.race && (
                    <Badge variant="outline" className="text-xs">
                      {theme.race}
                    </Badge>
                  )}
                  {theme.class && (
                    <Badge variant="outline" className="text-xs">
                      {theme.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Theme Information */}
                <div className="mt-3 space-y-3">
                  {theme.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{theme.description}</p>
                    </div>
                  )}
                  
                  {theme.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{theme.personality}</p>
                    </div>
                  )}
                  
                  {theme.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{theme.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(theme.hair || theme.skin || theme.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {theme.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {theme.hair}</Badge>
                      )}
                      {theme.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {theme.skin}</Badge>
                      )}
                      {theme.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {theme.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Theme Traits */}
                {theme.personalityTraits && theme.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {theme.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {theme.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{theme.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((theme.abilities && theme.abilities.length > 0) || (theme.skills && theme.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {theme.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {theme.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((theme.abilities?.length || 0) + (theme.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((theme.abilities?.length || 0) + (theme.skills?.length || 0)) - 6} more
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
                    onEdit(theme);
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
                    onDelete(theme);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Theme Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {theme.abilities && theme.abilities.length > 0 && (
              <span>{theme.abilities.length} abilities</span>
            )}
            {theme.skills && theme.skills.length > 0 && (
              <span>{theme.skills.length} skills</span>
            )}
            {theme.languages && theme.languages.length > 0 && (
              <span>{theme.languages.length} languages</span>
            )}
            {theme.relationships && theme.relationships.length > 0 && (
              <span>{theme.relationships.length} relationships</span>
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