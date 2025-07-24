import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Organization } from '../lib/types';

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
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {organization.imageUrl ? (
              <img 
                src={organization.imageUrl} 
                alt={organization.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Organization Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {organization.name}
                  {organization.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({organization.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {organization.role}
                  </Badge>
                  {organization.race && (
                    <Badge variant="outline" className="text-xs">
                      {organization.race}
                    </Badge>
                  )}
                  {organization.class && (
                    <Badge variant="outline" className="text-xs">
                      {organization.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Organization Information */}
                <div className="mt-3 space-y-3">
                  {organization.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{organization.description}</p>
                    </div>
                  )}
                  
                  {organization.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{organization.personality}</p>
                    </div>
                  )}
                  
                  {organization.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{organization.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(organization.hair || organization.skin || organization.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {organization.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {organization.hair}</Badge>
                      )}
                      {organization.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {organization.skin}</Badge>
                      )}
                      {organization.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {organization.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Organization Traits */}
                {organization.personalityTraits && organization.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {organization.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {organization.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{organization.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((organization.abilities && organization.abilities.length > 0) || (organization.skills && organization.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {organization.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {organization.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((organization.abilities?.length || 0) + (organization.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((organization.abilities?.length || 0) + (organization.skills?.length || 0)) - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

              </div>
            </div>
          </div>
        </div>

        {/* Organization Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {organization.abilities && organization.abilities.length > 0 && (
              <span>{organization.abilities.length} abilities</span>
            )}
            {organization.skills && organization.skills.length > 0 && (
              <span>{organization.skills.length} skills</span>
            )}
            {organization.languages && organization.languages.length > 0 && (
              <span>{organization.languages.length} languages</span>
            )}
            {organization.relationships && organization.relationships.length > 0 && (
              <span>{organization.relationships.length} relationships</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Click to view details</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}