import { MenuStatus, useCurrentLevelState, useGameStore } from '../../store';
import { Platform } from './levelFeatures/platforms';
import { LevelComponent } from './levelFeatures/component';
import { EnvironmentFeature } from './levelFeatures/environment';
import { Breakable, LevelFeatureProp } from '../../libs/levels/types';
import { useLevelBuilderStore } from '../ui/LevelBuilder';
import { Fragment, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2 } from 'three';

export const LevelManager = () => {
  const menuState = useGameStore((state) => state.menuState);
  const currentLevelState = useCurrentLevelState((state) => state);
  const [rerender, setRerender] = useState(0);
  const builderLevel = useLevelBuilderStore();

  let state = currentLevelState;
  if (menuState == MenuStatus.LEVEL_BUILDER) {
    state = builderLevel;
  }

  useEffect(() => {
    /**
     * THis is a hack to force a rerender when the level builder is active
     */
    if (menuState == MenuStatus.LEVEL_BUILDER) {
      setRerender(Math.random() * 100);
    }
  }, [builderLevel]);

  const environment = state.environment;

  const currentLevel = state.platforms.map((platform, index) => {
    const components = state.components.filter((component) => component.platformIndex === index) as Breakable<LevelFeatureProp>[];

    return (
      <Platform key={platform.uuid || index} scale={platform.scale} position={platform.position}>
        {components.map((component) => {
          return <LevelComponent key={component.uuid} {...component} />;
        })}
      </Platform>
    );
  });

  return (
    <Fragment key={rerender}>
      {environment?.map((envFeature, index) => {
        return <EnvironmentFeature key={envFeature.uuid} {...envFeature} />;
      })}
      {currentLevel}
    </Fragment>
  );
};
