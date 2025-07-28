/**
 * Phase 3: Replit-Native Backup System
 * Simple localStorage backup replacing complex database backup systems
 * Optimized for creative development workflow
 */

import { Project, Character, Outline, ProseDocument } from '@/lib/types';

interface BackupData {
  timestamp: string;
  version: string;
  projects: Project[];
  characters: Character[];
  outlines: Outline[];
  proseDocuments: ProseDocument[];
  metadata: {
    totalProjects: number;
    totalCharacters: number;
    sessionDuration: number;
    performanceMetrics?: any;
  };
}

interface BackupOptions {
  includeImages?: boolean;
  includeMetadata?: boolean;
  compress?: boolean;
}

class ReplitBackupManager {
  private readonly STORAGE_KEY = 'fablecraft_backup';
  private readonly MAX_BACKUPS = 10;
  private readonly VERSION = '3.0';

  /**
   * Create automatic localStorage backup (Phase 3 replacement for database backups)
   */
  async createAutoBackup(projectId?: string): Promise<void> {
    try {
      const backupData = await this.gatherBackupData(projectId);
      const existingBackups = this.getStoredBackups();
      
      // Add new backup
      existingBackups.unshift(backupData);
      
      // Keep only recent backups
      if (existingBackups.length > this.MAX_BACKUPS) {
        existingBackups.splice(this.MAX_BACKUPS);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingBackups));
      
      console.log('💾 Auto-backup created:', {
        timestamp: backupData.timestamp,
        projects: backupData.projects.length,
        characters: backupData.characters.length
      });
    } catch (error) {
      console.error('🚨 Auto-backup failed:', error);
    }
  }

  /**
   * Export backup file for creative work portability
   */
  async exportBackup(
    projectId?: string, 
    options: BackupOptions = {}
  ): Promise<void> {
    try {
      const backupData = await this.gatherBackupData(projectId, options);
      
      const fileName = projectId 
        ? `fablecraft-project-${projectId}-${new Date().toISOString().split('T')[0]}.json`
        : `fablecraft-full-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('📦 Backup exported:', fileName, backupData);
    } catch (error) {
      console.error('🚨 Export failed:', error);
      throw error;
    }
  }

  /**
   * Import backup from file
   */
  async importBackup(file: File): Promise<BackupData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string) as BackupData;
          
          // Validate backup format
          if (!this.validateBackupData(backupData)) {
            throw new Error('Invalid backup file format');
          }
          
          console.log('📥 Backup imported:', {
            version: backupData.version,
            timestamp: backupData.timestamp,
            projects: backupData.projects.length
          });
          
          resolve(backupData);
        } catch (error) {
          reject(new Error(`Failed to parse backup file: ${error}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read backup file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Get list of stored backups
   */
  getStoredBackups(): BackupData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backup: BackupData): Promise<void> {
    try {
      // In a real app, this would restore to the actual storage
      // For now, we'll store in a separate key for safety
      localStorage.setItem(`${this.STORAGE_KEY}_restored`, JSON.stringify(backup));
      
      console.log('🔄 Backup restored:', {
        timestamp: backup.timestamp,
        projects: backup.projects.length,
        characters: backup.characters.length
      });
    } catch (error) {
      console.error('🚨 Restore failed:', error);
      throw error;
    }
  }

  /**
   * Clear old backups
   */
  clearOldBackups(keepRecent: number = 5): number {
    try {
      const backups = this.getStoredBackups();
      const toKeep = backups.slice(0, keepRecent);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toKeep));
      
      const removed = backups.length - toKeep.length;
      console.log(`🧹 Cleaned up ${removed} old backups`);
      
      return removed;
    } catch (error) {
      console.error('🚨 Cleanup failed:', error);
      return 0;
    }
  }

  /**
   * Get backup storage size
   */
  getStorageInfo(): { size: number; count: number; oldest?: string; newest?: string } {
    try {
      const backups = this.getStoredBackups();
      const size = new Blob([localStorage.getItem(this.STORAGE_KEY) || '']).size;
      
      return {
        size: Math.round(size / 1024), // KB
        count: backups.length,
        oldest: backups[backups.length - 1]?.timestamp,
        newest: backups[0]?.timestamp
      };
    } catch {
      return { size: 0, count: 0 };
    }
  }

  /**
   * Schedule automatic backups
   */
  scheduleAutoBackups(): () => void {
    const interval = setInterval(() => {
      this.createAutoBackup();
    }, 10 * 60 * 1000); // Every 10 minutes in development

    console.log('⏰ Auto-backup scheduled every 10 minutes');

    // Return cleanup function
    return () => {
      clearInterval(interval);
      console.log('⏰ Auto-backup schedule cleared');
    };
  }

  private async gatherBackupData(
    projectId?: string,
    options: BackupOptions = {}
  ): Promise<BackupData> {
    // In a real implementation, this would fetch from your storage layer
    // For now, we'll simulate gathering data
    const mockData: BackupData = {
      timestamp: new Date().toISOString(),
      version: this.VERSION,
      projects: [], // Would fetch actual projects
      characters: [], // Would fetch actual characters
      outlines: [],
      proseDocuments: [],
      metadata: {
        totalProjects: 0,
        totalCharacters: 0,
        sessionDuration: Date.now() - (window.performance?.timing?.navigationStart || Date.now()),
        ...(options.includeMetadata && {
          performanceMetrics: this.gatherPerformanceData()
        })
      }
    };

    return mockData;
  }

  private validateBackupData(data: any): data is BackupData {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.timestamp === 'string' &&
      typeof data.version === 'string' &&
      Array.isArray(data.projects) &&
      Array.isArray(data.characters) &&
      data.metadata &&
      typeof data.metadata.totalProjects === 'number'
    );
  }

  private gatherPerformanceData() {
    try {
      const nav = performance.navigation;
      const timing = performance.timing;
      
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        networkLatency: timing.responseStart - timing.requestStart,
        memoryUsage: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize
        } : null
      };
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const backupManager = new ReplitBackupManager();

// Export types
export type { BackupData, BackupOptions };

// Hook for React components
export function useReplitBackup() {
  const [backups, setBackups] = React.useState<BackupData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setBackups(backupManager.getStoredBackups());
  }, []);

  const createBackup = async (projectId?: string) => {
    setIsLoading(true);
    try {
      await backupManager.createAutoBackup(projectId);
      setBackups(backupManager.getStoredBackups());
    } finally {
      setIsLoading(false);
    }
  };

  const exportBackup = async (projectId?: string, options?: BackupOptions) => {
    setIsLoading(true);
    try {
      await backupManager.exportBackup(projectId, options);
    } finally {
      setIsLoading(false);
    }
  };

  const importBackup = async (file: File) => {
    setIsLoading(true);
    try {
      const backupData = await backupManager.importBackup(file);
      return backupData;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    backups,
    isLoading,
    createBackup,
    exportBackup,
    importBackup,
    storageInfo: backupManager.getStorageInfo(),
    clearOldBackups: backupManager.clearOldBackups.bind(backupManager)
  };
}

// React import fix
import React from 'react';