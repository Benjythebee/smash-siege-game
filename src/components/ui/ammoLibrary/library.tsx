import { Auth } from '../Auth';
import { Inventory } from '../Inventory';
import { MenuStatus, useGameStore } from '../../../store';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/button/button';
import { useUserStore } from '../../userStore';
import { useSlingshot } from '../hooks/use-slingshot';
import { useBreakpoints } from '../../../libs/use-breakpoints';
import { AmmoLibraryMobile } from './library.mobile';

export const AmmoLibrary = () => {
  const user = useUserStore((s) => s.user);
  const [show, setShow] = useState(true);
  const { loading } = useSlingshot();
  const menuStatus = useGameStore((state) => state.menuState);
  const { isMaxSm } = useBreakpoints();
  const isHidden = menuStatus !== MenuStatus.HIDDEN;

  if (isMaxSm) {
    const mobileProps = {
      isHidden,
      loading,
      user,
      menuStatus
    };
    return <AmmoLibraryMobile {...mobileProps} />;
  }

  return (
    <div
      className={`AmmoLibrary z-20 absolute bottom-0 right-0 overflow-hidden h-[20rem] w-[30rem] pointer-events-none select-none ${loading ? 'opacity-10' : ''} ${isHidden ? 'hidden' : ''}`}
    >
      <div className="relative h-full w-full">
        <div className={`flex flex-col-reverse h-full w-full`}>
          <Auth />
          <motion.div
            initial={{ y: 0, zIndex: 10 }}
            className="overflow-hidden h-full"
            animate={
              show
                ? {
                    y: 0,
                    zIndex: 10
                  }
                : { y: 230, zIndex: 0 }
            }
          >
            <div className={`absolute top-0 right-5 select-none ${user ? '' : 'hidden'}`}>
              <Button onClick={() => setShow(!show)} className=" pointer-events-auto" text={show ? 'Hide' : 'View'} theme="white" size="xsmall" />
            </div>
            <Inventory />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
