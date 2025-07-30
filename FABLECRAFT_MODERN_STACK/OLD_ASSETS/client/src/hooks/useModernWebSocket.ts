import { useState, useEffect, useCallback, useTransition, useDeferredValue } from 'react';
import { useToast } from './use-toast';

/**
 * Modern WebSocket Hook for React 18 Integration
 * Optimized for FableCraft real-time features with concurrent rendering
 */

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  clientId?: string;
}

interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  enableOptimisticUpdates?: boolean;
  enableConcurrentProcessing?: boolean;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  messages: WebSocketMessage[];
  lastMessage: WebSocketMessage | null;
  error: string | null;
  connectionId: string | null;
}

export function useModernWebSocket(
  url: string,
  options: WebSocketOptions = {}
) {
  const {
    reconnectAttempts = 10,
    reconnectInterval = 3000,
    enableOptimisticUpdates = true,
    enableConcurrentProcessing = true,
  } = options;

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    messages: [],
    lastMessage: null,
    error: null,
    connectionId: null,
  });

  const [isPending, startTransition] = useTransition();
  const deferredMessages = useDeferredValue(state.messages);
  const { toast } = useToast();

  // Connection management
  const connect = useCallback(() => {
    if (ws?.readyState === WebSocket.OPEN) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const websocket = new WebSocket(url);

      websocket.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'CONNECTION_ESTABLISHED') {
            setState(prev => ({
              ...prev,
              connectionId: message.payload.clientId,
            }));
            return;
          }

          // Use concurrent features for non-urgent updates
          if (enableConcurrentProcessing) {
            startTransition(() => {
              setState(prev => ({
                ...prev,
                messages: [...prev.messages, message],
                lastMessage: message,
              }));
            });
          } else {
            setState(prev => ({
              ...prev,
              messages: [...prev.messages, message],
              lastMessage: message,
            }));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      websocket.onclose = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));
        setWs(null);

        if (!event.wasClean) {
          // Attempt reconnection
          setTimeout(connect, reconnectInterval);
        }
      };

      websocket.onerror = (error) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        isConnecting: false,
      }));
    }
  }, [url, reconnectInterval, enableConcurrentProcessing]);

  // Send message with optimistic updates
  const sendMessage = useCallback((type: string, payload: any) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "WebSocket is not connected",
        variant: "destructive",
      });
      return false;
    }

    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now(),
      clientId: state.connectionId || undefined,
    };

    try {
      ws.send(JSON.stringify(message));

      // Optimistic update for certain message types
      if (enableOptimisticUpdates && shouldOptimisticallyUpdate(type)) {
        startTransition(() => {
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, { ...message, payload: { ...payload, optimistic: true } }],
          }));
        });
      }

      return true;
    } catch (error) {
      toast({
        title: "Send Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
  }, [ws, state.connectionId, enableOptimisticUpdates, toast]);

  // Character-specific methods
  const updateCharacterField = useCallback((characterId: string, field: string, value: any) => {
    return sendMessage('CHARACTER_FIELD_UPDATE', {
      characterId,
      field,
      value,
      userId: 'current-user', // Would come from auth context
    });
  }, [sendMessage]);

  const startCharacterGeneration = useCallback((projectId: string, prompt: string, options: any = {}) => {
    return sendMessage('CHARACTER_GENERATION_START', {
      projectId,
      prompt,
      options,
    });
  }, [sendMessage]);

  const sendTypingIndicator = useCallback((location: string, isTyping: boolean) => {
    return sendMessage('TYPING_INDICATOR', {
      location,
      isTyping,
      userId: 'current-user',
      userName: 'Current User',
    });
  }, [sendMessage]);

  const lockDocument = useCallback((documentId: string, action: 'lock' | 'unlock') => {
    return sendMessage('DOCUMENT_LOCK', {
      documentId,
      action,
      userId: 'current-user',
    });
  }, [sendMessage]);

  // Project collaboration methods
  const updateProjectStatus = useCallback((projectId: string, status: string, metadata: any = {}) => {
    return sendMessage('PROJECT_STATUS_UPDATE', {
      projectId,
      status,
      metadata,
    });
  }, [sendMessage]);

  const inviteCollaborator = useCallback((projectId: string, inviteeEmail: string, role: string) => {
    return sendMessage('COLLABORATION_INVITE', {
      projectId,
      inviteeEmail,
      role,
      inviterName: 'Current User',
    });
  }, [sendMessage]);

  // World bible methods
  const updateWorldElement = useCallback((projectId: string, elementType: string, elementId: string, data: any) => {
    return sendMessage('WORLD_ELEMENT_UPDATE', {
      projectId,
      elementType,
      elementId,
      data,
    });
  }, [sendMessage]);

  // Subscribe to project room
  const subscribeToProject = useCallback((projectId: string) => {
    return sendMessage('SUBSCRIBE_TO_ROOM', { roomId: `project-${projectId}` });
  }, [sendMessage]);

  const unsubscribeFromProject = useCallback((projectId: string) => {
    return sendMessage('UNSUBSCRIBE_FROM_ROOM', { roomId: `project-${projectId}` });
  }, [sendMessage]);

  // Message filtering helpers
  const getMessagesByType = useCallback((type: string) => {
    return deferredMessages.filter(msg => msg.type === type);
  }, [deferredMessages]);

  const getLatestMessageByType = useCallback((type: string) => {
    const messages = getMessagesByType(type);
    return messages[messages.length - 1] || null;
  }, [getMessagesByType]);

  // Connection management
  useEffect(() => {
    connect();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Cleanup old messages (keep last 100)
  useEffect(() => {
    if (state.messages.length > 100) {
      startTransition(() => {
        setState(prev => ({
          ...prev,
          messages: prev.messages.slice(-100),
        }));
      });
    }
  }, [state.messages.length]);

  return {
    // Connection state
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    connectionId: state.connectionId,
    isPending,

    // Messages
    messages: deferredMessages,
    lastMessage: state.lastMessage,
    getMessagesByType,
    getLatestMessageByType,

    // Core methods
    sendMessage,
    connect,

    // Character methods
    updateCharacterField,
    startCharacterGeneration,
    sendTypingIndicator,
    lockDocument,

    // Project methods
    updateProjectStatus,
    inviteCollaborator,
    subscribeToProject,
    unsubscribeFromProject,

    // World bible methods
    updateWorldElement,
  };
}

// Helper function to determine if a message type should use optimistic updates
function shouldOptimisticallyUpdate(type: string): boolean {
  const optimisticTypes = [
    'CHARACTER_FIELD_UPDATE',
    'WORLD_ELEMENT_UPDATE',
    'TYPING_INDICATOR',
  ];
  return optimisticTypes.includes(type);
}

export default useModernWebSocket;