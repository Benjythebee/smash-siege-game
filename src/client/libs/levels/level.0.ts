import { LevelData } from '../../../common/types.js';

const level: LevelData = {
  name: 'Level 0',
  totalAmmo: 3,
  environment: [
    {
      type: 'rock_1',
      position: [10, -1, 0]
    },
    {
      type: 'rock_2',
      position: [-20, -1, -10]
    },
    {
      type: 'plant',
      position: [8, -1, -13]
    }
  ],
  platforms: [
    {
      color: '#fff',
      position: [0, 0, -15] as [x: number, y: number, z: number],
      scale: [10, 1, 10]
    }
  ],
  components: [
    // Position is relative to the platform
    {
      platformIndex: 0,
      type: 'stone',
      position: [-1, 2, 0],
      scale: [1, 3, 1]
    },
    {
      platformIndex: 0,
      type: 'wood',
      position: [0, 4, 0],
      scale: [1, 3, 1],
      rotation: [0, 0, Math.PI / 2]
    },
    {
      platformIndex: 0,
      type: 'stone',
      position: [1, 2, 0],
      scale: [1, 3, 1]
    }
  ],
  image_url: '/images/thumbnails/level-0.png'
};

export default level;
