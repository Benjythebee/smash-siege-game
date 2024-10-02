import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { levelsData } from '../../libs/levels.js';
import { clearLevel, endGame, MenuStatus, useGameStore } from '../../store.js';
import { defaultEnvironmentProps, defaultFeatureProps, defaultPlatformProps } from '../../libs/levels/types.js';
import { useEditorStore } from './levelBuilder/Editor.store.js';
import React from 'react';
import { Button } from './components/button/button.js';
import { EnvironmentFeatureProp, LevelData, LevelPlatformProp } from '../../../common/types.js';
import { AuthInEditor } from './levelBuilder/auth-in-editor.js';
import { useCustomLevelStore } from '../../libs/customLevels/customLevel.context.js';
import { ScreenshotManager } from '../../libs/screenshotManager/screenshotManager.js';
import { useSceneOutsideR3F } from '../../scene.store.js';

const emptyLevel = {
  name: 'My level',
  totalAmmo: 10,
  platforms: [],
  components: [],
  environment: []
};

export const useLevelBuilderStore = create<LevelData>()(() => structuredClone(emptyLevel));

const addEnvironment = (newEnv: EnvironmentFeatureProp) => {
  const env = useLevelBuilderStore.getState().environment;
  if ((env || []).findIndex((item) => item.uuid == newEnv.uuid) > -1) {
    return useLevelBuilderStore.setState({ environment: (env || []).map((item) => (item.uuid == newEnv.uuid ? newEnv : item)) });
  }
  return useLevelBuilderStore.setState({ environment: [...(env || []), newEnv] });
};
const removeEnvironment = (newEnv: EnvironmentFeatureProp) => {
  const env = useLevelBuilderStore.getState().environment;
  return useLevelBuilderStore.setState({ environment: (env || []).filter((item) => item.uuid !== newEnv.uuid) });
};

const addPlatform = (newPlatform: LevelData['platforms'][0]) => {
  const platforms = useLevelBuilderStore.getState().platforms;
  if ((platforms || []).findIndex((item) => item.uuid == newPlatform.uuid) > -1) {
    return useLevelBuilderStore.setState({ platforms: (platforms || []).map((item) => (item.uuid == newPlatform.uuid ? newPlatform : item)) });
  }
  return useLevelBuilderStore.setState({ platforms: [...(platforms || []), newPlatform] });
};

const removePlatform = (newPlatform: LevelData['platforms'][0]) => {
  const platforms = useLevelBuilderStore.getState().platforms;
  return useLevelBuilderStore.setState({ platforms: (platforms || []).filter((item) => item.uuid !== newPlatform.uuid) });
};

export const LevelBuilder = () => {
  const { name, totalAmmo, environment, platforms, components } = useLevelBuilderStore((state) => state);
  const { menuState } = useGameStore();

  const { uploadLevelToLibrary, uploadError, uploadSuccess } = useCustomLevelStore();
  const [uploading, setUploading] = React.useState(false);
  const [selectedImportLevel, setSelectedImportLevel] = React.useState<number>(0);
  const isHidden = menuState == MenuStatus.LEVEL_BUILDER;
  const { scene, camera } = useSceneOutsideR3F();
  useEffect(() => {
    if (menuState == MenuStatus.LEVEL_BUILDER) {
      clearLevel();
    }
  }, [menuState]);

  const leaveBuilder = () => {
    useLevelBuilderStore.setState(structuredClone(emptyLevel));
    useEditorStore.setState({ selectedPlatformOrEnvironment: null, selectedItem: null });
    endGame();
  };

  const defaultLevels = Object.entries(levelsData)
    .filter(([key]) => !isNaN(parseInt(key)))
    .map(([, value]) => value) as LevelData[];

  const add = (type: 'environment' | 'platform') => {
    // create new object
    switch (type) {
      case 'environment':
        const newEnvItem = defaultEnvironmentProps({
          position: [0, 1, -20] // default position
        });
        addEnvironment(newEnvItem);
        useEditorStore.setState({ selectedPlatformOrEnvironment: { type: 'environment', data: newEnvItem }, selectedItem: null });
        break;
      case 'platform':
        const newPlat = defaultPlatformProps({
          position: [0, 0, -20], // default position
          scale: [5, 1, 5] // default scale
        });
        addPlatform(newPlat);
        useEditorStore.setState({ selectedPlatformOrEnvironment: { type: 'platforms', data: newPlat }, selectedItem: null });
        break;
      default:
        break;
    }
  };

  const remove = (type: 'environment' | 'platform') => {
    // create new object
    switch (type) {
      case 'environment':
        const env = environment || [];
        const lastEnvPiece = env[env.length - 1];
        lastEnvPiece && removeEnvironment(lastEnvPiece as EnvironmentFeatureProp);
        useEditorStore.getState().selectedPlatformOrEnvironment?.type == 'environment'
          ? useEditorStore.setState({ selectedPlatformOrEnvironment: null, selectedItem: null })
          : null;
        break;
      case 'platform':
        const platfs = platforms || [];
        const lastPlats = platfs[platfs.length - 1];
        lastPlats && removePlatform(lastPlats as LevelPlatformProp);
        useEditorStore.getState().selectedPlatformOrEnvironment?.type == 'platforms' ? useEditorStore.setState({ selectedPlatformOrEnvironment: null, selectedItem: null }) : null;
        break;
      default:
        break;
    }
  };

  const takeScreenShot = (purpose: 'encoded' | 'download') => {
    if (!scene) {
      console.warn('No scene found');
      return;
    }
    if (!camera) {
      console.warn('No camera found');
      return;
    }
    const c = new ScreenshotManager(scene);
    c.setCamera(camera);
    if (purpose == 'encoded') {
      return c.getImageData(256, 256);
    } else {
      c.saveScreenshot('my level', 512, 512);
      return null;
    }
  };

  const importLevel = () => {
    const levelData = structuredClone(levelsData[selectedImportLevel]);
    // add default values to properties
    levelData.platforms = levelData.platforms.map((plat) => defaultPlatformProps(plat));
    levelData.environment = (levelData.environment || []).map((env) => defaultEnvironmentProps(env));
    levelData.components = (levelData.components || []).map((comp) => defaultFeatureProps(comp));
    useEditorStore.setState({ selectedPlatformOrEnvironment: null, selectedItem: null });
    useLevelBuilderStore.setState(levelData);
  };

  const exportLevel = async (option: 'library' | 'clipboard') => {
    const object = structuredClone(useLevelBuilderStore.getState());
    // cleanup object
    // remove uuid
    object.platforms = object.platforms.map((plat) => {
      //@ts-ignore
      const { uuid, health, ...rest } = plat;
      return rest;
    });
    object.environment = object.environment!.map((env) => {
      //@ts-ignore
      const { uuid, health, ...rest } = env;
      return rest;
    });
    object.components = object.components.map((comp) => {
      //@ts-ignore
      const { uuid, health, ...rest } = comp;
      return rest;
    });
    if (option == 'clipboard') {
      navigator.clipboard.writeText(JSON.stringify(object));
      return;
    } else {
      // Take a screenshot

      setUploading(true);
      const imgData = takeScreenShot('encoded');
      if (imgData) {
        object.image_url = imgData;
      }
      await uploadLevelToLibrary(object);
      setUploading(false);
    }
  };

  return (
    <>
      <Button className={`absolute top-5 left-5 ${isHidden ? '' : 'hidden'}`} text="Back" theme="white" size="big" onClick={leaveBuilder} />

      <div className={`LevelBuilder absolute p-2 z-10 bottom-0 left-0 w-full border-white border-2 bg-slate-700/80 text-white ${isHidden ? '' : 'hidden'}`}>
        <div className="flex gap-2">
          {/** Level details */}
          <div className={`flex flex-col gap-2 w-1/6`}>
            <span className="font-bold">Level information</span>

            <div className="flex flex-col gap-2">
              <label htmlFor="levelName">Level Name</label>
              <input type="text" className="text-black" id="levelName" value={name} onChange={(e) => useLevelBuilderStore.setState({ name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="totalAmmo">Total Ammo</label>
              <input type="number" className="text-black" id="totalAmmo" value={totalAmmo} onChange={(e) => useLevelBuilderStore.setState({ totalAmmo: Number(e.target.value) })} />
            </div>
          </div>
          {/* Level Platforms*/}
          <div className={`flex flex-col gap-2 w-1/6`}>
            <span className="font-bold">Level Platforms</span>
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-md border-black border-solid border-2" onClick={() => add('platform')}>
                +
              </button>
              <button className="rounded-md border-black border-solid border-2" onClick={() => remove('platform')}>
                -
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {platforms?.map((env, index) => (
                <div
                  className="hover:bg-slate-700 cursor-pointer"
                  key={env.uuid}
                  onClick={() => useEditorStore.setState({ selectedPlatformOrEnvironment: { type: 'platforms', data: env as any }, selectedItem: null })}
                >
                  Platform {index}
                </div>
              ))}
            </div>
          </div>
          {/* Level Environment*/}
          <div className={`flex flex-col gap-2 w-1/6`}>
            <span className="font-bold">Level Environment</span>
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-md border-black border-solid border-2" onClick={() => add('environment')}>
                +
              </button>
              <button className="rounded-md border-black border-solid border-2" onClick={() => remove('environment')}>
                -
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {environment?.map((env, _index) => (
                <div
                  className="hover:bg-slate-700 cursor-pointer"
                  key={env.uuid}
                  onClick={() => useEditorStore.setState({ selectedPlatformOrEnvironment: { type: 'environment', data: env as any }, selectedItem: null })}
                >
                  {env.type}
                </div>
              ))}
            </div>
          </div>
          {/* Test environment */}
          <div className={`flex flex-col gap-2 w-1/6`}>
            <span className="font-bold">Import & Export</span>
            <div className="flex flex-col gap-2">
              <label htmlFor="import">Import</label>
              <div className="flex gap-2">
                <select className="text-black" onChange={(e) => setSelectedImportLevel(Number(e.currentTarget.value))} value={selectedImportLevel} name="import" id="import">
                  {defaultLevels.map((level, index) => (
                    <option key={level.name} value={index}>
                      {level.name}
                    </option>
                  ))}
                </select>
                <button className="px-2 disabled:bg-gray-500 rounded-md bg-white text-black border-solid border-2 cursor-pointer" onClick={() => importLevel()}>
                  Import {levelsData[selectedImportLevel].name}
                </button>
              </div>
              <label htmlFor="import">Export</label>
              <div className="flex gap-2 ">
                <button
                  disabled={!platforms.length || !components.length || uploading}
                  className="px-2 disabled:bg-gray-500 rounded-md bg-green-800 text-white border-solid border-2 cursor-pointer"
                  onClick={() => exportLevel('library')}
                >
                  {uploading ? `Uploading...` : `Save level to library`}
                </button>
                <button
                  disabled={!platforms.length || !components.length}
                  className="px-2 disabled:bg-gray-500 rounded-md bg-green-800 text-white border-solid border-2 cursor-pointer"
                  onClick={() => exportLevel('clipboard')}
                >
                  Copy JSON
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {uploadError && <div className="text-red-500">{uploadError}</div>}
            {uploadSuccess && <div className="text-green-500">Level uploaded successfully</div>}
            <AuthInEditor />
          </div>
        </div>
      </div>
    </>
  );
};
