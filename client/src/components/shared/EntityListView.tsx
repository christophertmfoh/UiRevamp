import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  Filter,
  SortAsc,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EntityListViewProps {
  title: string;
  description?: string;
  entities: any[];
  icon: React.ComponentType<any>;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateNew: () => void;
  onEdit: (entity: any) => void;
  onDelete: (entity: any) => void;
  onView: (entity: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  renderEntityCard?: (entity: any, index: number) => React.ReactNode;
  renderEntityListItem?: (entity: any, index: number) => React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  fields?: {
    name?: string;
    description?: string;
    imageField?: string;
    badgeField?: string;
    statusField?: string;
  };
}

export function EntityListView({
  title,
  description,
  entities,
  icon: Icon,
  viewMode,
  onViewModeChange,
  onCreateNew,
  onEdit,
  onDelete,
  onView,
  searchQuery,
  onSearchChange,
  renderEntityCard,
  renderEntityListItem,
  emptyStateTitle,
  emptyStateDescription,
  fields = {
    name: 'name',
    description: 'description',
    imageField: 'image',
    badgeField: 'type',
    statusField: 'status'
  }
}: EntityListViewProps) {
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('name');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Filter and sort entities
  const filteredEntities = entities.filter(entity => {
    const searchTerm = searchQuery.toLowerCase();
    const name = entity[fields.name || 'name']?.toLowerCase() || '';
    const description = entity[fields.description || 'description']?.toLowerCase() || '';
    
    return name.includes(searchTerm) || description.includes(searchTerm);
  });

  const sortedEntities = [...filteredEntities].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a[fields.name || 'name'] || '').localeCompare(b[fields.name || 'name'] || '');
      case 'created':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'updated':
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      default:
        return 0;
    }
  });

  // Default card renderer
  const defaultCardRenderer = (entity: any, index: number) => (
    <Card key={entity.id || index} className="creative-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">
              {entity[fields.name || 'name'] || 'Untitled'}
            </CardTitle>
            {entity[fields.description || 'description'] && (
              <CardDescription className="text-sm line-clamp-2">
                {entity[fields.description || 'description']}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(entity)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(entity)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(entity)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {entity[fields.badgeField || 'type'] && (
              <Badge variant="outline" className="text-xs">
                {entity[fields.badgeField || 'type']}
              </Badge>
            )}
            {entity[fields.statusField || 'status'] && (
              <Badge 
                variant={entity[fields.statusField || 'status'] === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {entity[fields.statusField || 'status']}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Default list item renderer
  const defaultListItemRenderer = (entity: any, index: number) => (
    <div 
      key={entity.id || index} 
      className="flex items-center justify-between p-4 border-b hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-2 h-2 rounded-full bg-accent"></div>
        <div className="flex-1">
          <h3 className="font-medium">{entity[fields.name || 'name'] || 'Untitled'}</h3>
          {entity[fields.description || 'description'] && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {entity[fields.description || 'description']}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {entity[fields.badgeField || 'type'] && (
            <Badge variant="outline" className="text-xs">
              {entity[fields.badgeField || 'type']}
            </Badge>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onView(entity)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(entity)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(entity)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="h-8 w-8 text-accent" />
          <div>
            <h1 className="font-title text-3xl">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <Button onClick={onCreateNew} className="interactive-warm">
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Controls */}
      <Card className="creative-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('created')}>
                    Date Created
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('updated')}>
                    Last Updated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterBy('all')}>
                    All Items
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredEntities.length} of {entities.length} {title.toLowerCase()}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Content */}
      {sortedEntities.length === 0 ? (
        <Card className="creative-card">
          <CardContent className="text-center py-16">
            <Icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-title text-xl mb-2">
              {emptyStateTitle || `No ${title} Found`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {emptyStateDescription || 
                (searchQuery 
                  ? `No ${title.toLowerCase()} match your search criteria.` 
                  : `Get started by creating your first ${title.toLowerCase().slice(0, -1)}.`
                )
              }
            </p>
            <Button onClick={onCreateNew} className="interactive-warm">
              <Plus className="h-4 w-4 mr-2" />
              Create {title.slice(0, -1)}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-0"
        }>
          {viewMode === 'grid' ? (
            sortedEntities.map((entity, index) => 
              renderEntityCard ? renderEntityCard(entity, index) : defaultCardRenderer(entity, index)
            )
          ) : (
            <Card className="creative-card">
              <CardContent className="p-0">
                {sortedEntities.map((entity, index) => 
                  renderEntityListItem ? renderEntityListItem(entity, index) : defaultListItemRenderer(entity, index)
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}