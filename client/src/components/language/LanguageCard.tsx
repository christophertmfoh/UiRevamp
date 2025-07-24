import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MessageSquare, ChevronRight } from 'lucide-react';
import type { Language } from '@/lib/types';

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
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
            {language.imageUrl ? (
              <img 
                src={language.imageUrl} 
                alt={language.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MessageSquare className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            )}
          </div>

          {/* Language Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
                  {language.name}
                  {language.family && (
                    <span className="text-muted-foreground font-normal ml-2 text-sm">
                      ({language.family})
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  {language.speakers && language.speakers.length > 0 && (
                    <>
                      {language.speakers.slice(0, 2).map((speaker, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {speaker}
                        </Badge>
                      ))}
                      {language.speakers.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{language.speakers.length - 2} more</span>
                      )}
                    </>
                  )}
                  {language.tags && language.tags.length > 0 && (
                    <>
                      {language.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={`tag-${index}`} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>

                {/* Language-specific Information */}
                <div className="mt-3 space-y-3">
                  {language.description && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h5>
                      <p className="text-sm line-clamp-2">{language.description}</p>
                    </div>
                  )}
                  
                  {language.script && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Writing System</h5>
                      <p className="text-sm line-clamp-2">{language.script}</p>
                    </div>
                  )}

                  {language.culturalSignificance && (
                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cultural Significance</h5>
                      <p className="text-sm line-clamp-2">{language.culturalSignificance}</p>
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
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}