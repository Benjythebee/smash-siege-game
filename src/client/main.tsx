import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { Menu } from './components/ui/Menu.js';
import { useGameStore } from './store.js';
import { UserInputIndicator } from './components/ui/components/InputHelper/MobileRotateIndicator.js';
import { LevelBuilder } from './components/ui/levelBuilder/LevelBuilder.js';
import { EditorMenu } from './components/ui/levelBuilder/editor/Editor.js';
import { AmmoLibrary } from './components/ui/ammoLibrary/library.js';
import { SoundProvider } from './libs/sounds/soundContext.js';
import { AmbientAudioProvider } from './libs/music/AudioContext.js';
import { SoundtrackInfo } from './libs/music/index.js';
import { Footer } from './components/ui/Footer/footer.js';
import { LevelProgressDetails } from './components/ui/levelProgress/levelProgress.js';
import { CustomLevelManagerProvider } from './libs/customLevels/customLevel.context.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//credits:
// Fireside Tales and The_Bards_Tale by Darren Curtis | https://www.darrencurtismusic.com/
// Music promoted on https://www.chosic.com/free-music/all/
// Creative Commons Attribution 3.0 Unported (CC BY 3.0)
// https://creativecommons.org/licenses/by/3.0/

/**
 * Crystal Caverns by Darren Curtis | https://www.darrencurtismusic.com/
Music promoted on https://www.chosic.com/free-music/all/
Creative Commons Attribution 3.0 Unported (CC BY 3.0)
https://creativecommons.org/licenses/by/3.0/
 
 */

const soundtracks: Array<SoundtrackInfo> = [
  // used randomly throughout world
  {
    tracks: [
      {
        fileName: 'The_Bards_Tale.mp3',
        duration: 158589,
        volume: 0.06
      },
      {
        fileName: 'Guitar-Gentle.mp3',
        duration: 187947,
        volume: 0.06
      },
      {
        fileName: 'Fireside-Tales.mp3',
        duration: 100752,
        volume: 0.06
      },
      {
        fileName: 'Crystal-Caverns.mp3',
        duration: 125136,
        volume: 0.06
      }
    ],
    isDefault: true
  }
];

function Hydration() {
  useEffect(() => {
    useGameStore.persist.rehydrate();
  }, []);

  return null;
}

function Game() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  );
  return (
    <React.StrictMode>
      <Hydration />
      <AmbientAudioProvider soundtracks={soundtracks}>
        <QueryClientProvider client={queryClient}>
          <SoundProvider>
            <CustomLevelManagerProvider>
              <AmmoLibrary />
              <Menu />
              <App />
              <LevelBuilder />
              <EditorMenu />
              <Footer />
            </CustomLevelManagerProvider>
          </SoundProvider>
        </QueryClientProvider>
      </AmbientAudioProvider>
      <LevelProgressDetails />
      <UserInputIndicator />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Game />);
