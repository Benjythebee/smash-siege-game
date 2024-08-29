'use client';

import React, { useEffect } from 'react';

import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps extends React.ComponentPropsWithoutRef<typeof motion.span> {
  value: number;
  /**
   * Whether to animate the number when the component mounts.
   */
  animateOnMount?: boolean;
  /**
   * Stiffness of the spring animation. Default is 75.
   */
  stiffness?: number;
  /**
   * on animation complete callback
   */
  onAnimationComplete?: () => void;
}

export const AnimatedNumber = (props: AnimatedNumberProps) => {
  const { value, animateOnMount, onAnimationComplete, stiffness = 75, className, ...rest } = props;

  const spring = useSpring(animateOnMount ? 0 : value, { mass: 0.8, stiffness, damping: 15 });

  const display = useTransform(spring, (current) => Math.max(Math.round(current), 0).toLocaleString());

  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  React.useEffect(() => {
    spring.on('change', (v) => {
      if (Number(v) >= value) {
        onAnimationComplete?.();
        spring.clearListeners();
      }
    });
    return () => {
      spring.clearListeners();
    };
  }, []);

  useEffect(() => {
    if (value == 0) {
      // if Value is 0, onAnimationComplete?.() will never fire; so we need to call it manually
      setTimeout(() => {
        onAnimationComplete?.();
      }, 500);
    }
  }, [value]);

  return (
    <motion.span className={className} {...rest}>
      {display}
    </motion.span>
  );
};
