/*
Rock by jeremy [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/62bVOJt7vHv)
*/

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Rock_1: THREE.Mesh;
    Rock_2: THREE.Mesh;
  };
  materials: {
    Rock_Grey: THREE.MeshStandardMaterial;
    ['455A64']: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export const RandomRockAmmo = React.forwardRef((props: JSX.IntrinsicElements['group'], ref) => {
  const { nodes, materials } = useGLTF('./models/rockAmmo.glb') as GLTFResult;

  const rock = useRef<number>(Math.floor(Math.random() * 2));
  const randomRotation = useRef<number[]>([Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]);

  return (
    // @ts-ignore
    <group ref={ref} {...props} dispose={null} rotation={new THREE.Euler().fromArray(randomRotation.current as any)}>
      {rock.current == 0 && <mesh geometry={nodes.Rock_1.geometry} material={materials.Rock_Grey} />}
      {rock.current == 1 && <mesh geometry={nodes.Rock_2.geometry} material={materials['455A64']} />}
    </group>
  );
});

useGLTF.preload('./models/rockAmmo.glb');
