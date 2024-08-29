import { MenuStatus, resetLevel, useGameStore } from '../../../store';

export const Footer = () => {
  const { menuState } = useGameStore();

  const isVisible = menuState == MenuStatus.HIDDEN;

  const resetCurrentLevel = () => {
    resetLevel();
  };
  return (
    <>
      <div className={`absolute z-20 pointer-events-none bottom-5 ${!isVisible ? 'hidden' : ''} flex w-full justify-between gap-2 px-4 `}>
        <div className="LeftSide flex gap-2 select-none items-center">
          <button
            className="text-4xl pointer-events-auto font-bold text-center hover:text-black/80 cursor-pointer"
            onClick={() => useGameStore.setState({ menuState: MenuStatus.MAIN_MENU })}
          >
            Menu |
          </button>

          <button className="text-4xl pointer-events-auto font-bold text-center hover:text-black/80 cursor-pointer" onClick={() => resetCurrentLevel()}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
};
