import { MenuStatus, useGameStore } from '../../store.js';
import { MenuCredits } from './components/Menu.Credits.js';
import { GridLevels } from './components/Menu.GridLevels.js';
import { MenuPlayTab } from './components/Menu.play.js';
import { LevelScore } from './components/Menu.Score.js';

export const Menu = () => {
  const { menuState } = useGameStore();
  const isHidden = menuState == MenuStatus.HIDDEN || menuState == MenuStatus.LEVEL_BUILDER;
  return (
    <>
      <div className={`absolute z-[19] w-full h-full bg-white/10 blur-sm ${isHidden ? 'hidden' : ''}`}></div>
      <div className={`absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-black border-solid ${isHidden ? 'hidden' : ''}`}>
        <div className="relative h-full md:w-[50vw] lg:w-[40vw] max-md:w-[80vw] py-5 px-10 bg-black text-white">
          {menuState == MenuStatus.MAIN_MENU ? (
            <MenuPlayTab />
          ) : menuState == MenuStatus.LEVELS ? (
            <GridLevels />
          ) : menuState == MenuStatus.SCORE ? (
            <LevelScore />
          ) : menuState == MenuStatus.CREDITS ? (
            <MenuCredits />
          ) : null}
        </div>
      </div>
    </>
  );
};
