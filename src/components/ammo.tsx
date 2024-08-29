import { Sphere, useGLTF } from '@react-three/drei';
import { BallCollider, CapsuleCollider, IntersectionEnterPayload, RapierCollider, RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier';
import React, { createRef, ForwardedRef, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Box3, Group, Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { moveCurrentAmmo, useGameStore, useSlingShotStore } from '../store';
import { AnimationResponse } from '../libs/mona';
import { VRM, VRMUtils } from '@pixiv/three-vrm';
import { Euler, useFrame, useThree } from '@react-three/fiber';
import { RandomRockAmmo } from './3d/RockAmmo';

const loadingShaderVertex = `
// vertexShader.glsl
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const loadingShaderFragment = `
// fragmentShader.glsl
uniform float time;
varying vec2 vUv;

void main() {
    // Create a pulsing effect by using the sin function
    float pulse = sin(time * 3.0) * 0.5 + 0.5;
    
    // Interpolate between white and blue
    vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0), pulse);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export const ImportedAsset = React.forwardRef((props: { name: string; importedAsset: AnimationResponse; onLoaded?: (group: Group) => void }, ref: any) => {
  const { name, importedAsset, onLoaded } = props;

  const gltf = useGLTF(importedAsset.animationUrl);

  useEffect(() => {
    if (gltf) {
      // if (gltf.scene.userData?.scaled) {
      //   onLoaded && onLoaded(gltf.scene);
      //   return;
      // }
      if (importedAsset.animationFiletype == 'vrm') {
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        const vrm = new VRM(gltf as any);

        console.log(vrm);
      }

      const group = ref.current as Group;
      console.log(group);
      // get the boundingBox of the model, and get the width, height, depth
      const box = new Box3().setFromObject(group.children[0]);
      const size = box.getSize(new Vector3());
      const width = size.x;
      const height = size.y;
      const depth = size.z;

      // From there, we need to resize the model if it's too big
      const maxScale = 2;
      const maxDimension = Math.max(width, height, depth);
      const scale = maxDimension > maxScale ? maxScale / maxDimension : 1;

      group.scale.set(scale, scale, scale);

      group.userData = { scaled: true };
      onLoaded && onLoaded(group);
    }
  }, [gltf]);

  return (
    <group ref={ref}>
      <primitive name={name} object={gltf.scene}></primitive>
    </group>
  );
});

const LoadingImport = () => {
  const shaderMat = useRef<ShaderMaterial>(null);
  const meshRef = useRef<Mesh | null>(null);
  useFrame(({ clock }) => {
    if (shaderMat.current) {
      shaderMat.current!.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.75]} />
      <shaderMaterial
        ref={shaderMat}
        vertexShader={loadingShaderVertex}
        fragmentShader={loadingShaderFragment}
        uniforms={{
          time: { value: 0 }
        }}
      />
    </mesh>
  );
};

ImportedAsset.displayName = 'ImportedAsset';

export const Ammo = React.forwardRef(({ position, importedAssets }: RigidBodyProps & { importedAssets?: AnimationResponse }, ref: ForwardedRef<RapierRigidBody>) => {
  const importedAssetRef = useRef(null);
  const centerRef = useRef<Group>(null);

  const onLoadedImported = (group: Group) => {
    const center = centerRef.current?.getWorldPosition(new Vector3());
    console.log('onLoadedImported', importedAssetRef.current, center);
    if (importedAssetRef.current && center) {
      //@ts-ignore
      useSlingShotStore.setState({ currentAmmoRef: ref.current, ammoLoaded: true });

      const groupToMove = 'scene' in group ? (group.scene as Group) : group;
      // For some reason VRM models are not willing to cooperate with the code below;
      if (importedAssets?.animationFiletype == 'vrm') {
        groupToMove.position.copy(new Vector3(0, -1, 0));
        return;
      }

      // Get center of bounding box of the group;
      const box = new Box3().setFromObject(groupToMove);
      const bbcenter = new Vector3();
      box.getCenter(bbcenter);

      // console.log('ammo center', center);
      // console.log('bbcenter', bbcenter);
      // console.log('group pos', groupToMove.position);
      // console.log('group world', groupToMove.getWorldPosition(new Vector3()));

      // compute difference between center of bounding box and center of the group
      const diff = bbcenter.clone().sub(center);
      // move the group by the difference
      groupToMove.position.sub(diff);
    }
  };

  return importedAssets ? (
    //@ts-ignore
    <RigidBody ref={ref} position={position} canSleep={false} colliders={false} type={'kinematicPosition'}>
      <group ref={centerRef} />
      {importedAssets.animationType == 'avatar' ? <CapsuleCollider name="ammo" args={[0.5, 0.5]} /> : <BallCollider name="ammo" args={[0.5]} />}
      <Suspense fallback={<LoadingImport />}>
        <ImportedAsset ref={importedAssetRef} onLoaded={onLoadedImported} name="ammo" importedAsset={importedAssets} />
      </Suspense>
    </RigidBody>
  ) : (
    //@ts-ignore
    <RigidBody ref={ref} position={position} ccd={true} canSleep={false} colliders={false} type={'kinematicPosition'}>
      <group ref={centerRef} />
      <BallCollider name="ammo" args={[0.65]} />
      <RandomRockAmmo name="ammo" receiveShadow />
    </RigidBody>
  );
});

Ammo.displayName = 'Ammo';

export const AmmoController = ({ originalPosition }: { originalPosition: Vector3 }) => {
  const ammoLoadout = useSlingShotStore((state) => state.ammoLoadout);
  const currentAmmoIndex = useSlingShotStore((state) => state.currentAmmoIndex);
  const importedAssets = useSlingShotStore((state) => state.importedAssets);

  const refs = useMemo(() => ammoLoadout.map(() => createRef<RapierRigidBody>()), []);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      useSlingShotStore.setState((state) => {
        return {
          currentAmmoRef: refs[currentAmmoIndex]?.current || null,
          ammoLoadout: state.ammoLoadout.map((ammo, index) => {
            if (index == state.currentAmmoIndex) {
              return { ...ammo, position: originalPosition.clone() };
            }
            return ammo;
          })
        };
      });
    }, 500);
  }, [currentAmmoIndex]);

  const onHitWater = (e: IntersectionEnterPayload) => {
    if (e.other.colliderObject?.name == 'water') {
      e.target.rigidBody?.setEnabled(false);
    }
  };

  return (
    <>
      {ammoLoadout.map((ammo, index) => {
        const pos = ammo.position!;
        return <Ammo ref={refs[index]} onIntersectionEnter={onHitWater} importedAssets={importedAssets[String(index)]} key={ammo.uuid} position={pos} />;
      })}
    </>
  );
};
