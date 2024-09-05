import { MenuStatus, useGameStore } from '../../../../store';
import { ArrowKeys } from './arrowKeys';
import { TouchXControls } from './touchControls';

export const UserInputIndicator = () => {
  const menuState = useGameStore((state) => state.menuState);
  const isVisible = menuState == MenuStatus.HIDDEN;
  return (
    <div className="absolute  z-[21] max-sm:w-full pointer-events-none bottom-32 left-1/2 -translate-x-1/2">
      <ArrowKeys className={`max-sm:hidden h-[120px] ${!isVisible ? 'hidden' : ''}`} />
      <TouchXControls className={`hidden  ${!isVisible ? 'hidden' : 'max-sm:flex'}`} />
    </div>
  );
};
