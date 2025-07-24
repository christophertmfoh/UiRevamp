import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Image as ImageIcon } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  description: string;
  significance: string;
  atmosphere: string;
  imageGallery: any[];
  displayImageId: number | null;
  tags: string[];
}

interface LocationCardProps {
  location: Location;
  onClick: () => void;
  onOpenPortraitModal: () => void;
}

export function LocationCard({ location, onClick, onOpenPortraitModal }: LocationCardProps) {
  const hasImage = location.imageGallery && location.imageGallery.length > 0;
  const displayImage = hasImage 
    ? location.imageGallery.find(img => img.id === location.displayImageId) || location.imageGallery[0]
    : null;

  return (
    <Card className="creative-card hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
      <CardHeader className="p-4" onClick={onClick}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-title truncate group-hover:text-accent transition-colors">
              {location.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {location.significance || 'Location'}
            </div>
          </div>
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0" onClick={onClick}>
        {/* Location Image */}
        <div className="w-full h-32 rounded-lg bg-gradient-to-br from-green-100 to-blue-200 dark:from-green-900/30 dark:to-blue-900/30 mb-3 overflow-hidden">
          {displayImage && displayImage.url ? (
            <img 
              src={displayImage.url} 
              alt={location.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {location.description || 'No description available'}
        </p>

        {/* Atmosphere */}
        {location.atmosphere && (
          <p className="text-xs text-accent/80 italic mb-3 line-clamp-1">
            "{location.atmosphere}"
          </p>
        )}

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {location.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {location.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{location.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPortraitModal();
            }}
            className="flex-1"
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            {hasImage ? 'Gallery' : 'Add Image'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}