import { Box } from '@react-three/drei';
import { CuboidCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { defaultPlatformProps } from '../../../libs/levels/types.js';
import { Group } from 'three';
import React from 'react';
import { LevelPlatformProp } from '../../../../common/types.js';

export const Platform = (props: React.PropsWithChildren<Partial<LevelPlatformProp>>) => {
  const { children, ...otherProps } = props;
  const { width, depth, height, position, ...rest } = defaultPlatformProps(otherProps);
  const body = useRef<RapierRigidBody>(null);
  const platform = useRef<Group>(null);

  return (
    <group ref={platform} position={position}>
      <RigidBody ref={body} mass={50} friction={1} restitution={0.001} colliders={false} type="fixed" {...rest}>
        <CuboidCollider name="platform" args={[width / 2, height / 2, depth / 2]} />
        <Box args={[width, height, depth]} receiveShadow castShadow>
          <meshLambertMaterial color={props.color} />
        </Box>
      </RigidBody>
      {children}
    </group>
  );
};
