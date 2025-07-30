import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, List, Trash2, Edit3 } from 'lucide-react';

/**
 * Story Outline Editor Component
 * Structure planning tool for creative writing projects
 */

interface OutlineItem {
  id: string;
  title: string;
  description: string;
  type: 'chapter' | 'scene' | 'note';
  order: number;
}

interface StoryOutlineEditorProps {
  projectId: string;
  outlineId?: string;
  onStructureChange?: (structure: OutlineItem[]) => void;
  initialOutline?: OutlineItem[];
}

export const StoryOutlineEditor: React.FC<StoryOutlineEditorProps> = ({
  projectId,
  outlineId,
  onStructureChange,
  initialOutline = []
}) => {
  const [outline, setOutline] = useState<OutlineItem[]>(initialOutline);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addItem = useCallback((type: 'chapter' | 'scene' | 'note') => {
    const newItem: OutlineItem = {
      id: `${type}-${Date.now()}`,
      title: `New ${type}`,
      description: '',
      type,
      order: outline.length
    };
    
    const newOutline = [...outline, newItem];
    setOutline(newOutline);
    onStructureChange?.(newOutline);
    setEditingId(newItem.id);
  }, [outline, onStructureChange]);

  const updateItem = useCallback((id: string, updates: Partial<OutlineItem>) => {
    const newOutline = outline.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setOutline(newOutline);
    onStructureChange?.(newOutline);
  }, [outline, onStructureChange]);

  const deleteItem = useCallback((id: string) => {
    const newOutline = outline.filter(item => item.id !== id);
    setOutline(newOutline);
    onStructureChange?.(newOutline);
  }, [outline, onStructureChange]);

  const getTypeColor = (type: OutlineItem['type']) => {
    switch (type) {
      case 'chapter': return 'bg-blue-500';
      case 'scene': return 'bg-green-500';
      case 'note': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Story Outline
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {outline.length} items
            </Badge>
            
            <Button
              size="sm"
              onClick={() => addItem('chapter')}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Chapter
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => addItem('scene')}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Scene
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {outline.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No outline items yet. Add a chapter or scene to get started.</p>
          </div>
        ) : (
          outline.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(item.type)}`} />
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                      className="font-medium bg-transparent border-b border-border focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <h3 
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => setEditingId(item.id)}
                    >
                      {item.title}
                    </h3>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(item.id)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <textarea
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                placeholder="Add description or notes..."
                className="w-full h-20 p-2 text-sm border border-border rounded resize-none focus:outline-none focus:ring-1 focus:ring-primary/20 bg-background"
              />
            </div>
          ))
        )}
        
        <div className="pt-3 border-t border-border/20 text-xs text-muted-foreground">
          Project: {projectId} {outlineId && `• Outline: ${outlineId}`}
        </div>
      </CardContent>
    </Card>
  );
};