import cn from 'clsx';

export const LevelBuilderTabTypes = ['content', 'import & export'] as const;
export type LevelBuilderTabTypes = (typeof LevelBuilderTabTypes)[number];

export const LevelBuilderTabs = ({ tab, setTab }: { tab: LevelBuilderTabTypes; setTab: (x: LevelBuilderTabTypes) => void }) => {
  return (
    <div className={`LevelBuilderTabs flex `}>
      {LevelBuilderTabTypes.map((t) => (
        <div
          key={t}
          className={cn(
            `cursor-pointer hover:z-[102] px-4 py-1  rounded-t-lg border-solid border-t-2 border-r-2 capitalize`,
            `hover:bg-black/50`,
            tab == t ? `bg-dark/80 border-white  ` : ` bg-white/80 border-black text-black`
          )}
          onClick={() => setTab(t)}
        >
          {t}
        </div>
      ))}
    </div>
  );
};
