import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Character } from '@/types/character';

interface CharacterContextType {
  // Current character being edited/created
  character: Partial<Character>;
  
  // Update a single field
  updateField: (key: keyof Character, value: any) => void;
  
  // Update multiple fields at once
  updateFields: (updates: Partial<Character>) => void;
  
  // Reset to empty character
  resetCharacter: () => void;
  
  // Load existing character data
  loadCharacter: (characterData: Character) => void;
  
  // Get field value with fallback
  getFieldValue: (key: keyof Character) => any;
  
  // Check if field has value
  hasFieldValue: (key: keyof Character) => boolean;
  
  // Get character completeness percentage
  getCompleteness: () => number;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

interface CharacterProviderProps {
  children: ReactNode;
  initialCharacter?: Partial<Character>;
}

export function CharacterProvider({ children, initialCharacter = {} }: CharacterProviderProps) {
  const [character, setCharacter] = useState<Partial<Character>>(initialCharacter);

  const updateField = useCallback((key: keyof Character, value: any) => {
    setCharacter(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateFields = useCallback((updates: Partial<Character>) => {
    setCharacter(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetCharacter = useCallback(() => {
    setCharacter({});
  }, []);

  const loadCharacter = useCallback((characterData: Character) => {
    setCharacter(characterData);
  }, []);

  const getFieldValue = useCallback((key: keyof Character) => {
    return character[key];
  }, [character]);

  const hasFieldValue = useCallback((key: keyof Character) => {
    const value = character[key];
    if (value === undefined || value === null || value === '') {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return true;
  }, [character]);

  const getCompleteness = useCallback(() => {
    // Define important fields for completeness calculation
    const importantFields: (keyof Character)[] = [
      // Identity (weight: 20%)
      'name', 'age', 'occupation', 'species',
      
      // Appearance (weight: 15%)
      'height', 'hairColor', 'eyeColor', 'generalAppearance',
      
      // Personality (weight: 25%)
      'personalityTraits', 'temperament', 'positiveTraits', 'negativeTraits',
      
      // Psychology (weight: 15%)
      'motivations', 'goals', 'fears',
      
      // Background (weight: 15%)
      'backstory', 'childhood',
      
      // Story Role (weight: 10%)
      'role', 'character_arc'
    ];

    const filledFields = importantFields.filter(field => hasFieldValue(field));
    return Math.round((filledFields.length / importantFields.length) * 100);
  }, [character, hasFieldValue]);

  const value: CharacterContextType = {
    character,
    updateField,
    updateFields,
    resetCharacter,
    loadCharacter,
    getFieldValue,
    hasFieldValue,
    getCompleteness
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}

// Helper hook to get a specific field value with type safety
export function useCharacterField<K extends keyof Character>(key: K): [Character[K], (value: Character[K]) => void] {
  const { getFieldValue, updateField } = useCharacter();
  
  const value = getFieldValue(key);
  const setValue = useCallback((newValue: Character[K]) => {
    updateField(key, newValue);
  }, [key, updateField]);

  return [value, setValue];
}