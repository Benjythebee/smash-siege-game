import { LevelData } from '../../../common/types.js';

const level: LevelData = {
  name: 'Level 6',
  totalAmmo: 3,
  platforms: [
    { scale: [8, 1, 10], position: [-6, 0, -14], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' },
    { scale: [10, 1, 10], position: [3.2, 0, -27.4], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' }
  ],
  components: [
    { platformIndex: 1, scale: [1, 3, 1], position: [-1, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' },
    { platformIndex: 1, scale: [1, 3, 1], position: [-2.55, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    { platformIndex: 1, scale: [1, 3, 1], position: [1, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 1, scale: [1, 3, 1], position: [-3, 2, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 1, scale: [1, 3, 1], position: [0.47, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    {
      platformIndex: 0,
      scale: [5, 2, 5],
      position: [1, 3, 3],
      rotation: [0.75, 0, -0.6],
      width: 1,
      height: 1,
      depth: 1,
      color: '#000',
      type: 'trampoline'
    },
    {
      platformIndex: 1,
      scale: [0.5, 1, 0.5],
      position: [2, 4.17, 18.4],
      rotation: [0, 1.7, 0],
      width: 1,
      height: 1,
      depth: 1,
      color: '#000',
      type: 'wood'
    },
    {
      platformIndex: 1,
      scale: [2, 4.1, 0.5],
      position: [3.54, 4.93, 17.3],
      rotation: [1.56, 0, 1.35],
      width: 1,
      height: 1,
      depth: 1,
      color: '#000',
      type: 'wood',
      name: 'Platform'
    },
    {
      platformIndex: 1,
      scale: [2, 2, 2],
      position: [1.9, 6.17, 18.1],
      rotation: [0, 0, 0],
      width: 1,
      height: 1,
      depth: 1,
      color: '#000',
      type: 'boulder'
    },
    {
      platformIndex: 1,
      scale: [0.5, 1, 0.5],
      position: [1.8, 4.17, 17],
      rotation: [0, 1.7, 0],
      width: 1,
      height: 1,
      depth: 1,
      color: '#000',
      type: 'wood'
    }
  ],
  environment: [
    { scale: [1, 1, 1], position: [8, -1, 1], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'rock_1' },
    { scale: [1, 1, 1], position: [-5, -1, -2], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'rock_2' },
    { scale: [1, 1, 1], position: [-14, -1, -7], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'plant' },
    {
      scale: [1.5, 1.2, 1.5],
      position: [4.3, -1, -5],
      rotation: [0, -0.4, 0],
      width: 1,
      height: 1,
      depth: 1,
      type: 'large_rock'
    }
  ]
};
export default level;
