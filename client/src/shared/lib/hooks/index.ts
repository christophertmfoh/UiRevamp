/**
 * Universal Hooks Index
 * Exports all shared utility hooks for entity management
 */

// Entity utilities
export {
  calculateEntityCompleteness,
  createEntitySummary,
  processEntityDataForSave,
  processEntityDataForForm,
  filterEntitiesBySearch,
  sortEntities,
  validateEntityData,
  calculateEntityStatistics,
  findDuplicateEntities,
  bulkUpdateEntities,
  prepareEntityForExport,
  type BaseEntity,
} from '../utils/entityUtils';

// Form utilities
export {
  useEntityForm,
  useFieldEnhancement,
  useFormSections,
  useAutoSave,
  useFieldFocus,
  validationPatterns,
  fieldTransformers,
} from '../utils/formUtils';

// API utilities
export {
  useEntityList,
  useEntity,
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
  useBulkDeleteEntities,
  useBulkUpdateEntities,
  useEntityAIEnhancement,
  useEntityImageUpload,
  useEntityImageGeneration,
  useEntitySearch,
  useEntityExport,
  invalidateEntityQueries,
  prefetchEntity,
} from '../utils/apiUtils';

// UI utilities
export {
  useViewMode,
  useSortState,
  useModalState,
  useSelectionState,
  usePagination,
  useSearchState,
  useFilterState,
  useLoadingStates,
  useErrorState,
  useToastState,
  useKeyboardShortcuts,
  localStorageUtils,
} from '../utils/uiUtils';