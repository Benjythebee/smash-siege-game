import { defaultFeatureProps } from '../../../../libs/levels/types.js';
import { Fragment } from 'react/jsx-runtime';
import { useLevelBuilderStore } from '../LevelBuilder.js';
import { EditorDataItem, EditorGlobalEntity, onItemEditObservable, useEditorStore } from './Editor.store.js';
import { v4 as uuidV4 } from 'uuid';
import { EnvironmentFeatureProp, EnvironmentFeatureTypes, FeatureType, LevelFeatureProp, LevelPlatformProp } from '../../../../../common/types.js';
import { addComponent, removeComponent } from './utils.js';
import { useEditorTools } from './useEditorTool.js';
import { BasicVectorEditor } from './utils/VectorEditor.js';
import { NameEditor } from './utils/featureNameEditor.js';
import { JSONFileIcon } from '../../icons/json.icon.js';

export const EditorMenu = () => {
  const { selectedPlatformOrEnvironment, selectedItem, focused } = useEditorStore();

  const { updatePlatformOrEnvironment, updateComponent, setComponentType, setEnvironmentType, addNewComponent, currentPlatformIndex, removeComponentById, cloneComponent } =
    useEditorTools();

  if (!selectedPlatformOrEnvironment) return null;

  const componentsForPlatform =
    selectedPlatformOrEnvironment.type == 'platforms' ? useLevelBuilderStore.getState().components.filter((t) => t.platformIndex == currentPlatformIndex) : [];

  return (
    <div className={`EditorMenu absolute z-[50] rounded-md top-0 h-[100vh] right-0 w-[20rem]`}>
      <div className="relative w-full h-full">
        <div
          className="absolute flex p-2 justify-between rounded-l-lg bg-dark -left-6 top-3 text-alice-blue scale-150 hover:bg-dark/80 cursor-pointer"
          onClick={() => {
            useEditorStore.setState({ focused: null, selectedItem: null, selectedPlatformOrEnvironment: null });
          }}
        >
          X
        </div>

        <div className="h-full overflow-y-auto overflow-x-hidden bg-dark p-2 text-alice-blue">
          <div className="text-lg font-bold capitalize flex flex-col">Editing: {selectedPlatformOrEnvironment.type}</div>
          <BasicVectorEditor data={selectedPlatformOrEnvironment.data} onUpdateVector={updatePlatformOrEnvironment as any} />
          {selectedPlatformOrEnvironment.type == 'environment' && (
            <div className="grid grid-cols-2 gap-2 py-4">
              <label className="col-span-2 font-bold capitalize" htmlFor={''}>
                Type
              </label>
              <select
                className="col-span-2 text-black"
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
                <div className="bg-gray">
                  {componentsForPlatform.map((component, index) => (
                    <div key={component.uuid} className="flex justify-between hover:bg-blueish-green cursor-pointer">
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
                Selected Feature<span className="text-xs">uuid: {selectedItem.data.uuid}</span>
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
                <select className="col-span-2 text-black" value={selectedItem.data.type} onChange={(e) => setComponentType(e.currentTarget.value as LevelFeatureProp['type'])}>
                  {FeatureType.map((type) => (
                    <option key={type} value={type} className="text-black capitalize">
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
    </div>
  );
};

const QuickExportSection = (props: { data: LevelFeatureProp | EnvironmentFeatureProp | LevelPlatformProp }) => {
  const { data } = props;

  const onCopyToClipBoard = async () => {
    //@ts-ignore
    const { uuid, health, ...rest } = data;
    await navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
    confirm('JSON copied to clipboard');
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 pt-2">
        <h1 className="text-md font-bold col-span-4">Quick Export</h1>
        <button title="Copy JSON to clipboard" className="col-span-1 px-2  cursor-pointer font-bold m-auto" onClick={onCopyToClipBoard}>
          <JSONFileIcon className="w-8 h-8 hover:text-white/80" />
        </button>
      </div>
    </>
  );
};
