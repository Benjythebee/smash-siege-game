/*
Rock by Quaternius (https://poly.pizza/m/34W5ymEePk)
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Rock_3: THREE.Mesh;
  };
  materials: {
    Atlas: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function EnvironmentRock2(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/Rock_2.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Rock_3.geometry} material={materials.Atlas} scale={100} />
    </group>
  );
}

useGLTF.preload('/models/Rock_2.glb');
