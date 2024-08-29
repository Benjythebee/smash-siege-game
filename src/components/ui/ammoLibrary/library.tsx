import { Auth } from '../Auth';
import { Inventory } from '../Inventory';
import { MenuStatus, useGameStore } from '../../../store';

export const AmmoLibrary = () => {
  const menuStatus = useGameStore((state) => state.menuState);
  const isHidden = menuStatus !== MenuStatus.HIDDEN;

  return (
    <div className={`AmmoLibrary z-20 absolute bottom-0 right-0 overflow-hidden h-[20rem] w-[30rem] ${isHidden ? 'hidden' : ''}`}>
      <div className="flex flex-col h-full w-full">
        <Inventory />

        <Auth />
      </div>
    </div>
  );
};
