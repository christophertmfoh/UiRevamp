import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Edit, Save, X } from 'lucide-react';
import { useCharacter } from '@/context/CharacterProvider';
import { DisplayFieldGroup } from './DisplayField';
import { CHARACTER_FIELD_CATEGORIES } from '@/types/character';

interface IdentityExampleProps {
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export function IdentityExample({ isEditing = false, onToggleEdit }: IdentityExampleProps) {
  const { character, updateField, getFieldValue } = useCharacter();

  // If editing, show the wizard-style input form
  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Identity - Edit Mode</CardTitle>
              <p className="text-sm text-muted-foreground">
                Basic information and core identity
              </p>
            </div>
          </div>
          {onToggleEdit && (
            <Button variant="outline" size="sm" onClick={onToggleEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={getFieldValue('name') || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter character name"
                className="w-full"
              />
            </div>

            {/* Nicknames */}
            <div className="space-y-2">
              <Label htmlFor="nicknames" className="text-sm font-medium">
                Nicknames
              </Label>
              <Input
                id="nicknames"
                value={getFieldValue('nicknames') || ''}
                onChange={(e) => updateField('nicknames', e.target.value)}
                placeholder="Common nicknames or pet names"
                className="w-full"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Age
              </Label>
              <Input
                id="age"
                value={getFieldValue('age') || ''}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder="Character age or age range"
                className="w-full"
              />
            </div>

            {/* Species/Race */}
            <div className="space-y-2">
              <Label htmlFor="species" className="text-sm font-medium">
                Species/Race
              </Label>
              <Input
                id="species"
                value={getFieldValue('species') || ''}
                onChange={(e) => updateField('species', e.target.value)}
                placeholder="Human, Elf, Alien, etc."
                className="w-full"
              />
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-sm font-medium">
                Occupation
              </Label>
              <Input
                id="occupation"
                value={getFieldValue('occupation') || ''}
                onChange={(e) => updateField('occupation', e.target.value)}
                placeholder="Job, role, or profession"
                className="w-full"
              />
            </div>

            {/* Pronouns */}
            <div className="space-y-2">
              <Label htmlFor="pronouns" className="text-sm font-medium">
                Pronouns
              </Label>
              <Select
                value={getFieldValue('pronouns') || ''}
                onValueChange={(value) => updateField('pronouns', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he/him">he/him</SelectItem>
                  <SelectItem value="she/her">she/her</SelectItem>
                  <SelectItem value="they/them">they/them</SelectItem>
                  <SelectItem value="it/its">it/its</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {onToggleEdit && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onToggleEdit}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Display mode - show the character data using DisplayFieldGroup
  const identityFields = CHARACTER_FIELD_CATEGORIES.identity.map(fieldKey => ({
    key: fieldKey as keyof typeof character,
    value: getFieldValue(fieldKey as keyof typeof character),
  }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Identity - Display Mode</CardTitle>
            <p className="text-sm text-muted-foreground">
              Character's basic information and core identity
            </p>
          </div>
        </div>
        {onToggleEdit && (
          <Button variant="outline" size="sm" onClick={onToggleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <DisplayFieldGroup
          title="Identity Information"
          fields={identityFields}
          variant="grid"
        />
      </CardContent>
    </Card>
  );
}

// Demo component to show the pattern in action
export function IdentityExampleDemo() {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Character Creation Pattern Demo</h2>
        <p className="text-muted-foreground">
          This shows how wizard input connects to display view in real-time
        </p>
      </div>
      
      <IdentityExample 
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
      />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          {isEditing ? 
            'Edit mode: Changes update the character state immediately' : 
            'Display mode: Shows character data with proper empty states'
          }
        </p>
      </div>
    </div>
  );
}