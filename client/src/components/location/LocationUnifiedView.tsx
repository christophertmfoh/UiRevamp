import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Save, X, MapPin, Image as ImageIcon, Trash2 } from 'lucide-react';
import { LocationForm } from './LocationForm';
import { LocationDetailAccordion } from './LocationDetailAccordion';
import { useToast } from '@/hooks/use-toast';

interface Location {
  id: string;
  projectId: string;
  name: string;
  description: string;
  significance: string;
  history: string;
  atmosphere: string;
  imageGallery: any[];
  displayImageId: number | null;
  tags: string[];
}

interface LocationUnifiedViewProps {
  location: Location;
  onBack: () => void;
  onUpdate: () => void;
  onDelete: (location: Location) => void;
  onOpenPortraitModal: (location: Location) => void;
}

export function LocationUnifiedView({ 
  location, 
  onBack, 
  onUpdate, 
  onDelete, 
  onOpenPortraitModal 
}: LocationUnifiedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveComplete = () => {
    setIsEditing(false);
    onUpdate();
    toast({
      title: 'Location Updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${location.name}"? This action cannot be undone.`)) {
      onDelete(location);
    }
  };

  // Show edit form when editing
  if (isEditing) {
    return (
      <LocationForm
        projectId={location.projectId}
        location={location}
        onCancel={handleCancelEdit}
      />
    );
  }

  const hasImage = location.imageGallery && location.imageGallery.length > 0;
  const displayImage = hasImage 
    ? location.imageGallery.find(img => img.id === location.displayImageId) || location.imageGallery[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleEdit} className="interactive-warm gap-2">
            <Edit className="h-4 w-4" />
            Edit Location
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Location Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Location Image */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-green-100 to-blue-200 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {displayImage && displayImage.url ? (
                <img 
                  src={displayImage.url} 
                  alt={location.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <MapPin className="h-16 w-16 text-green-600 dark:text-green-400" />
              )}
            </div>

            {/* Location Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="font-title text-3xl mb-1">{location.name}</h1>
                  {location.significance && (
                    <p className="text-lg text-accent font-medium">{location.significance}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenPortraitModal(location)}
                  className="gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  {hasImage ? 'Gallery' : 'Add Image'}
                </Button>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                {location.description}
              </p>

              {/* Tags */}
              {location.tags && location.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <LocationDetailAccordion location={location} />
    </div>
  );
}