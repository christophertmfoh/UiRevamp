import type { WebSocket } from 'ws';
import { log } from '../vite';
import { storage } from '../storage/factory';

/**
 * Real-time WebSocket handlers for FableCraft creative writing features
 * Optimized for React 18 concurrent features and real-time collaboration
 */

interface WebSocketMessage {
  type: string;
  payload: any;
  clientId?: string;
  userId?: string;
  timestamp: number;
}

interface TypingIndicator {
  userId: string;
  userName: string;
  location: string; // e.g., "character-form-name", "outline-section-3"
  timestamp: number;
}

interface CollaborationState {
  activeUsers: Map<string, { userId: string; userName: string; location: string }>;
  typingIndicators: Map<string, TypingIndicator>;
  documentLocks: Map<string, string>; // documentId -> userId
}

/**
 * Real-time handlers for character management
 */
export class CharacterRealtimeHandler {
  private collaborationState = new Map<string, CollaborationState>(); // projectId -> state

  /**
   * Handle character field updates in real-time
   */
  async handleCharacterFieldUpdate(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): Promise<void> {
    const { projectId, characterId, field, value, userId } = message.payload;

    try {
      // Optimistic update broadcast to other clients
      broadcast(`project-${projectId}`, {
        type: 'CHARACTER_FIELD_UPDATED',
        payload: {
          characterId,
          field,
          value,
          userId,
          optimistic: true,
        },
        timestamp: Date.now(),
      });

      // Persist to database
      const character = await storage.getCharacter(characterId);
      if (character) {
        character[field] = value;
        await storage.updateCharacter(characterId, character);

        // Confirm update
        broadcast(`project-${projectId}`, {
          type: 'CHARACTER_FIELD_CONFIRMED',
          payload: {
            characterId,
            field,
            value,
            userId,
          },
          timestamp: Date.now(),
        });

        log(`📝 Character field updated: ${characterId}.${field} by user ${userId}`);
      }
    } catch (error) {
      log(`❌ Character field update failed: ${error}`);
      broadcast(`project-${projectId}`, {
        type: 'CHARACTER_FIELD_ERROR',
        payload: {
          characterId,
          field,
          error: error instanceof Error ? error.message : 'Update failed',
        },
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Handle AI character generation progress
   */
  async handleCharacterGeneration(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): Promise<void> {
    const { projectId, prompt, options } = message.payload;
    const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    try {
      // Start generation notification
      broadcast(`project-${projectId}`, {
        type: 'CHARACTER_GENERATION_STARTED',
        payload: {
          generationId,
          prompt,
          status: 'initializing',
        },
        timestamp: Date.now(),
      });

      // Simulate AI generation with progress updates
      const steps = [
        { step: 'analyzing_prompt', progress: 10, message: 'Analyzing character prompt...' },
        { step: 'generating_traits', progress: 30, message: 'Generating personality traits...' },
        { step: 'creating_backstory', progress: 50, message: 'Creating character backstory...' },
        { step: 'defining_relationships', progress: 70, message: 'Defining character relationships...' },
        { step: 'finalizing', progress: 90, message: 'Finalizing character details...' },
        { step: 'complete', progress: 100, message: 'Character generation complete!' },
      ];

      for (const stepData of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

        broadcast(`project-${projectId}`, {
          type: 'CHARACTER_GENERATION_PROGRESS',
          payload: {
            generationId,
            ...stepData,
          },
          timestamp: Date.now(),
        });
      }

      // Final result (would integrate with actual AI generation)
      const generatedCharacter = {
        id: `char-${Date.now()}`,
        name: 'Generated Character',
        personality: 'Brave and determined',
        backstory: 'A warrior from the northern lands...',
        projectId,
      };

      broadcast(`project-${projectId}`, {
        type: 'CHARACTER_GENERATION_COMPLETE',
        payload: {
          generationId,
          character: generatedCharacter,
        },
        timestamp: Date.now(),
      });

      log(`🤖 Character generation completed: ${generationId}`);
    } catch (error) {
      log(`❌ Character generation failed: ${error}`);
      broadcast(`project-${projectId}`, {
        type: 'CHARACTER_GENERATION_ERROR',
        payload: {
          generationId,
          error: error instanceof Error ? error.message : 'Generation failed',
        },
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Handle typing indicators for collaborative editing
   */
  handleTypingIndicator(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): void {
    const { projectId, userId, userName, location, isTyping } = message.payload;
    
    const state = this.getCollaborationState(projectId);
    
    if (isTyping) {
      state.typingIndicators.set(userId, {
        userId,
        userName,
        location,
        timestamp: Date.now(),
      });
    } else {
      state.typingIndicators.delete(userId);
    }

    // Broadcast typing state to other users
    broadcast(`project-${projectId}`, {
      type: 'TYPING_INDICATOR_UPDATE',
      payload: {
        location,
        typingUsers: Array.from(state.typingIndicators.values())
          .filter(indicator => indicator.location === location),
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Handle document locking for collaborative editing
   */
  handleDocumentLock(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): void {
    const { projectId, documentId, userId, action } = message.payload; // action: 'lock' | 'unlock'
    
    const state = this.getCollaborationState(projectId);
    
    if (action === 'lock') {
      const existingLock = state.documentLocks.get(documentId);
      if (existingLock && existingLock !== userId) {
        // Document already locked by another user
        broadcast(`project-${projectId}`, {
          type: 'DOCUMENT_LOCK_DENIED',
          payload: {
            documentId,
            lockedBy: existingLock,
            reason: 'Document is being edited by another user',
          },
          timestamp: Date.now(),
        });
        return;
      }
      
      state.documentLocks.set(documentId, userId);
      log(`🔒 Document locked: ${documentId} by user ${userId}`);
    } else {
      state.documentLocks.delete(documentId);
      log(`🔓 Document unlocked: ${documentId} by user ${userId}`);
    }

    broadcast(`project-${projectId}`, {
      type: 'DOCUMENT_LOCK_UPDATE',
      payload: {
        documentId,
        isLocked: action === 'lock',
        lockedBy: action === 'lock' ? userId : null,
      },
      timestamp: Date.now(),
    });
  }

  private getCollaborationState(projectId: string): CollaborationState {
    if (!this.collaborationState.has(projectId)) {
      this.collaborationState.set(projectId, {
        activeUsers: new Map(),
        typingIndicators: new Map(),
        documentLocks: new Map(),
      });
    }
    return this.collaborationState.get(projectId)!;
  }

  /**
   * Clean up expired typing indicators
   */
  cleanup(): void {
    const now = Date.now();
    const timeout = 5000; // 5 seconds

    this.collaborationState.forEach((state, projectId) => {
      const expired: string[] = [];
      
      state.typingIndicators.forEach((indicator, userId) => {
        if (now - indicator.timestamp > timeout) {
          expired.push(userId);
        }
      });

      expired.forEach(userId => state.typingIndicators.delete(userId));
    });
  }
}

/**
 * Real-time handlers for world bible management
 */
export class WorldBibleRealtimeHandler {
  /**
   * Handle world element updates
   */
  async handleWorldElementUpdate(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): Promise<void> {
    const { projectId, elementType, elementId, data } = message.payload;

    try {
      // Broadcast optimistic update
      broadcast(`world-${projectId}`, {
        type: 'WORLD_ELEMENT_UPDATED',
        payload: {
          elementType,
          elementId,
          data,
          optimistic: true,
        },
        timestamp: Date.now(),
      });

      // Persist update (would integrate with your world bible storage)
      log(`🌍 World element updated: ${elementType}/${elementId}`);

      // Confirm update
      broadcast(`world-${projectId}`, {
        type: 'WORLD_ELEMENT_CONFIRMED',
        payload: {
          elementType,
          elementId,
          data,
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      log(`❌ World element update failed: ${error}`);
      broadcast(`world-${projectId}`, {
        type: 'WORLD_ELEMENT_ERROR',
        payload: {
          elementType,
          elementId,
          error: error instanceof Error ? error.message : 'Update failed',
        },
        timestamp: Date.now(),
      });
    }
  }
}

/**
 * Real-time handlers for project management
 */
export class ProjectRealtimeHandler {
  /**
   * Handle project status updates
   */
  async handleProjectStatusUpdate(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): Promise<void> {
    const { projectId, status, metadata } = message.payload;

    try {
      // Update project status
      const project = await storage.getProject(projectId);
      if (project) {
        project.status = status;
        project.updatedAt = new Date();
        await storage.updateProject(projectId, project);

        broadcast(`project-${projectId}`, {
          type: 'PROJECT_STATUS_UPDATED',
          payload: {
            projectId,
            status,
            metadata,
          },
          timestamp: Date.now(),
        });

        log(`📋 Project status updated: ${projectId} -> ${status}`);
      }
    } catch (error) {
      log(`❌ Project status update failed: ${error}`);
    }
  }

  /**
   * Handle project collaboration invites
   */
  async handleCollaborationInvite(
    clientId: string,
    message: WebSocketMessage,
    broadcast: (roomId: string, message: WebSocketMessage) => void
  ): Promise<void> {
    const { projectId, inviteeEmail, role, inviterName } = message.payload;

    try {
      // Send collaboration invite notification
      broadcast(`user-${inviteeEmail}`, {
        type: 'COLLABORATION_INVITE',
        payload: {
          projectId,
          inviterName,
          role,
        },
        timestamp: Date.now(),
      });

      // Notify project members
      broadcast(`project-${projectId}`, {
        type: 'COLLABORATION_INVITE_SENT',
        payload: {
          inviteeEmail,
          role,
        },
        timestamp: Date.now(),
      });

      log(`🤝 Collaboration invite sent: ${inviteeEmail} to project ${projectId}`);
    } catch (error) {
      log(`❌ Collaboration invite failed: ${error}`);
    }
  }
}

// Singleton instances
export const characterHandler = new CharacterRealtimeHandler();
export const worldBibleHandler = new WorldBibleRealtimeHandler();
export const projectHandler = new ProjectRealtimeHandler();

// Setup cleanup intervals
setInterval(() => {
  characterHandler.cleanup();
}, 30000); // Clean up every 30 seconds