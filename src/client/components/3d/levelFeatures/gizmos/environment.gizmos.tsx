import { PivotControls } from '@react-three/drei';
import { MenuStatus, useGameStore } from '../../../../store.js';
import { EditorGlobalEntity, onItemEditObservable, useEditorStore } from '../../../ui/levelBuilder/editor/Editor.store.js';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { EnvironmentFeatureProp, LevelPlatformProp } from '../../../../../common/types.js';
import { useRef, useState } from 'react';

export const EnvironmentGizmos = ({ children, id }: React.PropsWithChildren<{ id: string }>) => {
  const menuState = useGameStore((state) => state.menuState);
  const selectedItem = useEditorStore((s) => s.selectedPlatformOrEnvironment);
  const selectedFeatureItem = useEditorStore((s) => s.selectedItem);
  const [gizmoSelected, setGizmoSelected] = useState<'Rotator' | 'Arrow' | 'Sphere' | 'Slider' | null>(null);

  const matrix = useRef(new Matrix4());

  // Don't show gizmos if not in level builder mode or if no item is selected or if we have a feature selected (not a platform)
  const enabled = menuState == MenuStatus.LEVEL_BUILDER && !selectedFeatureItem && !!selectedItem && selectedItem.data.uuid == id;

  const startPosition = !selectedItem ? [0, 0, 0] : new Vector3().fromArray(selectedItem.data.position).toArray();

  const update = (_newData: LevelPlatformProp | EnvironmentFeatureProp) => {
    if (!selectedItem) return;
    useEditorStore.setState((state) => {
      const newData = { ...selectedItem.data, ..._newData };
      const newItem = { ...selectedItem, ...{ data: newData } } as EditorGlobalEntity;
      onItemEditObservable.notifyObservers(newItem);
      return { selectedPlatformOrEnvironment: { ...state.selectedItem, ...newItem } };
    });
  };

  return (
    <PivotControls
      enabled={enabled}
      depthTest={false}
      autoTransform={true}
      scale={2}
      matrix={matrix.current}
      onDragStart={(p) => {
        setGizmoSelected(p.component);
        useEditorStore.setState({ isDraggingGizmo: true });
      }}
      onDrag={(matrix_) => {
        matrix.current = matrix_;
      }}
      disableSliders={true}
      disableScaling={false}
      onDragEnd={() => {
        setTimeout(() => {
          useEditorStore.setState({ isDraggingGizmo: false });
        }, 2);
        if (!selectedItem) return;
        const position = new Vector3();
        const scale = new Vector3();
        const rotation = new Quaternion();
        matrix.current.decompose(position, rotation, scale);
        // Add position, rotation, scale to the component's data
        const prev = {
          position: new Vector3().fromArray(selectedItem.data.position),
          rotation: new Vector3().fromArray(selectedItem.data.rotation),
          scale: new Vector3().fromArray(selectedItem.data.scale)
        };

        // Only apply the changes of the selected gizmo

        if (gizmoSelected == 'Rotator') {
          prev.rotation.add(new Euler().setFromQuaternion(rotation));
        } else if (gizmoSelected == 'Arrow') {
          prev.position.add(position);
        } else if (gizmoSelected == 'Sphere') {
          prev.scale.multiply(scale);
        }

        const data = { rotation: prev.rotation.toArray().splice(0, 3), position: prev.position.toArray(), scale: prev.scale.toArray() };
        update(data as any);
      }}
      offset={startPosition as [number, number, number]}
    >
      {children}
    </PivotControls>
  );
};
