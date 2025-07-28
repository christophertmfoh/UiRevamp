import React, { useState, useCallback } from 'react';
import { useCreativeDebugger } from '@/hooks/useCreativeDebugger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Clock } from 'lucide-react';

/**
 * Writing Editor Component
 * Core writing interface for FableCraft creative platform
 */

interface WritingEditorProps {
  projectId: string;
  documentId?: string;
  onSave?: (content: string) => void;
  placeholder?: string;
  initialContent?: string;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({
  projectId,
  documentId,
  onSave,
  placeholder = "Start writing your story...",
  initialContent = ""
}) => {
  const [content, setContent] = useState(initialContent);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const { logAction, logError } = useCreativeDebugger(`writing-editor-${projectId}`);

  const updateWordCount = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateWordCount(newContent);
    logAction('content_changed', { 
      contentLength: newContent.length,
      wordCount: newContent.trim().split(/\s+/).filter(word => word.length > 0).length
    });
  }, [updateWordCount, logAction]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    logAction('save_started', { contentLength: content.length, wordCount });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
      onSave?.(content);
      setLastSaved(new Date());
      logAction('save_completed', { contentLength: content.length, wordCount });
    } catch (error) {
      console.error('Failed to save:', error);
      logError(error as Error, 'save_operation');
    } finally {
      setIsSaving(false);
    }
  }, [content, onSave, isSaving, wordCount, logAction, logError]);

  React.useEffect(() => {
    updateWordCount(initialContent);
  }, [initialContent, updateWordCount]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Writing Editor
          </CardTitle>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {wordCount} words
            </Badge>
            
            {lastSaved && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
            
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full h-96 p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            lineHeight: '1.6'
          }}
        />
        
        <div className="mt-3 text-xs text-muted-foreground">
          Project: {projectId} {documentId && `• Document: ${documentId}`}
        </div>
      </CardContent>
    </Card>
  );
};