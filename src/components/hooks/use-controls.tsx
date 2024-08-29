import { useEffect, useState } from 'react';

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return arrowDown;
};
