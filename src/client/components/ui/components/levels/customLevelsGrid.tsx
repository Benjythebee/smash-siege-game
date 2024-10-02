import { create } from 'zustand';
import { CustomLevelsAPI } from '../../../../libs/customLevels/editorApi.js';
import { useEffect } from 'react';
import { LoadingIcon } from '../../icons/loader.js';
import { LevelType } from '../../../../../common/types.js';
import { convertLevelTypeToLevelData } from '../../../../../common/convert.js';
import { useCustomLevelStore } from '../../../../libs/customLevels/customLevel.context.js';

const levelsStore = create<{
  levels: LevelType[];
  page: number;
  error: string;
  loading: boolean;
  actions: {
    setLevels: (levels: LevelType[]) => void;
    setPage: (page: number) => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
  };
}>((set, get) => ({
  levels: [],
  page: 0,
  loading: false,
  error: '',
  actions: {
    setLevels: (levels: LevelType[]) => set({ levels }),
    setPage: (page: number) => set({ page }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string) => set({ error })
  }
}));

const useLevelFetchActions = () => {
  const { setLevels, setPage, setLoading, setError } = levelsStore((state) => state.actions);
  return { setLevels, setPage, setLoading, setError };
};

const useCustomLevels = () => {
  const { levels, page, loading, error } = levelsStore((state) => state);
  const { setLevels, setLoading, setError } = useLevelFetchActions();

  const fetchLevels = async (page: number) => {
    setLoading(true);
    const response = await new CustomLevelsAPI().getCustomLevels(page);
    if ('error' in response) {
      console.error(response.error);
      setError(response.error);
      setLoading(false);
      return;
    }
    setLevels(response.levels);
    setLoading(false);
  };

  useEffect(() => {
    if (!levels.length) {
      fetchLevels(0);
    }
  }, []);

  useEffect(() => {
    fetchLevels(page);
  }, [page]);
  return { levels, page, loading, error, refetch: () => fetchLevels(page) };
};

export const CustomLevels = (props: {}) => {
  const { levels, page, loading } = useCustomLevels();
  const { setPage } = useLevelFetchActions();
  const { setLoadedCustomLevel } = useCustomLevelStore();

  const nextPage = () => {
    setPage(page + 1);
  };
  const prevPage = () => {
    setPage(page - 1);
  };
  const hasPrevPage = page > 0;

  return (
    <div className="w-full h-full">
      <div className="pt-6 grid grid-cols-3 max-sm:grid-cols-2 gap-2 max-sm:gap-2">
        {levels.length === 0 && loading && (
          <div className="col-span-3 max-sm:col-span-2 text-white text-2xl m-auto">
            <LoadingIcon></LoadingIcon>
          </div>
        )}
        {levels.length === 0 && !loading && <div className="col-span-3 max-sm:col-span-2 text-white text-center text-2xl">No levels found</div>}
        {levels.map((level) => {
          const levelName = level.name;
          const levelUploaded = new Date(level.created_at);
          return (
            <div
              key={levelName}
              onClick={() => {
                setLoadedCustomLevel(level);
              }}
              className={`rounded-md py-2 px-4 max-sm:px-2 text-white flex flex-col gap-1 text-center font-bold  cursor-pointer round-md hover:bg-white/10`}
            >
              <div className="max-sm:text-sm text-lg uppercase text-ellipsis ">{level.name}</div>
              <div className="max-sm:text-xxs text-xs flex gap-2">
                <strong>Author: </strong> {level.author}
              </div>
              <div className="max-sm:text-xxs text-xs flex gap-2">
                <strong>Uploaded:</strong> {levelUploaded.getMonth() + 1 + '-' + levelUploaded.getFullYear()}
              </div>
            </div>
          );
        })}
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
