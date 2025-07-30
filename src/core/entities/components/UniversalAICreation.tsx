import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Wand2,
  Brain,
  Zap,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Lightbulb,
  Settings
} from 'lucide-react';
import type {
  EnhancedUniversalEntityConfig,
  AIPromptConfig,
  AIGenerationSettings
} from '../config/EntityConfig';

interface UniversalAICreationProps {
  config: EnhancedUniversalEntityConfig;
  onComplete: (entity: any) => void;
  projectId: string;
}

export function UniversalAICreation({
  config,
  onComplete,
  projectId
}: UniversalAICreationProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<AIPromptConfig | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [aiSettings, setAiSettings] = useState<AIGenerationSettings>({
    creativity: 0.7,
    complexity: 0.5,
    style: 'balanced',
    includeDetails: true
  });

  const aiPrompts = config.aiConfig?.prompts || [];
  const isAIEnabled = config.features?.hasAIGeneration !== false;

  // Handle AI generation
  const handleGenerate = async () => {
    if (!selectedPrompt && !customPrompt.trim()) {
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedData(null);

    try {
      // Simulate AI generation process
      await simulateAIGeneration();

      // Create entity data from AI generation
      const entityData = {
        projectId,
        name: generateEntityName(),
        ...generateEntityFields(),
        // Mark as AI generated
        _aiGenerated: true,
        _generationPrompt: selectedPrompt?.id || 'custom',
        _generationSettings: aiSettings
      };

      setGeneratedData(entityData);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate AI generation process with progress updates
  const simulateAIGeneration = async () => {
    const steps = [
      'Analyzing prompt...',
      'Generating core attributes...',
      'Creating detailed descriptions...',
      'Adding supporting elements...',
      'Finalizing creation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      setGenerationProgress((i + 1) / steps.length * 100);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }
  };

  // Generate entity name based on prompt
  const generateEntityName = (): string => {
    const promptName = selectedPrompt?.name || 'Generated';
    const timestamp = Date.now().toString().slice(-4);
    return `${promptName} ${config.displayName} ${timestamp}`;
  };

  // Generate entity fields based on configuration
  const generateEntityFields = (): Record<string, any> => {
    const fields: Record<string, any> = {};

    // Generate based on field priorities and types
    config.fields.forEach(field => {
      if (field.aiEnhanceable && field.priority !== 'optional') {
        switch (field.type) {
          case 'text':
            fields[field.key] = generateTextValue(field.key, field.label);
            break;
          case 'textarea':
            fields[field.key] = generateDescriptionValue(field.key, field.label);
            break;
          case 'array':
            fields[field.key] = generateArrayValue(field.key, field.label);
            break;
          case 'select':
            if (field.options && field.options.length > 0) {
              fields[field.key] = field.options[Math.floor(Math.random() * field.options.length)];
            }
            break;
          case 'number':
            fields[field.key] = Math.floor(Math.random() * 100) + 1;
            break;
          case 'boolean':
            fields[field.key] = Math.random() > 0.5;
            break;
        }
      }
    });

    return fields;
  };

  // Generate text values based on context
  const generateTextValue = (key: string, label: string): string => {
    const promptContext = selectedPrompt?.context || 'general';

    // This would integrate with actual AI service
    const samples = {
      name: ['Mysterious', 'Ancient', 'Powerful', 'Forgotten', 'Sacred'],
      title: ['Guardian', 'Keeper', 'Master', 'Elder', 'Champion'],
      occupation: ['Scholar', 'Warrior', 'Merchant', 'Artisan', 'Explorer']
    };

    const keyLower = key.toLowerCase();
    if (samples[keyLower as keyof typeof samples]) {
      const options = samples[keyLower as keyof typeof samples];
      return options[Math.floor(Math.random() * options.length)];
    }

    return `Generated ${label}`;
  };

  // Generate description values
  const generateDescriptionValue = (key: string, label: string): string => {
    const promptContext = selectedPrompt?.context || 'general';

    // This would use actual AI generation
    return `This is a detailed ${label.toLowerCase()} generated using AI with ${promptContext} context. The generation takes into account the creative settings and complexity preferences specified.`;
  };

  // Generate array values
  const generateArrayValue = (key: string, label: string): string[] => {
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 items
    const items = [];

    for (let i = 0; i < count; i++) {
      items.push(`Generated ${label.toLowerCase().slice(0, -1)} ${i + 1}`);
    }

    return items;
  };

  // Handle settings change
  const handleSettingsChange = (key: keyof AIGenerationSettings, value: any) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle using generated data
  const handleUseGenerated = () => {
    if (generatedData) {
      onComplete(generatedData);
    }
  };

  // If AI is not enabled, show disabled state
  if (!isAIEnabled) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI Generation Disabled</h3>
          <p className="text-muted-foreground mb-4">
            AI generation is not enabled for {config.displayName.toLowerCase()} creation.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact your administrator to enable AI features for this entity type.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If no prompts configured, show basic custom prompt
  if (aiPrompts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI {config.displayName} Creation
          </h3>
          <p className="text-muted-foreground">
            Describe what you want to create and let AI generate it for you
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Label htmlFor="custom-prompt">Describe your {config.displayName.toLowerCase()}</Label>
            <Textarea
              id="custom-prompt"
              placeholder={`Example: "Create a mysterious ${config.displayName.toLowerCase()} with ancient powers and a complex backstory"`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[100px]"
            />

            <Button
              onClick={handleGenerate}
              disabled={!customPrompt.trim() || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI {config.displayName} Creation
        </h3>
        <p className="text-muted-foreground">
          Choose a specialized prompt or create your own
        </p>
      </div>

      {/* Prompt Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aiPrompts.map(prompt => (
          <Card
            key={prompt.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedPrompt?.id === prompt.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedPrompt(prompt)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {prompt.icon ? (
                    <prompt.icon className="h-6 w-6 text-primary" />
                  ) : (
                    <Wand2 className="h-6 w-6 text-primary" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{prompt.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {prompt.description}
                    </p>
                  </div>
                </div>

                {prompt.complexity && (
                  <Badge variant="outline" className="text-xs">
                    {prompt.complexity}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Prompt preview */}
              <div className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-md">
                "{prompt.template.substring(0, 120)}..."
              </div>

              {/* Prompt features */}
              {prompt.features && prompt.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {prompt.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Custom prompt option */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md border-dashed ${
            selectedPrompt === null ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedPrompt(null)}
        >
          <CardContent className="p-6 text-center space-y-3">
            <Lightbulb className="h-8 w-8 text-primary mx-auto" />
            <div>
              <h4 className="font-medium">Custom Prompt</h4>
              <p className="text-sm text-muted-foreground">
                Write your own description
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom prompt input */}
      {selectedPrompt === null && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Label htmlFor="custom-prompt">Describe your {config.displayName.toLowerCase()}</Label>
            <Textarea
              id="custom-prompt"
              placeholder={`Example: "Create a mysterious ${config.displayName.toLowerCase()} with ancient powers and a complex backstory"`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      )}

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Generation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Creativity Level</Label>
              <Select
                value={aiSettings.creativity?.toString()}
                onValueChange={(value) => handleSettingsChange('creativity', parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.3">Conservative</SelectItem>
                  <SelectItem value="0.7">Balanced</SelectItem>
                  <SelectItem value="0.9">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Complexity</Label>
              <Select
                value={aiSettings.complexity?.toString()}
                onValueChange={(value) => handleSettingsChange('complexity', parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.3">Simple</SelectItem>
                  <SelectItem value="0.5">Moderate</SelectItem>
                  <SelectItem value="0.8">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">Generating your {config.displayName.toLowerCase()}...</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{generationStep}</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Result */}
      {generatedData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Generated {config.displayName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{generatedData.name}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {Object.entries(generatedData)
                  .filter(([key]) => !key.startsWith('_') && key !== 'projectId' && key !== 'name')
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleUseGenerated} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Use This {config.displayName}
              </Button>
              <Button variant="outline" onClick={handleGenerate} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {!generatedData && (
        <Button
          onClick={handleGenerate}
          disabled={(!selectedPrompt && !customPrompt.trim()) || isGenerating}
          className="w-full gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate {config.displayName} with AI
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default UniversalAICreation;