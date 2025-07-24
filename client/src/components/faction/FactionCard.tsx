import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users, ChevronRight, Shield, Target, Zap } from 'lucide-react';
import type { Faction } from '@/lib/types';

interface FactionCardProps {
  faction: Faction;
  onSelect: (faction: Faction) => void;
  onEdit: (faction: Faction) => void;
  onDelete: (faction: Faction) => void;
}

export function FactionCard({ faction, onSelect, onEdit, onDelete }: FactionCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(faction)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Faction Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {faction.imageUrl ? (
              <img 
                src={faction.imageUrl} 
                alt={faction.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Users className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Faction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {faction.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  {faction.type && (
                    <Badge variant="secondary" className="text-xs">
                      {faction.type}
                    </Badge>
                  )}
                  {faction.threat_level && (
                    <Badge 
                      variant={faction.threat_level === 'Extreme' || faction.threat_level === 'Apocalyptic' ? 'destructive' : 'outline'} 
                      className="text-xs"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {faction.threat_level}
                    </Badge>
                  )}
                  {faction.status && (
                    <Badge variant="outline" className="text-xs">
                      {faction.status}
                    </Badge>
                  )}
                </div>

                {/* Extended Faction Information */}
                <div className="mt-3 space-y-3">
                  {faction.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{faction.description}</p>
                    </div>
                  )}
                  
                  {faction.goals && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        Goals
                      </h5>
                      <p className="text-sm line-clamp-2">{faction.goals}</p>
                    </div>
                  )}
                  
                  {faction.ideology && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ideology</h5>
                      <p className="text-sm line-clamp-2">{faction.ideology}</p>
                    </div>
                  )}
                  
                  {faction.leadership && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Leadership</h5>
                      <p className="text-sm line-clamp-2">{faction.leadership}</p>
                    </div>
                  )}

                  {faction.methods && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Methods</h5>
                      <p className="text-sm line-clamp-2">{faction.methods}</p>
                    </div>
                  )}

                  {faction.tags && faction.tags.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tags</h5>
                      <div className="flex flex-wrap gap-1">
                        {faction.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {faction.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            +{faction.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(faction);
                  }}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(faction);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}