import { Box } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { defaultPlatformProps, LevelPlatformProp } from '../../../libs/levels/types';

export const Platform = (props: Partial<LevelPlatformProp>) => {
  const { width, depth, height, ...rest } = defaultPlatformProps(props);
  const collider = useRef(null);

  return (
    <RigidBody mass={50} restitution={0.01} colliders={false} type="fixed" {...rest}>
      <CuboidCollider restitution={0.01} name="platform" ref={collider} args={[width / 2, height / 2, depth / 2]} />
      <Box args={[width, height, depth]} receiveShadow castShadow>
        <meshLambertMaterial color={props.color} />
      </Box>
    </RigidBody>
  );
};
