import { UniversalEntityManager } from './UniversalEntityManager';
import { CHARACTER_CONFIG } from '../config/CharacterConfig';

interface UniversalCharacterManagerProps {
  projectId: string;
  selectedCharacterId?: string | null;
  onClearSelection?: () => void;
}

export function UniversalCharacterManager({ 
  projectId, 
  selectedCharacterId, 
  onClearSelection 
}: UniversalCharacterManagerProps) {
  return (
    <UniversalEntityManager
      config={CHARACTER_CONFIG}
      projectId={projectId}
      selectedEntityId={selectedCharacterId}
      onClearSelection={onClearSelection}
    />
  );
}