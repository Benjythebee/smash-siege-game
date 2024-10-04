import { RigidBody } from '@react-three/rapier';
import { defaultEnvironmentProps } from '../../../../libs/levels/types.js';
import React from 'react';
import { EnvironmentRock } from './Rock.js';
import { EnvironmentRock2 } from './Rock_2.js';
import { EnvironmentLargeRock } from './RockLarge.js';
import { EnvironmentPlant } from './Plant.js';
import { EnvironmentKelp } from './Kelp.js';
import { EnvironmentFeatureProp } from '../../../../../common/types.js';
import { EnvironmentGizmos } from '../gizmos/environment.gizmos.js';

export const EnvironmentFeature = React.forwardRef((props: Partial<EnvironmentFeatureProp>, ref: any) => {
  const { width, depth, height, type, uuid, ...rest } = defaultEnvironmentProps(props);

  const Feature = () => {
    switch (type) {
      case 'rock_1':
        return <EnvironmentRock {...rest} />;
      case 'rock_2':
        return <EnvironmentRock2 {...rest} />;
      case 'large_rock':
        return <EnvironmentLargeRock {...rest} />;
      case 'kelp':
        return <EnvironmentKelp {...rest} />;
      case 'plant':
        return <EnvironmentPlant {...rest} />;
      default:
        return <EnvironmentPlant {...rest} />;
    }
  };

  switch (type) {
    case 'rock_1':
    case 'rock_2':
    case 'large_rock':
      return (
        <EnvironmentGizmos key={uuid + 'gizmo'} id={uuid}>
          <RigidBody ref={ref} colliders={'trimesh'} type="fixed" {...rest}>
            <Feature />
          </RigidBody>
        </EnvironmentGizmos>
      );

    default:
      return (
        <EnvironmentGizmos key={uuid + 'gizmo'} id={uuid}>
          <Feature />
        </EnvironmentGizmos>
      );
  }
});
