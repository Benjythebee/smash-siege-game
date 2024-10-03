import { LevelFeatureProp } from '../../../../../common/types';
import { useLevelBuilderStore } from '../LevelBuilder';

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

export { addComponent, removeComponent };
