import React from 'react';
import { FileText, Search, PlusCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon className="w-full h-full" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <div className="mt-lg">
          <Button 
            onClick={action.onClick}
            className="btn-enhanced gradient-primary text-primary-foreground px-6 py-3 rounded-xl"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export function EmptyProjectsState({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <EmptyState
      icon={PlusCircle}
      title="No projects yet"
      description="Start your creative journey by creating your first project. Bring your stories to life with AI-powered tools."
      action={{
        label: "Create Your First Project",
        onClick: onCreateProject
      }}
    />
  );
}

export function EmptySearchState() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description="We encountered an error while loading your data. Please try again."
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
    />
  );
}