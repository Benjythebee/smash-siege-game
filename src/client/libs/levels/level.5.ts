import { LevelData } from '../../../common/types.js';

const level: LevelData = {
  name: 'Level 5',
  totalAmmo: 3,
  platforms: [{ scale: [10, 1, 10], position: [0, 0, -15], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000' }],
  components: [
    { platformIndex: 0, scale: [1, 3, 1], position: [-3, 2, -3], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 0, scale: [1, 8, 8], position: [0, 4, 0], rotation: [0, 0, 1.5707963267948966], width: 1, height: 1, depth: 1, color: '#000', type: 'wood' },
    { platformIndex: 0, scale: [1, 3, 1], position: [3, 2, -3], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 0, scale: [1, 3, 1], position: [3, 2, 4], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 0, scale: [1, 3, 1], position: [-3, 2, 4], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'stone' },
    { platformIndex: 0, scale: [1, 3, 1], position: [0, 6.01, 0], rotation: [0, 1, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'cement' },
    { platformIndex: 0, scale: [3, 3, 3], position: [0, 9, 0], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, color: '#000', type: 'boulder' }
  ],
  environment: [
    { scale: [1, 1, 1], position: [7, -2, 0], rotation: [0, -1, 0], width: 1, height: 1, depth: 1, type: 'kelp' },
    { scale: [1, 1, 1], position: [-10, -1, -10], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'rock_2' },
    { scale: [1, 1, 1], position: [8, -1, -13], rotation: [0, 0, 0], width: 1, height: 1, depth: 1, type: 'plant' }
  ],
  image_url: '/images/thumbnails/level-5.png'
};
export default level;
