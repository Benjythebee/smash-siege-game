import React from 'react';
import { useCustomLevelStore } from '../../../../../libs/customLevels/customLevel.context';
import { useSceneOutsideR3F } from '../../../../../scene.store';
import { useLevelBuilderStore } from '../../LevelBuilder';
import { ScreenshotManager } from '../../../../../libs/screenshotManager/screenshotManager';
import { useUserStore } from '../../../../userStore';
import cn from 'clsx';
import { JSONFileIcon } from '../../../icons/json.icon';
import { cleanLevel } from '../../editor/utils/cleanExportLevel';
const physicsDebug = import.meta.env.VITE_PHYSICS_DEBUG == 'true';

export const LevelBuilderExportSection = () => {
  const { platforms, components, importedId } = useLevelBuilderStore((state) => state);
  const [uploading, setUploading] = React.useState(false);
  const { scene, camera } = useSceneOutsideR3F((s) => ({ scene: s.scene, camera: s.camera }));
  const user = useUserStore((state) => state.user);
  const { uploadLevelToLibrary, uploadError, uploadSuccess } = useCustomLevelStore();

  const isUpdate = !!importedId;

  const toggleDebugPhysics = (x: boolean) => {
    if (!physicsDebug) return;
    useSceneOutsideR3F.setState({ debug: x });
  };

  const takeScreenShot = async (purpose: 'encoded' | 'download') => {
    if (!scene) {
      console.warn('No scene found');
      return;
    }
    if (!camera) {
      console.warn('No camera found');
      return;
    }
    toggleDebugPhysics(false);
    // Sleep for 4ms to allow the scene to update
    await new Promise((resolve) => setTimeout(resolve, 4));
    const c = new ScreenshotManager(scene);
    c.setCamera(camera);
    if (purpose == 'encoded') {
      const data = c.getImageData(256, 256);
      toggleDebugPhysics(true);
      return data;
    } else {
      c.saveScreenshot('my level', 512, 512);
      toggleDebugPhysics(true);
      return null;
    }
  };

  const exportLevel = async (option: 'library' | 'clipboard') => {
    const object = structuredClone(useLevelBuilderStore.getState());

    if (object.name == 'My level') {
      if (confirm("You haven't changed the name of the level. Do you want to continue?") == false) {
        return;
      }
    }
    const clean = cleanLevel(object);
    if (option == 'clipboard') {
      navigator.clipboard.writeText(JSON.stringify(clean));
      return;
    } else {
      // Take a screenshot

      setUploading(true);
      const imgData = await takeScreenShot('encoded');
      if (imgData) {
        clean.image_url = imgData;
      }
      await uploadLevelToLibrary(clean);
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2`}>
      <span className="font-bold">Export</span>
      {uploadError && <div className="text-red-500">{uploadError}</div>}
      {uploadSuccess && <div className="text-green-500">Level uploaded successfully</div>}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 ">
          <span className="max-w-60">Upload your level to the public and share it with others!</span>
          <button
            disabled={!platforms.length || !components.length || uploading || !user}
            className={cn('px-2 rounded-md bg-green-600 text-white  border-solid border-2 cursor-pointer disabled:cursor-auto disabled:bg-gray disabled:text-white/50 ')}
            onClick={() => exportLevel('library')}
          >
            {uploading ? `Uploading...` : !user ? `Login to upload level` : isUpdate ? `Update Level` : `Upload level to library`}
          </button>
        </div>
        <div className="flex gap-2">
          <span className="max-w-60">Directly copy the JSON of the level</span>
          <button
            disabled={!platforms.length || !components.length}
            className="px-2  text-green-600 cursor-pointer disabled:cursor-auto disabled:text-slate-500 hover:text-green-800"
            onClick={() => exportLevel('clipboard')}
          >
            <JSONFileIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
