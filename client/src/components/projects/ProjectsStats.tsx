import React from 'react';
import { Library, Activity, Sparkles, PlusCircle } from 'lucide-react';

interface ProjectsStatsProps {
  totalProjects: number;
  completedProjects: number;
  onNewProject: () => void;
}

export function ProjectsStats({ totalProjects, completedProjects, onNewProject }: ProjectsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Projects */}
      <div className="surface-elevated rounded-xl p-4 border border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-foreground">
              {totalProjects}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Total Projects
            </p>
          </div>
          <div className="w-10 h-10 gradient-primary-br rounded-lg flex items-center justify-center shadow-md">
            <Library className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="surface-elevated rounded-xl p-4 border border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-foreground">
              {completedProjects}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Completed Projects
            </p>
          </div>
          <div className="w-10 h-10 gradient-primary-br rounded-lg flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="surface-elevated rounded-xl p-4 border border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-foreground">
              {totalProjects - completedProjects}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">
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
        className="gradient-primary-br rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" 
        onClick={onNewProject}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-black text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
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