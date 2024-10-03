import { Box, useTexture } from '@react-three/drei';
import { BallCollider, ContactForcePayload, CuboidCollider, IntersectionEnterPayload, RapierCollider, RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import { Breakable, defaultFeatureProps } from '../../../libs/levels/types.js';
import React from 'react';
import { Mesh, Vector3 } from 'three';
import { addExplosion, getComponentHealth, MenuStatus, updateComponentInLevel, useGameStore } from '../../../store.js';
import { featureHealth, featurePhysics } from './constants.js';
import { Trampoline } from './glbComponents/Trampoline.js';
import { GroupProps, ThreeEvent } from '@react-three/fiber';
import { useSoundContext } from '../../../libs/sounds/soundContext.js';
import { Boulder } from './glbComponents/Boulder.js';
import { Gizmos } from './gizmos/component.gizmos.js';
import { useEditorStore } from '../../ui/levelBuilder/editor/Editor.store.js';
import { FeatureType, IndestructibleType, LevelFeatureProp } from '../../../../common/types.js';

const healthToBrokenStatus = (type: FeatureType, value: number): 'healthy' | 'good' | 'meh' | 'broken' | 'destroyed' => {
  if (featureHealth[type] == -1) return 'healthy';
  const brackets = featureHealth[type] / 3;
  if (value == featureHealth[type]) {
    return 'healthy';
  }
  if (value >= brackets * 2 && value < featureHealth[type]) {
    return 'good';
  }
  if (value >= brackets && value < brackets * 2) {
    return 'meh';
  }
  if (value > 0 && value < brackets) {
    return 'broken';
  }
  return 'destroyed';
};

type customComponentTextures = {
  type: 'custom';
  map: string;
  normal: string;
};

const textures: {
  [key in FeatureType]:
    | customComponentTextures
    | {
        type: 'imported';
        component: React.ForwardRefExoticComponent<Omit<GroupProps, 'ref'> & React.RefAttributes<unknown>>;
      };
} = {
  wood: {
    type: 'custom',
    map: '/textures/maple.jpg',
    normal: '/textures/maple-normal.jpg'
  },
  stone: {
    type: 'custom',
    map: '/textures/stone.jpg',
    normal: '/textures/stone-normal.jpg'
  },
  cement: {
    type: 'custom',
    map: '/textures/cement.jpg',
    normal: '/textures/cement-normal.jpg'
  },
  trampoline: {
    type: 'imported',
    component: Trampoline
  },
  boulder: {
    type: 'imported',
    component: Boulder
  }
};

export const CustomComponent = React.forwardRef((props: Partial<Breakable<LevelFeatureProp>> & { onClick: (e: ThreeEvent<MouseEvent>) => void; visible?: boolean }, ref: any) => {
  const { onClick, ...rest } = props;
  const { width, depth, height, type, uuid, health, ...otherProps } = defaultFeatureProps(rest);
  const { visible = true } = props;
  const texture = textures[type] as customComponentTextures;

  const colorTexture = useTexture(texture.map, (texture) => {
    texture.repeat.set(1, 2);
    texture.wrapS = 1000;
    texture.wrapT = 1002;
  });
  const normalTexture = useTexture(texture.normal, (texture) => {
    texture.repeat.set(1, 2);
    texture.wrapS = 1000;
    texture.wrapT = 1002;
  });

  const brokenStatus = healthToBrokenStatus(type, health);

  const color = brokenStatus == 'healthy' ? undefined : brokenStatus == 'good' ? '#cf9fa2' : brokenStatus == 'meh' ? '#cc686e' : brokenStatus == 'broken' ? '#f00' : undefined;

  return (
    <Box visible={visible} onClick={onClick} name={type + uuid} ref={ref} args={[width, height, depth]} receiveShadow castShadow>
      {normalTexture && <meshPhysicalMaterial map={colorTexture} normalMap={normalTexture} color={color}></meshPhysicalMaterial>}
      {!normalTexture && <meshBasicMaterial map={colorTexture} color={color}></meshBasicMaterial>}
    </Box>
  );
});

export const LevelComponent = React.forwardRef((props: Partial<Breakable<LevelFeatureProp>>, ref: any) => {
  const { width, depth, height, type, uuid, health, scale, ...rest } = defaultFeatureProps(props);
  const menuState = useGameStore((state) => state.menuState);
  const isPaused = useGameStore((state) => state.isPaused);
  const incrementScore = useGameStore((state) => state.incrementScore);
  const { playSound } = useSoundContext();
  const boxRef = useRef<Mesh>(null);
  const boxColliderRef = useRef<RapierCollider>(null);
  const [brokenStatus, setBrokenStatus] = React.useState<'healthy' | 'good' | 'meh' | 'broken' | 'destroyed'>(healthToBrokenStatus(type, health));
  const physicsDisabled = menuState == MenuStatus.LEVEL_BUILDER || isPaused || type == 'trampoline';

  const destroy = () => {
    if (boxRef.current) {
      boxColliderRef.current?.setEnabled(false);
      boxRef.current.visible = false;
    }
  };

  const onContactForce = (payload: ContactForcePayload) => {
    if (useGameStore.getState().menuState == MenuStatus.LEVEL_BUILDER) return;
    if (isPaused) return;
    if (payload.maxForceMagnitude < 50) return; // ignore small forces

    const isPlatformCollision = payload.other.colliderObject?.name == 'platform';
    const isAmmoCollision = payload.other.colliderObject?.name == 'ammo';
    const isBoulderCollision = payload.other.colliderObject?.name == 'boulder';
    if (isPlatformCollision || isAmmoCollision || isBoulderCollision) {
      const isGroundDirection = payload.maxForceDirection == new Vector3(0, 1, 0);

      if (type == 'trampoline') {
        playSound('bounce', { position: boxRef.current!.getWorldPosition(new Vector3()).toArray() });
      }

      if ((isPlatformCollision || isBoulderCollision) && isGroundDirection && payload.maxForceMagnitude < 100) {
        // If the force is coming from the ground and is less than 100, ignore it
        return;
      }

      const health = getComponentHealth(uuid);

      const damage = payload.maxForceMagnitude;

      const newHealth = health - damage;

      setBrokenStatus(healthToBrokenStatus(type, newHealth));
      updateComponentInLevel(uuid, { health: newHealth });
    }
  };

  const onOceanIntersection = (payload: IntersectionEnterPayload) => {
    if (IndestructibleType.includes(type as any)) return;
    if (payload.other.colliderObject?.name == 'water') {
      if (brokenStatus == 'destroyed') return;
      setBrokenStatus(healthToBrokenStatus(type, 0));
      updateComponentInLevel(uuid, { health: 0 });
    }
  };

  useEffect(() => {
    if (brokenStatus == 'destroyed') {
      const worldPosition = boxRef.current!.getWorldPosition(new Vector3());
      addExplosion({
        offset: [worldPosition.x, worldPosition.y, worldPosition.z],
        scale: 1
      });
      incrementScore(featureHealth[type]);
      destroy();
    }
  }, [brokenStatus]);

  const onPointerClick = (e: ThreeEvent<MouseEvent>) => {
    if (menuState !== MenuStatus.LEVEL_BUILDER) return;
    if (useEditorStore.getState().isDraggingGizmo) return;
    useEditorStore.getState().setSelectedItemByUuid(uuid);
  };

  const Component = React.forwardRef((_, ref) =>
    type == 'trampoline' ? (
      <Trampoline onClick={onPointerClick} name={type + uuid} uuid={uuid} ref={ref} scale={[width, height, depth]} />
    ) : type == 'boulder' ? (
      <Boulder onClick={onPointerClick} name={type + uuid} uuid={uuid} ref={ref} scale={[width, height, depth]} />
    ) : (
      <CustomComponent
        onClick={onPointerClick}
        visible={brokenStatus !== 'destroyed'}
        ref={ref}
        width={width}
        depth={depth}
        height={height}
        type={type}
        uuid={uuid}
        health={health}
      />
    )
  );
  Component.displayName = 'Component';

  const colliderHalfHeight = type == 'trampoline' ? height / 6 : height / 2;

  const physics = featurePhysics[type];

  return (
    <Gizmos key={uuid + 'gizmo'} id={uuid}>
      <RigidBody
        userData={{ uuid, platformIndex: props.platformIndex }}
        ref={ref}
        key={uuid}
        colliders={false}
        type={brokenStatus == 'destroyed' || physicsDisabled ? 'fixed' : 'dynamic'}
        onIntersectionEnter={onOceanIntersection}
        canSleep={false}
        onContactForce={onContactForce}
        scale={scale}
        {...rest}
      >
        {type == 'boulder' ? (
          <BallCollider restitution={physics.restitution} mass={physics.mass} friction={physics.friction} ref={boxColliderRef} name={type} args={[width / 2]}></BallCollider>
        ) : (
          <CuboidCollider
            restitution={physics.restitution}
            mass={physics.mass}
            friction={physics.friction}
            ref={boxColliderRef}
            name={type}
            args={[width / 2, colliderHalfHeight, depth / 2]}
          />
        )}

        <Component ref={boxRef} />
      </RigidBody>
    </Gizmos>
  );
});
