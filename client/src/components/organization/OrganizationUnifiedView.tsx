import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Save, X, Building2, Target, Users, Cog, Handshake, History, Heart, Settings, Camera, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Organization } from '../../lib/types';
import { ORGANIZATION_SECTIONS } from '../../lib/organizationConfig';
import { OrganizationPortraitModal } from './OrganizationPortraitModal';

interface OrganizationUnifiedViewProps {
  projectId: string;
  organization: Organization;
  onBack: () => void;
  onDelete: (organization: Organization) => void;
}

// Icon mapping for organization tabs
const ICON_COMPONENTS = {
  Identity: Building2,
  Purpose: Target,
  Structure: Users,
  Operations: Cog,
  Relations: Handshake,
  History: History,
  Culture: Heart,
  Meta: Settings,
};

export function OrganizationUnifiedView({ 
  projectId,
  organization, 
  onBack, 
  onDelete 
}: OrganizationUnifiedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(organization);
  const [activeTab, setActiveTab] = useState('identity');
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Organization) => {
      // Clean data before sending
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (key === 'updatedAt') return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          if (Array.isArray(value) && value.length === 0) return false;
          if (value === null || value === undefined) return false;
          return true;
        })
      );
      
      return await apiRequest('PUT', `/api/projects/${projectId}/organizations/${organization.id}`, cleanedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to save organization:', error);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData as Organization);
  };

  const handleCancel = () => {
    setFormData(organization); // Reset form data
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderField = (field: any, value: any) => {
    if (isEditing) {
      switch (field.type) {
        case 'text':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                value={value || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="creative-input"
              />
            </div>
          );
        
        case 'textarea':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Textarea
                id={field.name}
                value={value || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="creative-input min-h-[100px] resize-y"
              />
            </div>
          );
        
        case 'select':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Select 
                value={value || ''} 
                onValueChange={(newValue) => handleInputChange(field.name, newValue)}
              >
                <SelectTrigger className="creative-input">
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        
        case 'array':
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                value={Array.isArray(value) ? value.join(', ') : ''}
                onChange={(e) => handleInputChange(field.name, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={`Enter ${field.label.toLowerCase()}, separated by commas...`}
                className="creative-input"
              />
            </div>
          );
        
        default:
          return null;
      }
    } else {
      // View mode - only show fields that have content
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
        return null; // Don't render empty fields in view mode
      }

      return (
        <div key={field.name} className="space-y-2">
          <Label className="text-muted-foreground">{field.label}</Label>
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm">{value}</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Organizations</span>
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={saveMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saveMutation.isPending || !formData.name?.trim()}
                className="interactive-warm"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save Organization'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Organization
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(organization)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Organization Header */}
      <div className="flex items-start space-x-6 mb-8">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-lg flex items-center justify-center shadow-lg">
            {organization.imageUrl ? (
              <img 
                src={organization.imageUrl} 
                alt={organization.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="w-16 h-16 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
            onClick={() => setIsPortraitModalOpen(true)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1">
          <h1 className="font-title text-4xl mb-2">{organization.name}</h1>
          {organization.type && (
            <Badge variant="secondary" className="mb-3">
              {organization.type}
            </Badge>
          )}
          {organization.description && (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {organization.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content - Sidebar Layout like Factions */}
      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-64 space-y-2">
          {ORGANIZATION_SECTIONS.map((section) => {
            const Icon = ICON_COMPONENTS[section.title as keyof typeof ICON_COMPONENTS];
            const isActive = activeTab === section.title.toLowerCase();
            return (
              <button
                key={section.title}
                onClick={() => setActiveTab(section.title.toLowerCase())}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-3 ${
                  isActive 
                    ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30' 
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                <div>
                  <div className="font-medium text-sm">{section.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <Card className="creative-card">
            <div className="p-6">
              {ORGANIZATION_SECTIONS.map((section) => {
                if (activeTab !== section.title.toLowerCase()) return null;
                
                return (
                  <div key={section.title} className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{section.description}</p>
                      <div className="grid gap-6 md:grid-cols-2">
                        {section.fields.map((field) => 
                          renderField(field, formData[field.name as keyof Organization])
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Portrait Modal */}
      <OrganizationPortraitModal
        isOpen={isPortraitModalOpen}
        onClose={() => setIsPortraitModalOpen(false)}
        organization={organization}
        projectId={projectId}
      />
    </div>
  );
}