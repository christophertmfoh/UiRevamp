import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, ChevronRight } from 'lucide-react';
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
          {/* Location Image */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0">
            {location.imageUrl ? (
              <img 
                src={location.imageUrl} 
                alt={location.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MapPin className="h-10 w-10 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* Location Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {location.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {location.type}
                  </Badge>
                  {location.scale && (
                    <Badge variant="outline" className="text-xs">
                      {location.scale}
                    </Badge>
                  )}
                  {location.significance && (
                    <Badge variant="outline" className="text-xs">
                      {location.significance}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                  {location.description}
                </p>

                {/* Tags */}
                {location.tags && location.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {location.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {location.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{location.tags.length - 3} more
                      </Badge>
                    )}
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
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}