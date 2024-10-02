import { MenuStatus, useGameStore } from '../../../../store.js';
import { useLibraryMobileState } from '../../ammoLibrary/library.mobile.store.js';
import { ArrowKeys } from './arrowKeys.js';
import { TouchXControls } from './touchControls.js';

export const UserInputIndicator = () => {
  const menuState = useGameStore((state) => state.menuState);
  const isMobileMonaLibraryOpen = useLibraryMobileState((s) => s.isOpen);
  const isVisible = menuState == MenuStatus.HIDDEN && !isMobileMonaLibraryOpen;
  return (
    <div className="absolute  z-[21] max-sm:w-full pointer-events-none bottom-32 left-1/2 -translate-x-1/2">
      <ArrowKeys className={`max-sm:hidden h-[120px] ${!isVisible ? 'hidden' : ''}`} />
      <TouchXControls className={`hidden  ${!isVisible ? 'hidden' : 'max-sm:flex'}`} />
    </div>
  );
};
