import { useState } from 'react';
import { levelsData } from '../../../libs/levels.js';
import { MenuStatus, resetLevel, useGameStore } from '../../../store.js';
import { Button } from './button/button.js';
import { LevelTabs } from './levels/tabs.js';
import { DefaultLevels } from './levels/defaultLevelGrids.js';
import { CustomLevels } from './levels/customLevelsGrid.js';

export const GridLevels = () => {
  const scoreByLevel = useGameStore((state) => state.scoreByLevel);
  const [tab, setTab] = useState<'custom' | 'default'>('default');

  const setMenuTab = () => {
    useGameStore.setState({ menuState: MenuStatus.MAIN_MENU });
  };

  const onClickLevel = (level: number) => {
    resetLevel(level);
  };

  return (
    <div className="h-full ">
      <Button text="Back" theme="white" size="small" onClick={setMenuTab} />
      <LevelTabs tab={tab} setTab={setTab} />
      <div className="scrollArea overflow-y-auto overflow-x-hidden min-h-[60vh] max-md:min-h-[80vh] max-h-80">
        {tab === 'default' && <DefaultLevels scoreByLevel={scoreByLevel} levelsData={levelsData} onClickLevel={onClickLevel} />}
        {tab === 'custom' && <CustomLevels onClickLevel={onClickLevel} />}
      </div>
    </div>
  );
};
