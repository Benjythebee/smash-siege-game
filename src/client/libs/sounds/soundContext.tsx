import React, { useEffect } from 'react';

import { create } from 'zustand';

import { useSound } from './use-sound.js';
import { useUserSettings } from '../settings/useUserSettings.js';

/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * File sprites are formatted as follows:
 * name: [use in game]-[description of the sound from the file name]
 * offset: offset in the sound in ms
 * duration: duration of the sound in ms
 */
export const SOUNDS = {
  file: 'sounds.mp3',
  content: [
    {
      name: 'click-pop',
      tags: ['free', 'cc', 'mixkit'],
      offset: 0,
      duration: 292 //ms
    },
    {
      name: 'poof_original',
      tags: ['mixkit', 'magic', 'sparkle'],
      offset: 292,
      duration: 1373 //ms
    },
    {
      name: 'poof_lower',
      tags: ['mixkit', 'processed', 'magic', 'sparkle'],
      offset: 1665,
      duration: 1373 //ms
    },
    {
      name: 'woosh_one',
      tags: ['pixabay', 'wooshes'],
      offset: 3038,
      duration: 228 //ms
    },
    {
      name: 'woosh_two',
      tags: ['pixabay', 'wooshes'],
      offset: 3265,
      duration: 275 //ms
    },
    {
      name: 'woosh_three',
      tags: ['pixabay', 'wooshes'],
      offset: 3541,
      duration: 240 //ms
    },
    {
      name: 'woosh_four',
      tags: ['pixabay', 'wooshes'],
      offset: 3781,
      duration: 182 //ms
    },
    {
      name: 'bounce',
      tags: ['smartsound_fx', 'rubber band'],
      offset: 3963,
      duration: 497 //ms
    }
  ]
} as const;

export interface SoundContextProps {
  /**
   * Play a sound by name
   */
  playSound: (name: (typeof SOUNDS)['content'][number]['name'], playOptions?: { loop?: boolean; position?: number[] }) => number;
  /**
   *  All the sounds
   */
  sounds: typeof SOUNDS;
  /**
   * Check if a sound is playing
   */
  isPlayingSound: (name: (typeof SOUNDS)['content'][number]['name']) => boolean;
  /**
   * Stop a sound by name
   */
  stopSound: (name: (typeof SOUNDS)['content'][number]['name'], id?: number) => void;
}

export const SoundContext = React.createContext({} as SoundContextProps);

const useSoundMapStore = create<{
  soundMap: Record<(typeof SOUNDS)['content'][number]['name'], number[]>;
  setSoundItem: (key: (typeof SOUNDS)['content'][number]['name'], value: number | null, oldValue?: number) => void;
}>((set, get) => ({
  soundMap: {} as any,
  setSoundItem: (key: (typeof SOUNDS)['content'][number]['name'], value: number | null, oldValue?: number) => {
    const newMap = { ...get().soundMap };
    if (value === null) {
      if (!newMap[key]) return;
      if (newMap[key].length === 1) {
        delete newMap[key];
      } else if (oldValue) {
        newMap[key].map((num, i) => {
          if (num === oldValue) {
            newMap[key].splice(i, 1);
            return true;
          }
          return false;
        });
      }
      set({ soundMap: newMap });
    } else {
      newMap[key] = [...(get().soundMap[key] || []), value];
      set({ soundMap: newMap });
    }
  }
}));

export const SoundProvider = ({ children }: React.PropsWithChildren) => {
  const { soundMap, setSoundItem } = useSoundMapStore();

  const [play, { stop }] = useSound('/sounds/sounds.mp3', {
    volume: useUserSettings.getState().sfxVolume,
    sprite: SOUNDS.content.reduce(
      (acc, { name, offset, duration }) => {
        acc[name] = [offset, duration];
        return acc;
      },
      {} as Record<(typeof SOUNDS)['content'][number]['name'], [number, number]>
    )
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playSound = (name: (typeof SOUNDS)['content'][number]['name'], playOptions?: { loop?: boolean; position?: number[] }) => {
    const num = play({ id: name, loop: !!playOptions?.loop, position: playOptions?.position });
    if (num) {
      setSoundItem(name, num);
      setTimeout(
        () => {
          setSoundItem(name, null);
        },
        SOUNDS.content.find((sound) => sound.name === name)?.duration || 1
      );
    }
    return num || 0;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isPlayingSound = React.useCallback(
    (name: (typeof SOUNDS)['content'][number]['name']) => {
      return soundMap[name]?.length > 0;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [soundMap]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stopSound = React.useCallback(
    (name: (typeof SOUNDS)['content'][number]['name'], id?: number) => {
      const { soundMap, setSoundItem: _setSoundItem } = useSoundMapStore.getState();

      if (id && typeof soundMap[name] == 'undefined') {
        // if for some reason the soundMap is undefined, stop all
        stop(String(id));
      } else {
        soundMap[name]?.forEach((num) => {
          if (id && num !== id) return;
          return stop(num ? String(num) : undefined);
        });
        _setSoundItem(name, null, id);
      }
    },
    [stop]
  );

  useEffect(() => {
    useSoundStore.setState({ playSound, isPlayingSound, stopSound });
    // eslint-disable-next-line no-sparse-arrays
  }, [playSound, isPlayingSound, stopSound]);

  return (
    <SoundContext.Provider
      value={{
        playSound,
        isPlayingSound,
        stopSound,
        sounds: SOUNDS
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

/**
 * Use sound context for SFX; use this to play sounds
 * IF YOU CANT USE CONTEXT, USE `useSoundStore.getState()` instead of `useSoundContext()`
 */
export const useSoundContext = () => React.useContext(SoundContext);

/**
 * Hack to allow the sound context to be used programmatically
 * Access "playSound" programmatically
 */
export const useSoundStore = create<Pick<SoundContextProps, 'playSound' | 'stopSound' | 'isPlayingSound'>>(
  () =>
    ({
      playSound: () => {},
      isPlayingSound: () => {},
      stopSound: () => {}
    }) as any
);
/**
 * uses the sound context to play a sound via programmatic access
 */
export const playSoundProgrammatically = (name: Parameters<SoundContextProps['playSound']>['0'], options?: Parameters<SoundContextProps['playSound']>['1']) =>
  useSoundStore?.getState().playSound(name, options);
/**
 * Check if a sound is currently playing
 */
export const isPlayingSound = (name: Parameters<SoundContextProps['playSound']>['0']) => useSoundStore?.getState().isPlayingSound(name);
/**
 * Stop a sound that's playing
 */
export const stopSoundProgrammatically = (name: Parameters<SoundContextProps['playSound']>['0']) => useSoundStore?.getState().stopSound(name);
