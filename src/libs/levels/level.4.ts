import { LevelData } from '../levels';

const level: LevelData = {
  name: 'Level 4',
  totalAmmo: 3,
  platforms: [
    { scale: [10, 1, 10], position: [-10, 0, -15], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' },
    { scale: [10, 1, 10], position: [10, 0, -28], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' }
  ],
  components: [
    { platformIndex: 1, scale: [1, 3, 1], position: [-1, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' },
    { platformIndex: 1, scale: [1, 3, 1], position: [-2.55, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    { platformIndex: 1, scale: [1, 3, 1], position: [1, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 1, scale: [1, 3, 1], position: [-3, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 1, scale: [1, 3, 1], position: [0.47, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    { platformIndex: 0, scale: [5, 2, 5], position: [1, 3, 0], rotation: [1.5, 0, -1.25], width: 1, height: 1, depth: 1, color: '#000', type: 'trampoline' }
  ],
  environment: [
    { scale: [1, 1, 1], position: [6, -1, -8], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'rock_1' },
    { scale: [1, 1, 1], position: [-3, -1, -17], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'rock_2' },
    { scale: [1, 1, 1], position: [8, -1, -7], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'plant' },
    { scale: [1, 1, 1], position: [3, -1, -7], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'large_rock' }
  ]
};

export default level;
