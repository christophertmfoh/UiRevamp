import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import type { MagicSystem } from '@/lib/types';

interface MagicSystemCardProps {
  magicSystem: MagicSystem;
  onSelect: (magicSystem: MagicSystem) => void;
  onEdit: (magicSystem: MagicSystem) => void;
  onDelete: (magicSystem: MagicSystem) => void;
}

export function MagicSystemCard({ magicSystem, onSelect, onEdit, onDelete }: MagicSystemCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(magicSystem)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Magic System Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-200 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center flex-shrink-0">
            {magicSystem.imageUrl ? (
              <img 
                src={magicSystem.imageUrl} 
                alt={magicSystem.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Sparkles className="h-10 w-10 text-violet-600 dark:text-violet-400" />
            )}
          </div>

          {/* Magic System Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {magicSystem.name}
                  {magicSystem.type && (
                    <span className="text-muted-foreground font-normal ml-2 text-sm">
                      ({magicSystem.type})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  {magicSystem.practitioners && magicSystem.practitioners.length > 0 && (
                    <>
                      {magicSystem.practitioners.slice(0, 2).map((practitioner, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {practitioner}
                        </Badge>
                      ))}
                      {magicSystem.practitioners.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{magicSystem.practitioners.length - 2} more</span>
                      )}
                    </>
                  )}
                  {magicSystem.tags && magicSystem.tags.length > 0 && (
                    <>
                      {magicSystem.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={`tag-${index}`} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>

                {/* Magic System-specific Information */}
                <div className="mt-3 space-y-3">
                  {magicSystem.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{magicSystem.description}</p>
                    </div>
                  )}
                  
                  {magicSystem.source && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Source</h5>
                      <p className="text-sm line-clamp-2">{magicSystem.source}</p>
                    </div>
                  )}

                  {magicSystem.limitations && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Limitations</h5>
                      <p className="text-sm line-clamp-2">{magicSystem.limitations}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(magicSystem);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(magicSystem);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}