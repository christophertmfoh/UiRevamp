import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, ChevronRight } from 'lucide-react';
import type { Language } from '../lib/types';

interface LanguageCardProps {
  language: Language;
  onSelect: (language: Language) => void;
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
}

export function LanguageCard({ language, onSelect, onEdit, onDelete }: LanguageCardProps) {
  return (
    <Card className="creative-card interactive-warm-subtle cursor-pointer group" onClick={() => onSelect(language)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Language Avatar */}
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
            {language.imageUrl ? (
              <img 
                src={language.imageUrl} 
                alt={language.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Language Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {language.name}
                  {language.title && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({language.title})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {language.role}
                  </Badge>
                  {language.race && (
                    <Badge variant="outline" className="text-xs">
                      {language.race}
                    </Badge>
                  )}
                  {language.class && (
                    <Badge variant="outline" className="text-xs">
                      {language.class}
                    </Badge>
                  )}
                </div>

                {/* Extended Language Information */}
                <div className="mt-3 space-y-3">
                  {language.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{language.description}</p>
                    </div>
                  )}
                  
                  {language.personality && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personality</h5>
                      <p className="text-sm line-clamp-2">{language.personality}</p>
                    </div>
                  )}
                  
                  {language.backstory && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Backstory</h5>
                      <p className="text-sm line-clamp-2">{language.backstory}</p>
                    </div>
                  )}
                </div>

                {/* Physical Traits */}
                {(language.hair || language.skin || language.attire) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Physical</h5>
                    <div className="flex flex-wrap gap-1">
                      {language.hair && (
                        <Badge variant="secondary" className="text-xs">Hair: {language.hair}</Badge>
                      )}
                      {language.skin && (
                        <Badge variant="secondary" className="text-xs">Skin: {language.skin}</Badge>
                      )}
                      {language.attire && (
                        <Badge variant="secondary" className="text-xs">Attire: {language.attire}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Language Traits */}
                {language.personalityTraits && language.personalityTraits.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Traits</h5>
                    <div className="flex flex-wrap gap-1">
                      {language.personalityTraits.slice(0, 4).map((trait, index) => (
                        <span 
                          key={index}
                          className="inline-block text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {language.personalityTraits.length > 4 && (
                        <span className="inline-block text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          +{language.personalityTraits.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills & Abilities */}
                {((language.abilities && language.abilities.length > 0) || (language.skills && language.skills.length > 0)) && (
                  <div className="mt-4">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abilities & Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {language.abilities?.slice(0, 3).map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{ability}</Badge>
                      ))}
                      {language.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {((language.abilities?.length || 0) + (language.skills?.length || 0)) > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{((language.abilities?.length || 0) + (language.skills?.length || 0)) - 6} more
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
                    onEdit(language);
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
                    onDelete(language);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </div>
          </div>
        </div>

        {/* Language Stats Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {language.abilities && language.abilities.length > 0 && (
              <span>{language.abilities.length} abilities</span>
            )}
            {language.skills && language.skills.length > 0 && (
              <span>{language.skills.length} skills</span>
            )}
            {language.languages && language.languages.length > 0 && (
              <span>{language.languages.length} languages</span>
            )}
            {language.relationships && language.relationships.length > 0 && (
              <span>{language.relationships.length} relationships</span>
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