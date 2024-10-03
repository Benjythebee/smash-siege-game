import { LevelFeatureProp } from '../../../../../../common/types';

export const NameEditor = (props: { data: LevelFeatureProp; onUpdateName: (data: LevelFeatureProp) => void }) => {
  const { data, onUpdateName } = props;

  return (
    <div className="grid grid-cols-2 gap-2 py-2">
      <label className=" col-span-2 font-bold capitalize" htmlFor={''}>
        Name
      </label>
      <input
        key={data.name}
        className={`text-black`}
        type="text"
        id={'name'}
        value={data.name}
        maxLength={100}
        onChange={(e) => onUpdateName({ ...data, name: e.currentTarget.value || '' })}
      />
    </div>
  );
};
