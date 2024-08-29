// https://codesandbox.io/s/space-game-i2160?file=/src/3d/Explosions.js
// By @drcmda

import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSlingShotStore } from '../../../store';

const tempObject = new THREE.Object3D();

export type ExplosionType = { guid: string; offset: number[]; scale: number };

function make(color: string, speed: number) {
  return {
    ref: React.createRef(),
    color,
    data: new Array(20)
      .fill(0)
      .map(() => [new THREE.Vector3(), new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2).normalize().multiplyScalar(speed * 0.5)])
  };
}

export default function Explosions() {
  const explosions = useSlingShotStore((state) => state.explosions);
  return explosions.map(({ guid, offset, scale }) => <Explosion key={guid} guid={guid} position={[offset[0], offset[1], offset[2]]} scale={scale * 0.05} />);
}

type ExplosionProps = {
  scale: number;
  position: THREE.Vector3Tuple;
  guid: string;
};
function Explosion({ position, scale, guid }: ExplosionProps) {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => [make('white', 0.8), make('orange', 0.6)], []);

  useFrame((state, delta) => {
    particles.forEach(({ data }, type) => {
      if (group.current) {
        const mesh = group.current.children[type] as THREE.InstancedMesh;
        data.forEach(([vec, normal], i) => {
          vec.add(normal);
          tempObject.position.copy(vec);
          tempObject.updateMatrix();
          mesh.setMatrixAt(i, tempObject.matrix);
        });
        // @ts-ignore
        mesh.material.opacity -= 0.025;
        // group.current.position.z += delta * 50;
        mesh.instanceMatrix.needsUpdate = true;
        // @ts-ignore
        if (mesh.material.opacity <= 0) {
          // remove the explosion
          useSlingShotStore.setState((state) => ({
            explosions: state.explosions.filter((explosion) => explosion.guid !== guid)
          }));
        }
      }
    });
  });

  return (
    <group ref={group} name={guid} position={position} scale={[scale, scale, scale]}>
      {particles.map(({ color, data }, index) => (
        <instancedMesh key={index} args={[undefined, undefined, data.length]} frustumCulled={false}>
          <dodecahedronGeometry args={[10, 0]} />
          <meshBasicMaterial color={color} transparent opacity={1} fog={false} />
        </instancedMesh>
      ))}
    </group>
  );
}
