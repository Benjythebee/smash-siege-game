/**
 *
 * Hack to obtain the scene outside of the Canvas component in react-three-fiber
 *
 */

import { Camera } from '@react-three/fiber';
import { Scene } from 'three';
import { create } from 'zustand';

const physicsDebug = import.meta.env.VITE_PHYSICS_DEBUG == 'true';
export const useSceneOutsideR3F = create<{
  scene: Scene | null;
  camera: Camera | null;
  debug: boolean;
}>((set) => ({
  scene: null,
  camera: null,
  debug: physicsDebug
}));
