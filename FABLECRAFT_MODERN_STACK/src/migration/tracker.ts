/**
 * Enterprise Migration Tracking System
 * 
 * Tracks the progress of asset migration from legacy builds into FABLECRAFT_MODERN_STACK
 * following Feature-Sliced Design architecture and enterprise development practices.
 * 
 * @version 1.0.0
 * @created Step 1.3.2 - Target Structure Preparation
 */

/**
 * Migration step interface for tracking individual migration operations
 */
export interface MigrationStep {
  /** Unique identifier for the migration step */
  id: string;
  
  /** Migration phase (e.g., 'Phase 1', 'Phase 2', etc.) */
  phase: string;
  
  /** Component or system being migrated */
  component: string;
  
  /** Current status of the migration step */
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  
  /** Git commit hash or branch state for rollback */
  rollbackPoint: string;
  
  /** Dependencies required for this migration step */
  dependencies: string[];
  
  /** Validation criteria that must be met for completion */
  validationCriteria: string[];
}

/**
 * Migration phase interface for organizing related steps
 */
export interface MigrationPhase {
  /** Phase identifier */
  id: string;
  
  /** Human-readable phase name */
  name: string;
  
  /** Phase description */
  description: string;
  
  /** Steps within this phase */
  steps: MigrationStep[];
  
  /** Overall phase status */
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  
  /** Estimated duration for the phase */
  estimatedDuration: string;
  
  /** Risk level for the phase */
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Complete migration tracker interface
 */
export interface MigrationTracker {
  /** Migration project name */
  projectName: string;
  
  /** Migration start timestamp */
  startedAt: Date;
  
  /** Migration completion timestamp */
  completedAt?: Date;
  
  /** Current active phase */
  currentPhase: string;
  
  /** Current active step */
  currentStep: string;
  
  /** All migration phases */
  phases: MigrationPhase[];
  
  /** Overall migration status */
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

/**
 * Migration tracking utilities
 */
export class MigrationTrackerService {
  private tracker: MigrationTracker;

  constructor(projectName: string) {
    this.tracker = {
      projectName,
      startedAt: new Date(),
      currentPhase: 'Phase 1',
      currentStep: 'Step 1.1',
      phases: [],
      status: 'pending'
    };
  }

  /**
   * Add a new migration phase
   */
  addPhase(phase: MigrationPhase): void {
    this.tracker.phases.push(phase);
  }

  /**
   * Update step status
   */
  updateStepStatus(phaseId: string, stepId: string, status: MigrationStep['status']): void {
    const phase = this.tracker.phases.find(p => p.id === phaseId);
    if (phase) {
      const step = phase.steps.find(s => s.id === stepId);
      if (step) {
        step.status = status;
        this.updatePhaseStatus(phaseId);
      }
    }
  }

  /**
   * Update current active step
   */
  setCurrentStep(phaseId: string, stepId: string): void {
    this.tracker.currentPhase = phaseId;
    this.tracker.currentStep = stepId;
  }

  /**
   * Get current migration status
   */
  getStatus(): MigrationTracker {
    return { ...this.tracker };
  }

  /**
   * Mark migration as completed
   */
  markCompleted(): void {
    this.tracker.status = 'completed';
    this.tracker.completedAt = new Date();
  }

  /**
   * Private method to update phase status based on step statuses
   */
  private updatePhaseStatus(phaseId: string): void {
    const phase = this.tracker.phases.find(p => p.id === phaseId);
    if (!phase) return;

    const steps = phase.steps;
    const completedSteps = steps.filter(s => s.status === 'completed');
    const failedSteps = steps.filter(s => s.status === 'failed');
    const inProgressSteps = steps.filter(s => s.status === 'in-progress');

    if (failedSteps.length > 0) {
      phase.status = 'failed';
    } else if (completedSteps.length === steps.length) {
      phase.status = 'completed';
    } else if (inProgressSteps.length > 0) {
      phase.status = 'in-progress';
    } else {
      phase.status = 'pending';
    }
  }
}

/**
 * Initialize migration tracker for FABLECRAFT_MODERN_STACK
 */
export function initializeMigrationTracker(): MigrationTrackerService {
  return new MigrationTrackerService('FABLECRAFT_MODERN_STACK');
}

/**
 * Export type definitions for external use
 */
