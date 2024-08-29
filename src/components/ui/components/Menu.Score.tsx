import { useEffect, useState } from 'react';
import { endGame, MenuStatus, resetLevel, useGameStore, useSlingShotStore } from '../../../store';

import { AnimatedNumber } from './AnimatedNumber';
import { levelsData } from '../../../libs/levels';
import { scoreToGrade } from '../../../libs/score';
import { Button } from './button/button';

export const LevelScore = () => {
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  const { currentAmmoIndex } = useSlingShotStore();

  const [showNext, setShowNext] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [showGrade, setShowGrade] = useState(false);

  const currentLevel = levelsData[level].name;

  const isLastLevel = level === levelsData.length - 1;
  const ammoUsed = currentAmmoIndex + 1;
  const retryLevel = () => {
    resetLevel();
  };

  const nextLevel = () => {
    if (isLastLevel) {
      return endGame();
    }
    const nextLevel = level + 1;
    resetLevel(nextLevel);
  };
  const grade = scoreToGrade(score, ammoUsed, level);

  const onAnimatedFinished = () => {
    setShowGrade(true);
    setShowRetry(true);
    if (grade !== 'F') {
      // Only show next level if the grade is not F
      setShowNext(true);
    }
  };

  const showCredits = () => {
    useGameStore.setState({ menuState: MenuStatus.CREDITS, prevMenuState: MenuStatus.SCORE });
  };

  return (
    <div className="h-full flex flex-col text-center gap-4">
      <div className="text-4xl font-bold mb-6 ">{currentLevel}</div>

      <div className=" justify-between text-center text-2xl flex items-center gap-2 ">
        Ammunition used:{' '}
        <div className="text-yellow text-6xl">
          <AnimatedNumber animateOnMount value={ammoUsed} onAnimationComplete={onAnimatedFinished} />
        </div>{' '}
      </div>

      <div className=" justify-between text-center text-2xl flex items-center gap-2 ">
        Score:{' '}
        <div className="text-yellow text-6xl">
          <AnimatedNumber animateOnMount value={score} onAnimationComplete={onAnimatedFinished} />
        </div>{' '}
      </div>

      <div className=" justify-between text-center text-2xl flex items-center gap-2 ">
        Grade: <div className="text-yellow font-bold text-8xl">{!!showGrade ? grade : '-'}</div>{' '}
      </div>

      <div className="grow flex flex-col gap-2">
        {showNext && !isLastLevel && <Button theme="blue" size="big" text="Next Level" onClick={nextLevel} />}
        {showRetry && <Button theme="green" size="big" text="Retry" onClick={retryLevel} />}
        {showNext && isLastLevel && <Button theme="red" size="big" text="Game Over - Menu" onClick={endGame} />}
        {isLastLevel && <Button theme="blue" size="big" text="Credits" onClick={showCredits} />}
      </div>
    </div>
  );
};
