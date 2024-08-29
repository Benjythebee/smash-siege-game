/*
Trampoline by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/44njxNdC0gt)
*/

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import React from 'react';

type GLTFResult = GLTF & {
  nodes: {
    Trampoline_Mesh: THREE.Mesh;
  };
  materials: {
    Trampoline_Mat: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export const Trampoline = React.forwardRef((props: JSX.IntrinsicElements['group'], ref: any) => {
  const { nodes, materials } = useGLTF('./models/Trampoline.glb') as GLTFResult;

  const pos = (props.position as [number, number, number]) || [0, 0, 0];
  pos[1] -= 0.25;

  return (
    <group {...props} position={pos} ref={ref} dispose={null}>
      <mesh geometry={nodes.Trampoline_Mesh.geometry} material={materials.Trampoline_Mat} />
    </group>
  );
});

useGLTF.preload('./models/Trampoline.glb');
