import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Location } from '../lib/types';

interface LocationCardProps {
  location: Location;
  onSelect: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export function LocationCard({ location, onSelect, onEdit, onDelete }: LocationCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(location)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Location Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {location.imageUrl ? (
              <img 
                src={location.imageUrl} 
                alt={location.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Location Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {location.name}
                  {location.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({location.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {location.role}
                  </Badge>
                  {location.race && (
                    <Badge variant="outline" className="text-xs">
                      {location.race}
                    </Badge>
                  )}
                  {location.class && (
                    <Badge variant="outline" className="text-xs">
                      {location.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Location Information */}
                <div className="mt-3 space-y-3">
                  {location.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{location.description}</p>
                    </div>
                  )}
                  
                  {location.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{location.personality}</p>
                    </div>
                  )}
                  
                  {location.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{location.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(location.hair || location.skin || location.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {location.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {location.hair}</Badge>
                      )}
                      {location.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {location.skin}</Badge>
                      )}
                      {location.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {location.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Traits */}
                {location.personalityTraits && location.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {location.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {location.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{location.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((location.abilities && location.abilities.length > 0) || (location.skills && location.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {location.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {location.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((location.abilities?.length || 0) + (location.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((location.abilities?.length || 0) + (location.skills?.length || 0)) - 6} more
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
                    onEdit(location);
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
                    onDelete(location);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Location Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {location.abilities && location.abilities.length > 0 && (
              <span>{location.abilities.length} abilities</span>
            )}
            {location.skills && location.skills.length > 0 && (
              <span>{location.skills.length} skills</span>
            )}
            {location.languages && location.languages.length > 0 && (
              <span>{location.languages.length} languages</span>
            )}
            {location.relationships && location.relationships.length > 0 && (
              <span>{location.relationships.length} relationships</span>
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