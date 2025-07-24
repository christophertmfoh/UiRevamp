import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Scroll,
  Eye
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  description: string;
  significance?: string;
  history?: string;
  atmosphere?: string;
  tags?: string[];
}

interface LocationDetailAccordionProps {
  location: Location;
}

export function LocationDetailAccordion({ location }: LocationDetailAccordionProps) {
  const DetailSection = ({ title, content, icon: Icon }: { title: string; content?: string; icon: any }) => {
    if (!content || content.trim() === '') return null;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-accent" />
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
          {content}
        </p>
      </div>
    );
  };

  return (
    <Accordion type="multiple" className="space-y-4" defaultValue={["description", "atmosphere", "history"]}>
      
      {/* Description */}
      <AccordionItem value="description" className="border-none">
        <Card className="creative-card">
          <AccordionTrigger className="hover:no-underline p-0">
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <CardTitle>Description</CardTitle>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <CardContent className="space-y-4 pt-0">
              <DetailSection title="Description" content={location.description} icon={MapPin} />
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>

      {/* Atmosphere */}
      {location.atmosphere && (
        <AccordionItem value="atmosphere" className="border-none">
          <Card className="creative-card">
            <AccordionTrigger className="hover:no-underline p-0">
              <CardHeader className="flex-row items-center gap-3 space-y-0 pb-4">
                <Eye className="h-5 w-5 text-accent" />
                <CardTitle>Atmosphere</CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <CardContent className="space-y-4 pt-0">
                <DetailSection title="Atmosphere" content={location.atmosphere} icon={Eye} />
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      )}

      {/* History & Significance */}
      {(location.history || location.significance) && (
        <AccordionItem value="history" className="border-none">
          <Card className="creative-card">
            <AccordionTrigger className="hover:no-underline p-0">
              <CardHeader className="flex-row items-center gap-3 space-y-0 pb-4">
                <Scroll className="h-5 w-5 text-accent" />
                <CardTitle>History & Significance</CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <CardContent className="space-y-4 pt-0">
                <DetailSection title="History" content={location.history} icon={Scroll} />
                <DetailSection title="Significance" content={location.significance} icon={Scroll} />
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      )}

      {/* Tags */}
      {location.tags && location.tags.length > 0 && (
        <AccordionItem value="tags" className="border-none">
          <Card className="creative-card">
            <AccordionTrigger className="hover:no-underline p-0">
              <CardHeader className="flex-row items-center gap-3 space-y-0 pb-4">
                <MapPin className="h-5 w-5 text-accent" />
                <CardTitle>Tags & Categories</CardTitle>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      )}

    </Accordion>
  );
}