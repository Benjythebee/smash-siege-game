import { LevelData, LevelType } from './types';

/**
 * Convert LevelType to LevelData
 */
export const convertLevelTypeToLevelData = (level: LevelType): LevelData => {
  const { id, content, ...rest } = level;
  return {
    ...rest,
    totalAmmo: level.total_ammo,
    name: level.name,
    environment: content.environment,
    platforms: content.platforms,
    components: content.components
  };
};
