import { InteractiveSlingShot } from './InteractiveSlingShot.js';
import { LevelManager } from './3d/levelManager.js';
import Explosions from './3d/explosions/explosion.js';
import { Ocean } from './3d/levelFeatures/environment/Water.js';
import { Seagull } from './3d/levelFeatures/environment/birds/Seagull.js';
import { useEffect } from 'react';
import * as THREE from 'three';
import React from 'react';
import { loadSeagullPath } from './3d/levelFeatures/environment/birds/pathing.js';
import { useFrame, useThree } from '@react-three/fiber';
// import { Line } from '@react-three/drei';

const SeagullObject = () => {
  const pathData = React.useRef<{ positions: THREE.Vector3[]; directions: THREE.Vector3[] }>({ positions: [], directions: [] });
  const seagulRef = React.useRef<THREE.Object3D>(null);
  const [visible, setVisible] = React.useState(false);
  const nextGeneration = React.useRef<NodeJS.Timeout | null>(null);
  const frameIndex = React.useRef(0);
  // const scene = useThree((state) => state.scene);
  useEffect(() => {
    pathData.current = loadSeagullPath();
    setVisible(true);
    // const points = pathData.current.positions.map((v) => [v.x, v.y, v.z]);
    // const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map((v) => new THREE.Vector3(...v))), new THREE.LineBasicMaterial({ color: 0xff0000 }));
    // scene.add(line);
  }, []);

  useFrame(({ clock }) => {
    if (pathData.current.positions.length === 0) return;
    if (!seagulRef.current) return;

    if ((clock.getElapsedTime() * 60) % 6 == 0) return;

    const data = pathData.current;

    if (data.positions[frameIndex.current]) {
      seagulRef.current.position.copy(data.positions[frameIndex.current]);
      seagulRef.current.lookAt(data.directions[frameIndex.current].clone());
      frameIndex.current = frameIndex.current + 1;
    }

    if (!nextGeneration.current && frameIndex.current == data.positions.length - 1) {
      pathData.current = { positions: [], directions: [] };
      setVisible(false);
      nextGeneration.current = setTimeout(
        () => {
          setVisible(true);
          frameIndex.current = 0;
          pathData.current = loadSeagullPath();
          nextGeneration.current = null;
        },
        1000 * 60 * 1
      );
    }
  });

  return (
    <>
      <Seagull ref={seagulRef} visible={visible} scale={[0.3, 0.3, 0.3]} />
    </>
  );
};

export const Experience = () => {
  return (
    <>
      {/* <OrbitControls /> */}
      {/* LIGHTS */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow color={'#9e69da'} />
      <Ocean />
      <LevelManager />
      <Explosions />
      <fog attach="fog" args={['white', 100, 120]} />
      <SeagullObject />
      <InteractiveSlingShot />
    </>
  );
};
