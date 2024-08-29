import { create } from 'zustand';
import { EnvironmentFeatureProp, LevelFeatureProp, LevelPlatformProp } from '../../../libs/levels/types';
import { Observable } from '../../../libs/observable';
import { useLevelBuilderStore } from '../LevelBuilder';

export type EditorGlobalEntity = { type: 'environment'; data: EnvironmentFeatureProp } | { type: 'platforms'; data: LevelPlatformProp };

export type EditorDataItem = { type: 'components'; data: LevelFeatureProp };

export const useEditorStore = create<{
  focused: LevelFeatureProp | null;
  selectedPlatformOrEnvironment: EditorGlobalEntity | null;
  setSelectedPlatformOrEnvironment: (entity: EditorGlobalEntity | null) => void;
  selectedItem: EditorDataItem | null;
  setSelectedItem: (item: EditorDataItem | null) => void;
}>((set) => ({
  focused: null,
  selectedPlatformOrEnvironment: null,
  setSelectedPlatformOrEnvironment: (entity: EditorGlobalEntity | null) => set({ selectedPlatformOrEnvironment: entity }),
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item })
}));

export const onItemEditObservable = new Observable<EditorGlobalEntity | EditorDataItem>();

onItemEditObservable.add((item) => {
  useLevelBuilderStore.setState((state) => {
    return { [item.type]: [...(state[item.type] || []).map((i) => (i.uuid == item.data.uuid ? item.data : i))] };
  });
});
