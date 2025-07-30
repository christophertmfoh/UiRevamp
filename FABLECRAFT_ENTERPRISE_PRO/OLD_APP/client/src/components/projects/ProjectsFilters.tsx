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
    <div className="mb-8">
      {/* Cohesive Toolbar - All project list controls grouped together */}
      <div className="surface-elevated rounded-xl p-4 border border-border/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search Section - Primary action */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 bg-background/50 border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 w-full"
            />
          </div>

          {/* Controls Section - Secondary actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 px-4 py-3 bg-background/50 border-border/50 text-foreground hover:bg-accent/10 hover:border-primary/50 transition-all duration-300 rounded-lg min-w-[140px] justify-start"
                >
                  {React.createElement(getSortIcon(), { 
                    className: "w-4 h-4 text-muted-foreground" 
                  })}
                  <span className="text-sm font-medium flex-1 text-left">
                    {getSortLabel()}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
            <div className="flex items-center bg-background/50 border border-border/50 rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});