import { MeshReflectorMaterial } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { extend, useThree, useLoader, useFrame, Object3DNode } from '@react-three/fiber';

import { Water } from 'three/examples/jsm/objects/Water.js';
import { PlaneGeometry, RepeatWrapping, TextureLoader, Vector3 } from 'three';
import { useMemo, useRef } from 'react';
extend({ Water });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}
export const Ocean = () => {
  const ref = useRef(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(TextureLoader, '/textures/waternormals.jpg');

  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  const geom = useMemo(() => new PlaneGeometry(30000, 30000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new Vector3(),
      sunColor: 0xeb8934,
      waterColor: 0x0064b5,
      distortionScale: 0.1,
      fog: false,
      //@ts-ignore
      format: gl.encoding
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [waterNormals]
  );
  //@ts-ignore
  useFrame((state, delta) => (ref.current!.material.uniforms.time.value += delta));
  return (
    <group>
      <RigidBody type="fixed" colliders={false} name="water">
        <water ref={ref} args={[geom, config]} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
      </RigidBody>
      <CuboidCollider name="water" args={[100, 0.5, 100]} position={[0, -1.0, 0]} sensor />
    </group>
  );
};
