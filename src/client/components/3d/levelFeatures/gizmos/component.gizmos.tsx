import { PivotControls } from '@react-three/drei';
import { MenuStatus, useGameStore } from '../../../../store.js';
import { EditorDataItem, onItemEditObservable, useEditorStore } from '../../../ui/levelBuilder/editor/Editor.store.js';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { LevelFeatureProp } from '../../../../../common/types.js';
import { useRef, useState } from 'react';

export const Gizmos = ({ children, id }: React.PropsWithChildren<{ id: string }>) => {
  const menuState = useGameStore((state) => state.menuState);
  const selectedItem = useEditorStore((s) => s.selectedItem);
  const selectedItemFocused = useEditorStore((s) => s.focused);
  const [gizmoSelected, setGizmoSelected] = useState<'Rotator' | 'Arrow' | 'Sphere' | 'Slider' | null>(null);

  const matrix = useRef(new Matrix4());

  const enabled = menuState == MenuStatus.LEVEL_BUILDER && !!selectedItem && selectedItem.data.uuid == id;

  const startPosition = !selectedItem ? [0, 0, 0] : new Vector3().fromArray(selectedItem.data.position).toArray();

  const updateComponent = (_newData: LevelFeatureProp) => {
    if (!selectedItem) return;
    useEditorStore.setState((state) => {
      const newData = { ...selectedItem.data, ..._newData };
      const newItem = { ...selectedItem, ...{ data: newData } } as EditorDataItem;
      onItemEditObservable.notifyObservers(newItem);
      return { selectedItem: { ...state.selectedItem, ...newItem } };
    });
  };

  return (
    <PivotControls
      enabled={enabled}
      depthTest={false}
      scale={selectedItemFocused ? 1 : 3}
      autoTransform={true}
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
        updateComponent(data as any);
      }}
      offset={startPosition as [number, number, number]}
    >
      {children}
    </PivotControls>
  );
};
