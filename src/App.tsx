import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
const physicsDebug = import.meta.env.VITE_PHYSICS_DEBUG == 'true';

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 10, 15], fov: 69 }}>
      <color attach="background" args={['#dbecfb']} />
      <Suspense fallback={null}>
        <Physics debug={physicsDebug}>
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
