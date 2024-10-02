import React, { useEffect } from 'react';

import { GameAudioEngine } from './GameAudioEngine.js';
import type { SoundtrackInfo } from './GameAudioEngine.js';

const AmbientAudioContext = React.createContext<{
  audioEngine: GameAudioEngine | null;
}>({} as any);

export const AmbientAudioProvider = ({
  children,
  soundtracks
}: React.PropsWithChildren<{
  soundtracks: Array<SoundtrackInfo>;
}>) => {
  const [audioEngine] = React.useState(!(typeof window === 'undefined') ? GameAudioEngine.initialize() : null);

  GameAudioEngine.setupSoundtracks(soundtracks);

  const start = () => {
    if (audioEngine) {
      audioEngine.isLoading = false;
      if (!audioEngine.running) {
        audioEngine.audioContext.resume();
      }
    }
  };

  useEffect(() => {
    if (audioEngine) {
      audioEngine?.start();
      // start on mount
      start();
    }
  }, []);

  return <AmbientAudioContext.Provider value={{ audioEngine }}>{children}</AmbientAudioContext.Provider>;
};
