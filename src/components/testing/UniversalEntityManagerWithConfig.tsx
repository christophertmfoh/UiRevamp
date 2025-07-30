/**
 * Universal Entity Manager With Config
 * Specialized version for testing that accepts a custom entity configuration
 * Used for Step 11 CHARACTER_CONFIG parity testing
 */

import React, { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText,
  X
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import type { EnhancedUniversalEntityConfig } from '@/core/entities/config/EntityConfig';

type ViewMode = 'grid' | 'list';

interface UniversalEntityManagerWithConfigProps {
  config: EnhancedUniversalEntityConfig;
  projectId: string;
  selectedEntityId?: string | null;
  onClearSelection?: () => void;
}

// Entity card skeleton for lazy loading
const EntityCardSkeleton = memo(() => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
));

// Memoized entity card component
const MemoizedEntityCard = memo(({ 
  entity, 
  config, 
  isSelectionMode, 
  selectedEntityIds, 
  onEntityClick, 
  onSelectEntity 
}: {
  entity: Character;
  config: EnhancedUniversalEntityConfig;
  isSelectionMode: boolean;
  selectedEntityIds: Set<string>;
  onEntityClick: (entity: Character) => void;
  onSelectEntity: (entityId: string, selected: boolean) => void;
}) => {
  const handleClick = useCallback(() => {
    if (isSelectionMode) {
      onSelectEntity(entity.id, !selectedEntityIds.has(entity.id));
    } else {
      onEntityClick(entity);
    }
  }, [entity, isSelectionMode, selectedEntityIds, onEntityClick, onSelectEntity]);

  // Render field value based on configuration
  const renderFieldValue = (fieldKey: string, value: any, fieldConfig: any) => {
    if (!value) return null;

    switch (fieldConfig?.format) {
      case 'line-clamp-2':
        return (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {value}
          </p>
        );
      case 'pills':
        if (Array.isArray(value)) {
          const limit = fieldConfig.limit || 3;
          const items = value.slice(0, limit);
          return (
            <div className="flex flex-wrap gap-1">
              {items.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
              {value.length > limit && (
                <Badge variant="outline" className="text-xs">
                  +{value.length - limit} more
                </Badge>
              )}
            </div>
          );
        }
        return value;
      case 'parentheses':
        return `(${value})`;
      default:
        if (fieldConfig?.badge) {
          return (
            <Badge variant={fieldConfig.badge === 'secondary' ? 'secondary' : 'outline'} className="text-xs">
              {fieldConfig.prefix && `${fieldConfig.prefix} `}{value}
            </Badge>
          );
        }
        return value;
    }
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border overflow-hidden relative ${
        isSelectionMode 
          ? selectedEntityIds.has(entity.id)
            ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-lg' 
            : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
          : 'border-border/30 hover:border-[var(--accent)]/50 bg-gradient-to-br from-background via-background/90 to-[var(--accent)]/5'
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-0 relative">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/3 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              selectedEntityIds.has(entity.id)
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[white]'
                : 'bg-background/80 border-border hover:border-[var(--accent)]'
            }`}>
              {selectedEntityIds.has(entity.id) && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        )}
        
        {/* Entity Image Header */}
        <div className="relative h-64 bg-gradient-to-br from-[var(--accent)]/5 via-muted/20 to-[var(--accent)]/10 overflow-hidden">
          {entity.imageUrl ? (
            <>
              <img 
                src={entity.imageUrl} 
                alt={entity.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 to-muted/30">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                  <config.icon className="h-10 w-10 text-[var(--accent)]/60" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Add Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Entity Details */}
        <div className="p-6 space-y-4">
          {/* Primary Fields */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {config.displayConfig.cardFields
                .filter(field => field.primary)
                .map(fieldConfig => {
                  const value = entity[fieldConfig.key];
                  if (!value) return null;
                  return (
                    <h3 key={fieldConfig.key} className="font-bold text-xl group-hover:text-[var(--accent)] transition-colors truncate">
                      {value}
                    </h3>
                  );
                })}
              
              {/* Secondary Fields */}
              {config.displayConfig.cardFields
                .filter(field => field.secondary)
                .map(fieldConfig => {
                  const value = entity[fieldConfig.key];
                  if (!value) return null;
                  return (
                    <div key={fieldConfig.key} className="text-sm text-muted-foreground mt-1">
                      {renderFieldValue(fieldConfig.key, value, fieldConfig)}
                    </div>
                  );
                })}
            </div>

            {/* Edit Action */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit action
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Badge Fields */}
          <div className="flex flex-wrap gap-2">
            {config.displayConfig.cardFields
              .filter(field => field.badge && field.showInPreview)
              .map(fieldConfig => {
                const value = entity[fieldConfig.key];
                if (!value) return null;
                return (
                  <div key={fieldConfig.key}>
                    {renderFieldValue(fieldConfig.key, value, fieldConfig)}
                  </div>
                );
              })}
          </div>

          {/* Extended Sections */}
          <div className="space-y-3">
            {config.displayConfig.cardFields
              .filter(field => field.section === 'extended' && field.showInPreview)
              .map(fieldConfig => {
                const value = entity[fieldConfig.key];
                if (!value) return null;
                return (
                  <div key={fieldConfig.key}>
                    <h5 className="text-sm font-medium text-muted-foreground mb-1">
                      {fieldConfig.label}
                    </h5>
                    {renderFieldValue(fieldConfig.key, value, fieldConfig)}
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export const UniversalEntityManagerWithConfig = memo(function UniversalEntityManagerWithConfig({ 
  config, 
  projectId, 
  selectedEntityId, 
  onClearSelection 
}: UniversalEntityManagerWithConfigProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>(config.displayConfig.sortOptions[0]?.key || 'alphabetical');
  const [viewMode, setViewMode] = useState<ViewMode>(config.displayConfig.defaultView || 'grid');
  
  // State management - matching CharacterManager exactly
  const [selectedEntity, setSelectedEntity] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const queryClient = useQueryClient();

  // Data fetching - using character API for testing
  const { data: entities = [], isLoading } = useQuery<Character[]>({
    queryKey: [`/api/projects/${projectId}/characters`],
    enabled: !!projectId && projectId !== 'undefined' && projectId !== 'null',
  });

  // PERFORMANCE: Debounced search to reduce re-renders
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // PERFORMANCE: Memoized statistics to prevent recalculation
  const entityStats = useMemo(() => ({
    total: entities.length,
    visible: entities.length, // Simplified for testing
    selected: selectedEntityIds.size
  }), [entities.length, selectedEntityIds.size]);

  // PERFORMANCE: Memoized sorting function to prevent recalculation
  const sortEntities = useCallback((entitiesArray: Character[]): Character[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...entitiesArray].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...entitiesArray].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...entitiesArray].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      default:
        return entitiesArray;
    }
  }, [sortBy]);

  // PERFORMANCE: Memoized filtering and sorting for better performance
  const filteredEntities = useMemo(() => {
    // First filter entities based on debounced search query
    const filtered = entities.filter(entity => {
      if (!debouncedSearchQuery.trim()) return true;
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      const searchFields = config.displayConfig.searchFields;
      
      return searchFields.some(fieldKey => {
        const value = entity[fieldKey];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (Array.isArray(value)) {
          return value.some(item => 
            typeof item === 'string' && item.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
    });
    
    // Then sort the filtered results
    return sortEntities(filtered);
  }, [entities, debouncedSearchQuery, sortBy, config.displayConfig.searchFields, sortEntities]);

  // PERFORMANCE: Memoized selection handlers to prevent unnecessary re-renders
  const handleSelectEntity = useCallback((entityId: string, selected: boolean) => {
    setSelectedEntityIds(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(entityId);
      } else {
        newSelected.delete(entityId);
      }
      return newSelected;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedEntityIds(prev => {
      if (prev.size === filteredEntities.length) {
        return new Set();
      } else {
        return new Set(filteredEntities.map(e => e.id));
      }
    });
  }, [filteredEntities]);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => {
      const newMode = !prev;
      if (prev) { // If we're turning off selection mode
        setSelectedEntityIds(new Set());
      }
      return newMode;
    });
  }, []);

  // PERFORMANCE: Memoized view mode handlers
  const handleGridView = useCallback(() => setViewMode('grid'), []);
  const handleListView = useCallback(() => setViewMode('list'), []);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics - EXACT MATCH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {config.displayName}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-muted-foreground">
                {entityStats.total} {entityStats.total === 1 ? config.name.toLowerCase() : config.pluralName.toLowerCase()} in your world
              </span>
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsCreating(true)} 
              size="lg"
              className="bg-[var(--accent)] hover:bg-[var(--accent)] text-[white] shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="p-1 bg-white/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="font-semibold tracking-wide">Create {config.name}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Controls Bar - EXACT MATCH */}
        <div className="flex items-center justify-between bg-card border rounded-lg p-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${config.pluralName.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px] justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {config.displayConfig.sortOptions.find(opt => opt.key === sortBy)?.label || 'Sort'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {config.displayConfig.sortOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.key}
                    onClick={() => setSortBy(option.key)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border/50 rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleGridView}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleListView}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Entities Display */}
      {isLoading ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-3"
        }>
          {Array.from({ length: 8 }).map((_, i) => (
            <EntityCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEntities.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <config.icon className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {entities.length === 0 ? `No ${config.name.toLowerCase()} yet` : `No ${config.name.toLowerCase()} match your search`}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {entities.length === 0 
                ? config.description
                : 'Try adjusting your search terms.'
              }
            </p>
          </div>
          {entities.length === 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <Button 
                onClick={() => setIsCreating(true)} 
                size="lg"
                className="bg-[var(--accent)] hover:bg-[var(--accent)] text-[white] shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <div className="p-1 bg-white/10 rounded-full mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wide">Create First {config.name}</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-3"
        }>
          {filteredEntities.map((entity) => (
            <Suspense key={entity.id} fallback={<EntityCardSkeleton />}>
              <MemoizedEntityCard
                entity={entity}
                config={config}
                isSelectionMode={isSelectionMode}
                selectedEntityIds={selectedEntityIds}
                onEntityClick={setSelectedEntity}
                onSelectEntity={handleSelectEntity}
              />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
});