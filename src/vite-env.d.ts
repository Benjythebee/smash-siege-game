/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MONA_APP_ID: string
    readonly VITE_PHYSICS_DEBUG: boolean
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

type ActionName = 'actionNameOne' | 'actionNameTwo';

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}
