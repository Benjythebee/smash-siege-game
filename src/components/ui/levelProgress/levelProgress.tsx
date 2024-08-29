import { MenuStatus, useGameStore, useSlingShotStore } from '../../../store';
import { AnimatedNumber } from '../components/AnimatedNumber';

export const LevelProgressDetails = () => {
  const { level, score, menuState } = useGameStore();

  const ammoLoadout = useSlingShotStore((state) => state.ammoLoadout);
  const currentAmmoIndex = useSlingShotStore((state) => state.currentAmmoIndex);

  const isVisible = menuState == MenuStatus.HIDDEN;

  return (
    <>
      <div className={`LevelProgress absolute z-20 pointer-events-none top-0 right-0 h-12  ${!isVisible ? 'hidden' : ''}  `}>
        <div className="RightSide pointer-events-none select-none flex items-center h-full">
          <div className="relative bg-slate-400/20 border-x-2 border-solid border-black px-2 flex h-full gap-4 items-end pb-[2px]">
            <div className="absolute top-1 left-1 text-sm font-bold">Ammo:</div>
            {ammoLoadout.map((_, i) => (
              <div key={i} className={`w-4 h-4 border-black border-2 rounded-full ${currentAmmoIndex > i ? `bg-white border-solid` : `bg-black`}`}></div>
            ))}
          </div>
          <div className="bg-slate-400/20 px-2 h-full">
            <div className="text-4xl font-bold text-center "> Level {level} </div>
          </div>
          <div className="bg-slate-400/20 border-l-2 border-solid border-black px-2 h-full">
            <div className="text-green text-4xl font-bold pr-5">{score ? <AnimatedNumber value={score} /> : '-'} Pts </div>
          </div>
        </div>
      </div>
    </>
  );
};
