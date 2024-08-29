import { LevelData } from '../levels';
import { EnvironmentFeatureProp, LevelFeatureProp, LevelPlatformProp } from './types';

const level: LevelData = {
  name: 'Level 2',
  totalAmmo: 5,
  platforms: [
    { scale: [6, 1, 2], position: [-9, 0, -15], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' },
    { scale: [10, 1, 10], position: [10, 0, -45], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' }
  ],
  components: [
    { platformIndex: 0, scale: [1, 3, 1], position: [0, 6.01, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' },
    { platformIndex: 0, scale: [1, 3, 1], position: [0, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    { platformIndex: 0, scale: [1, 3, 1], position: [0, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' },
    { platformIndex: 1, scale: [1, 3, 1], position: [-3, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' },
    { platformIndex: 1, scale: [1, 5, 1], position: [-1, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    { platformIndex: 1, scale: [1, 3, 1], position: [1, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' }
  ],
  environment: [
    { scale: [1, 1, 1], position: [8, -1, -18], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'plant' },
    { scale: [1, 1, 1], position: [4, -1, -13], rotation: [0, 1.2, 0], width: 1, height: 1, depth: 1, type: 'plant' },
    { scale: [1, 1, 1], position: [8, -3, -15], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'kelp' },
    { scale: [1, 1, 1], position: [-7, -2.5, -17], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'kelp' }
  ]
};

export default level;
