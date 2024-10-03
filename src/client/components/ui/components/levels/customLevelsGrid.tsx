import { useState } from 'react';
import { LoadingIcon } from '../../icons/loader.js';
import { LevelType } from '../../../../../common/types.js';
import { useCustomLevelStore } from '../../../../libs/customLevels/customLevel.context.js';
import { motion } from 'framer-motion';
import { useFetchCustomLevels } from '../../../../requests/get-levels.js';

export const CustomLevels = (props: {}) => {
  const { data, page, isLoading: loading, setPage } = useFetchCustomLevels();

  const nextPage = () => {
    setPage(page + 1);
  };
  const prevPage = () => {
    setPage(page - 1);
  };
  const hasPrevPage = page > 0;

  const levels = data?.levels || [];
  return (
    <div className="w-full h-full">
      <div className="pt-6 grid grid-cols-3 max-sm:grid-cols-2 gap-2 max-sm:gap-2">
        {levels.length === 0 && loading && (
          <div className="col-span-3 max-sm:col-span-2 text-white text-2xl m-auto">
            <LoadingIcon></LoadingIcon>
          </div>
        )}
        {levels.length === 0 && !loading && <div className="col-span-3 max-sm:col-span-2 text-white text-center text-2xl">No levels found</div>}
        {levels.map((level) => (
          <LevelCard level={level} key={level.author + level.id + level.name} />
        ))}
      </div>
      <div className="flex justify-between w-full">
        {hasPrevPage ? (
          <button onClick={prevPage} className="text-white text-2xl hover:text-white/50 font-bold uppercase mt-4">
            Prev
          </button>
        ) : (
          <div></div>
        )}
        <button onClick={nextPage} className="text-white text-2xl hover:text-white/50 font-bold uppercase mt-4">
          Next
        </button>
      </div>
    </div>
  );
};

const LevelCard = (props: { level: LevelType }) => {
  const { setLoadedCustomLevel } = useCustomLevelStore();
  const [hover, setHover] = useState(false);

  const level = props.level;
  const levelName = level.name;
  const levelUploaded = new Date(level.created_at);
  return (
    <div
      key={levelName}
      onClick={() => {
        setLoadedCustomLevel(level);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onTouchStartCapture={() => setHover(true)}
      onTouchEndCapture={() => setHover(false)}
      className={`relative rounded-md max-sm:px-2 text-white flex flex-col gap-1 text-center font-bold overflow-hidden  cursor-pointer round-md hover:bg-white/10`}
    >
      <img src={level.image_url} className=" rounded-md bg-gray-600" alt={level.name} />
      <motion.div
        key={level.id + levelName}
        initial={{ height: '1.5rem' }}
        animate={hover ? { height: 'auto' } : 'initial'}
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/30"
      >
        <div className="max-sm:text-sm text-lg uppercase text-ellipsis ">{level.name}</div>
        <div className="max-sm:text-xxs text-xs flex gap-2">
          <strong>Author: </strong> {level.author}
        </div>
        <div className="max-sm:text-xxs text-xs flex gap-2">
          <strong>Uploaded:</strong> {levelUploaded.getMonth() + 1 + '-' + levelUploaded.getFullYear()}
        </div>
      </motion.div>
    </div>
  );
};
