import levelZero from './levels/level.0.js';
import levelOne from './levels/level.1.js';
import levelTwo from './levels/level.2.js';
import levelThree from './levels/level.3.js';
import levelFour from './levels/level.4.js';
import levelFive from './levels/level.5.js';
import levelSix from './levels/level.6.js';
import { LevelData } from '../../common/types.js';

const levelsData_: LevelData[] = [levelZero, levelOne, levelTwo, levelThree, levelFour, levelFive, levelSix];

export const levelsData = levelsData_.reduce(
  (acc, level, index) => {
    acc[index] = level;
    return acc;
  },
  {} as {
    length: number;
    custom: LevelData | null;
  } & Record<string, LevelData>
);

(levelsData.length as number) = levelsData_.length;
export type LevelDataDictionary = typeof levelsData;
