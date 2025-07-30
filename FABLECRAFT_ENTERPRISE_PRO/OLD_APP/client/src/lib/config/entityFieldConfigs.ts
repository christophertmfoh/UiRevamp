import { EntityFieldConfig } from '@shared/schema';
import { characterFieldConfig } from './characterFieldConfig';
import { baseFieldConfig } from './baseFieldConfig';

export const entityFieldConfigs: Record<string, EntityFieldConfig[]> = {
  character: characterFieldConfig,
  base: baseFieldConfig
};

export default entityFieldConfigs;