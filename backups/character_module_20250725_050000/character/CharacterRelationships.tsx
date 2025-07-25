import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, Heart, Sword, Shield, Link, Trash2, Edit, UserPlus } from 'lucide-react';
import type { Character } from '../../lib/types';

interface Relationship {
  id: string;
  targetCharacterId: string;
  targetCharacterName: string;
  type: 'family' | 'romantic' | 'friend' | 'enemy' | 'ally' | 'mentor' | 'rival' | 'neutral';
  status: 'active' | 'past' | 'complicated' | 'unknown';
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'intense';
  notes: string;
  history: string;
}

const RELATIONSHIP_TYPES = [
  { value: 'family', label: 'Family', icon: Users, color: 'bg-blue-500' },
  { value: 'romantic', label: 'Romantic', icon: Heart, color: 'bg-pink-500' },
  { value: 'friend', label: 'Friend', icon: Shield, color: 'bg-green-500' },
  { value: 'ally', label: 'Ally', icon: Link, color: 'bg-emerald-500' },
  { value: 'mentor', label: 'Mentor', icon: Users, color: 'bg-purple-500' },
  { value: 'rival', label: 'Rival', icon: Sword, color: 'bg-orange-500' },
  { value: 'enemy', label: 'Enemy', icon: Sword, color: 'bg-red-500' },
  { value: 'neutral', label: 'Neutral', icon: Users, color: 'bg-gray-500' }
];

interface CharacterRelationshipsProps {
  character: Character;
  allCharacters: Character[];
  onUpdateRelationships: (relationships: Relationship[]) => void;
}

export function CharacterRelationships({ 
  character, 
  allCharacters, 
  onUpdateRelationships 
}: CharacterRelationshipsProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [newRelationship, setNewRelationship] = useState<Partial<Relationship>>({
    type: 'friend',
    status: 'active',
    strength: 'moderate'
  });

  const availableCharacters = allCharacters.filter(c => c.id !== character.id);

  const handleAddRelationship = () => {
    if (newRelationship.targetCharacterId && newRelationship.type) {
      const targetCharacter = allCharacters.find(c => c.id === newRelationship.targetCharacterId);
      const relationship: Relationship = {
        id: Date.now().toString(),
        targetCharacterId: newRelationship.targetCharacterId,
        targetCharacterName: targetCharacter?.name || 'Unknown',
        type: newRelationship.type as Relationship['type'],
        status: newRelationship.status as Relationship['status'] || 'active',
        strength: newRelationship.strength as Relationship['strength'] || 'moderate',
        description: newRelationship.description || '',
        notes: newRelationship.notes || '',
        history: newRelationship.history || ''
      };

      const updatedRelationships = [...relationships, relationship];
      setRelationships(updatedRelationships);
      onUpdateRelationships(updatedRelationships);
      setNewRelationship({ type: 'friend', status: 'active', strength: 'moderate' });
      setIsAddingRelationship(false);
    }
  };

  const handleDeleteRelationship = (relationshipId: string) => {
    const updatedRelationships = relationships.filter(r => r.id !== relationshipId);
    setRelationships(updatedRelationships);
    onUpdateRelationships(updatedRelationships);
  };

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship);
  };

  const handleUpdateRelationship = (updatedRelationship: Relationship) => {
    const updatedRelationships = relationships.map(r => 
      r.id === updatedRelationship.id ? updatedRelationship : r
    );
    setRelationships(updatedRelationships);
    onUpdateRelationships(updatedRelationships);
    setEditingRelationship(null);
  };

  const getRelationshipTypeInfo = (type: string) => {
    return RELATIONSHIP_TYPES.find(t => t.value === type) || RELATIONSHIP_TYPES[0];
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-gray-200 text-gray-800';
      case 'moderate': return 'bg-blue-200 text-blue-800';
      case 'strong': return 'bg-green-200 text-green-800';
      case 'intense': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const RelationshipCard = ({ relationship }: { relationship: Relationship }) => {
    const typeInfo = getRelationshipTypeInfo(relationship.type);
    const Icon = typeInfo.icon;

    return (
      <Card className="transition-all duration-200 hover:shadow-md border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">{relationship.targetCharacterName}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {relationship.type}
                  </Badge>
                  <Badge className={`text-xs ${getStrengthColor(relationship.strength)}`}>
                    {relationship.strength}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {relationship.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditRelationship(relationship)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteRelationship(relationship.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {relationship.description && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{relationship.description}</p>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Character Relationships</h3>
          <p className="text-sm text-muted-foreground">
            Map connections between {character.name} and other characters
          </p>
        </div>
        <Button onClick={() => setIsAddingRelationship(true)} className="interactive-warm">
          <Plus className="h-4 w-4 mr-2" />
          Add Relationship
        </Button>
      </div>

      {/* Relationships Grid */}
      {relationships.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="font-semibold mb-2">No relationships yet</h4>
          <p className="text-muted-foreground mb-4">
            Start building {character.name}'s social network by adding their first relationship.
          </p>
          <Button onClick={() => setIsAddingRelationship(true)} variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Add First Relationship
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relationships.map((relationship) => (
            <RelationshipCard key={relationship.id} relationship={relationship} />
          ))}
        </div>
      )}

      {/* Add Relationship Modal */}
      <Dialog open={isAddingRelationship} onOpenChange={setIsAddingRelationship}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Relationship</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="target-character">Related Character</Label>
              <Select
                value={newRelationship.targetCharacterId || ''}
                onValueChange={(value) => setNewRelationship(prev => ({ ...prev, targetCharacterId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a character" />
                </SelectTrigger>
                <SelectContent>
                  {availableCharacters.map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="relationship-type">Relationship Type</Label>
              <Select
                value={newRelationship.type || ''}
                onValueChange={(value) => setNewRelationship(prev => ({ ...prev, type: value as Relationship['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="relationship-strength">Strength</Label>
                <Select
                  value={newRelationship.strength || ''}
                  onValueChange={(value) => setNewRelationship(prev => ({ ...prev, strength: value as Relationship['strength'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Strength" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Weak</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="intense">Intense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="relationship-status">Status</Label>
                <Select
                  value={newRelationship.status || ''}
                  onValueChange={(value) => setNewRelationship(prev => ({ ...prev, status: value as Relationship['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                    <SelectItem value="complicated">Complicated</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="relationship-description">Description</Label>
              <Textarea
                id="relationship-description"
                value={newRelationship.description || ''}
                onChange={(e) => setNewRelationship(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the nature of this relationship..."
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setIsAddingRelationship(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddRelationship}
                disabled={!newRelationship.targetCharacterId || !newRelationship.type}
                className="interactive-warm"
              >
                Add Relationship
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Relationship Modal */}
      {editingRelationship && (
        <Dialog open={!!editingRelationship} onOpenChange={() => setEditingRelationship(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Relationship</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Character</Label>
                <div className="p-2 bg-muted rounded">
                  {editingRelationship.targetCharacterName}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-relationship-type">Relationship Type</Label>
                <Select
                  value={editingRelationship.type}
                  onValueChange={(value) => setEditingRelationship(prev => 
                    prev ? { ...prev, type: value as Relationship['type'] } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-relationship-strength">Strength</Label>
                  <Select
                    value={editingRelationship.strength}
                    onValueChange={(value) => setEditingRelationship(prev => 
                      prev ? { ...prev, strength: value as Relationship['strength'] } : null
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="intense">Intense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-relationship-status">Status</Label>
                  <Select
                    value={editingRelationship.status}
                    onValueChange={(value) => setEditingRelationship(prev => 
                      prev ? { ...prev, status: value as Relationship['status'] } : null
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                      <SelectItem value="complicated">Complicated</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-relationship-description">Description</Label>
                <Textarea
                  id="edit-relationship-description"
                  value={editingRelationship.description}
                  onChange={(e) => setEditingRelationship(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  placeholder="Describe the nature of this relationship..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setEditingRelationship(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => editingRelationship && handleUpdateRelationship(editingRelationship)}
                  className="interactive-warm"
                >
                  Update Relationship
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}