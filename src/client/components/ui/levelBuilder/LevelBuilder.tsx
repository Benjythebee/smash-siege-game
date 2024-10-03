import { useEffect } from 'react';
import { create } from 'zustand';

import { clearLevel, endGame, MenuStatus, useGameStore } from '../../../store.js';

import { useEditorStore } from './editor/Editor.store.js';
import React from 'react';
import { Button } from '../components/button/button.js';
import { LevelData } from '../../../../common/types.js';
import { emptyLevel } from './utils.js';
import { LevelBuilderTabs, LevelBuilderTabTypes } from './tabs/tabs.js';
import { LevelBuilderInfoTab } from './tabs/content.tab.js';
import { LevelBuilderImportExportTab } from './tabs/exportImport.tab.js';

export const useLevelBuilderStore = create<LevelData & { importedId?: number }>()(() => structuredClone(emptyLevel));

export const LevelBuilder = () => {
  const { menuState } = useGameStore();
  const [tab, setTab] = React.useState<LevelBuilderTabTypes>('content');

  const isHidden = menuState == MenuStatus.LEVEL_BUILDER;

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

  return (
    <>
      <Button className={`absolute top-5 left-5 ${isHidden ? '' : 'hidden'}`} text="Back" theme="white" size="big" onClick={leaveBuilder} />

      <div className={`LevelBuilder absolute z-10 bottom-0 left-0 w-full bg-transparent text-white ${isHidden ? '' : 'hidden'}`}>
        <LevelBuilderTabs tab={tab} setTab={setTab} />
        {tab == 'content' ? <LevelBuilderInfoTab /> : tab == 'import & export' ? <LevelBuilderImportExportTab setTab={setTab} /> : null}
      </div>
    </>
  );
};
