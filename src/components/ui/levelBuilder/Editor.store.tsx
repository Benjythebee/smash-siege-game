import { create } from 'zustand';
import { EnvironmentFeatureProp, LevelFeatureProp, LevelPlatformProp } from '../../../libs/levels/types';
import { Observable } from '../../../libs/observable';
import { useLevelBuilderStore } from '../LevelBuilder';

export type EditorGlobalEntity = { type: 'environment'; data: EnvironmentFeatureProp } | { type: 'platforms'; data: LevelPlatformProp };

export type EditorDataItem = { type: 'components'; data: LevelFeatureProp };

export const useEditorStore = create<{
  focused: LevelFeatureProp | null;
  isDraggingGizmo: boolean;
  selectedPlatformOrEnvironment: EditorGlobalEntity | null;
  setSelectedPlatformOrEnvironment: (entity: EditorGlobalEntity | null) => void;
  selectedItem: EditorDataItem | null;
  setSelectedItem: (item: EditorDataItem | null) => void;
  setSelectedItemByUuid: (uuid: string) => void;
}>((set, get) => ({
  focused: null,
  isDraggingGizmo: false,
  selectedPlatformOrEnvironment: null,
  setSelectedPlatformOrEnvironment: (entity: EditorGlobalEntity | null) => set({ selectedPlatformOrEnvironment: entity }),
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  setSelectedItemByUuid: (uuid) => {
    const state = useLevelBuilderStore.getState();
    console.log('state', get().isDraggingGizmo);
    if (get().isDraggingGizmo) return;
    const component = state.components.find((i) => i.uuid == uuid);
    if (!component || typeof component.platformIndex == 'undefined') return;

    const platform = state.platforms[component.platformIndex] as LevelPlatformProp;

    useEditorStore.setState({
      focused: null,
      selectedPlatformOrEnvironment: { type: 'platforms', data: platform },
      selectedItem: { type: 'components', data: component as LevelFeatureProp }
    });
  }
}));

export const onItemEditObservable = new Observable<EditorGlobalEntity | EditorDataItem>();

onItemEditObservable.add((item) => {
  useLevelBuilderStore.setState((state) => {
    return { [item.type]: [...(state[item.type] || []).map((i) => (i.uuid == item.data.uuid ? item.data : i))] };
  });
});
