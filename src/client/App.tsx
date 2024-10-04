import { Canvas, useThree } from '@react-three/fiber';
import { Experience } from './components/Experience.js';
import { Suspense, useEffect } from 'react';
import { Physics } from '@react-three/rapier';
import { useSceneOutsideR3F } from './scene.store.js';

function App() {
  const debug = useSceneOutsideR3F((s) => s.debug);

  return (
    <Canvas shadows camera={{ position: [0, 10, 15], fov: 69 }}>
      <OnSceneReady />
      <color attach="background" args={['#dbecfb']} />
      <Suspense fallback={null}>
        <Physics debug={debug}>
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;

const OnSceneReady = () => {
  const { scene, camera } = useThree((s) => ({ scene: s.scene, camera: s.camera }));
  useEffect(() => {
    if (scene) {
      useSceneOutsideR3F.setState({ scene });
    }
  }, [scene]);

  useEffect(() => {
    if (camera) {
      useSceneOutsideR3F.setState({ camera });
    }
  }, [camera]);

  return null;
};
