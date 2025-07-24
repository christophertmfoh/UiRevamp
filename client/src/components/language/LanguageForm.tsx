import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Language } from '@/lib/types';

interface LanguageFormProps {
  projectId: string;
  onCancel: () => void;
  language?: Language;
}

export function LanguageForm({ projectId, onCancel, language }: LanguageFormProps) {
  const [formData, setFormData] = useState({
    name: language?.name || '',
    family: language?.family || '',
    speakers: language?.speakers?.join(', ') || '',
    description: language?.description || '',
    script: language?.script || '',
    grammar: language?.grammar || '',
    vocabulary: language?.vocabulary || '',
    culturalSignificance: language?.culturalSignificance || '',
    examples: language?.examples || '',
    tags: language?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (languageData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/languages`, languageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (languageData: any) => 
      apiRequest('PUT', `/api/languages/${language?.id}`, languageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'languages'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      name: formData.name,
      family: formData.family,
      speakers: formData.speakers.split(',').map(s => s.trim()).filter(Boolean),
      description: formData.description,
      script: formData.script,
      grammar: formData.grammar,
      vocabulary: formData.vocabulary,
      culturalSignificance: formData.culturalSignificance,
      examples: formData.examples,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (language) {
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
          Back to Languages
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Language'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {language ? 'Edit Language' : 'Create New Language'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                placeholder="Enter language name..."
              />
            </div>

            <div>
              <Label htmlFor="family">Language Family</Label>
              <Input
                id="family"
                value={formData.family}
                onChange={(e) => updateField('family', e.target.value)}
                placeholder="e.g., Elvish, Draconic, Ancient..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="speakers">Speakers</Label>
            <Input
              id="speakers"
              value={formData.speakers}
              onChange={(e) => updateField('speakers', e.target.value)}
              placeholder="Who speaks this language (comma-separated)..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the language and its characteristics..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="script">Writing System</Label>
              <Textarea
                id="script"
                value={formData.script}
                onChange={(e) => updateField('script', e.target.value)}
                placeholder="Describe the writing system or script..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="grammar">Grammar</Label>
              <Textarea
                id="grammar"
                value={formData.grammar}
                onChange={(e) => updateField('grammar', e.target.value)}
                placeholder="Key grammatical features and rules..."
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vocabulary">Vocabulary Notes</Label>
            <Textarea
              id="vocabulary"
              value={formData.vocabulary}
              onChange={(e) => updateField('vocabulary', e.target.value)}
              placeholder="Important words, terms, or vocabulary patterns..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="culturalSignificance">Cultural Significance</Label>
            <Textarea
              id="culturalSignificance"
              value={formData.culturalSignificance}
              onChange={(e) => updateField('culturalSignificance', e.target.value)}
              placeholder="How this language relates to culture and society..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="examples">Examples</Label>
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={(e) => updateField('examples', e.target.value)}
              placeholder="Sample phrases, sentences, or translations..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
            />
          </div>
        </form>
      </Card>
    </div>
  );
}