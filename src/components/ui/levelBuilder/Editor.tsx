import { defaultFeatureProps, EnvironmentFeatureProp, EnvironmentFeatureTypes, LevelFeatureProp, LevelPlatformProp, FeatureType } from '../../../libs/levels/types';
import { Fragment } from 'react/jsx-runtime';
import { useLevelBuilderStore } from '../LevelBuilder';
import { EditorDataItem, EditorGlobalEntity, onItemEditObservable, useEditorStore } from './Editor.store';
import { v4 as uuidV4 } from 'uuid';

const addComponent = (newComponent: LevelFeatureProp) => {
  const components = useLevelBuilderStore.getState().components;
  if ((components || []).findIndex((item) => item.uuid == newComponent.uuid) > -1) {
    return useLevelBuilderStore.setState({ components: (components || []).map((item) => (item.uuid == newComponent.uuid ? newComponent : item)) });
  }
  return useLevelBuilderStore.setState({ components: [...(components || []), newComponent] });
};

const removeComponent = (newComponent: LevelFeatureProp) => {
  const components = useLevelBuilderStore.getState().components;
  return useLevelBuilderStore.setState({ components: (components || []).filter((item) => item.uuid !== newComponent.uuid) });
};

export const EditorMenu = () => {
  const { selectedPlatformOrEnvironment, selectedItem, focused } = useEditorStore();
  const components = useLevelBuilderStore((state) => state.components);
  if (!selectedPlatformOrEnvironment) return null;

  const updatePlatformOrEnvironment = (newData: EditorGlobalEntity['data']) => {
    useEditorStore.setState((state) => {
      const newItem = { ...selectedPlatformOrEnvironment, ...{ data: newData } } as EditorGlobalEntity;
      onItemEditObservable.notifyObservers(newItem);
      return { selectedPlatformOrEnvironment: { ...state.selectedPlatformOrEnvironment, ...newItem } };
    });
  };

  const updateComponent = (newData: LevelFeatureProp) => {
    useEditorStore.setState((state) => {
      const newItem = { ...selectedItem, ...{ data: newData } } as EditorDataItem;
      onItemEditObservable.notifyObservers(newItem);
      return { selectedItem: { ...state.selectedItem, ...newItem } };
    });
  };

  const setComponentType = (type: LevelFeatureProp['type']) => {
    if (selectedItem?.type !== 'components') return;
    const data = selectedItem.data;
    data.type = type;
    updateComponent(data);
  };

  const setEnvironmentType = (type: EnvironmentFeatureProp['type']) => {
    if (selectedPlatformOrEnvironment?.type !== 'environment') return;
    const data = selectedPlatformOrEnvironment.data;
    data.type = type;
    useEditorStore.setState((state) => {
      const newItem = { ...selectedPlatformOrEnvironment, ...{ data: data } } as EditorGlobalEntity;
      onItemEditObservable.notifyObservers(newItem);
      return { selectedPlatformOrEnvironment: { ...state.selectedPlatformOrEnvironment, ...newItem } };
    });
  };

  const currentPlatformIndex =
    selectedPlatformOrEnvironment.type == 'platforms' ? useLevelBuilderStore.getState().platforms.findIndex((t) => t.uuid == selectedPlatformOrEnvironment.data.uuid) : -1;

  const addNewComponent = () => {
    const newComponent = defaultFeatureProps({});
    addComponent(newComponent);
    const currentPlatformScale = useLevelBuilderStore.getState().platforms[currentPlatformIndex].scale || [1, 1, 1];
    newComponent.platformIndex = currentPlatformIndex;
    newComponent.position = [0, currentPlatformScale[1], 0];
    useEditorStore.setState({ selectedItem: { type: 'components', data: newComponent } });
  };

  const removeComponentById = (uuid: string) => {
    const comps = components || [];
    const comp = comps.find((item) => item.uuid == uuid);
    if (comp) {
      removeComponent(comp as LevelFeatureProp);
      const selected = useEditorStore.getState().selectedItem;
      if (selected?.type == 'components' && selected?.data.uuid == comp.uuid) {
        useEditorStore.setState({ selectedItem: null });
      }
    }
  };

  const cloneComponent = (item: LevelFeatureProp) => {
    const newComponent = structuredClone({ ...item });
    newComponent.uuid = uuidV4();
    newComponent.position = [newComponent.position[0] + 1, newComponent.position[1], newComponent.position[2]];
    addComponent(newComponent);
    useEditorStore.setState((state) => ({ selectedItem: { type: 'components', data: newComponent }, focused: state.focused ? newComponent : null }));
  };

  const componentsForPlatform =
    selectedPlatformOrEnvironment.type == 'platforms' ? useLevelBuilderStore.getState().components.filter((t) => t.platformIndex == currentPlatformIndex) : [];

  return (
    <div className={`EditorMenu absolute z-[50] rounded-md top-0 h-[100vh] right-0 bg-slate-700/90 w-[20rem] p-2`}>
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="flex p-2 justify-between border-b-2 border-black border-2">
          <div className="text-lg font-bold capitalize flex flex-col">{selectedPlatformOrEnvironment.type}</div>
          <div
            className="font-bold text-lg rounded-md border-black border-2 border-solid cursor-pointer hover:bg-black hover:text-white"
            onClick={() => {
              useEditorStore.setState({ focused: null, selectedItem: null, selectedPlatformOrEnvironment: null });
            }}
          >
            Close
          </div>
        </div>

        <BasicVectorEditor data={selectedPlatformOrEnvironment.data} onUpdateVector={updatePlatformOrEnvironment as any} />
        {selectedPlatformOrEnvironment.type == 'environment' && (
          <div className="grid grid-cols-2 gap-2 py-4">
            <label className="col-span-2 font-bold capitalize" htmlFor={''}>
              Type
            </label>
            <select
              className="col-span-2"
              value={selectedPlatformOrEnvironment.data.type}
              onChange={(e) => setEnvironmentType(e.currentTarget.value as EnvironmentFeatureProp['type'])}
            >
              {EnvironmentFeatureTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}
        <QuickExportSection data={selectedPlatformOrEnvironment.data} />

        {selectedPlatformOrEnvironment.type == 'platforms' && (
          <div className="flex flex-col py-2">
            <div className="font-bold">Components</div>
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-md border-black border-solid border-2" onClick={() => addNewComponent()}>
                +
              </button>
            </div>
            <div className="pt-2 flex flex-col gap-2 max-h-32 overflow-y-auto overflow-x-hidden">
              <div className="bg-slate-500">
                {componentsForPlatform.map((component, index) => (
                  <div key={component.uuid} className="flex justify-between hover:bg-slate-700 cursor-pointer">
                    <div className="capitalize " onClick={() => useEditorStore.getState().setSelectedItem({ type: 'components', data: component as any })}>
                      {component.name ? (
                        component.name + ` [${component.type}]`
                      ) : (
                        <>
                          {component.type}
                          <span className="text-[0.5rem]"> {component.uuid}</span>
                        </>
                      )}
                    </div>
                    <button className="rounded-md px-2 border-black border-solid border-2" onClick={() => removeComponentById(component.uuid!)}>
                      -
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedPlatformOrEnvironment.type == 'platforms' && selectedItem && (
          <div className="border-2 p-2 border-slate-900 border-solid flex flex-col">
            <div className="text-lg flex flex-col gap-2">
              Selected Feature:<span className="text-xs">uuid: {selectedItem.data.uuid}</span>
              <div className="flex gap-2 justify-around">
                <button
                  className="border-2 border-solid border-black px-2 rounded-md hover:bg-slate-800 cursor-pointer font-bold"
                  onClick={() => useEditorStore.setState((state) => ({ focused: state.focused ? null : selectedItem.data }))}
                >
                  {focused ? 'Unfocus' : 'Focus'}
                </button>
                <button
                  className="border-2 border-solid border-black rounded-md px-2 hover:bg-slate-800 cursor-pointer font-bold"
                  onClick={() => cloneComponent(selectedItem.data)}
                >
                  Clone
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 py-4">
              <label className="col-span-2 font-bold capitalize" htmlFor={''}>
                Type
              </label>
              <select className="col-span-2" value={selectedItem.data.type} onChange={(e) => setComponentType(e.currentTarget.value as LevelFeatureProp['type'])}>
                {FeatureType.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <NameEditor data={selectedItem.data} onUpdateName={updateComponent as any} />
            <BasicVectorEditor data={selectedItem.data} onUpdateVector={updateComponent as any} />
            <QuickExportSection data={selectedItem.data} />
          </div>
        )}
      </div>
    </div>
  );
};

const cleanNumber = (value: string) => {
  // sanitate the number but allow negatives
  return Number(value.replace(/[^0-9.-]/g, ''));
};

const BasicVectorEditor = (props: {
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
            <div className=" col-span-2 grid grid-cols-3 gap-2">
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

const NameEditor = (props: { data: LevelFeatureProp; onUpdateName: (data: LevelFeatureProp) => void }) => {
  const { data, onUpdateName } = props;

  return (
    <div className="grid grid-cols-2 gap-2 py-2">
      <label className=" col-span-2 font-bold capitalize" htmlFor={''}>
        Name
      </label>
      <input type="text" id={'name'} value={data.name} maxLength={100} onChange={(e) => onUpdateName({ ...data, name: e.currentTarget.value || '' })} />
    </div>
  );
};

const QuickExportSection = (props: { data: LevelFeatureProp | EnvironmentFeatureProp | LevelPlatformProp }) => {
  const { data } = props;

  const onCopyToClipBoard = () => {
    //@ts-ignore
    const { uuid, health, ...rest } = data;
    navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <h1 className="text-md font-bold">Quick Export</h1>
        <button className="col-span-2 border-2 border-solid border-black rounded-md px-2 hover:bg-slate-800 cursor-pointer font-bold" onClick={onCopyToClipBoard}>
          Copy JSON to clipboard
        </button>
      </div>
    </>
  );
};
