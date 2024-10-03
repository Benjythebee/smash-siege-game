import { Box } from '@react-three/drei';
import { CuboidCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import { defaultPlatformProps } from '../../../libs/levels/types.js';
import { Group } from 'three';
import React from 'react';
import { LevelPlatformProp } from '../../../../common/types.js';
import { EnvironmentGizmos } from './gizmos/environment.gizmos.js';
import { ThreeEvent } from '@react-three/fiber';
import { MenuStatus, useGameStore } from '../../../store.js';
import { useEditorStore } from '../../ui/levelBuilder/editor/Editor.store.js';

export const Platform = (props: React.PropsWithChildren<Partial<LevelPlatformProp>>) => {
  const { children, ...otherProps } = props;
  const { width, depth, height, position, uuid, ...rest } = defaultPlatformProps(otherProps);
  const menuState = useGameStore((state) => state.menuState);
  const body = useRef<RapierRigidBody>(null);
  const platform = useRef<Group>(null);

  const onPointerClick = (e: ThreeEvent<MouseEvent>) => {
    if (menuState !== MenuStatus.LEVEL_BUILDER) return;
    if (useEditorStore.getState().isDraggingGizmo) return;
    useEditorStore.getState().setSelectedItemByUuid(uuid);
  };

  return (
    <EnvironmentGizmos key={uuid + 'gizmo'} id={uuid}>
      <group ref={platform} position={position}>
        <RigidBody ref={body} mass={50} friction={1} restitution={0.001} colliders={false} type="fixed" {...rest}>
          <CuboidCollider name="platform" args={[width / 2, height / 2, depth / 2]} />
          <Box onClick={onPointerClick} args={[width, height, depth]} receiveShadow castShadow>
            <meshLambertMaterial color={props.color} />
          </Box>
        </RigidBody>
        {children}
      </group>
    </EnvironmentGizmos>
  );
};
