/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 ./public/models/slingshot.glb -t 
*/

import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
type ActionName = 'actionNameOne' | 'actionNameTwo';

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    ['Node-Mesh']: THREE.Mesh
    ['Node-Mesh_1']: THREE.Mesh
  }
  materials: {
    mat20: THREE.MeshStandardMaterial
    mat18: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Slingshot(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./models/slingshot.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['Node-Mesh'].geometry} material={materials.mat20} />
      <mesh geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat18} />
    </group>
  )
}

useGLTF.preload('./models/slingshot.glb')
