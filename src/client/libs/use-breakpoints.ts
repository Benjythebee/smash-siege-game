import { useEffect } from 'react';
import { createStore, useStore } from 'zustand';
import { getScreen, ScreenValue, ScreenValueMax } from './get-screen.js';

const cleanNormalBreakpoints = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  '2xl': false
};

const cleanMaxBreakpoints = {
  'max-sm': false,
  'max-md': false,
  'max-lg': false,
  'max-xl': false,
  'max-2xl': false
};

const store = createStore<{
  breakpoints: typeof cleanNormalBreakpoints & typeof cleanMaxBreakpoints;
  _listeners: [MediaQueryList, () => void][];
  _isInit: boolean;
  _init: () => void;
}>((set, get) => ({
  breakpoints: {
    ...cleanNormalBreakpoints,
    ...cleanMaxBreakpoints
  },
  _listeners: [],
  _isInit: false,
  _init: () => {
    if (get()._isInit) return; // already initialized
    set(() => ({ _isInit: true }));
    for (const key of ScreenValueMax) {
      const mediaQueryList = window.matchMedia(getScreen(key));

      const updateState = () => {
        set((prev) => ({
          breakpoints: { ...prev.breakpoints, ...{ [key]: mediaQueryList.matches } }
        }));
      };
      updateState();
      mediaQueryList.addEventListener('change', updateState);
      set((prev) => ({ _listeners: [...prev._listeners, [mediaQueryList, updateState]] }));
    }

    for (const key of ['xs', ...ScreenValue]) {
      const mediaQueryList = window.matchMedia(getScreen(key as ScreenValue));
      const updateState = () => {
        set((prev) => ({
          breakpoints: {
            ...prev.breakpoints,
            // the tailwindcss media queries will return true for all of the smaller breakpoints if the screen is large;
            // for the sake of easy usage, we will set the smaller breakpoints to false if the larger breakpoint is true

            ...(mediaQueryList.matches ? cleanNormalBreakpoints : {}),
            ...{ [key]: mediaQueryList.matches }
          }
        }));
      };
      updateState();
      mediaQueryList.addEventListener('change', updateState);
      set((prev) => ({ _listeners: [...prev._listeners, [mediaQueryList, updateState]] }));
    }
  }
}));

export const useBreakpoints = () => {
  const { breakpoints, _init } = useStore(store);

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }
    _init();
  }, []);

  return {
    isXs: breakpoints.xs,
    isSm: breakpoints.sm,
    isMaxSm: breakpoints['max-sm'],
    isMd: breakpoints.md,
    isMaxMd: breakpoints['max-md'],
    isLg: breakpoints.lg,
    isMaxLg: breakpoints['max-lg'],
    isXl: breakpoints.xl,
    isMaxXl: breakpoints['max-xl'],
    is2xl: breakpoints['2xl'],
    isMax2xl: breakpoints['max-2xl']
  };
};
