import { MenuStatus, resetLevel, useGameStore } from '../../../store.js';
import { useLibraryMobileState } from '../ammoLibrary/library.mobile.store.js';
import { Button } from '../components/button/button.js';
import { useSlingshot } from '../hooks/use-slingshot.js';

export const Footer = () => {
  const { menuState } = useGameStore();
  const { loading } = useSlingshot();
  const isMobileMonaLibraryOpen = useLibraryMobileState((s) => s.isOpen);
  const isVisible = menuState == MenuStatus.HIDDEN && !isMobileMonaLibraryOpen;

  const resetCurrentLevel = () => {
    resetLevel();
  };
  return (
    <>
      <div
        className={`absolute z-20 pointer-events-none max-sm:bottom-2 bottom-5 ${loading ? 'opacity-10' : ''} ${!isVisible ? 'hidden' : ''} flex w-full justify-between gap-2 px-2 `}
      >
        <div className="LeftSide flex gap-2 select-none items-center">
          <Button className="pointer-events-auto" text="Menu" theme="white" size="small" onClick={() => useGameStore.setState({ menuState: MenuStatus.MAIN_MENU })} />
          <Button className="pointer-events-auto" text="Reset" theme="white" size="small" onClick={() => resetCurrentLevel()} />
        </div>
      </div>
    </>
  );
};
