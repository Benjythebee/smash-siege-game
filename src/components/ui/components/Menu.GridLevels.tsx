import { levelsData } from '../../../libs/levels';
import { gradeToColor, scoreToGrade } from '../../../libs/score';
import { MenuStatus, resetLevel, resumeGame, useGameStore } from '../../../store';
import { Button } from './button/button';

export const GridLevels = () => {
  const scoreByLevel = useGameStore((state) => state.scoreByLevel);
  const setMenuTab = () => {
    useGameStore.setState({ menuState: MenuStatus.MAIN_MENU });
  };

  const onClickLevel = (level: number) => {
    resetLevel(level);
  };

  return (
    <div className="h-full ">
      <Button text="Back" theme="white" size="small" onClick={setMenuTab} />
      <div className="scrollArea overflow-y-auto overflow-x-hidden max-h-52">
        <div className="pt-6 grid grid-cols-4 gap-3">
          {levelsData.map((level, index) => {
            const score = scoreByLevel[index];
            const hasBeenAttempted = score !== undefined;
            const canAttempt = index === 0 || scoreByLevel[index - 1] !== undefined;
            const grade = hasBeenAttempted ? scoreToGrade(score.score, score.ammoUsed, index) : undefined;
            const color = hasBeenAttempted ? gradeToColor(grade!) : 'bg-gray-600';

            return (
              <div
                key={level.name}
                onClick={() => {
                  (hasBeenAttempted || canAttempt) && onClickLevel(index);
                }}
                className={`rounded-md py-2 px-4 text-white text-center font-bold uppercase text-2xl ${hasBeenAttempted || canAttempt ? 'cursor-pointer' : ''} ${color}`}
              >
                {level.name}
                {hasBeenAttempted ? <div className="text-sm">Score: {scoreByLevel[index].score}</div> : <div className="text-xs">No score</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
