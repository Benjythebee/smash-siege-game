import { Auth } from '../Auth.js';
import { Inventory } from '../Inventory.js';
import { MenuStatus } from '../../../store.js';
import { Button } from '../components/button/button.js';
import { MonaUser } from 'mona-js-sdk';
import { useLibraryMobileState } from './library.mobile.store.js';

export interface AmmoLibraryMobileProps {
  isHidden: boolean;
  loading: boolean;
  user: MonaUser | null;
  menuStatus: MenuStatus;
}

export const AmmoLibraryMobile = ({ isHidden, loading, user, menuStatus }: AmmoLibraryMobileProps) => {
  const { isOpen, setIsOpen } = useLibraryMobileState();

  if (!isOpen) {
    return (
      <div className={`AmmoLibrary z-20 absolute bottom-0 right-0 overflow-hidden pointer-events-none select-none ${loading ? 'opacity-10' : ''} ${isHidden ? 'hidden' : ''}`}>
        <div className="flex gap-1 p-2 pointer-events-none select-none  ">
          <div
            className="flex flex-col gap-1 cursor-pointer pointer-events-auto rounded-md bg-white p-2"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <img src="/images/mona-red.webp" alt="mona" className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`AmmoLibrary w-[90%] h-[70%] absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-black border-solid bg-white ${loading ? 'opacity-10' : ''} ${isHidden ? 'hidden' : ''}`}
    >
      <div className="absolute -top-10 right-0">
        <Button onClick={() => setIsOpen(false)} className="pointer-events-auto" text="Close" theme="white" size="xsmall" />
      </div>

      <div className="flex flex-col w-full max-sm:h-full max-sm:overflow-hidden">
        <Auth />
        <Inventory />
      </div>
    </div>
  );
};
