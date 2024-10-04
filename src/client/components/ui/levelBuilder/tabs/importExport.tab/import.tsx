import React from 'react';
import { LevelData } from '../../../../../../common/types';
import { levelsData } from '../../../../../libs/levels';
import { useLevelBuilderStore } from '../../LevelBuilder';
import { useEditorStore } from '../../editor/Editor.store';
import { defaultEnvironmentProps, defaultFeatureProps, defaultPlatformProps } from '../../../../../libs/levels/types';
import { useFetchCustomLevelsByAuthor } from '../../../../../requests/get-levels-by-author';
import { convertLevelTypeToLevelData } from '../../../../../../common/convert';
import { useUserStore } from '../../../../userStore';
import type { LevelBuilderTabTypes } from '../tabs';

export const LevelBuilderImportSection = ({ setTab }: { setTab: (x: LevelBuilderTabTypes) => void }) => {
  const importLevel = (level: LevelData & { importedId?: number }) => {
    const levelData = structuredClone(level);
    // add default values to properties
    levelData.platforms = levelData.platforms.map((plat) => defaultPlatformProps(plat));
    levelData.environment = (levelData.environment || []).map((env) => defaultEnvironmentProps(env));
    levelData.components = (levelData.components || []).map((comp) => defaultFeatureProps(comp));
    useEditorStore.setState({ selectedPlatformOrEnvironment: null, selectedItem: null });
    useLevelBuilderStore.setState(levelData);
    setTab('content');
  };

  return (
    <div className={`flex flex-col gap-1`}>
      <ImportDefaultLevel importLevel={importLevel} />
      <ImportAuthoredLevel importLevel={importLevel} />
    </div>
  );
};

const ImportDefaultLevel = ({ importLevel }: { importLevel: (x: LevelData) => void }) => {
  const [selectedDefaultLevel, setSelectedDefaultLevel] = React.useState<number>(0);
  const defaultLevels = Object.entries(levelsData)
    .filter(([key]) => !isNaN(parseInt(key)))
    .map(([, value]) => value) as LevelData[];

  return (
    <>
      <span className="font-bold">Import Default Level</span>
      <div className="flex gap-2">
        <select className="text-black" onChange={(e) => setSelectedDefaultLevel(Number(e.currentTarget.value))} value={selectedDefaultLevel} name="import" id="import">
          {defaultLevels.map((level, index) => (
            <option key={level.name} value={index}>
              {level.name}
            </option>
          ))}
        </select>
        <button
          className="px-2 disabled:bg-gray-500 rounded-md bg-white text-black border-solid border-2 cursor-pointer"
          onClick={() => importLevel(levelsData[selectedDefaultLevel])}
        >
          Import {levelsData[selectedDefaultLevel].name}
        </button>
      </div>
    </>
  );
};

const ImportAuthoredLevel = ({ importLevel }: { importLevel: (x: LevelData) => void }) => {
  const [selectedDefaultLevel, setSelectedDefaultLevel] = React.useState<number>(0);
  const user = useUserStore((s) => s.user);
  const { data, isLoading } = useFetchCustomLevelsByAuthor(user?.username || undefined);

  const customLevels = data?.levels || [];

  const selectedLevel = customLevels.find((t) => t.id === selectedDefaultLevel);

  const converted = selectedLevel ? { ...convertLevelTypeToLevelData(selectedLevel), importedId: selectedLevel.id } : null;
  return (
    <>
      <span className="font-bold">Import Authored Level</span>
      <div className="flex gap-2">
        {user && isLoading && <div>Loading...</div>}
        {!isLoading && (
          <select className="text-black" onChange={(e) => setSelectedDefaultLevel(Number(e.currentTarget.value))} value={selectedDefaultLevel} name="import" id="import">
            <option value={0}>{!user ? `Login to load your levels` : `Select`}</option>
            {customLevels.map((level, index) => (
              <option key={level.name} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        )}
        {selectedLevel && (
          <button className="px-2 disabled:bg-gray-500 rounded-md bg-white text-black border-solid border-2 cursor-pointer" onClick={() => importLevel(converted!)}>
            Import {selectedLevel.name}
          </button>
        )}
      </div>
    </>
  );
};
