import { create } from 'zustand';
import { RapierRigidBody } from '@react-three/rapier';
import { AnimationResponse } from 'mona-js-sdk';
import { persist } from 'zustand/middleware';
import { levelsData } from './libs/levels.js';
import { ExplosionType } from './components/3d/explosions/explosion.js';
import { Breakable, defaultEnvironmentProps } from './libs/levels/types.js';
import { featureHealth } from './components/3d/levelFeatures/constants.js';
import { v4 as uuidv4 } from 'uuid';
import { Vector3 } from 'three';
import { onReloadLevel } from './observables.js';
import { useLevelBuilderStore } from './components/ui/levelBuilder/LevelBuilder.js';
import { playSoundProgrammatically } from './libs/sounds/soundContext.js';
import { slingShotCenterPositionVector } from './components/3d/Slingshot.js';
import React from 'react';
import { LevelData, LevelFeatureProp } from '../common/types.js';
import { CustomLevelStore } from './libs/customLevels/customLevel.context.js';

export enum MenuStatus {
  MAIN_MENU,
  LEVELS,
  HIDDEN,
  SCORE,
  LEVEL_BUILDER,
  CREDITS
}

export type ammoLoadoutType = {
  id: string;
  name: string;
  uuid: string;
  ref: React.MutableRefObject<RapierRigidBody | null>;
  released: boolean;
  position?: Vector3;
  rotation?: Vector3;
};
const generateAmmo = (num: number): ammoLoadoutType[] => {
  return Array(num)
    .fill(0)
    .map((_, i) => {
      return {
        id: 'ammo' + i,
        uuid: uuidv4(),
        name: 'ammo' + i,
        ref: React.createRef<RapierRigidBody>(),
        released: false,
        position: i == 0 ? slingShotCenterPositionVector : new Vector3(0, -8, 0)
      };
    });
};

export const useGameStore = create<{
  level: number | 'custom' | 'editor-test';
  scoreByLevel: { ammoUsed: number; score: number }[];
  startGame: (level: number) => void;
  endGame: () => void;
  score: number;
  setScoreByLevel: (score: number, ammoUsed: number) => void;
  incrementScore: (score: number) => void;
  isPaused: boolean;
  menuState: MenuStatus;
  prevMenuState: MenuStatus;
}>()(
  persist(
    (set, get) => ({
      level: 0,
      menuState: MenuStatus.MAIN_MENU,
      prevMenuState: MenuStatus.MAIN_MENU,
      scoreByLevel: [],
      startGame: () => set({ level: 0 }),
      endGame: () => set({ level: 0 }),
      isPaused: true,
      score: 0,
      incrementScore: (score: number) => set((state) => ({ score: state.score + score })),
      setScoreByLevel: (score: number, ammoUsed: number) => {
        const level = get().level;
        if (level == 'custom') return; // no score for custom level for now
        if (level == 'editor-test') return; // no score for editor test level
        const arr = get().scoreByLevel;
        arr[level] = { score, ammoUsed };
        set({ scoreByLevel: arr });
      }
    }),
    {
      name: 'level-game-store',
      skipHydration: true,
      partialize: (state) => ({ scoreByLevel: state.scoreByLevel })
    }
  )
);

/**
 * Store dedicated to ammo management  and other slingshot mechanics
 */
export const useSlingShotStore = create<{
  importedAssets: { [index: string]: AnimationResponse };
  explosions: ExplosionType[];
  currentAmmoIndex: number;
  ammoLoadout: ammoLoadoutType[];
  ammoLoaded: boolean;
  nextAmmo: () => void;
  isOutOfAmmo: () => boolean;
  setCurrentAmmoIndex: (index: number) => void;
  selectImportedAsset: (asset: AnimationResponse) => void;
  currentAmmoRef: () => RapierRigidBody | null;
}>((set, get) => ({
  currentAmmoIndex: -1,
  importedAssets: {},
  explosions: [],
  ammoLoaded: true,
  ammoLoadout: generateAmmo(levelsData[0].totalAmmo),
  isOutOfAmmo: () => get().currentAmmoIndex > get().ammoLoadout.length - 1,
  nextAmmo: () =>
    set((state) => {
      if (state.currentAmmoIndex < state.ammoLoadout.length) {
        return { currentAmmoIndex: state.currentAmmoIndex + 1 };
      }
      return { currentAmmoIndex: state.currentAmmoIndex };
    }),
  selectImportedAsset: (asset: AnimationResponse) => {
    if (get().isOutOfAmmo()) return;
    const m = get().importedAssets;
    const isLoadingAnImportedAsset = !!m[String(get().currentAmmoIndex)] && !get().ammoLoaded;
    if (isLoadingAnImportedAsset) return;
    set((state) => ({ importedAssets: { ...m, [String(state.currentAmmoIndex)]: asset }, ammoLoaded: false }));
  },
  setCurrentAmmoIndex: (index: number) => set({ currentAmmoIndex: index }),
  currentAmmoRef: () => get().ammoLoadout[get().currentAmmoIndex]?.ref.current
}));

/**
 * Store dedicated to the state of the current level, it is of the type LevelData
 */
export const useCurrentLevelState = create<LevelData>((set, get) => {
  const clone = structuredClone(levelsData[0]);
  return {
    ...clone,
    components: setComponentsBreakableData(clone.components as any[]),
    environment: clone.environment?.map((e) => defaultEnvironmentProps(e)) || []
  };
});

/**
 * This is to automatically show the menu when all components are broken or when we run out of ammo
 */
const timeouts: {
  onAllBrokenTimeout: NodeJS.Timeout | null;
  onOutOfAmmoTimeout: NodeJS.Timeout | null;
} = {
  onAllBrokenTimeout: null,
  onOutOfAmmoTimeout: null
};
const clearTimeouts = () => {
  timeouts.onAllBrokenTimeout && clearTimeout(timeouts.onAllBrokenTimeout);
  timeouts.onOutOfAmmoTimeout && clearTimeout(timeouts.onOutOfAmmoTimeout);
  timeouts.onAllBrokenTimeout = null;
  timeouts.onOutOfAmmoTimeout = null;
};

/**
 * Subscribe to level state changes to check if all components are broken
 */
useCurrentLevelState.subscribe((state) => {
  if (!state.components || state.components.length == 0) {
    return;
  }

  if (useGameStore.getState().menuState !== MenuStatus.HIDDEN) return;

  const isAllBroken = state.components.every((component) => (component as Breakable<LevelFeatureProp>).health <= 0);

  if (isAllBroken && !timeouts.onAllBrokenTimeout) {
    // clear ammo out timeout
    timeouts.onOutOfAmmoTimeout && clearTimeout(timeouts.onOutOfAmmoTimeout);

    useGameStore.getState().setScoreByLevel(useGameStore.getState().score, useSlingShotStore.getState().currentAmmoIndex + 1);
    timeouts.onAllBrokenTimeout = setTimeout(() => {
      useGameStore.setState({ menuState: MenuStatus.SCORE });
      timeouts.onAllBrokenTimeout = null;
    }, 1000);
  }
});

/**
 * Subscribe to ammo state changes to check if we're out of ammo
 */
useSlingShotStore.subscribe((state) => {
  const gameState = useGameStore.getState();
  if (gameState.menuState !== MenuStatus.HIDDEN) return;
  // Show score if we're out of ammo
  if (state.isOutOfAmmo() && !timeouts.onOutOfAmmoTimeout) {
    if (gameState.level != 'custom' && gameState.level != 'editor-test') {
      // Set score by level on default levels only
      const lastLevelScore = gameState.scoreByLevel[gameState.level]?.score || 0;
      const currentSCore = gameState.score;
      if (lastLevelScore < currentSCore) {
        gameState.setScoreByLevel(gameState.score, useSlingShotStore.getState().currentAmmoIndex + 1);
      }
    }

    timeouts.onOutOfAmmoTimeout = setTimeout(() => {
      console.log('out of ammo');
      useGameStore.setState({ menuState: MenuStatus.SCORE });
      clearTimeouts();
    }, 3000);
  }
});
// clear all timeouts on level change
let currentLevel: number | 'custom' | 'editor-test' = 0;
useGameStore.subscribe((state) => {
  if (state.level !== currentLevel) {
    // clear all timeouts
    clearTimeouts();
    currentLevel = state.level;
  }
});

/**
 * This is to automatically clear the custom level when the user leaves the custom level
 */
let wasCustomLevel = false;
useGameStore.subscribe((state) => {
  if (wasCustomLevel && state.level !== 'custom') {
    // clear store
    CustomLevelStore.getState().setLoadedCustomLevel(null, false);
  } else if (state.level === 'custom') {
    wasCustomLevel = true;
  }
});

/**
 * End the game; (reset the level, show the main menu)
 */
export const endGame = () => {
  onReloadLevel.notifyObservers();
  useGameStore.setState({
    menuState: MenuStatus.MAIN_MENU,
    level: 0,
    score: 0
  });
  loadLevel(0);

  useSlingShotStore.setState({
    currentAmmoIndex: 0,
    importedAssets: {},
    ammoLoaded: true,
    explosions: [],
    ammoLoadout: generateAmmo(levelsData[0].totalAmmo)
  });
};

/**
 * Call to clear the scene and reset a level to its initial state
 */
export const resetLevel = (levelId?: number | 'custom' | 'editor-test') => {
  let level = levelId ?? useGameStore.getState().level;
  if (!levelsData[level]) {
    level = 0;
  }
  onReloadLevel.notifyObservers();
  useGameStore.setState({
    score: 0,
    menuState: MenuStatus.HIDDEN,
    isPaused: false,
    ...(levelId ? { level: levelId } : {})
  });
  loadLevel(level);
  useSlingShotStore.setState({
    currentAmmoIndex: 0,
    ammoLoaded: true,
    importedAssets: {},
    explosions: [],
    ammoLoadout: generateAmmo(levelsData[level]!.totalAmmo)
  });

  clearTimeouts();
};

/**
 * Clear the current level state without changing the game state (score, menu etc)
 */
export const clearLevel = () => {
  useCurrentLevelState.setState({
    name: '',
    components: [],
    platforms: [],
    environment: []
  });
  onReloadLevel.notifyObservers();
  useGameStore.setState({
    score: 0
  });
  clearTimeouts();
};

/**
 * Add an explosion to the scene
 */
export const addExplosion = (explosion: Omit<ExplosionType, 'guid'>) => {
  const explosionSoundNames = ['poof_lower', 'poof_original'] as const;
  const randomExplosionSound = explosionSoundNames[Math.floor(Math.random() * explosionSoundNames.length)];
  playSoundProgrammatically(randomExplosionSound, { position: explosion.offset });
  useSlingShotStore.setState((state) => {
    return { explosions: [...state.explosions, { ...explosion, guid: uuidv4() }] };
  });
};

/**
 * Move the current ammo to a new position
 */
export const moveCurrentAmmo = (position: Vector3) => {
  useSlingShotStore.setState((state) => ({
    ammoLoadout: state.ammoLoadout.map((ammo, index) => {
      if (index == state.currentAmmoIndex) {
        if (ammo.released) return ammo;

        console.log('moving ammo ' + index);
        return { ...ammo, position: position.clone() };
      }
      return ammo;
    })
  }));
};
/**
 * Mark the specific ammo (by index) as released
 */
export const markAmmoAsReleased = (ammoIndex: number) => {
  useSlingShotStore.setState((state) => ({
    ammoLoadout: state.ammoLoadout.map((ammo, index) => {
      if (index == ammoIndex) {
        console.log('marking ammo ' + index + ' as released');
        return { ...ammo, released: true };
      }
      return ammo;
    })
  }));
};

export const isAmmoReleased = (ammoIndex: number) => {
  return useSlingShotStore.getState().ammoLoadout[ammoIndex]?.released || false;
};

export const currentAmmoPosition = () => {
  const state = useSlingShotStore.getState();
  return state.ammoLoadout[state.currentAmmoIndex]?.position?.clone() || new Vector3();
};

function setComponentsBreakableData(components: LevelFeatureProp[]) {
  return components.map((component) => ({ ...component, health: featureHealth[component.type!], uuid: uuidv4() }));
}

/**
 * Load a level by its index (or custom level);
 */
export const loadLevel = (level: number | 'custom' | 'editor-test') => {
  if (!levelsData[level]) return;
  useCurrentLevelState.setState(() => {
    const isBuilderLevel = useGameStore.getState().menuState == MenuStatus.LEVEL_BUILDER;
    const levelData = isBuilderLevel ? useLevelBuilderStore.getState() : structuredClone(levelsData[level]!);
    const cloned = structuredClone(levelData);
    return {
      ...cloned,
      components: setComponentsBreakableData(cloned.components as any[]),
      platforms: cloned.platforms.map((platform) => ({ ...platform, uuid: platform.uuid || uuidv4() })),
      environment: cloned.environment?.map((e) => defaultEnvironmentProps(e)) || []
    };
  });
};

export const getComponentHealth = (uuid: string) => {
  return (useCurrentLevelState.getState().components.find((component) => (component as any).uuid == uuid) as Breakable<LevelFeatureProp>)?.health || 0;
};

export const updateComponentInLevel = (uuid: string, data: Partial<Breakable<LevelFeatureProp>>) => {
  useCurrentLevelState.setState((state) => {
    return {
      components: state.components.map((component) => {
        if ('uuid' in component && component.uuid == uuid) {
          return { ...component, ...data };
        }
        return component;
      })
    };
  });
};
