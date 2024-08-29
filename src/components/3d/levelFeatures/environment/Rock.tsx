/*

Rock by Quaternius (https://poly.pizza/m/b7gRkv0cEa)
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Rock_1: THREE.Mesh;
  };
  materials: {
    Atlas: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function EnvironmentRock(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/Rock.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Rock_1.geometry} material={materials.Atlas} scale={100} />
    </group>
  );
}

useGLTF.preload('/models/Rock.glb');
