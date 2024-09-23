import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { ExpectedLevelDataFromClient, LevelData, LevelType } from '../../../common/types';
import { useUserStore } from '../../components/userStore';
import { CustomLevelsAPI } from './editorApi';

const CustomLevelContext = createContext<{
  loadedLevel: LevelData | null;
  setLoadedLevel: (level: LevelData) => void;
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadLevelToLibrary: (cleanedLevel: LevelData) => void;
}>({
  loadedLevel: null,
  uploadError: null,
  uploadSuccess: false,
  setLoadedLevel: () => {},
  uploadLevelToLibrary: () => {}
});

export const CustomLevelManagerProvider = ({ children }: PropsWithChildren) => {
  const [loadedLevel, setLoadedLevel] = useState<LevelData | null>(null);

  // For uploading a level
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setuploadSuccess] = useState<boolean>(false);

  // uploading a level

  const uploadLevelToLibrary = async (cleanedLevel: LevelData) => {
    console.log(cleanedLevel);
    const user = useUserStore.getState();
    setUploadError(null);
    setuploadSuccess(false);
    if (!user.user?.username) {
      setUploadError('Please login to upload this level');
      return;
    }
    // Upload to Library
    // Convert LevelData to LevelType
    const level: ExpectedLevelDataFromClient = {
      name: cleanedLevel.name,
      description: 'Custom level',
      author: user.user?.username || 'Anonymous',
      total_ammo: cleanedLevel.totalAmmo,
      content: {
        platforms: cleanedLevel.platforms,
        environment: cleanedLevel.environment,
        components: cleanedLevel.components
      }
    };

    const api = new CustomLevelsAPI();
    console.log(cleanedLevel);
    console.log(level);
    const response = await api.addLevel(level);
    if ('error' in response) {
      setUploadError(response.error);
    } else {
      setuploadSuccess(true);
    }
  };

  return (
    <CustomLevelContext.Provider
      value={{
        uploadSuccess: uploadSuccess,
        loadedLevel: loadedLevel,
        setLoadedLevel: setLoadedLevel,
        uploadError: uploadError,
        uploadLevelToLibrary
      }}
    >
      {children}
    </CustomLevelContext.Provider>
  );
};

export const useCustomLevelProvider = () => {
  return useContext(CustomLevelContext);
};
