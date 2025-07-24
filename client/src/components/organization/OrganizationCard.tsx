import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Building, ChevronRight } from 'lucide-react';
import type { Organization } from '@/lib/types';

interface OrganizationCardProps {
  organization: Organization;
  onSelect: (organization: Organization) => void;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

export function OrganizationCard({ organization, onSelect, onEdit, onDelete }: OrganizationCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(organization)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Organization Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center flex-shrink-0">
            {organization.imageUrl ? (
              <img 
                src={organization.imageUrl} 
                alt={organization.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            )}
          </div>

          {/* Organization Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {organization.name}
                  {organization.type && (
                    <span className="text-muted-foreground font-normal ml-2 text-sm">
                      ({organization.type})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  {organization.status && (
                    <Badge variant="secondary" className="text-xs">
                      {organization.status}
                    </Badge>
                  )}
                  {organization.tags && organization.tags.length > 0 && (
                    <>
                      {organization.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {organization.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{organization.tags.length - 2} more</span>
                      )}
                    </>
                  )}
                </div>

                {/* Organization-specific Information */}
                <div className="mt-3 space-y-3">
                  {organization.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{organization.description}</p>
                    </div>
                  )}
                  
                  {organization.goals && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Goals</h5>
                      <p className="text-sm line-clamp-2">{organization.goals}</p>
                    </div>
                  )}

                  {organization.leadership && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Leadership</h5>
                      <p className="text-sm line-clamp-2">{organization.leadership}</p>
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
                    onEdit(organization);
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
                    onDelete(organization);
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