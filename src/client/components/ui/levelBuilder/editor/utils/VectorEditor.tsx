import { Fragment } from 'react/jsx-runtime';
import { LevelFeatureProp } from '../../../../../../common/types';
import { cleanNumber } from './cleanNumber';

export const BasicVectorEditor = (props: {
  data: Pick<LevelFeatureProp, 'position' | 'scale' | 'rotation'>;
  onUpdateVector: (data: Pick<LevelFeatureProp, 'scale' | 'position' | 'rotation'>) => void;
}) => {
  const { data, onUpdateVector } = props;

  const updateValueInVector = (key: 'position' | 'rotation' | 'scale', index: number, value: number) => {
    data[key][index] = value;
    onUpdateVector(data);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 py-2">
        {(['position', 'rotation', 'scale'] as const).map((key) => (
          <Fragment key={key}>
            <label className=" col-span-2 font-bold capitalize" htmlFor={''}>
              {key}
            </label>
            <div className=" col-span-2 grid grid-cols-3 gap-2 text-black">
              <input
                type="number"
                id={key + '.x'}
                step={0.1}
                min={key == 'scale' ? 0 : undefined}
                value={data[key][0]}
                onChange={(e) => updateValueInVector(key, 0, cleanNumber(e.currentTarget.value))}
              />
              <input
                type="number"
                step={0.1}
                id={key + '.y'}
                min={key == 'scale' ? 0 : undefined}
                value={data[key][1]}
                onChange={(e) => updateValueInVector(key, 1, cleanNumber(e.currentTarget.value))}
              />
              <input
                type="number"
                step={0.1}
                id={key + '.z'}
                min={key == 'scale' ? 0 : undefined}
                value={data[key][2]}
                onChange={(e) => updateValueInVector(key, 2, cleanNumber(e.currentTarget.value))}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
};
