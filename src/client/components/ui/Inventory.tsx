import React, { useEffect, useState } from 'react';
import { setInventory, useUserStore } from '../userStore.js';
import Mona from '../../libs/mona.js';
import { AmmoLibraryCards } from './ammoLibrary/cards.js';
import { LoadingIcon } from './icons/loader.js';
import { useBreakpoints } from '../../libs/use-breakpoints.js';
import { CardsMobile } from './ammoLibrary/cards.mobile.js';

export const Inventory = () => {
  const { user, inventory } = useUserStore();
  const [loading, setLoading] = useState(false);
  const { isMaxSm } = useBreakpoints();
  const loadInventory = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const inventory = await Mona.getTokens({ chain_id: 1, address: user.wallets[0] });
    const baseInventory = await Mona.getTokens({ chain_id: 8453, address: user.wallets[0] });
    if (inventory.tokens.length > 0) {
      setInventory([...inventory.tokens, ...baseInventory.tokens]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      if (!inventory.length) {
        loadInventory();
      }
    }
  }, [user, inventory]);

  if (!user) return <div className="h-full select-none"></div>;

  if (loading) {
    return (
      <div className="relative w-full h-full pointer-events-none max-sm:flex max-sm:justify-center">
        <div className="md:absolute  md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 text-white max-sm:text-black  ">
          <LoadingIcon className="" width={60} height={60} />
        </div>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="relative w-full h-full select-none pointer-events-none  max-sm:flex max-sm:justify-center">
        <div className="md:absolute md:bottom-5 text-white max-sm:text-black ">
          <span className="font-bold">No Assets found.</span>
        </div>
      </div>
    );
  }

  if (isMaxSm) {
    return <CardsMobile items={inventory} />;
  }

  return <AmmoLibraryCards items={inventory} />;
};
