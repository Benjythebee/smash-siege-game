import { useState } from 'react';
import { LevelData, LevelType } from '../../../../../common/types.js';
import { LevelDataDictionary } from '../../../../libs/levels.js';
import { gradeToColor, scoreToGrade } from '../../../../libs/score.js';
import { motion } from 'framer-motion';

interface DefaultLevelsProps {
  scoreByLevel: { ammoUsed: number; score: number }[];
  levelsData: LevelDataDictionary;
  onClickLevel: (index: number) => void;
}

export const DefaultLevels = (props: DefaultLevelsProps) => {
  const { levelsData, scoreByLevel, onClickLevel } = props;

  const defaultLevels = Object.entries(levelsData)
    .filter(([key]) => !isNaN(parseInt(key)))
    .map(([, value]) => value) as LevelData[];

  return (
    <div className="pt-6 grid grid-cols-4 max-sm:grid-cols-2 gap-2 max-sm:gap-2">
      {defaultLevels.map((level, index) => {
        return <LevelCard key={level.name} level={level} levelIndex={index} scoreByLevel={scoreByLevel} onClickLevel={onClickLevel} />;
      })}
    </div>
  );
};

const LevelCard = (props: {
  levelIndex: number;
  scoreByLevel: DefaultLevelsProps['scoreByLevel'];
  level: LevelData & { image_url?: string };
  onClickLevel: DefaultLevelsProps['onClickLevel'];
}) => {
  const [hover, setHover] = useState(false);
  const { onClickLevel, levelIndex, scoreByLevel } = props;
  const score = scoreByLevel[levelIndex];
  const level = props.level;
  const levelName = level.name;

  const hasBeenAttempted = !!score;
  const canAttempt = levelIndex === 0 || scoreByLevel[levelIndex - 1] !== undefined;
  const grade = hasBeenAttempted ? scoreToGrade(score.score, score.ammoUsed, levelIndex) : undefined;
  const color = hasBeenAttempted ? gradeToColor(grade!) : 'bg-gray-600';

  return (
    <div
      key={levelName}
      onClick={() => {
        onClickLevel(levelIndex);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onTouchStartCapture={() => setHover(true)}
      onTouchEndCapture={() => setHover(false)}
      className={`relative rounded-md max-sm:px-2 text-white flex flex-col gap-1 text-center font-bold overflow-hidden  cursor-pointer round-md hover:bg-white/10`}
    >
      <div className={`h-full w-full ${color} p-1`}>
        {hasBeenAttempted && level.image_url ? (
          <img src={level.image_url} className=" rounded-md bg-gray-600" alt={level.name} />
        ) : (
          <div className="relative rounded-md bg-slate-600 text-center">
            <strong className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-5xl">?</strong>
            <img src={'/images/thumbnails/level-0.png'} className="invisible rounded-md bg-gray-600" alt={level.name} />
          </div>
        )}
        <motion.div
          key={levelName}
          initial={{ height: '1.5rem' }}
          animate={hover ? { height: 'auto' } : 'initial'}
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/30"
        >
          <div className="max-sm:text-sm text-lg uppercase text-ellipsis ">{level.name}</div>
          {hasBeenAttempted ? <div className="max-sm:text-xs text-sm">Score: {scoreByLevel[levelIndex].score}</div> : <div className="max-sm:text-xxs text-xs">No score</div>}
        </motion.div>
      </div>
    </div>
  );
};
