import React from 'react';
import { Library, Activity, Sparkles, PlusCircle } from 'lucide-react';

interface ProjectsStatsProps {
  totalProjects: number;
  completedProjects: number;
  onNewProject: () => void;
}

export function ProjectsStats({ totalProjects, completedProjects, onNewProject }: ProjectsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {/* Total Projects */}
      <div className="surface-elevated rounded-xl p-6 border border-border/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {totalProjects}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Total Projects
            </p>
          </div>
          <div className="w-12 h-12 gradient-primary-br rounded-xl flex items-center justify-center shadow-md">
            <Library className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="surface-elevated rounded-xl p-6 border border-border/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {completedProjects}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Completed
            </p>
          </div>
          <div className="w-12 h-12 gradient-primary-br rounded-xl flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="surface-elevated rounded-xl p-6 border border-border/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {totalProjects - completedProjects}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              In Progress
            </p>
          </div>
          <div className="w-12 h-12 gradient-primary-br rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* New Project Button - Fixed padding and alignment */}
      <button 
        onClick={onNewProject}
        className="group surface-elevated gradient-primary-br rounded-xl p-6 border border-border/30 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left focus:ring-2 focus:ring-primary/20 focus:outline-none"
      >
        <div className="flex items-center justify-between h-full">
          <div className="space-y-1">
            <p className="text-lg font-bold text-primary-foreground drop-shadow-sm">
              New Project
            </p>
            <p className="text-sm text-primary-foreground/80 font-medium drop-shadow-sm">
              Start your journey
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PlusCircle className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </button>
    </div>
  );
}