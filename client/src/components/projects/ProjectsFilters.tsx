import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Grid3X3, 
  List, 
  ChevronDown,
  Calendar,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';

interface ProjectsFiltersProps {
  searchQuery: string;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'updated' | 'created' | 'type';
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sort: 'name' | 'updated' | 'created' | 'type') => void;
}

export const ProjectsFilters = React.memo(function ProjectsFilters({
  searchQuery,
  viewMode,
  sortBy,
  onSearchChange,
  onViewModeChange,
  onSortChange
}: ProjectsFiltersProps) {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const sortOptions = [
    { value: 'updated', label: 'Last Updated', icon: Clock },
    { value: 'created', label: 'Date Created', icon: Calendar },
    { value: 'name', label: 'Name', icon: FileText },
    { value: 'type', label: 'Type', icon: TrendingUp },
  ] as const;

  const getSortIcon = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option?.icon || Clock;
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option?.label || 'Last Updated';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between mb-8">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-0 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-enhanced pl-10 pr-4 py-3 bg-card/80 backdrop-blur-sm border-border/30 rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-300"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="group flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border-border/30 text-foreground hover:bg-accent/10 hover:border-primary/40 transition-all duration-300 rounded-xl"
            >
              {React.createElement(getSortIcon(), { 
                className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" 
              })}
              <span className="hidden sm:inline text-sm font-medium">
                {getSortLabel()}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded-lg ${
                  sortBy === option.value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-accent/10 hover:text-primary'
                }`}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
                {sortBy === option.value && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl p-1">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('grid')}
            className={`px-3 py-2 rounded-lg transition-all duration-300 ${
              viewMode === 'grid'
                ? 'gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-2 rounded-lg transition-all duration-300 ${
              viewMode === 'list'
                ? 'gradient-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});