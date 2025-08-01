/**
 * Custom Hook for Character Form Logic
 * Consolidates form state management and validation
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { FIELD_DEFINITIONS, getFieldDefinition } from '@/lib/config/fieldConfig';
import { calculateEntityCompleteness } from '@/lib/utils/entityUtils';
import { 
  hasCharacterChanges, 
  prepareCharacterForSave, 
  cleanCorruptedCharacterData,
  logCharacterDataIntegrity 
} from '@/lib/utils/characterDataUtils';

interface UseCharacterFormProps {
  projectId: string;
  character?: Character | null;
  onSave?: (character: Character) => void;
  onCancel?: () => void;
}

export function useCharacterForm({ projectId, character, onSave, onCancel }: UseCharacterFormProps) {
  const queryClient = useQueryClient();
  
  // Form state with data corruption prevention
  const [formData, setFormData] = useState<Partial<Character>>(() => {
    if (character) {
      // Clean any existing corruption when initializing
      const cleaned = cleanCorruptedCharacterData(character);
      logCharacterDataIntegrity(cleaned, 'Form Initialization');
      return cleaned;
    }
    
    // Initialize with default values
    const defaultValues: Partial<Character> = {
      projectId,
      personalityTraits: [],
      abilities: [],
      skills: [],
      talents: [],
      expertise: [],
      // languages: [], // Removed as not in Character schema
      archetypes: [],
      tropes: [],
      tags: []
    };
    
    return defaultValues;
  });

  const [fieldEnhancements, setFieldEnhancements] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Mutations with data integrity protection
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Character>): Promise<Character> => {
      const cleanData = prepareCharacterForSave(data);
      logCharacterDataIntegrity(cleanData, 'Character Creation');
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, cleanData);
      return response as unknown as Character;
    },
    onSuccess: (newCharacter: Character) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onSave?.(newCharacter);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Character): Promise<Character> => {
      const cleanData = prepareCharacterForSave(data) as Character;
      logCharacterDataIntegrity(cleanData, 'Character Update');
      const response = await apiRequest('PUT', `/api/characters/${data.id}`, cleanData);
      return response as unknown as Character;
    },
    onSuccess: (updatedCharacter: Character) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onSave?.(updatedCharacter);
    },
  });

  // Field enhancement
  const enhanceFieldMutation = useMutation({
    mutationFn: async ({ fieldKey, fieldLabel }: { fieldKey: string; fieldLabel: string }) => {
      if (!formData.id) throw new Error('Character must be saved before field enhancement');
      
      const response = await apiRequest('POST', `/api/characters/${formData.id}/enhance-field`, {
        fieldKey,
        fieldLabel,
        currentValue: formData[fieldKey as keyof Character] || ''
      });
      
      return response.json();
    },
    onSuccess: (enhancedData, { fieldKey }) => {
      setFormData(prev => ({ ...prev, ...enhancedData }));
      setFieldEnhancements(prev => ({ ...prev, [fieldKey]: false }));
    },
  });

  // Form handlers
  const updateField = useCallback((fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
    
    // Clear validation error for this field
    if (validationErrors[fieldKey]) {
      setValidationErrors(prev => {
        const { [fieldKey]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [validationErrors]);

  const enhanceField = useCallback((fieldKey: string, fieldLabel: string) => {
    setFieldEnhancements(prev => ({ ...prev, [fieldKey]: true }));
    enhanceFieldMutation.mutate({ fieldKey, fieldLabel });
  }, [enhanceFieldMutation]);

  // Validation
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    // Check required fields
    FIELD_DEFINITIONS
      .filter(field => field.required)
      .forEach(field => {
        const value = formData[field.key as keyof Character];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.key] = `${field.label} is required`;
        }
      });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      if (character?.id) {
        await updateMutation.mutateAsync(formData as Character);
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Failed to save character:', error);
    }
  }, [character, formData, validateForm, createMutation, updateMutation]);

  // Computed values with safe comparison
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const hasChanges = useMemo(() => {
    if (!character) return Object.keys(formData).length > 1; // More than just projectId
    
    // CRITICAL FIX: Use safe comparison instead of JSON.stringify
    return hasCharacterChanges(formData, character);
  }, [character, formData]);

  const completionStats = useMemo(() => {
    return calculateEntityCompleteness(formData as any, FIELD_DEFINITIONS);
  }, [formData]);

  return {
    // State
    formData,
    fieldEnhancements,
    validationErrors,
    isLoading,
    hasChanges,
    completionStats,
    
    // Actions
    updateField,
    enhanceField,
    handleSave,
    handleCancel: onCancel,
    validateForm,
    
    // Utilities
    getFieldDefinition,
    isFieldEnhancing: (fieldKey: string) => fieldEnhancements[fieldKey] || false,
    hasValidationError: (fieldKey: string) => !!validationErrors[fieldKey],
    getValidationError: (fieldKey: string) => validationErrors[fieldKey]
  };
}