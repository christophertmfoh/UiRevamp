import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Target, Users, Sword, Castle, History, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { FACTION_SECTIONS, FACTION_TYPES, BLOOMWEAVER_REGIONS } from '@/lib/factionConfig';
import type { Faction } from '@/lib/types';

interface FactionFormProps {
  projectId: string;
  onCancel: () => void;
  faction?: Faction;
}

export function FactionForm({ projectId, onCancel, faction }: FactionFormProps) {
  const [formData, setFormData] = useState({
    name: faction?.name || '',
    description: faction?.description || '',
    type: faction?.type || '',
    goals: faction?.goals || '',
    methods: faction?.methods || '',
    history: faction?.history || '',
    leadership: faction?.leadership || '',
    structure: faction?.structure || '',
    resources: faction?.resources || '',
    relationships: faction?.relationships || '',
    status: faction?.status || '',
    ideology: faction?.ideology || '',
    methods_detailed: faction?.methods_detailed || '',
    corruption_techniques: faction?.corruption_techniques || '',
    recruitment: faction?.recruitment || '',
    strongholds: faction?.strongholds || '',
    weaknesses: faction?.weaknesses || '',
    threat_level: faction?.threat_level || '',
    current_operations: faction?.current_operations || '',
    key_figures: faction?.key_figures || '',
    origin_story: faction?.origin_story || '',
    tags: (faction?.tags || []).join(', '),
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => 
      fetch(`/api/factions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectId }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/factions', projectId] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => 
      fetch(`/api/factions/${faction?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/factions', projectId] });
      onCancel();
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFactionTypeChange = (newType: string) => {
    const typeDefaults = FACTION_TYPES[newType as keyof typeof FACTION_TYPES];
    if (typeDefaults) {
      setFormData(prev => ({
        ...prev,
        type: newType,
        ...typeDefaults.defaultValues
      }));
    } else {
      setFormData(prev => ({ ...prev, type: newType }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (faction) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.name as keyof typeof formData] as string;
    
    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Select value={value} onValueChange={(val) => {
              if (field.name === 'type') {
                handleFactionTypeChange(val);
              } else {
                handleInputChange(field.name, val);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="min-h-24"
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
          </div>
        );
      case 'array':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {value.split(',').map((tag, idx) => (
                tag.trim() && <Badge key={idx} variant="secondary">{tag.trim()}</Badge>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              required={field.required}
            />
          </div>
        );
    }
  };

  const getTabIcon = (index: number) => {
    const icons = [Target, Users, Sword, Castle, History, Settings];
    const Icon = icons[index] || Settings;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {faction ? 'Edit Faction' : 'Create New Faction'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  BloomWeaver faction configuration
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {faction ? 'Update' : 'Create'} Faction
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <Tabs defaultValue="0" className="h-full flex flex-col">
                  <TabsList className="grid grid-cols-6 mb-6">
                    {FACTION_SECTIONS.map((section, index) => (
                      <TabsTrigger
                        key={index}
                        value={index.toString()}
                        className="flex items-center gap-2"
                      >
                        {getTabIcon(index)}
                        <span className="hidden sm:inline">{section.title}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="flex-1 overflow-auto">
                    {FACTION_SECTIONS.map((section, index) => (
                      <TabsContent
                        key={index}
                        value={index.toString()}
                        className="mt-0 h-full"
                      >
                        <div className="space-y-6">
                          <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {section.title}
                            </h3>
                          </div>
                          <div className="grid gap-6">
                            {section.fields.map(renderField)}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}