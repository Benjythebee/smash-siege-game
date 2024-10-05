import { levelsData } from '../../../libs/levels';
import { MenuStatus, resetLevel, useGameStore } from '../../../store';
import { useEditorStore } from './editor/Editor.store';
import { cleanLevel } from './editor/utils/cleanExportLevel';
import { LevelBuilderStoreType, useLevelBuilderStore } from './LevelBuilder';
import { emptyLevel } from './utils';

//temporarily save the level data from the editor
const temp: {
  data: LevelBuilderStoreType | null;
} = {
  data: null
};

export const loadTestLevel = () => {
  const state = useLevelBuilderStore.getState();
  temp.data = state;
  const cleanedLevel = cleanLevel(structuredClone(state));

  if (!cleanedLevel.totalAmmo) {
    console.error('Level must have some ammo to be testable');
    throw new Error('Level must have some ammo to be testable');
  }

  if (!cleanedLevel.components.length) {
    console.error('Level must have some components to be testable');
    throw new Error('Level must have some components to be testable');
  }
  //Clear the level builder stores
  useLevelBuilderStore.setState(structuredClone(emptyLevel));
  useEditorStore.setState({ selectedPlatformOrEnvironment: null, selectedItem: null });

  // Set the level data to the levelsData object
  levelsData['editor-test'] = cleanedLevel;
  // Reset the level to the test level
  resetLevel('editor-test');
};

export const exitTestLevel = () => {
  // open the level builder
  useGameStore.setState({ menuState: MenuStatus.LEVEL_BUILDER });
  levelsData['editor-test'] = null;
  // Reset the level to the original level
  if (!temp.data) {
    console.error('No level data to reset to');
    // default to empty level builder
    useLevelBuilderStore.setState(structuredClone(emptyLevel));
    return;
  }
  useLevelBuilderStore.setState(temp.data);
};
