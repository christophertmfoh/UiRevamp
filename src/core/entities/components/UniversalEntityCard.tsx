import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, ChevronRight, MoreVertical, Camera } from 'lucide-react';
import type { UniversalEntityConfig } from '../config/EntityConfig';

interface UniversalEntityCardProps {
  config: UniversalEntityConfig;
  entity: any;
  viewMode: 'grid' | 'list';
  onSelect: (entity: any) => void;
  onEdit: (entity: any) => void;
  onDelete: (entity: any) => void;
}

export function UniversalEntityCard({ 
  config, 
  entity, 
  viewMode, 
  onSelect, 
  onEdit, 
  onDelete 
}: UniversalEntityCardProps) {
  
  // Get display fields for current view mode
  const displayFields = config.display.displayFields[viewMode === 'grid' ? 'card' : 'list'];
  
  // Get entity image/portrait
  const getEntityImage = () => {
    if (entity.imageUrl) return entity.imageUrl;
    if (entity.portraits && entity.portraits.length > 0) return entity.portraits[0];
    return null;
  };

  const entityImage = getEntityImage();

  // Render field value based on type
  const renderFieldValue = (fieldKey: string, value: any) => {
    const fieldDef = config.fields.find(f => f.key === fieldKey);
    if (!fieldDef) return null;

    if (!value) return null;

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
          {value.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{value.length - 3} more
            </span>
          )}
        </div>
      );
    }

    if (typeof value === 'string') {
      // Truncate long text
      const maxLength = viewMode === 'grid' ? 100 : 200;
      const truncated = value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
      
      return (
        <p className={`text-sm ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {truncated}
        </p>
      );
    }

    return <span className="text-sm">{String(value)}</span>;
  };

  // Handle click events
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or dropdowns
    if ((e.target as HTMLElement).closest('button, [role="button"]')) {
      return;
    }
    onSelect(entity);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entity);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(entity);
  };

  if (viewMode === 'list') {
    return (
      <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Entity Image */}
            {config.features.hasPortraits && (
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                {entityImage ? (
                  <img 
                    src={entityImage} 
                    alt={entity.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <config.icon className={`h-8 w-8 text-${config.color}-600 dark:text-${config.color}-400`} />
                )}
              </div>
            )}

            {/* Entity Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                    {entity.name}
                  </h3>
                  
                  {/* Display fields */}
                  <div className="mt-2 space-y-2">
                    {displayFields.slice(1).map((fieldKey) => {
                      const value = entity[fieldKey];
                      const fieldDef = config.fields.find(f => f.key === fieldKey);
                      
                      if (!value || !fieldDef) return null;
                      
                      return (
                        <div key={fieldKey}>
                          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {fieldDef.label}
                          </h5>
                          {renderFieldValue(fieldKey, value)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {config.features.hasPortraits && (
                        <DropdownMenuItem>
                          <Camera className="h-4 w-4 mr-2" />
                          Portraits
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Entity Image */}
          {config.features.hasPortraits && (
            <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
              {entityImage ? (
                <img 
                  src={entityImage} 
                  alt={entity.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <config.icon className={`h-10 w-10 text-${config.color}-600 dark:text-${config.color}-400`} />
              )}
            </div>
          )}

          {/* Entity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {entity.name}
                </h3>
                
                {/* Display fields */}
                <div className="mt-3 space-y-3">
                  {displayFields.slice(1).map((fieldKey) => {
                    const value = entity[fieldKey];
                    const fieldDef = config.fields.find(f => f.key === fieldKey);
                    
                    if (!value || !fieldDef) return null;
                    
                    return (
                      <div key={fieldKey}>
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {fieldDef.label}
                        </h5>
                        {renderFieldValue(fieldKey, value)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {config.features.hasPortraits && (
                      <DropdownMenuItem>
                        <Camera className="h-4 w-4 mr-2" />
                        Portraits
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={handleDelete}
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
        </div>
      </CardContent>
    </Card>
  );
}