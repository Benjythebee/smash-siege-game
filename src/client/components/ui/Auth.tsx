import React from 'react';
import Mona from '../../libs/mona.js';
import { resetUser, setUser, useUserStore } from '../userStore.js';
import { motion } from 'framer-motion';
import { isMobile } from '../../libs/music/detectors/index.js';
import { useBreakpoints } from '../../libs/use-breakpoints.js';
import { Button } from './components/button/button.js';

const variants = {
  open: {
    x: 0
  },
  closed: {
    x: isMobile() ? 290 : 280
  }
};

export const Auth = () => {
  const { user } = useUserStore();
  const { isMaxSm } = useBreakpoints();
  const [email, setEmail] = React.useState('');
  const [showOTP, setShowOTP] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [showLogin, setShowLogin] = React.useState(false);
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (showOTP) {
      const { otp } = e.target as typeof e.target & {
        otp: { value: string };
      };

      const p = await Mona.OTP_Verify(email, otp.value);
      if (p.success) {
        const user = await Mona.getUser();
        if ('error' in user) {
          console.error(user.error);
        } else {
          setUser(user);
        }
      }
      return;
    }

    const { email: _email } = e.target as typeof e.target & {
      email: { value: string };
    };

    setEmail(_email.value);
    setLoading(true);
    await Mona.OTP_Generate(_email.value);
    setLoading(false);
    setShowOTP(true);
  };

  if (user) {
    return (
      <div className="flex justify-between items-center gap-1 p-2 rounded-md bg-white z-10 w-full">
        {isMaxSm && <img src="/images/mona-red.webp" alt="mona" className="w-8 h-8" />}
        <div className="flex grow flex-col gap-1">
          <span className="text-base font-bold  leading-3"> Logged in as {user.username} </span>
          <span className="text-sm">Select an item from your assets</span>
        </div>
        <Button
          onClick={() => {
            resetUser();
            Mona.logout();
          }}
          className="pointer-events-auto border-solid border-black border-2"
          text={'Logout'}
          theme="white"
          size="xsmall"
        />
      </div>
    );
  }

  return (
    <>
      <motion.form
        className="flex max-sm:flex-col gap-1 p-2 pointer-events-none select-none rounded-md bg-white"
        variants={variants}
        initial={'closed'}
        animate={showLogin ? 'open' : 'closed'}
        onSubmit={onSubmitForm}
      >
        <div
          className="flex flex-col gap-1 cursor-pointer pointer-events-auto max-sm:items-center"
          onClick={() => {
            setShowLogin(!showLogin);
          }}
        >
          {isMaxSm && <img src="/images/mona-red.webp" alt="mona" className="w-8 h-8" />}
          <span className="text-lg font-bold  leading-3 max-sm:text-xl"> Login to MONA</span>
          <span className="text-sm"> Use your own inventory as ammo! </span>
        </div>

        <div className="flex max-sm:flex-col max-sm:item-center gap-2">
          {!showOTP ? (
            <label htmlFor="email">
              Email:{' '}
              {loading ? (
                <div className="w-full">Loading...</div>
              ) : (
                <input key="email_" name="email" className="w-full pointer-events-auto" type="email" placeholder="Email@email.com" />
              )}
            </label>
          ) : (
            <label htmlFor="otp">
              OTP sent to your email
              <input key="otp_" name="otp" type="text" autoFocus className="w-full pointer-events-auto" placeholder="OTP" maxLength={6} />
            </label>
          )}
          <button className="px-2 bg-slate-200 rounded-md pointer-events-auto">Login</button>
        </div>
      </motion.form>
    </>
  );
};
