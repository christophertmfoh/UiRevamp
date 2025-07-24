import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, MapPin, Compass, TreePine, Building, Crown, Scroll, Camera, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Location } from '@/lib/types';

interface LocationFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  location?: Location;
}

export function LocationFormExpanded({ projectId, onCancel, location }: LocationFormExpandedProps) {
  const [formData, setFormData] = useState({
    // Identity & Basics
    name: location?.name || '',
    nicknames: location?.nicknames || '',
    aliases: location?.aliases || '',
    locationType: location?.locationType || '', // city, village, forest, mountain, etc.
    classification: location?.classification || '', // capital, outpost, sacred site, etc.
    size: location?.size || '', // small, medium, large, vast
    status: location?.status || '', // thriving, declining, ruined, abandoned
    
    // Geographic & Physical
    description: location?.description || '',
    physicalDescription: location?.physicalDescription || '',
    geography: location?.geography || '',
    terrain: location?.terrain || '',
    climate: location?.climate || '',
    weather: location?.weather || '',
    seasons: location?.seasons || '',
    naturalFeatures: location?.naturalFeatures || '',
    landmarks: location?.landmarks || '',
    boundaries: location?.boundaries || '',
    coordinates: location?.coordinates || '',
    elevation: location?.elevation || '',
    area: location?.area || '',
    
    // Atmosphere & Environment
    atmosphere: location?.atmosphere || '',
    mood: location?.mood || '',
    ambiance: location?.ambiance || '',
    sounds: location?.sounds || '',
    smells: location?.smells || '',
    lighting: location?.lighting || '',
    colors: location?.colors || '',
    temperature: location?.temperature || '',
    airQuality: location?.airQuality || '',
    visibility: location?.visibility || '',
    
    // Architecture & Structures
    architecture: location?.architecture || '',
    buildings: location?.buildings || '',
    structures: location?.structures || '',
    materials: location?.materials || '',
    construction: location?.construction || '',
    layout: location?.layout || '',
    districts: location?.districts || '',
    neighborhoods: location?.neighborhoods || '',
    infrastructure: location?.infrastructure || '',
    fortifications: location?.fortifications || '',
    defenses: location?.defenses || '',
    
    // Society & Culture
    population: location?.population || '',
    demographics: location?.demographics || '',
    inhabitants: location?.inhabitants || '',
    culture: location?.culture || '',
    customs: location?.customs || '',
    traditions: location?.traditions || '',
    languages: location?.languages?.join(', ') || '',
    religion: location?.religion || '',
    beliefs: location?.beliefs || '',
    festivals: location?.festivals || '',
    celebrations: location?.celebrations || '',
    socialStructure: location?.socialStructure || '',
    governance: location?.governance || '',
    leadership: location?.leadership || '',
    laws: location?.laws || '',
    justice: location?.justice || '',
    
    // Politics & Power
    politicalStatus: location?.politicalStatus || '',
    allegiances: location?.allegiances || '',
    conflicts: location?.conflicts || '',
    tensions: location?.tensions || '',
    alliances: location?.alliances || '',
    enemies: location?.enemies || '',
    threats: location?.threats || '',
    
    // Economy & Resources
    economy: location?.economy || '',
    trade: location?.trade || '',
    commerce: location?.commerce || '',
    industry: location?.industry || '',
    resources: location?.resources || '',
    exports: location?.exports || '',
    imports: location?.imports || '',
    currency: location?.currency || '',
    wealth: location?.wealth || '',
    
    // History & Lore
    history: location?.history || '',
    origin: location?.origin || '',
    founding: location?.founding || '',
    pastEvents: location?.pastEvents || '',
    historicalFigures: location?.historicalFigures || '',
    legends: location?.legends || '',
    myths: location?.myths || '',
    folklore: location?.folklore || '',
    significance: location?.significance || '',
    
    // Story & Narrative
    narrativeRole: location?.narrativeRole || '',
    storyImportance: location?.storyImportance || '',
    plotRelevance: location?.plotRelevance || '',
    scenes: location?.scenes || '',
    events: location?.events || '',
    encounters: location?.encounters || '',
    mysteries: location?.mysteries || '',
    secrets: location?.secrets || '',
    
    // Development & Notes
    tags: location?.tags?.join(', ') || '',
    notes: location?.notes || '',
    development: location?.development || '',
    inspiration: location?.inspiration || '',
    references: location?.references || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (locationData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/locations`, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (locationData: any) => 
      apiRequest('PUT', `/api/locations/${location?.id}`, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (location) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Location'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {location ? 'Edit Location' : 'Create New Location'}
        </h1>

        <Tabs defaultValue="Identity" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="Identity" className="gap-2">
              <MapPin className="h-4 w-4" />
              Identity
            </TabsTrigger>
            <TabsTrigger value="Physical" className="gap-2">
              <Compass className="h-4 w-4" />
              Physical
            </TabsTrigger>
            <TabsTrigger value="Atmosphere" className="gap-2">
              <TreePine className="h-4 w-4" />
              Atmosphere
            </TabsTrigger>
            <TabsTrigger value="Architecture" className="gap-2">
              <Building className="h-4 w-4" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="Society" className="gap-2">
              <Crown className="h-4 w-4" />
              Society
            </TabsTrigger>
            <TabsTrigger value="History" className="gap-2">
              <Scroll className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="Story" className="gap-2">
              <Camera className="h-4 w-4" />
              Story
            </TabsTrigger>
            <TabsTrigger value="Meta" className="gap-2">
              <Settings className="h-4 w-4" />
              Meta
            </TabsTrigger>
          </TabsList>

          {/* Identity & Basics */}
          <TabsContent value="Identity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter location name..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nicknames">Nicknames</Label>
                <Input
                  id="nicknames"
                  value={formData.nicknames}
                  onChange={(e) => updateField('nicknames', e.target.value)}
                  placeholder="Common names, shortened names..."
                />
              </div>

              <div>
                <Label htmlFor="locationType">Location Type</Label>
                <Input
                  id="locationType"
                  value={formData.locationType}
                  onChange={(e) => updateField('locationType', e.target.value)}
                  placeholder="City, village, forest, mountain, dungeon..."
                />
              </div>

              <div>
                <Label htmlFor="classification">Classification</Label>
                <Input
                  id="classification"
                  value={formData.classification}
                  onChange={(e) => updateField('classification', e.target.value)}
                  placeholder="Capital, outpost, sacred site, trading post..."
                />
              </div>

              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => updateField('size', e.target.value)}
                  placeholder="Small, medium, large, vast..."
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  placeholder="Thriving, declining, ruined, abandoned..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">General Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Overall description of this location..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="aliases">Aliases & Other Names</Label>
              <Textarea
                id="aliases"
                value={formData.aliases}
                onChange={(e) => updateField('aliases', e.target.value)}
                placeholder="Historical names, names in other languages, formal titles..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Physical & Geographic */}
          <TabsContent value="Physical" className="space-y-6">
            <div>
              <Label htmlFor="physicalDescription">Physical Description</Label>
              <Textarea
                id="physicalDescription"
                value={formData.physicalDescription}
                onChange={(e) => updateField('physicalDescription', e.target.value)}
                placeholder="Detailed physical appearance and layout..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="geography">Geography</Label>
                <Textarea
                  id="geography"
                  value={formData.geography}
                  onChange={(e) => updateField('geography', e.target.value)}
                  placeholder="Geographic features, positioning..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="terrain">Terrain</Label>
                <Textarea
                  id="terrain"
                  value={formData.terrain}
                  onChange={(e) => updateField('terrain', e.target.value)}
                  placeholder="Hills, valleys, rocky, marshy..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="climate">Climate</Label>
                <Input
                  id="climate"
                  value={formData.climate}
                  onChange={(e) => updateField('climate', e.target.value)}
                  placeholder="Tropical, temperate, arctic..."
                />
              </div>

              <div>
                <Label htmlFor="weather">Weather Patterns</Label>
                <Input
                  id="weather"
                  value={formData.weather}
                  onChange={(e) => updateField('weather', e.target.value)}
                  placeholder="Rainy, dry, storms, fog..."
                />
              </div>

              <div>
                <Label htmlFor="naturalFeatures">Natural Features</Label>
                <Textarea
                  id="naturalFeatures"
                  value={formData.naturalFeatures}
                  onChange={(e) => updateField('naturalFeatures', e.target.value)}
                  placeholder="Rivers, mountains, forests, caves..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="landmarks">Landmarks</Label>
                <Textarea
                  id="landmarks"
                  value={formData.landmarks}
                  onChange={(e) => updateField('landmarks', e.target.value)}
                  placeholder="Notable features, monuments, distinctive sites..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Atmosphere & Environment */}
          <TabsContent value="Atmosphere" className="space-y-6">
            <div>
              <Label htmlFor="atmosphere">Overall Atmosphere</Label>
              <Textarea
                id="atmosphere"
                value={formData.atmosphere}
                onChange={(e) => updateField('atmosphere', e.target.value)}
                placeholder="The feeling and mood of this place..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mood">Mood & Tone</Label>
                <Input
                  id="mood"
                  value={formData.mood}
                  onChange={(e) => updateField('mood', e.target.value)}
                  placeholder="Peaceful, ominous, bustling, melancholy..."
                />
              </div>

              <div>
                <Label htmlFor="ambiance">Ambiance</Label>
                <Input
                  id="ambiance"
                  value={formData.ambiance}
                  onChange={(e) => updateField('ambiance', e.target.value)}
                  placeholder="Warm, cold, cozy, foreboding..."
                />
              </div>

              <div>
                <Label htmlFor="sounds">Sounds</Label>
                <Textarea
                  id="sounds"
                  value={formData.sounds}
                  onChange={(e) => updateField('sounds', e.target.value)}
                  placeholder="What sounds are heard here..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="smells">Smells & Scents</Label>
                <Textarea
                  id="smells"
                  value={formData.smells}
                  onChange={(e) => updateField('smells', e.target.value)}
                  placeholder="What scents fill the air..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="lighting">Lighting</Label>
                <Input
                  id="lighting"
                  value={formData.lighting}
                  onChange={(e) => updateField('lighting', e.target.value)}
                  placeholder="Bright, dim, candlelit, natural..."
                />
              </div>

              <div>
                <Label htmlFor="colors">Colors & Hues</Label>
                <Input
                  id="colors"
                  value={formData.colors}
                  onChange={(e) => updateField('colors', e.target.value)}
                  placeholder="Dominant colors and visual palette..."
                />
              </div>
            </div>
          </TabsContent>

          {/* Architecture & Structures */}
          <TabsContent value="Architecture" className="space-y-6">
            <div>
              <Label htmlFor="architecture">Architectural Style</Label>
              <Textarea
                id="architecture"
                value={formData.architecture}
                onChange={(e) => updateField('architecture', e.target.value)}
                placeholder="Building styles, design philosophy..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buildings">Buildings & Structures</Label>
                <Textarea
                  id="buildings"
                  value={formData.buildings}
                  onChange={(e) => updateField('buildings', e.target.value)}
                  placeholder="Key buildings, construction types..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="materials">Construction Materials</Label>
                <Textarea
                  id="materials"
                  value={formData.materials}
                  onChange={(e) => updateField('materials', e.target.value)}
                  placeholder="Stone, wood, metal, magical materials..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="layout">Layout & Organization</Label>
                <Textarea
                  id="layout"
                  value={formData.layout}
                  onChange={(e) => updateField('layout', e.target.value)}
                  placeholder="How the location is organized..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="districts">Districts & Areas</Label>
                <Textarea
                  id="districts"
                  value={formData.districts}
                  onChange={(e) => updateField('districts', e.target.value)}
                  placeholder="Different sections, quarters, zones..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Society & Culture */}
          <TabsContent value="Society" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="population">Population</Label>
                <Input
                  id="population"
                  value={formData.population}
                  onChange={(e) => updateField('population', e.target.value)}
                  placeholder="Number of inhabitants, demographics..."
                />
              </div>

              <div>
                <Label htmlFor="inhabitants">Inhabitants</Label>
                <Input
                  id="inhabitants"
                  value={formData.inhabitants}
                  onChange={(e) => updateField('inhabitants', e.target.value)}
                  placeholder="Who lives here, species, groups..."
                />
              </div>

              <div>
                <Label htmlFor="culture">Culture</Label>
                <Textarea
                  id="culture"
                  value={formData.culture}
                  onChange={(e) => updateField('culture', e.target.value)}
                  placeholder="Cultural practices, way of life..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="governance">Governance</Label>
                <Textarea
                  id="governance"
                  value={formData.governance}
                  onChange={(e) => updateField('governance', e.target.value)}
                  placeholder="How the location is governed..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="leadership">Leadership</Label>
                <Input
                  id="leadership"
                  value={formData.leadership}
                  onChange={(e) => updateField('leadership', e.target.value)}
                  placeholder="Who leads or rules this place..."
                />
              </div>

              <div>
                <Label htmlFor="languages">Languages</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => updateField('languages', e.target.value)}
                  placeholder="Languages spoken here (comma-separated)..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customs">Customs & Traditions</Label>
              <Textarea
                id="customs"
                value={formData.customs}
                onChange={(e) => updateField('customs', e.target.value)}
                placeholder="Local customs, traditions, social practices..."
                rows={4}
              />
            </div>
          </TabsContent>

          {/* History & Lore */}
          <TabsContent value="History" className="space-y-6">
            <div>
              <Label htmlFor="history">History</Label>
              <Textarea
                id="history"
                value={formData.history}
                onChange={(e) => updateField('history', e.target.value)}
                placeholder="The history of this location..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origin & Founding</Label>
                <Textarea
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => updateField('origin', e.target.value)}
                  placeholder="How this place came to be..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pastEvents">Past Events</Label>
                <Textarea
                  id="pastEvents"
                  value={formData.pastEvents}
                  onChange={(e) => updateField('pastEvents', e.target.value)}
                  placeholder="Important historical events..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="legends">Legends & Myths</Label>
                <Textarea
                  id="legends"
                  value={formData.legends}
                  onChange={(e) => updateField('legends', e.target.value)}
                  placeholder="Stories and legends about this place..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="significance">Significance</Label>
                <Textarea
                  id="significance"
                  value={formData.significance}
                  onChange={(e) => updateField('significance', e.target.value)}
                  placeholder="Why this location is important..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Story & Narrative */}
          <TabsContent value="Story" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="narrativeRole">Narrative Role</Label>
                <Input
                  id="narrativeRole"
                  value={formData.narrativeRole}
                  onChange={(e) => updateField('narrativeRole', e.target.value)}
                  placeholder="Role in the story..."
                />
              </div>

              <div>
                <Label htmlFor="storyImportance">Story Importance</Label>
                <Input
                  id="storyImportance"
                  value={formData.storyImportance}
                  onChange={(e) => updateField('storyImportance', e.target.value)}
                  placeholder="How important to the plot..."
                />
              </div>

              <div>
                <Label htmlFor="scenes">Scenes & Events</Label>
                <Textarea
                  id="scenes"
                  value={formData.scenes}
                  onChange={(e) => updateField('scenes', e.target.value)}
                  placeholder="What happens here in the story..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="mysteries">Mysteries & Secrets</Label>
                <Textarea
                  id="mysteries"
                  value={formData.mysteries}
                  onChange={(e) => updateField('mysteries', e.target.value)}
                  placeholder="Hidden aspects, secrets, mysteries..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="encounters">Encounters & Interactions</Label>
              <Textarea
                id="encounters"
                value={formData.encounters}
                onChange={(e) => updateField('encounters', e.target.value)}
                placeholder="What characters might encounter here..."
                rows={4}
              />
            </div>
          </TabsContent>

          {/* Meta & Development */}
          <TabsContent value="Meta" className="space-y-6">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="Tags for organization (comma-separated)..."
              />
            </div>

            <div>
              <Label htmlFor="notes">Development Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Your notes about this location..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inspiration">Inspiration</Label>
                <Textarea
                  id="inspiration"
                  value={formData.inspiration}
                  onChange={(e) => updateField('inspiration', e.target.value)}
                  placeholder="What inspired this location..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="references">References</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => updateField('references', e.target.value)}
                  placeholder="Reference materials, sources..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}