import React, { useEffect, useState } from 'react';
import { setInventory, useUserStore } from '../userStore';
import Mona from '../../libs/mona';
import { AmmoLibraryCards } from './ammoLibrary/cards';
import { LoadingIcon } from './icons/loader';

export const Inventory = () => {
  const { user, inventory } = useUserStore();
  const [loading, setLoading] = useState(true);

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
      loadInventory();
    }
  }, [user]);

  if (!user) return <div className="h-full select-none"></div>;

  return (
    <div className="h-full w-full select-none">
      {loading ? (
        <div className="relative w-full h-full pointer-events-none">
          <div className="absolute text-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <LoadingIcon className="" width={60} height={60} />
          </div>
        </div>
      ) : inventory.length == 0 ? (
        <div className="relative w-full h-full select-none pointer-events-none">
          <div className="absolute text-white bottom-5">
            <span className="font-bold">No Assets found.</span>
          </div>
        </div>
      ) : (
        <AmmoLibraryCards items={inventory} />
      )}
    </div>
  );
};
