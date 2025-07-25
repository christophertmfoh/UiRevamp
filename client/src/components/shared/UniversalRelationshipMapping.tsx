import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, Heart, Sword, Shield, Crown, UserCheck, UserX } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { showErrorToast, showSuccessToast } from '@/lib/utils/errorHandling';

interface Relationship {
  id: string;
  targetEntityId: string;
  targetEntityName: string;
  targetEntityType: string;
  relationshipType: string;
  strength: number;
  status: string;
  description: string;
  notes?: string;
}

interface UniversalRelationshipMappingProps {
  entity: any;
  entityType: string;
  projectId: string;
}

const RELATIONSHIP_TYPES = {
  personal: ['family', 'romantic', 'friend', 'enemy', 'rival', 'mentor', 'student', 'acquaintance'],
  professional: ['ally', 'colleague', 'superior', 'subordinate', 'contractor', 'client', 'competitor'],
  political: ['ruler', 'subject', 'ambassador', 'spy', 'informant', 'traitor', 'rebel'],
  social: ['neighbor', 'guild-member', 'party-member', 'contact', 'stranger']
};

const RELATIONSHIP_STATUSES = ['active', 'strained', 'hostile', 'neutral', 'improving', 'declining', 'severed'];

const RELATIONSHIP_ICONS = {
  romantic: Heart,
  enemy: Sword,
  ally: Shield,
  ruler: Crown,
  friend: UserCheck,
  rival: UserX
};

export function UniversalRelationshipMapping({
  entity,
  entityType,
  projectId
}: UniversalRelationshipMappingProps) {
  const [relationships, setRelationships] = useState<Relationship[]>(entity.relationships || []);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [newRelationship, setNewRelationship] = useState<Partial<Relationship>>({
    relationshipType: '',
    strength: 5,
    status: 'active',
    description: ''
  });

  const queryClient = useQueryClient();

  const saveRelationshipsMutation = useMutation({
    mutationFn: async (updatedRelationships: Relationship[]) => {
      return await apiRequest('PUT', `/api/${entityType}s/${entity.id}`, {
        ...entity,
        relationships: updatedRelationships
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entityType}s`] });
      showSuccessToast('Relationships updated successfully!');
    },
    onError: (error) => {
      showErrorToast(`Failed to update relationships: ${error.message}`);
    }
  });

  const handleAddRelationship = () => {
    if (!newRelationship.targetEntityName || !newRelationship.relationshipType) {
      showErrorToast('Please fill in required fields');
      return;
    }

    const relationship: Relationship = {
      id: Date.now().toString(),
      targetEntityId: Date.now().toString(), // In real app, this would be selected from existing entities
      targetEntityName: newRelationship.targetEntityName!,
      targetEntityType: newRelationship.targetEntityType || 'character',
      relationshipType: newRelationship.relationshipType!,
      strength: newRelationship.strength || 5,
      status: newRelationship.status || 'active',
      description: newRelationship.description || '',
      notes: newRelationship.notes
    };

    const updatedRelationships = [...relationships, relationship];
    setRelationships(updatedRelationships);
    saveRelationshipsMutation.mutate(updatedRelationships);
    
    setNewRelationship({
      relationshipType: '',
      strength: 5,
      status: 'active',
      description: ''
    });
    setIsAddingRelationship(false);
  };

  const handleRemoveRelationship = (relationshipId: string) => {
    const updatedRelationships = relationships.filter(r => r.id !== relationshipId);
    setRelationships(updatedRelationships);
    saveRelationshipsMutation.mutate(updatedRelationships);
  };

  const getRelationshipIcon = (type: string) => {
    const Icon = RELATIONSHIP_ICONS[type as keyof typeof RELATIONSHIP_ICONS] || Users;
    return Icon;
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 8) return 'text-green-600 bg-green-50';
    if (strength >= 6) return 'text-blue-600 bg-blue-50';
    if (strength >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'strained': return 'bg-yellow-100 text-yellow-800';
      case 'hostile': return 'bg-red-100 text-red-800';
      case 'improving': return 'bg-blue-100 text-blue-800';
      case 'declining': return 'bg-orange-100 text-orange-800';
      case 'severed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Relationship Network
          </CardTitle>
          <Dialog open={isAddingRelationship} onOpenChange={setIsAddingRelationship}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Relationship
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Relationship</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Name</Label>
                    <Input
                      placeholder="Character/Entity name"
                      value={newRelationship.targetEntityName || ''}
                      onChange={(e) => setNewRelationship(prev => ({ ...prev, targetEntityName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Type</Label>
                    <Select 
                      value={newRelationship.targetEntityType || 'character'} 
                      onValueChange={(value) => setNewRelationship(prev => ({ ...prev, targetEntityType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character">Character</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="faction">Faction</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Relationship Type</Label>
                    <Select 
                      value={newRelationship.relationshipType || ''} 
                      onValueChange={(value) => setNewRelationship(prev => ({ ...prev, relationshipType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(RELATIONSHIP_TYPES).map(([category, types]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                              {category}
                            </div>
                            {types.map(type => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={newRelationship.status || 'active'} 
                      onValueChange={(value) => setNewRelationship(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Strength (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newRelationship.strength || 5}
                    onChange={(e) => setNewRelationship(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the relationship..."
                    value={newRelationship.description || ''}
                    onChange={(e) => setNewRelationship(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingRelationship(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddRelationship} className="flex-1">
                    Add Relationship
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {relationships.length > 0 ? (
          <div className="space-y-3">
            {relationships.map((relationship) => {
              const Icon = getRelationshipIcon(relationship.relationshipType);
              return (
                <div key={relationship.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{relationship.targetEntityName}</span>
                      <Badge variant="outline" className="text-xs">
                        {relationship.targetEntityType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {relationship.relationshipType}
                      </Badge>
                      <Badge className={getStatusColor(relationship.status)}>
                        {relationship.status}
                      </Badge>
                      <Badge className={getStrengthColor(relationship.strength)}>
                        Strength: {relationship.strength}/10
                      </Badge>
                    </div>
                    {relationship.description && (
                      <p className="text-sm text-muted-foreground">
                        {relationship.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveRelationship(relationship.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              No relationships mapped yet
            </p>
            <Button variant="outline" onClick={() => setIsAddingRelationship(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Relationship
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}