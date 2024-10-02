/*
Vine by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/eI7GSQpnVUL)
*/

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Kelp: THREE.Mesh;
  };
  materials: {
    blinn1SG: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function EnvironmentKelp(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./models/Kelp.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Kelp.geometry} material={materials.blinn1SG} />
    </group>
  );
}

useGLTF.preload('./models/Kelp.glb');
