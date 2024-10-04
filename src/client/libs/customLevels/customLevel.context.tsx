import { PropsWithChildren, useRef } from 'react';
import { ExpectedLevelDataFromClient, LevelData, LevelType } from '../../../common/types';
import { useUserStore } from '../../components/userStore';
import { CustomLevelsAPI } from './editorApi';
import { createStore, StoreApi, useStore } from 'zustand';
import React from 'react';
import { levelsData } from '../levels';
import { resetLevel } from '../../store';
import { convertLevelTypeToLevelData } from '../../../common/convert';

type CustomLevelContextType = {
  loadedCustomLevel: LevelType | null;
  setLoadedCustomLevel: (level: LevelType | null, shouldReset?: boolean) => void;
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadLevelToLibrary: (cleanedLevel: LevelData & { importedId?: number }) => Promise<void>;
};

export const CustomLevelStore = createStore<CustomLevelContextType>()((set, get) => ({
  loadedCustomLevel: null,
  uploadError: null,
  uploadSuccess: false,
  setLoadedCustomLevel: (l: LevelType | null, shouldReset = true) => {
    if (l) {
      const converted = convertLevelTypeToLevelData(l);
      /**
       * Note: this is only time we ever edit "levelsData";
       */
      levelsData.custom = converted;
      set({ loadedCustomLevel: l });
      resetLevel('custom');
    } else {
      set({ loadedCustomLevel: null });
      levelsData.custom = null;
      if (shouldReset) {
        resetLevel(0);
      }
    }
  },
  uploadLevelToLibrary: async (cleanedLevel: LevelData & { importedId?: number }) => {
    const user = useUserStore.getState();
    set({ uploadError: null, uploadSuccess: false });

    if (!user.user?.username) {
      set({ uploadError: 'Please login to upload this level', uploadSuccess: false });
      return;
    }
    // Upload to Library
    // Convert LevelData to LevelType
    const level: ExpectedLevelDataFromClient & { importedId?: number } = {
      name: cleanedLevel.name,
      description: 'Custom level',
      image_url: cleanedLevel.image_url || '',
      total_ammo: cleanedLevel.totalAmmo,
      content: {
        platforms: cleanedLevel.platforms,
        environment: cleanedLevel.environment,
        components: cleanedLevel.components
      },
      importedId: cleanedLevel.importedId
    };

    const api = new CustomLevelsAPI();

    if (level.importedId) {
      const response = await api.updateLevel(level);
      if ('error' in response) {
        set({ uploadError: response.error, uploadSuccess: false });
      } else {
        set({ uploadError: '', uploadSuccess: true });
      }
    } else {
      const response = await api.addLevel(level);
      if ('error' in response) {
        set({ uploadError: response.error, uploadSuccess: false });
      } else {
        set({ uploadError: '', uploadSuccess: true });
      }
    }
  }
}));

const CustomLevelManagerContext = React.createContext<StoreApi<CustomLevelContextType> | null>(null);

export const CustomLevelManagerProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<StoreApi<CustomLevelContextType> | null>(null);

  if (!ref.current) {
    ref.current = CustomLevelStore;
  }

  return <CustomLevelManagerContext.Provider value={ref.current}>{children}</CustomLevelManagerContext.Provider>;
};

export const useCustomLevelStore = () => {
  return useStore(CustomLevelStore);
};

export const useCustomLevelStoreWithSelector = <T,>(selector: (store: CustomLevelContextType) => T): T => {
  return useStore(CustomLevelStore, selector);
};
