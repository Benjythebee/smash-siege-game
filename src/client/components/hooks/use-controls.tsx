import { useEffect, useState } from 'react';
import { isMobile } from '../../libs/music/detectors/index.js';
import { onTouchXRotate } from '../../observables.js';
import { Observer } from '../../libs/observable.js';

export const useArrowKeys = () => {
  const [arrowDown, setArrowDown] = useState({
    left: false,
    right: false,
    up: false,
    down: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setArrowDown((prev) => ({ ...prev, left: true }));
      }
      if (e.key === 'ArrowRight') {
        setArrowDown((prev) => ({ ...prev, right: true }));
      }
      if (e.key === 'ArrowUp') {
        setArrowDown((prev) => ({ ...prev, up: true }));
      }
      if (e.key === 'ArrowDown') {
        setArrowDown((prev) => ({ ...prev, down: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setArrowDown((prev) => ({ ...prev, left: false }));
      }
      if (e.key === 'ArrowRight') {
        setArrowDown((prev) => ({ ...prev, right: false }));
      }
      if (e.key === 'ArrowUp') {
        setArrowDown((prev) => ({ ...prev, up: false }));
      }
      if (e.key === 'ArrowDown') {
        setArrowDown((prev) => ({ ...prev, down: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    let touchObserver: Observer<'right' | 'left' | null> | null = null;
    if (isMobile()) {
      const onXRotate = (direction: 'right' | 'left' | null) => {
        console.log('onXRotate', direction);
        if (!direction) {
          const fakeKeyboardEvent1 = new KeyboardEvent('keyup', {
            key: 'ArrowRight'
          });
          const fakeKeyboardEvent2 = new KeyboardEvent('keyup', {
            key: 'ArrowLeft'
          });
          handleKeyUp(fakeKeyboardEvent1);
          handleKeyUp(fakeKeyboardEvent2);
          return;
        }
        const fakeKeyboardEvent = new KeyboardEvent('keydown', {
          key: direction === 'right' ? 'ArrowRight' : 'ArrowLeft'
        });
        handleKeyDown(fakeKeyboardEvent);
      };

      touchObserver = onTouchXRotate.add(onXRotate);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      touchObserver && onTouchXRotate.remove(touchObserver);
    };
  }, []);

  return arrowDown;
};
