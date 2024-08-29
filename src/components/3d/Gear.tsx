/*
Gear by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/0icYC-GPiro)
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Gear: THREE.Mesh;
  };
  materials: {
    ['Mat.1']: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function Gear(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./models/Gear.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Gear.geometry} material={materials['Mat.1']} />
    </group>
  );
}

useGLTF.preload('./models/Gear.glb');
