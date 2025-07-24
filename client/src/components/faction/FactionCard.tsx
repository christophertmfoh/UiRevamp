import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Faction } from '../lib/types';

interface FactionCardProps {
  faction: Faction;
  onSelect: (faction: Faction) => void;
  onEdit: (faction: Faction) => void;
  onDelete: (faction: Faction) => void;
}

export function FactionCard({ faction, onSelect, onEdit, onDelete }: FactionCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(faction)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Faction Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {faction.imageUrl ? (
              <img 
                src={faction.imageUrl} 
                alt={faction.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Faction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {faction.name}
                  {faction.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({faction.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {faction.role}
                  </Badge>
                  {faction.race && (
                    <Badge variant="outline" className="text-xs">
                      {faction.race}
                    </Badge>
                  )}
                  {faction.class && (
                    <Badge variant="outline" className="text-xs">
                      {faction.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Faction Information */}
                <div className="mt-3 space-y-3">
                  {faction.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{faction.description}</p>
                    </div>
                  )}
                  
                  {faction.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{faction.personality}</p>
                    </div>
                  )}
                  
                  {faction.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{faction.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(faction.hair || faction.skin || faction.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {faction.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {faction.hair}</Badge>
                      )}
                      {faction.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {faction.skin}</Badge>
                      )}
                      {faction.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {faction.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Faction Traits */}
                {faction.personalityTraits && faction.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {faction.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {faction.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{faction.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((faction.abilities && faction.abilities.length > 0) || (faction.skills && faction.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {faction.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {faction.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((faction.abilities?.length || 0) + (faction.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((faction.abilities?.length || 0) + (faction.skills?.length || 0)) - 6} more
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
                    onEdit(faction);
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
                    onDelete(faction);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Faction Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {faction.abilities && faction.abilities.length > 0 && (
              <span>{faction.abilities.length} abilities</span>
            )}
            {faction.skills && faction.skills.length > 0 && (
              <span>{faction.skills.length} skills</span>
            )}
            {faction.languages && faction.languages.length > 0 && (
              <span>{faction.languages.length} languages</span>
            )}
            {faction.relationships && faction.relationships.length > 0 && (
              <span>{faction.relationships.length} relationships</span>
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