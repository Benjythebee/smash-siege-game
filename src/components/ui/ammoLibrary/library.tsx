import { Auth } from '../Auth';
import { Inventory } from '../Inventory';
import { MenuStatus, useGameStore } from '../../../store';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/button/button';

export const AmmoLibrary = () => {
  const [show, setShow] = useState(true);
  const menuStatus = useGameStore((state) => state.menuState);
  const isHidden = menuStatus !== MenuStatus.HIDDEN;

  return (
    <div className={`AmmoLibrary z-20 absolute bottom-0 right-0 overflow-hidden h-[20rem] w-[30rem] pointer-events-none select-none ${isHidden ? 'hidden' : ''}`}>
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
            <div className="absolute top-0 right-5 select-none">
              <Button onClick={() => setShow(!show)} className=" pointer-events-auto" text={show ? 'Hide' : 'View'} theme="white" size="xsmall" />
            </div>
            <Inventory />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
