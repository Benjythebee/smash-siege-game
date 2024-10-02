/**
 *
 * Hack to obtain the scene outside of the Canvas component in react-three-fiber
 *
 */

import { Camera } from '@react-three/fiber';
import { Scene } from 'three';
import { create } from 'zustand';

export const useSceneOutsideR3F = create<{
  scene: Scene | null;
  camera: Camera | null;
}>((set) => ({
  scene: null,
  camera: null
}));
