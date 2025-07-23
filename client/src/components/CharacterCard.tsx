import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Character } from '../lib/types';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

export function CharacterCard({ character, onSelect, onEdit, onDelete }: CharacterCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Character Avatar */}
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {character.imageUrl ? (
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Character Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {character.name}
                  {character.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({character.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {character.role}
                  </Badge>
                  {character.race && (
                    <Badge variant="outline" className="text-xs">
                      {character.race}
                    </Badge>
                  )}
                  {character.class && (
                    <Badge variant="outline" className="text-xs">
                      {character.class}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {character.description || character.personality || 'No description available'}
                </p>

                {/* Character Traits */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {character.personalityTraits?.slice(0, 3).map((trait, index) => (
                    <span 
                      key={index}
                      className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                  {character.personalityTraits && character.personalityTraits.length > 3 && (
                    <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      +{character.personalityTraits.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(character);
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
                    onDelete(character);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelect(character)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Character Stats Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {character.abilities && character.abilities.length > 0 && (
              <span>{character.abilities.length} abilities</span>
            )}
            {character.skills && character.skills.length > 0 && (
              <span>{character.skills.length} skills</span>
            )}
            {character.languages && character.languages.length > 0 && (
              <span>{character.languages.length} languages</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {character.tags?.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}