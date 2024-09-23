export const LevelTabs = (props: { tab: 'custom' | 'default'; setTab: (tab: 'custom' | 'default') => void }) => {
  const { setTab, tab } = props;

  return (
    <div className="pt-2 flex gap-2">
      <button onClick={() => setTab('default')} className={`w-full rounded-md rounded-b-none text-center py-1 ${tab === 'default' ? 'bg-blue-500' : 'bg-slate-500'}`}>
        Default
      </button>
      <button onClick={() => setTab('custom')} className={`w-full rounded-md rounded-b-none text-center py-1 ${tab === 'custom' ? 'bg-blue-500' : 'bg-slate-500'} `}>
        Custom Levels
      </button>
    </div>
  );
};
