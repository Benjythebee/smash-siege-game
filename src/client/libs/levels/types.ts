import { Color } from '@react-three/fiber';
import { v4 as uuidv4 } from 'uuid';
import { featureHealth } from '../../components/3d/levelFeatures/constants.js';
import { EnvironmentFeatureProp, LevelFeatureProp, LevelPlatformProp } from '../../../common/types.js';

export type Breakable<T extends LevelFeatureProp> = T & {
  health: number;
  uuid: string;
};

export const defaultPlatformProps = (props: Partial<LevelPlatformProp>): LevelPlatformProp => {
  return {
    scale: [1, 1, 1] as [x: number, y: number, z: number],
    position: [0, 0, 0] as [x: number, y: number, z: number],
    rotation: [0, 0, 0] as [x: number, y: number, z: number],
    width: 1,
    height: 1,
    depth: 1,
    color: '#fff',
    uuid: props.uuid || uuidv4(),
    ...props
  };
};
export const defaultFeatureProps = (props: Partial<Breakable<LevelFeatureProp>>): Breakable<LevelFeatureProp> => {
  return {
    platformIndex: 0,
    scale: [1, 1, 1] as [x: number, y: number, z: number],
    position: [0, 0, 0] as [x: number, y: number, z: number],
    rotation: [0, 0, 0] as [x: number, y: number, z: number],
    width: 1,
    height: 1,
    depth: 1,
    color: '#fff',
    type: 'wood',
    health: featureHealth['wood'],
    uuid: props.uuid || uuidv4(),
    ...props
  };
};

export const defaultEnvironmentProps = (props: Partial<EnvironmentFeatureProp>): EnvironmentFeatureProp => {
  return {
    scale: [1, 1, 1] as [x: number, y: number, z: number],
    position: [0, 0, 0] as [x: number, y: number, z: number],
    rotation: [0, 0, 0] as [x: number, y: number, z: number],
    width: 1,
    height: 1,
    depth: 1,
    type: 'plant',
    ...props,
    uuid: props.uuid || uuidv4()
  };
};
