import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Item } from '../lib/types';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemCard({ item, onSelect, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(item)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Item Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {item.name}
                  {item.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({item.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.role}
                  </Badge>
                  {item.race && (
                    <Badge variant="outline" className="text-xs">
                      {item.race}
                    </Badge>
                  )}
                  {item.class && (
                    <Badge variant="outline" className="text-xs">
                      {item.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Item Information */}
                <div className="mt-3 space-y-3">
                  {item.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{item.description}</p>
                    </div>
                  )}
                  
                  {item.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{item.personality}</p>
                    </div>
                  )}
                  
                  {item.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{item.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(item.hair || item.skin || item.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {item.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {item.hair}</Badge>
                      )}
                      {item.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {item.skin}</Badge>
                      )}
                      {item.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {item.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Item Traits */}
                {item.personalityTraits && item.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {item.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {item.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{item.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((item.abilities && item.abilities.length > 0) || (item.skills && item.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {item.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {item.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((item.abilities?.length || 0) + (item.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((item.abilities?.length || 0) + (item.skills?.length || 0)) - 6} more
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
                    onEdit(item);
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
                    onDelete(item);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Item Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {item.abilities && item.abilities.length > 0 && (
              <span>{item.abilities.length} abilities</span>
            )}
            {item.skills && item.skills.length > 0 && (
              <span>{item.skills.length} skills</span>
            )}
            {item.languages && item.languages.length > 0 && (
              <span>{item.languages.length} languages</span>
            )}
            {item.relationships && item.relationships.length > 0 && (
              <span>{item.relationships.length} relationships</span>
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