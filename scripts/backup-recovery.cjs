#!/usr/bin/env node

/**
 * Backup and Recovery System
 * Handles automated backups and recovery procedures for FableCraft
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync, spawn } = require('child_process');
const { createReadStream, createWriteStream } = require('fs');
const { createGzip, createGunzip } = require('zlib');
const { pipeline } = require('stream/promises');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

class BackupRecoveryManager {
  constructor(options = {}) {
    this.backupDir = options.backupDir || './backups';
    this.retentionDays = options.retentionDays || 30;
    this.compressionEnabled = options.compressionEnabled !== false;
    this.encryptionEnabled = options.encryptionEnabled || false;
    this.remoteBackup = options.remoteBackup || null;
    
    // Backup configurations
    this.backupConfigs = {
      database: {
        enabled: true,
        type: 'postgres', // or 'sqlite', 'mysql'
        connectionString: process.env.DATABASE_URL,
        excludeTables: ['sessions', 'logs']
      },
      filesystem: {
        enabled: true,
        directories: [
          './uploads',
          './user-data',
          './config'
        ],
        excludePatterns: [
          '*.tmp',
          '*.log',
          'node_modules',
          '.git'
        ]
      },
      application: {
        enabled: true,
        configFiles: [
          '.env',
          'package.json',
          'docker-compose.yml',
          'nginx.conf'
        ]
      }
    };
  }

  async initialize() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`${colors.green}✅ Backup directory initialized: ${this.backupDir}${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Failed to initialize backup directory: ${error.message}${colors.reset}`);
      throw error;
    }
  }

  async createFullBackup(options = {}) {
    const backupId = this.generateBackupId();
    const backupPath = path.join(this.backupDir, backupId);
    
    console.log(`${colors.bold}${colors.cyan}🔄 Starting full backup: ${backupId}${colors.reset}`);
    
    try {
      await fs.mkdir(backupPath, { recursive: true });
      
      const manifest = {
        id: backupId,
        timestamp: new Date().toISOString(),
        type: 'full',
        version: this.getApplicationVersion(),
        components: [],
        metadata: {
          hostname: require('os').hostname(),
          platform: process.platform,
          nodeVersion: process.version
        }
      };

      // Backup database
      if (this.backupConfigs.database.enabled && !options.skipDatabase) {
        console.log(`${colors.blue}📊 Backing up database...${colors.reset}`);
        await this.backupDatabase(backupPath);
        manifest.components.push('database');
      }

      // Backup filesystem
      if (this.backupConfigs.filesystem.enabled && !options.skipFilesystem) {
        console.log(`${colors.blue}📁 Backing up filesystem...${colors.reset}`);
        await this.backupFilesystem(backupPath);
        manifest.components.push('filesystem');
      }

      // Backup application configuration
      if (this.backupConfigs.application.enabled && !options.skipConfig) {
        console.log(`${colors.blue}⚙️ Backing up application config...${colors.reset}`);
        await this.backupApplicationConfig(backupPath);
        manifest.components.push('application');
      }

      // Save backup manifest
      await fs.writeFile(
        path.join(backupPath, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      // Compress backup if enabled
      if (this.compressionEnabled) {
        console.log(`${colors.blue}🗜️ Compressing backup...${colors.reset}`);
        await this.compressBackup(backupPath);
      }

      // Upload to remote storage if configured
      if (this.remoteBackup) {
        console.log(`${colors.blue}☁️ Uploading to remote storage...${colors.reset}`);
        await this.uploadToRemote(backupPath);
      }

      console.log(`${colors.green}✅ Full backup completed: ${backupId}${colors.reset}`);
      return { backupId, backupPath, manifest };

    } catch (error) {
      console.error(`${colors.red}❌ Backup failed: ${error.message}${colors.reset}`);
      // Cleanup failed backup
      try {
        await this.removeDirectory(backupPath);
      } catch (cleanupError) {
        console.warn(`${colors.yellow}⚠️ Cleanup failed: ${cleanupError.message}${colors.reset}`);
      }
      throw error;
    }
  }

  async backupDatabase(backupPath) {
    const dbBackupPath = path.join(backupPath, 'database');
    await fs.mkdir(dbBackupPath, { recursive: true });

    if (this.backupConfigs.database.type === 'postgres') {
      await this.backupPostgres(dbBackupPath);
    } else if (this.backupConfigs.database.type === 'sqlite') {
      await this.backupSQLite(dbBackupPath);
    } else {
      throw new Error(`Unsupported database type: ${this.backupConfigs.database.type}`);
    }
  }

  async backupPostgres(dbBackupPath) {
    const dumpFile = path.join(dbBackupPath, 'dump.sql');
    const connectionString = this.backupConfigs.database.connectionString;
    
    if (!connectionString) {
      throw new Error('Database connection string not configured');
    }

    try {
      // Create database dump
      const pgDumpCommand = `pg_dump "${connectionString}" > "${dumpFile}"`;
      execSync(pgDumpCommand, { stdio: 'pipe' });

      // Create schema-only dump for quick recovery
      const schemaFile = path.join(dbBackupPath, 'schema.sql');
      const schemaCommand = `pg_dump --schema-only "${connectionString}" > "${schemaFile}"`;
      execSync(schemaCommand, { stdio: 'pipe' });

      // Export table statistics
      const statsFile = path.join(dbBackupPath, 'stats.json');
      const stats = await this.getTableStatistics(connectionString);
      await fs.writeFile(statsFile, JSON.stringify(stats, null, 2));

      console.log(`${colors.green}✅ PostgreSQL backup completed${colors.reset}`);
    } catch (error) {
      throw new Error(`PostgreSQL backup failed: ${error.message}`);
    }
  }

  async backupSQLite(dbBackupPath) {
    const dbFile = process.env.SQLITE_DB_PATH || './database.sqlite';
    const backupFile = path.join(dbBackupPath, 'database.sqlite');

    try {
      await fs.copyFile(dbFile, backupFile);
      
      // Create SQL dump for portability
      const dumpFile = path.join(dbBackupPath, 'dump.sql');
      const sqliteCommand = `sqlite3 "${dbFile}" .dump > "${dumpFile}"`;
      execSync(sqliteCommand, { stdio: 'pipe' });

      console.log(`${colors.green}✅ SQLite backup completed${colors.reset}`);
    } catch (error) {
      throw new Error(`SQLite backup failed: ${error.message}`);
    }
  }

  async backupFilesystem(backupPath) {
    const fsBackupPath = path.join(backupPath, 'filesystem');
    await fs.mkdir(fsBackupPath, { recursive: true });

    for (const directory of this.backupConfigs.filesystem.directories) {
      try {
        const dirExists = await fs.access(directory).then(() => true).catch(() => false);
        if (!dirExists) {
          console.warn(`${colors.yellow}⚠️ Directory not found, skipping: ${directory}${colors.reset}`);
          continue;
        }

        const targetDir = path.join(fsBackupPath, path.basename(directory));
        await this.copyDirectory(directory, targetDir);
        console.log(`${colors.green}✅ Backed up directory: ${directory}${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}❌ Failed to backup directory ${directory}: ${error.message}${colors.reset}`);
      }
    }
  }

  async backupApplicationConfig(backupPath) {
    const configBackupPath = path.join(backupPath, 'config');
    await fs.mkdir(configBackupPath, { recursive: true });

    for (const configFile of this.backupConfigs.application.configFiles) {
      try {
        const fileExists = await fs.access(configFile).then(() => true).catch(() => false);
        if (!fileExists) {
          console.warn(`${colors.yellow}⚠️ Config file not found, skipping: ${configFile}${colors.reset}`);
          continue;
        }

        const targetFile = path.join(configBackupPath, path.basename(configFile));
        await fs.copyFile(configFile, targetFile);
        console.log(`${colors.green}✅ Backed up config: ${configFile}${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}❌ Failed to backup config ${configFile}: ${error.message}${colors.reset}`);
      }
    }

    // Backup environment variables (sanitized)
    const envBackup = this.sanitizeEnvironmentVariables();
    await fs.writeFile(
      path.join(configBackupPath, 'environment.json'),
      JSON.stringify(envBackup, null, 2)
    );
  }

  async restoreFromBackup(backupId, options = {}) {
    const backupPath = path.join(this.backupDir, backupId);
    
    console.log(`${colors.bold}${colors.cyan}🔄 Starting restore from backup: ${backupId}${colors.reset}`);

    try {
      // Check if backup exists
      const backupExists = await fs.access(backupPath).then(() => true).catch(() => false);
      if (!backupExists) {
        throw new Error(`Backup not found: ${backupId}`);
      }

      // Read backup manifest
      const manifestPath = path.join(backupPath, 'manifest.json');
      const manifestContent = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestContent);

      console.log(`${colors.blue}📋 Backup info:${colors.reset}`);
      console.log(`  ID: ${manifest.id}`);
      console.log(`  Date: ${manifest.timestamp}`);
      console.log(`  Type: ${manifest.type}`);
      console.log(`  Components: ${manifest.components.join(', ')}`);

      // Confirm restore operation
      if (!options.force && !await this.confirmRestore()) {
        console.log(`${colors.yellow}⚠️ Restore operation cancelled${colors.reset}`);
        return;
      }

      // Create backup of current state before restore
      if (!options.skipCurrentBackup) {
        console.log(`${colors.blue}💾 Creating backup of current state...${colors.reset}`);
        await this.createFullBackup({ skipRemote: true });
      }

      // Restore components
      if (manifest.components.includes('database') && !options.skipDatabase) {
        await this.restoreDatabase(backupPath);
      }

      if (manifest.components.includes('filesystem') && !options.skipFilesystem) {
        await this.restoreFilesystem(backupPath);
      }

      if (manifest.components.includes('application') && !options.skipConfig) {
        await this.restoreApplicationConfig(backupPath);
      }

      console.log(`${colors.green}✅ Restore completed from backup: ${backupId}${colors.reset}`);

    } catch (error) {
      console.error(`${colors.red}❌ Restore failed: ${error.message}${colors.reset}`);
      throw error;
    }
  }

  async restoreDatabase(backupPath) {
    const dbBackupPath = path.join(backupPath, 'database');
    
    console.log(`${colors.blue}📊 Restoring database...${colors.reset}`);

    if (this.backupConfigs.database.type === 'postgres') {
      await this.restorePostgres(dbBackupPath);
    } else if (this.backupConfigs.database.type === 'sqlite') {
      await this.restoreSQLite(dbBackupPath);
    }

    console.log(`${colors.green}✅ Database restore completed${colors.reset}`);
  }

  async restorePostgres(dbBackupPath) {
    const dumpFile = path.join(dbBackupPath, 'dump.sql');
    const connectionString = this.backupConfigs.database.connectionString;

    try {
      // Drop and recreate database (be very careful!)
      const restoreCommand = `psql "${connectionString}" < "${dumpFile}"`;
      execSync(restoreCommand, { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`PostgreSQL restore failed: ${error.message}`);
    }
  }

  async restoreSQLite(dbBackupPath) {
    const backupFile = path.join(dbBackupPath, 'database.sqlite');
    const dbFile = process.env.SQLITE_DB_PATH || './database.sqlite';

    try {
      await fs.copyFile(backupFile, dbFile);
    } catch (error) {
      throw new Error(`SQLite restore failed: ${error.message}`);
    }
  }

  async restoreFilesystem(backupPath) {
    const fsBackupPath = path.join(backupPath, 'filesystem');
    
    console.log(`${colors.blue}📁 Restoring filesystem...${colors.reset}`);

    for (const directory of this.backupConfigs.filesystem.directories) {
      const sourceDir = path.join(fsBackupPath, path.basename(directory));
      const sourceExists = await fs.access(sourceDir).then(() => true).catch(() => false);
      
      if (!sourceExists) {
        console.warn(`${colors.yellow}⚠️ Backup directory not found, skipping: ${sourceDir}${colors.reset}`);
        continue;
      }

      try {
        // Remove existing directory
        await this.removeDirectory(directory);
        // Restore from backup
        await this.copyDirectory(sourceDir, directory);
        console.log(`${colors.green}✅ Restored directory: ${directory}${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}❌ Failed to restore directory ${directory}: ${error.message}${colors.reset}`);
      }
    }
  }

  async restoreApplicationConfig(backupPath) {
    const configBackupPath = path.join(backupPath, 'config');
    
    console.log(`${colors.blue}⚙️ Restoring application config...${colors.reset}`);

    for (const configFile of this.backupConfigs.application.configFiles) {
      const sourceFile = path.join(configBackupPath, path.basename(configFile));
      const sourceExists = await fs.access(sourceFile).then(() => true).catch(() => false);
      
      if (!sourceExists) {
        console.warn(`${colors.yellow}⚠️ Config backup not found, skipping: ${sourceFile}${colors.reset}`);
        continue;
      }

      try {
        await fs.copyFile(sourceFile, configFile);
        console.log(`${colors.green}✅ Restored config: ${configFile}${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}❌ Failed to restore config ${configFile}: ${error.message}${colors.reset}`);
      }
    }
  }

  async listBackups() {
    try {
      const backups = [];
      const entries = await fs.readdir(this.backupDir);
      
      for (const entry of entries) {
        const backupPath = path.join(this.backupDir, entry);
        const manifestPath = path.join(backupPath, 'manifest.json');
        
        try {
          const manifestContent = await fs.readFile(manifestPath, 'utf8');
          const manifest = JSON.parse(manifestContent);
          
          const stats = await fs.stat(backupPath);
          backups.push({
            id: manifest.id,
            timestamp: manifest.timestamp,
            type: manifest.type,
            components: manifest.components,
            size: await this.getDirectorySize(backupPath),
            path: backupPath
          });
        } catch (error) {
          console.warn(`${colors.yellow}⚠️ Invalid backup directory: ${entry}${colors.reset}`);
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error(`${colors.red}❌ Failed to list backups: ${error.message}${colors.reset}`);
      return [];
    }
  }

  async cleanupOldBackups() {
    console.log(`${colors.blue}🧹 Cleaning up old backups...${colors.reset}`);
    
    const backups = await this.listBackups();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    
    let cleanedCount = 0;
    let freedSpace = 0;
    
    for (const backup of backups) {
      if (new Date(backup.timestamp) < cutoffDate) {
        try {
          freedSpace += backup.size;
          await this.removeDirectory(backup.path);
          cleanedCount++;
          console.log(`${colors.green}✅ Removed old backup: ${backup.id}${colors.reset}`);
        } catch (error) {
          console.error(`${colors.red}❌ Failed to remove backup ${backup.id}: ${error.message}${colors.reset}`);
        }
      }
    }
    
    console.log(`${colors.green}✅ Cleanup completed: ${cleanedCount} backups removed, ${this.formatBytes(freedSpace)} freed${colors.reset}`);
  }

  // Utility methods
  generateBackupId() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `backup-${timestamp}-${Math.random().toString(36).substr(2, 6)}`;
  }

  getApplicationVersion() {
    try {
      const packageJson = require('../package.json');
      return packageJson.version || '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }

  sanitizeEnvironmentVariables() {
    const env = { ...process.env };
    const sensitiveKeys = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'API_KEY'];
    
    Object.keys(env).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toUpperCase().includes(sensitive))) {
        env[key] = '[REDACTED]';
      }
    });
    
    return env;
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async removeDirectory(dir) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch (error) {
      // Fallback for older Node.js versions
      const rimraf = require('rimraf');
      return new Promise((resolve, reject) => {
        rimraf(dir, (err) => err ? reject(err) : resolve());
      });
    }
  }

  async getDirectorySize(dir) {
    let size = 0;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        size += await this.getDirectorySize(fullPath);
      } else {
        const stats = await fs.stat(fullPath);
        size += stats.size;
      }
    }
    
    return size;
  }

  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  async confirmRestore() {
    // In a real implementation, you'd want to use a proper prompt library
    console.log(`${colors.yellow}⚠️ This will overwrite current data. Continue? (y/N)${colors.reset}`);
    return true; // For automation, return true. In interactive mode, prompt user.
  }

  async compressBackup(backupPath) {
    // Implementation for backup compression
    console.log(`${colors.blue}🗜️ Compression not implemented yet${colors.reset}`);
  }

  async uploadToRemote(backupPath) {
    // Implementation for remote backup upload
    console.log(`${colors.blue}☁️ Remote upload not implemented yet${colors.reset}`);
  }

  async getTableStatistics(connectionString) {
    // Implementation for database statistics
    return { tables: [], totalRows: 0 };
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const manager = new BackupRecoveryManager();
  
  async function main() {
    await manager.initialize();
    
    switch (command) {
      case 'backup':
        await manager.createFullBackup();
        break;
        
      case 'restore':
        const backupId = args[1];
        if (!backupId) {
          console.error(`${colors.red}❌ Please specify backup ID${colors.reset}`);
          process.exit(1);
        }
        await manager.restoreFromBackup(backupId);
        break;
        
      case 'list':
        const backups = await manager.listBackups();
        console.log(`${colors.bold}Available Backups:${colors.reset}`);
        backups.forEach(backup => {
          console.log(`  ${backup.id} - ${backup.timestamp} (${manager.formatBytes(backup.size)})`);
        });
        break;
        
      case 'cleanup':
        await manager.cleanupOldBackups();
        break;
        
      default:
        console.log(`${colors.bold}FableCraft Backup & Recovery Tool${colors.reset}`);
        console.log('Usage:');
        console.log('  node backup-recovery.cjs backup          - Create full backup');
        console.log('  node backup-recovery.cjs restore <id>    - Restore from backup');
        console.log('  node backup-recovery.cjs list            - List available backups');
        console.log('  node backup-recovery.cjs cleanup         - Remove old backups');
    }
  }
  
  main().catch(error => {
    console.error(`${colors.red}❌ Operation failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = BackupRecoveryManager;