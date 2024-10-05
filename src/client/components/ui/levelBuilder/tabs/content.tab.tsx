import { EnvironmentFeatureProp, LevelPlatformProp } from '../../../../../common/types';
import cn from 'clsx';
import { defaultEnvironmentProps, defaultPlatformProps } from '../../../../libs/levels/types';
import { useEditorStore } from '../editor/Editor.store';
import { useLevelBuilderStore } from '../LevelBuilder';
import { loadTestLevel } from '../testLevel';
import { addEnvironment, addPlatform, removeEnvironment, removePlatform } from '../utils';
import { useState } from 'react';

export const LevelBuilderInfoTab = () => {
  const { name, totalAmmo, environment, platforms, components } = useLevelBuilderStore((state) => state);

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

  return (
    <div className={`LevelBuilderTabs min-h-[11rem] bg-dark/80 p-2 text-alice-blue`}>
      <div className="flex gap-4">
        {/** Level details */}
        <div className={`flex flex-col gap-2 w-1/8`}>
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
        <div className={`flex flex-col gap-2 w-1/4`}>
          <span className="font-bold">Level Platforms</span>
          <div className="grid grid-cols-3 gap-2">
            <button className="rounded-md hover: border-black border-solid border-2" onClick={() => add('platform')}>
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
        <div className={`flex flex-col gap-2 w-1/4`}>
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
        {/* Test level button*/}
        <div className={`flex flex-col gap-2 w-1/5`}>
          <span className="font-bold">Test Level</span>
          <TestLevelButton />
        </div>
      </div>
    </div>
  );
};

const TestLevelButton = () => {
  const [error, setError] = useState<string | null>(null);

  const test = () => {
    setError(null);
    try {
      loadTestLevel();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <>
      {error ? <div className="text-red-500">{error}</div> : null}
      <button
        className={cn('px-2 rounded-md bg-green-600 text-white  border-solid border-2 cursor-pointer disabled:cursor-auto disabled:bg-gray disabled:text-white/50 ')}
        onClick={test}
      >
        Test Level
      </button>
    </>
  );
};
