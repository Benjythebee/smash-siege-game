import { MenuStatus, useGameStore } from '../../../../store';
import { ArrowKeys } from './arrowKeys';

export const UserInputIndicator = () => {
  const menuState = useGameStore((state) => state.menuState);
  const isVisible = menuState == MenuStatus.HIDDEN;
  return (
    <div className="absolute  z-[21] pointer-events-none bottom-32 left-1/2 -translate-x-1/2">
      <ArrowKeys className={`h-[120px] ${!isVisible ? 'hidden' : ''}`} />
    </div>
  );
};
