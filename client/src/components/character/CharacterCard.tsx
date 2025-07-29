import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight, Camera } from 'lucide-react';
import { useState } from 'react';
import type { Character } from '@/lib/types';
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

export function CharacterCard({ character, onSelect, onEdit, onDelete }: CharacterCardProps) {
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);

  const handleImageGenerated = (imageUrl: string) => {
    // Handle image generation completion - you might want to refresh the character data
    console.log('Image generated:', imageUrl);
  };

  const handleImageUploaded = (imageUrl: string) => {
    // Handle image upload completion - you might want to refresh the character data
    console.log('Image uploaded:', imageUrl);
  };

  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(character)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Character Avatar */}
          <div 
            className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 relative group/avatar cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsPortraitModalOpen(true);
            }}
          >
            {character.imageUrl ? (
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-full object-cover rounded-lg group-hover/avatar:brightness-75 transition-all duration-200"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400 group-hover/avatar:scale-110 transition-transform duration-200" />
            )}
            {/* Camera overlay on hover */}
            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
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

                {/* Extended Character Information */}
                <div className="mt-3 space-y-3">
                  {character.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{character.description}</p>
                    </div>
                  )}
                  
                  {character.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{character.personality}</p>
                    </div>
                  )}
                  
                  {character.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{character.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(character.hair || character.skin || character.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {character.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {character.hair}</Badge>
                      )}
                      {character.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {character.skin}</Badge>
                      )}
                      {character.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {character.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Character Traits */}
                {character.personalityTraits && character.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {character.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {character.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{character.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((character.abilities && character.abilities.length > 0) || (character.skills && character.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {character.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {character.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((character.abilities?.length || 0) + (character.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((character.abilities?.length || 0) + (character.skills?.length || 0)) - 6} more
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

              </div>
            </div>
          </div>
        </div>

        {/* Character Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {character.abilities && character.abilities.length > 0 && (
              <span>{character.abilities.length} abilities</span>
            )}
            {character.skills && character.skills.length > 0 && (
              <span>{character.skills.length} skills</span>
            )}
            {character.spokenLanguages && (
              <span>Languages: {character.spokenLanguages}</span>
            )}
            {character.relationships && character.relationships.length > 0 && (
              <span>{character.relationships.length} relationships</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Click to view details</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
      
      {/* Portrait Modal */}
      <CharacterPortraitModal
        character={character}
        isOpen={isPortraitModalOpen}
        onClose={() => setIsPortraitModalOpen(false)}
        onImageGenerated={handleImageGenerated}
        onImageUploaded={handleImageUploaded}
      />
    </Card>
  );
}