import React from 'react';
import { Library, Activity, Sparkles, PlusCircle } from 'lucide-react';

interface ProjectsStatsProps {
  totalProjects: number;
  completedProjects: number;
  onNewProject: () => void;
}

export function ProjectsStats({ totalProjects, completedProjects, onNewProject }: ProjectsStatsProps) {
  return (
    <div className="desktop-grid-4 gap-lg mb-xl stagger-children" style={{'--stagger-delay': '100ms'}}>
      {/* Total Projects */}
      <div className="card-enhanced p-lg space-y-sm fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-heading-2 text-foreground">
              {totalProjects}
            </p>
            <p className="text-caption text-muted-foreground mt-1">
              Total Projects
            </p>
          </div>
          <div className="w-10 h-10 gradient-primary-br rounded-lg flex items-center justify-center shadow-md">
            <Library className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="card-enhanced p-lg space-y-sm fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-heading-2 text-foreground">
              {completedProjects}
            </p>
            <p className="text-caption text-muted-foreground mt-1">
              Completed Projects
            </p>
          </div>
          <div className="w-10 h-10 gradient-primary-br rounded-lg flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="card-enhanced p-lg space-y-sm fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-heading-2 text-foreground">
              {totalProjects - completedProjects}
            </p>
            <p className="text-caption text-muted-foreground mt-1">
              In Progress
            </p>
          </div>
          <div className="w-10 h-10 gradient-primary-br rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* New Project Button */}
      <div 
        className="card-enhanced gradient-primary-br p-lg hover-scale hover-glow interactive-element fade-in-up" 
        onClick={onNewProject}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-heading-3 text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              New Project
            </p>
            <p className="text-xs font-medium text-primary-foreground/80 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
              Start your journey
            </p>
          </div>
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}