/**
 * Universal Form Utilities
 * Generic form handling utilities for all entity types
 */

import { useState, useCallback } from 'react';
import type { FieldDefinition } from '@/lib/config/fieldConfig';
import { validateEntityData, processEntityDataForSave, processEntityDataForForm } from './entityUtils';

// Generic form state hook
export function useEntityForm<T extends Record<string, any>>(
  initialEntity: Partial<T> | undefined,
  fieldDefinitions: FieldDefinition[]
) {
  const [formData, setFormData] = useState(() => 
    processEntityDataForForm(initialEntity, fieldDefinitions)
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback((fieldKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [errors]);

  const updateMultipleFields = useCallback((updates: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    setIsDirty(true);
  }, []);

  const validateForm = useCallback(() => {
    const validationErrors = validateEntityData(formData, fieldDefinitions);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, fieldDefinitions]);

  const getProcessedData = useCallback(() => {
    return processEntityDataForSave(formData, fieldDefinitions);
  }, [formData, fieldDefinitions]);

  const resetForm = useCallback(() => {
    setFormData(processEntityDataForForm(initialEntity, fieldDefinitions));
    setErrors({});
    setIsDirty(false);
  }, [initialEntity, fieldDefinitions]);

  const clearForm = useCallback(() => {
    setFormData(processEntityDataForForm(undefined, fieldDefinitions));
    setErrors({});
    setIsDirty(false);
  }, [fieldDefinitions]);

  return {
    formData,
    errors,
    isDirty,
    updateField,
    updateMultipleFields,
    validateForm,
    getProcessedData,
    resetForm,
    clearForm,
    setFormData,
    setErrors
  };
}

// Generic field enhancement state
export function useFieldEnhancement() {
  const [enhancingFields, setEnhancingFields] = useState<Record<string, boolean>>({});
  
  const setFieldEnhancing = useCallback((fieldKey: string, isEnhancing: boolean) => {
    setEnhancingFields(prev => ({
      ...prev,
      [fieldKey]: isEnhancing
    }));
  }, []);

  const isFieldEnhancing = useCallback((fieldKey: string) => {
    return enhancingFields[fieldKey] || false;
  }, [enhancingFields]);

  const resetEnhancements = useCallback(() => {
    setEnhancingFields({});
  }, []);

  return {
    enhancingFields,
    setFieldEnhancing,
    isFieldEnhancing,
    resetEnhancements
  };
}

// Generic form section state management
export function useFormSections(sections: string[]) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section]: true }), {})
  );
  
  const [activeSection, setActiveSection] = useState<string>(sections[0] || '');

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const expandAllSections = useCallback(() => {
    setExpandedSections(
      sections.reduce((acc, section) => ({ ...acc, [section]: true }), {})
    );
  }, [sections]);

  const collapseAllSections = useCallback(() => {
    setExpandedSections(
      sections.reduce((acc, section) => ({ ...acc, [section]: false }), {})
    );
  }, [sections]);

  return {
    expandedSections,
    activeSection,
    setActiveSection,
    toggleSection,
    expandAllSections,
    collapseAllSections
  };
}

// Generic form validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  number: /^\d+$/,
  positiveNumber: /^[1-9]\d*$/,
  decimal: /^\d+\.?\d*$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/
};

// Generic field value transformers
export const fieldTransformers = {
  trim: (value: string) => value.trim(),
  lowercase: (value: string) => value.toLowerCase(),
  uppercase: (value: string) => value.toUpperCase(),
  capitalize: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  removeSpaces: (value: string) => value.replace(/\s+/g, ''),
  slugify: (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  arrayFromCommaString: (value: string) => value.split(',').map(s => s.trim()).filter(Boolean),
  commaStringFromArray: (value: string[]) => value.join(', ')
};

// Generic form auto-save functionality
export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 2000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debouncedSave = useCallback(
    debounce(async (dataToSave: T) => {
      setIsSaving(true);
      try {
        await saveFunction(dataToSave);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay),
    [saveFunction, delay]
  );

  // Trigger auto-save when data changes
  useState(() => {
    if (data) {
      debouncedSave(data);
    }
  });

  return {
    isSaving,
    lastSaved
  };
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generic form field focus management
export function useFieldFocus() {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const focusField = useCallback((fieldKey: string) => {
    setFocusedField(fieldKey);
    
    // Auto-focus the actual input element
    setTimeout(() => {
      const element = document.getElementById(fieldKey);
      if (element) {
        element.focus();
      }
    }, 100);
  }, []);

  const blurField = useCallback(() => {
    setFocusedField(null);
  }, []);

  const isFocused = useCallback((fieldKey: string) => {
    return focusedField === fieldKey;
  }, [focusedField]);

  return {
    focusedField,
    focusField,
    blurField,
    isFocused
  };
}