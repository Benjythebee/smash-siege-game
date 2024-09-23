import { LevelData } from '../../../../../../../common/types.js';
import { gradeToColor, scoreToGrade } from '../../../../libs/score.js';

interface DefaultLevelsProps {
  scoreByLevel: { ammoUsed: number; score: number }[];
  levelsData: LevelData[];
  onClickLevel: (index: number) => void;
}

export const DefaultLevels = (props: DefaultLevelsProps) => {
  const { levelsData, scoreByLevel, onClickLevel } = props;

  return (
    <div className="pt-6 grid grid-cols-4 max-sm:grid-cols-2 gap-2 max-sm:gap-2">
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
            className={`rounded-md py-2 px-4 max-sm:px-2 text-white flex flex-col gap-1 text-center font-bold uppercase max-sm:text-sm text-2xl ${hasBeenAttempted || canAttempt ? 'cursor-pointer' : ''} ${color}`}
          >
            {level.name}
            {hasBeenAttempted ? <div className="max-sm:text-xs text-sm">Score: {scoreByLevel[index].score}</div> : <div className="max-sm:text-xxs text-xs">No score</div>}
          </div>
        );
      })}
    </div>
  );
};
