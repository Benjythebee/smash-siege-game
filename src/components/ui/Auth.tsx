import React from 'react';
import Mona from '../../libs/mona';
import { resetUser, setUser, useUserStore } from '../userStore';
import { motion } from 'framer-motion';
import { isMobile } from '../../libs/music/detectors';

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
      <div className="flex gap-1 p-2 rounded-md bg-white z-10">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold  leading-3"> Logged in as {user.username} </span>
          <span className="text-sm">Select an item from your assets</span>
        </div>
        <button
          className="py-1 px-2 border-black bg-white hover:bg-white/50 border-solid border-2 rounded-md pointer-events-auto"
          onClick={() => {
            resetUser();
            Mona.logout();
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.form
        className="flex gap-1 p-2 pointer-events-none select-none rounded-md bg-white"
        variants={variants}
        initial={'closed'}
        animate={showLogin ? 'open' : 'closed'}
        onSubmit={onSubmitForm}
      >
        <div
          className="flex flex-col gap-1 cursor-pointer pointer-events-auto"
          onClick={() => {
            setShowLogin(!showLogin);
          }}
        >
          <span className="text-lg font-bold  leading-3"> Login to Mona </span>
          <span className="text-sm"> Use your own inventory as ammo! </span>
        </div>

        <div className="flex gap-2">
          {!showOTP ? (
            <label htmlFor="email">
              Email:{' '}
              {loading ? <div className="w-full">Loading...</div> : <input key="email_" name="email" className="w-full pointer-events-auto" type="email" placeholder="Email" />}
            </label>
          ) : (
            <label htmlFor="otp">
              OTP sent to your email
              <input key="otp_" name="otp" type="text" className="w-full pointer-events-auto" placeholder="OTP" maxLength={6} />
            </label>
          )}
          <button className="px-2 bg-slate-200 rounded-md pointer-events-auto">Login</button>
        </div>
      </motion.form>
    </>
  );
};
