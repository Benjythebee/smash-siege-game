import { EnvironmentFeatureProp, LevelData } from '../../../../common/types';
import { useLevelBuilderStore } from './LevelBuilder';

const emptyLevel = {
  name: 'My level',
  totalAmmo: 10,
  platforms: [],
  components: [],
  environment: []
};

const addEnvironment = (newEnv: EnvironmentFeatureProp) => {
  const env = useLevelBuilderStore.getState().environment;
  if ((env || []).findIndex((item) => item.uuid == newEnv.uuid) > -1) {
    return useLevelBuilderStore.setState({ environment: (env || []).map((item) => (item.uuid == newEnv.uuid ? newEnv : item)) });
  }
  return useLevelBuilderStore.setState({ environment: [...(env || []), newEnv] });
};
const removeEnvironment = (newEnv: EnvironmentFeatureProp) => {
  const env = useLevelBuilderStore.getState().environment;
  return useLevelBuilderStore.setState({ environment: (env || []).filter((item) => item.uuid !== newEnv.uuid) });
};

const addPlatform = (newPlatform: LevelData['platforms'][0]) => {
  const platforms = useLevelBuilderStore.getState().platforms;
  if ((platforms || []).findIndex((item) => item.uuid == newPlatform.uuid) > -1) {
    return useLevelBuilderStore.setState({ platforms: (platforms || []).map((item) => (item.uuid == newPlatform.uuid ? newPlatform : item)) });
  }
  return useLevelBuilderStore.setState({ platforms: [...(platforms || []), newPlatform] });
};

const removePlatform = (newPlatform: LevelData['platforms'][0]) => {
  const platforms = useLevelBuilderStore.getState().platforms;
  return useLevelBuilderStore.setState({ platforms: (platforms || []).filter((item) => item.uuid !== newPlatform.uuid) });
};

export { emptyLevel, addEnvironment, removeEnvironment, addPlatform, removePlatform };
