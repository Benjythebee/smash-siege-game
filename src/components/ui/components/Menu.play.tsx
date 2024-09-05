import { useUserSettings } from '../../../libs/settings/useUserSettings';
import { MenuStatus, resetLevel, useGameStore, useSlingShotStore } from '../../../store';
import { Button } from './button/button';
import { Slider } from './sliders/slider';

export const MenuPlayTab = () => {
  const { sfxVolume, musicVolume, setMusicVolume, setSfxVolume } = useUserSettings();
  const currentAmmoIndex = useSlingShotStore((state) => state.currentAmmoIndex);
  const level = useGameStore((state) => state.level);

  const setLevelsTab = () => {
    useGameStore.setState({ menuState: MenuStatus.LEVELS });
  };
  const isResume = currentAmmoIndex !== 0 && level != 0;
  const playGame = () => {
    if (isResume) {
      // Resume game
      useGameStore.setState({ menuState: MenuStatus.HIDDEN, isPaused: false });
    } else {
      resetLevel();
    }
  };
  const startLevelBuilder = () => {
    useGameStore.setState({ menuState: MenuStatus.LEVEL_BUILDER, isPaused: false });
  };
  return (
    <div className="h-full flex flex-col gap-4 ">
      <div className="text-4xl uppercase font-bold mb-6  text-center">Siege Smash</div>
      <Button text={isResume ? 'Resume' : 'Play'} theme="green" size="big" onClick={playGame} />
      <Button text="Levels" theme="white" size="big" onClick={setLevelsTab} />
      <Button text="Level Builder" theme="white" size="big" onClick={startLevelBuilder} />

      <div className="flex justify-between gap-1">
        <Slider value={musicVolume} onChange={setMusicVolume} label="Music Volume" />
        <Slider value={sfxVolume} onChange={setSfxVolume} label="SFX Volume" />
      </div>
    </div>
  );
};
