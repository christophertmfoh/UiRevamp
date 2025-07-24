import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MapPin, ChevronRight, MoreVertical, Edit2, Camera } from 'lucide-react';
import type { Location } from '@/lib/types';

interface LocationCardProps {
  location: Location;
  onSelect: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  onManageImages?: (location: Location) => void;
}

export function LocationCard({ location, onSelect, onEdit, onDelete, onManageImages }: LocationCardProps) {
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
              <MapPin className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Location Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {location.name}
                </h3>
                
                {location.tags && location.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    {location.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {location.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{location.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Location-specific Information */}
                <div className="mt-3 space-y-3">
                  {location.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{location.description}</p>
                    </div>
                  )}
                  
                  {location.atmosphere && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Atmosphere</h5>
                      <p className="text-sm line-clamp-2">{location.atmosphere}</p>
                    </div>
                  )}

                  {location.significance && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Significance</h5>
                      <p className="text-sm line-clamp-2">{location.significance}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(location);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {onManageImages && (
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onManageImages(location);
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Manage Images
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(location);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}