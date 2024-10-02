import { useCustomLevelStoreWithSelector } from '../../../libs/customLevels/customLevel.context.js';
import { MenuStatus, useGameStore, useSlingShotStore } from '../../../store.js';
import { AnimatedNumber } from '../components/AnimatedNumber.js';

export const LevelProgressDetails = () => {
  const { level, score, menuState } = useGameStore();
  const loadedCustomLevel = useCustomLevelStoreWithSelector((s) => s.loadedCustomLevel);
  const ammoLoadout = useSlingShotStore((state) => state.ammoLoadout);
  const currentAmmoIndex = useSlingShotStore((state) => state.currentAmmoIndex);

  const isVisible = menuState == MenuStatus.HIDDEN;

  const levelName = loadedCustomLevel ? loadedCustomLevel.name : `Level ${level}`;

  return (
    <>
      <div className={`LevelProgress absolute z-20 pointer-events-none top-0 right-0 max-sm:w-full h-12  ${!isVisible ? 'hidden' : ''}  `}>
        <div className="RightSide bg-slate-400/20 pointer-events-none select-none flex items-center h-full justify-between">
          <div className="relative  border-x-2 border-solid border-black px-2 flex h-full gap-4 items-end pb-[2px] min-w-20">
            <div className="absolute top-1 left-1 text-sm font-bold">Ammo:</div>
            {ammoLoadout.map((_, i) => (
              <div key={i} className={`w-4 h-4 border-black border-2 rounded-full ${currentAmmoIndex > i ? `bg-white border-solid` : `bg-black`}`}></div>
            ))}
          </div>
          <div className=" px-2 h-full">
            <div className="text-4xl font-bold text-center "> {levelName} </div>
          </div>
          <div className=" border-l-2 border-solid border-black px-2 h-full">
            <div className="text-green max-sm:text-xl max-sm:flex max-sm:flex-col text-4xl font-bold pr-5">
              {score ? <AnimatedNumber className="max-md:text-base" value={score} /> : '-'} Pts{' '}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
