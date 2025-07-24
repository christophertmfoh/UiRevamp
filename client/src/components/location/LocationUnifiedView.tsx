import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit2, MapPin } from 'lucide-react';
import type { Location } from '@/lib/types';

interface LocationUnifiedViewProps {
  projectId: string;
  location: Location;
  onBack: () => void;
  onDelete: (location: Location) => void;
}

export function LocationUnifiedView({ 
  projectId, 
  location, 
  onBack, 
  onDelete 
}: LocationUnifiedViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Location
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          {/* Location Image */}
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0">
            {location.imageUrl ? (
              <img 
                src={location.imageUrl} 
                alt={location.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MapPin className="h-12 w-12 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* Location Info */}
          <div className="flex-1">
            <h1 className="font-title text-3xl mb-2">{location.name}</h1>
            
            {location.description && (
              <p className="text-muted-foreground mb-4">{location.description}</p>
            )}

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {location.atmosphere && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Atmosphere</p>
                  <p>{location.atmosphere}</p>
                </div>
              )}
              
              {location.significance && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Significance</p>
                  <p>{location.significance}</p>
                </div>
              )}

              {location.history && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">History</p>
                  <p className="line-clamp-2">{location.history}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* TODO: Add comprehensive tabbed view similar to CharacterUnifiedView */}
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Comprehensive location viewer coming soon. Use Edit button to access full details.
        </p>
      </Card>
    </div>
  );
}