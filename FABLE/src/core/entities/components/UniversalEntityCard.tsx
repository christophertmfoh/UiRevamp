import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, ChevronRight, MoreVertical, Camera, Star, Eye } from 'lucide-react';
import type { 
  EnhancedUniversalEntityConfig,
  DisplayFieldConfig 
} from '../config/EntityConfig';

interface UniversalEntityCardProps {
  config: EnhancedUniversalEntityConfig;
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
  
  // Get display fields for current view mode based on displayConfig
  const getDisplayFields = (): DisplayFieldConfig[] => {
    if (viewMode === 'grid') {
      return config.displayConfig?.cardFields || [];
    } else {
      return config.displayConfig?.listFields || [];
    }
  };
  
  const displayFields = getDisplayFields();
  
  // Get entity image/portrait
  const getEntityImage = () => {
    if (entity.imageUrl) return entity.imageUrl;
    if (entity.portraits && entity.portraits.length > 0) return entity.portraits[0];
    return null;
  };

  const entityImage = getEntityImage();

  // Enhanced field rendering with configuration-driven display rules
  const renderFieldValue = (fieldConfig: DisplayFieldConfig, value: any) => {
    const fieldDef = config.fields.find(f => f.key === fieldConfig.key);
    if (!fieldDef) return null;

    if (!value && !fieldConfig.showEmpty) return null;
    
    // Handle empty values
    if (!value) {
      const emptyText = fieldConfig.emptyText || fieldDef.emptyStateText || 'Not specified';
      return (
        <span className="text-xs text-muted-foreground italic">
          {emptyText}
        </span>
      );
    }

    // Custom renderer from config
    if (fieldConfig.customRenderer && typeof fieldConfig.customRenderer === 'function') {
      return fieldConfig.customRenderer(value, fieldDef, entity);
    }

    // Array values
    if (Array.isArray(value)) {
      if (value.length === 0) {
        if (!fieldConfig.showEmpty) return null;
        const emptyText = fieldConfig.emptyText || 'None added';
        return (
          <span className="text-xs text-muted-foreground italic">
            {emptyText}
          </span>
        );
      }
      
      const maxItems = fieldConfig.maxItems || (viewMode === 'grid' ? 3 : 5);
      const displayItems = value.slice(0, maxItems);
      
      return (
        <div className="flex flex-wrap gap-1">
          {displayItems.map((item, index) => {
            const displayValue = typeof item === 'object' ? (item.name || item.label || String(item)) : item;
            return (
              <Badge 
                key={index} 
                variant={fieldConfig.badgeVariant || 'secondary'} 
                className={`text-xs ${fieldConfig.badgeClassName || ''}`}
              >
                {displayValue}
              </Badge>
            );
          })}
          {value.length > maxItems && (
            <span className="text-xs text-muted-foreground">
              +{value.length - maxItems} more
            </span>
          )}
        </div>
      );
    }

    // Boolean values
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
          {fieldConfig.booleanLabels ? 
            (value ? fieldConfig.booleanLabels.true : fieldConfig.booleanLabels.false) :
            (value ? 'Yes' : 'No')
          }
        </Badge>
      );
    }

    // String values
    if (typeof value === 'string') {
      const maxLength = fieldConfig.maxLength || (viewMode === 'grid' ? 100 : 200);
      const truncated = value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
      
      return (
        <p className={`text-sm ${
          viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'
        } ${fieldConfig.className || ''}`}>
          {truncated}
        </p>
      );
    }

    // Number values
    if (typeof value === 'number') {
      const formatted = fieldConfig.numberFormat ? 
        new Intl.NumberFormat(undefined, fieldConfig.numberFormat).format(value) :
        String(value);
      
      return (
        <span className={`text-sm font-mono ${fieldConfig.className || ''}`}>
          {fieldConfig.prefix || ''}{formatted}{fieldConfig.suffix || ''}
        </span>
      );
    }

    // Date values
    if (fieldDef.type === 'date' && value) {
      const date = new Date(value);
      const formatted = fieldConfig.dateFormat ? 
        date.toLocaleDateString(undefined, fieldConfig.dateFormat) :
        date.toLocaleDateString();
      
      return (
        <span className={`text-sm ${fieldConfig.className || ''}`}>
          {formatted}
        </span>
      );
    }

    return (
      <span className={`text-sm ${fieldConfig.className || ''}`}>
        {String(value)}
      </span>
    );
  };

  // Calculate completion percentage for display
  const calculateCompletion = () => {
    const essentialFields = config.fields.filter(f => f.priority === 'essential');
    const completed = essentialFields.filter(field => {
      const value = entity[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
    
    return essentialFields.length > 0 ? Math.round((completed / essentialFields.length) * 100) : 100;
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

  // Get primary field (usually name/title)
  const primaryField = displayFields.find(f => f.isPrimary) || displayFields[0];
  const primaryValue = primaryField ? entity[primaryField.key] : entity.name || entity.title || 'Unnamed';
  
  // Get secondary fields (exclude primary)
  const secondaryFields = displayFields.filter(f => !f.isPrimary && f.key !== primaryField?.key);
  
  // Get completion percentage
  const completion = calculateCompletion();
  const showCompletion = config.displayConfig?.showCompletion !== false;

  if (viewMode === 'list') {
    return (
      <Card className="creative-card interactive-warm-subtle cursor-pointer group hover:shadow-md transition-all duration-200" onClick={handleCardClick}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Entity Image */}
            {config.features?.hasPortraits && (
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${config.gradient || 'from-primary/20 to-primary/10'} flex items-center justify-center flex-shrink-0`}>
                {entityImage ? (
                  <img 
                    src={entityImage} 
                    alt={primaryValue}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <config.icon className="h-8 w-8 text-primary" />
                )}
              </div>
            )}

            {/* Entity Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Primary field (title) */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                      {primaryValue}
                    </h3>
                    {showCompletion && (
                      <Badge 
                        variant={completion >= 80 ? 'default' : completion >= 50 ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {completion}%
                      </Badge>
                    )}
                  </div>
                  
                  {/* Secondary fields in compact layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {secondaryFields.slice(0, 4).map((fieldConfig) => {
                      const value = entity[fieldConfig.key];
                      const fieldDef = config.fields.find(f => f.key === fieldConfig.key);
                      
                      if (!value && !fieldConfig.showEmpty) return null;
                      if (!fieldDef) return null;
                      
                      return (
                        <div key={fieldConfig.key} className="min-w-0">
                          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 truncate">
                            {fieldConfig.label || fieldDef.label}
                          </h5>
                          <div className="truncate">
                            {renderFieldValue(fieldConfig, value)}
                          </div>
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
                      <DropdownMenuItem onClick={() => onSelect(entity)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {config.features?.hasPortraits && (
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
    <Card className="creative-card interactive-warm-subtle cursor-pointer group hover:shadow-lg transition-all duration-200" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with image and title */}
          <div className="flex items-start gap-4">
            {/* Entity Image */}
            {config.features?.hasPortraits && (
              <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${config.gradient || 'from-primary/20 to-primary/10'} flex items-center justify-center flex-shrink-0`}>
                {entityImage ? (
                  <img 
                    src={entityImage} 
                    alt={primaryValue}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <config.icon className="h-10 w-10 text-primary" />
                )}
              </div>
            )}

            {/* Title and Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                      {primaryValue}
                    </h3>
                    {showCompletion && (
                      <Badge 
                        variant={completion >= 80 ? 'default' : completion >= 50 ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {completion}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <DropdownMenuItem onClick={() => onSelect(entity)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {config.features?.hasPortraits && (
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
          
          {/* Secondary fields */}
          <div className="space-y-3">
            {secondaryFields.slice(0, 6).map((fieldConfig) => {
              const value = entity[fieldConfig.key];
              const fieldDef = config.fields.find(f => f.key === fieldConfig.key);
              
              if (!value && !fieldConfig.showEmpty) return null;
              if (!fieldDef) return null;
              
              return (
                <div key={fieldConfig.key}>
                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {fieldConfig.label || fieldDef.label}
                  </h5>
                  {renderFieldValue(fieldConfig, value)}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}