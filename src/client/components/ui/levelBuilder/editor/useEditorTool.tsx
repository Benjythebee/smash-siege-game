import { EnvironmentFeatureProp, LevelFeatureProp } from '../../../../../common/types';
import { defaultFeatureProps } from '../../../../libs/levels/types';
import { useLevelBuilderStore } from '../LevelBuilder';
import { EditorDataItem, EditorGlobalEntity, onItemEditObservable, useEditorStore } from './Editor.store';
import { addComponent, removeComponent } from './utils';
import { v4 as uuidV4 } from 'uuid';

export const useEditorTools = () => {
  const { selectedPlatformOrEnvironment, selectedItem, focused } = useEditorStore();
  const components = useLevelBuilderStore((state) => state.components);

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
    selectedPlatformOrEnvironment && selectedPlatformOrEnvironment.type == 'platforms'
      ? useLevelBuilderStore.getState().platforms.findIndex((t) => t.uuid == selectedPlatformOrEnvironment.data.uuid)
      : -1;

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

  return {
    updatePlatformOrEnvironment,
    updateComponent,
    setComponentType,
    setEnvironmentType,
    currentPlatformIndex,
    addNewComponent,
    removeComponentById,
    cloneComponent
  };
};
