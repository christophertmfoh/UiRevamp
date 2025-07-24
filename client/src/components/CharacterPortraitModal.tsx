import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Sparkles, Image, Brain, X } from 'lucide-react';
import type { Character } from '../lib/types';

interface CharacterPortraitModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

export function CharacterPortraitModal({
  character,
  isOpen,
  onClose,
  onImageGenerated,
  onImageUploaded
}: CharacterPortraitModalProps) {
  const [activeTab, setActiveTab] = useState('generate');
  const [aiEngine, setAiEngine] = useState('gemini');
  const [stylePrompt, setStylePrompt] = useState('digital art, fantasy character portrait, detailed face, professional lighting');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Generate AI prompt from character data
  const generateCharacterPrompt = () => {
    const parts = [];
    
    if (character.name) parts.push(`Character named ${character.name}`);
    if (character.age) parts.push(`${character.age} years old`);
    if (character.race) parts.push(`${character.race}`);
    if (character.physicalDescription) parts.push(character.physicalDescription);
    if (character.hair) parts.push(`hair: ${character.hair}`);
    if (character.eyes) parts.push(`eyes: ${character.eyes}`);
    if (character.build) parts.push(`build: ${character.build}`);
    if (character.attire) parts.push(`wearing: ${character.attire}`);
    if (character.distinguishingMarks) parts.push(`distinguishing features: ${character.distinguishingMarks}`);
    
    return parts.join(', ');
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const characterPrompt = generateCharacterPrompt();
      
      console.log('Generating image with character prompt:', characterPrompt);
      console.log('Style prompt:', stylePrompt);
      console.log('Using AI engine:', aiEngine);

      const response = await fetch('/api/characters/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterPrompt,
          stylePrompt,
          aiEngine
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      onImageGenerated?.(result.url);
      onClose();
    } catch (error: any) {
      console.error('Failed to generate image:', error);
      // Better error message for user
      const errorMessage = error.message.includes('API key') 
        ? 'AI service configuration issue. Please check your API settings.'
        : `Failed to generate image: ${error.message}`;
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUploaded?.(imageUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTrainModel = () => {
    console.log('Training model with selected images:', selectedImages);
    // TODO: Implement model training
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto creative-card">
        <DialogHeader>
          <DialogTitle className="font-title text-2xl">
            Manage Portraits for {character.name || 'Character'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate or Upload
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Train Model
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Generation */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      1. Generate or Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* AI Engine Selection */}
                    <div>
                      <Label>AI Engine</Label>
                      <Select value={aiEngine} onValueChange={setAiEngine}>
                        <SelectTrigger className="creative-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini">Google Gemini 2.0 ✨</SelectItem>
                          <SelectItem value="openai">OpenAI DALL-E 3 (Limited)</SelectItem>
                          <SelectItem value="midjourney">Midjourney (Coming Soon)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Gemini 2.0 is recommended for best results and availability
                      </p>
                    </div>

                    {/* Style Prompt */}
                    <div>
                      <Label>Style Reference</Label>
                      <Textarea
                        value={stylePrompt}
                        onChange={(e) => setStylePrompt(e.target.value)}
                        placeholder="e.g., oil painting, dark fantasy, digital art, realistic portrait"
                        className="creative-input"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Describe the artistic style and mood you want
                      </p>
                    </div>

                    {/* Character Prompt Preview */}
                    <div>
                      <Label>Character Description (Auto-generated)</Label>
                      <Textarea
                        value={generateCharacterPrompt()}
                        readOnly
                        className="creative-input text-sm text-muted-foreground"
                        rows={3}
                      />
                    </div>

                    {/* Generate Button */}
                    <Button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="w-full interactive-warm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      OR
                    </div>

                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Portrait Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {character.imageUrl ? (
                        <img 
                          src={character.imageUrl} 
                          alt={character.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Image className="h-16 w-16 mx-auto mb-2" />
                          <p>No portraits yet.</p>
                          <p className="text-sm">Generate or upload one.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="train" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  2. Train Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select 6-10 images from the gallery to create a consistent visual model for this character.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Placeholder for training images */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i}
                      className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {selectedImages.length} / 10 images selected
                  </Badge>
                  <Button 
                    onClick={handleTrainModel}
                    disabled={selectedImages.length < 6}
                    className="interactive-warm"
                  >
                    Train Character Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}