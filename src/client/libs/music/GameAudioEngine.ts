import { MenuStatus, useGameStore } from '../../store.js';
import { useUserSettings } from '../settings/useUserSettings.js';
import { isTablet } from './detectors/index.js';
import { AudioEngine } from './lib/AudioEngine.js';
import { TrackPlayer } from './TrackPlayer.js';

export interface TrackInfo {
  fileName: string;
  duration: number;
  volume?: number;
  fallback?: string;
  /**
   * Whether song is a PVP theme song
   */
  isCombat?: boolean;
}

export interface SoundtrackInfo {
  name?: string;
  tracks: TrackInfo[];
  state?: Array<string>;
  isDefault?: boolean;
  isTravel?: boolean;
}
export enum AudioPlayState {
  Paused = 'Paused',
  Playing = 'Playing',
  Exploring = 'Exploring'
}

function requestAudio(audioContext: AudioContext) {
  return new Promise<void>((resolve) => {
    if (audioContext.state !== 'suspended') {
      resolve();
      return;
    }
    const resume = () => {
      audioContext.resume();
    };
    // make it work!
    // touchstart, touchend doesn't work for starting audio context on mobile; we can only use pointerdown
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);

    // audioContext should get fired up for us soon, let's just wait!
    audioContext.addEventListener('statechange', (state) => {
      const context = state.target as AudioContext;
      if (context.state === 'running') {
        resolve();
      }
    });
  });
}

export class GameAudioEngine {
  static instance: GameAudioEngine;

  playState: AudioPlayState = AudioPlayState.Paused;
  /**
   * Gets or sets the audio engine to use
   */
  public static audioEngine: AudioEngine;
  audioEngine!: AudioEngine;
  public audioContext!: AudioContext;
  trackPlayers: Map<TrackInfo, TrackPlayer> = new Map();
  currentTrack: TrackInfo | null = null;

  trackFilter: BiquadFilterNode;
  trackLimiter: DynamicsCompressorNode;
  trackOut: GainNode;
  constructor() {
    GameAudioEngine.instance = this;
    GameAudioEngine.audioEngine = new AudioEngine();

    this.audioEngine = GameAudioEngine.audioEngine!;
    this.audioContext = GameAudioEngine.audioEngine.audioContext!;

    // let's put the track through a soft limiter to try and avoid clipping when the user pumps up the jam
    this.trackLimiter = createLimiter(this.audioContext);
    // soundtrack mixer
    this.trackOut = this.audioContext.createGain();
    this.trackOut.gain.value = 1;

    // inside we filter down the soundscapes
    this.trackFilter = this.audioContext.createBiquadFilter();
    this.trackFilter.type = 'highshelf';
    this.trackFilter.frequency.value = 1500;
    this.trackFilter.gain.value = 0;

    this.trackOut.connect(this.trackFilter);
    this.trackFilter.connect(this.trackLimiter);
    this.trackLimiter.connect(this.masterOut);

    this.trackOut.gain.value = useUserSettings.getState().musicVolume;
    useUserSettings.subscribe((settings) => {
      this.trackOut.gain.value = settings.musicVolume < 0 ? 0.001 : settings.musicVolume > 1 ? 1 : settings.musicVolume;
    });
  }

  static initialize() {
    if (GameAudioEngine.instance) {
      return GameAudioEngine.instance;
    }
    return new GameAudioEngine();
  }

  static mainTracks: Map<string, TrackInfo[]> = new Map();
  static setupSoundtracks = (tracks: Array<SoundtrackInfo>) => {
    // Already setup
    if (GameAudioEngine.mainTracks.has('default')) return;

    tracks.forEach((soundtrack) => {
      if (soundtrack.state) {
        soundtrack.state.forEach((state) => {
          // set the tracks, but don't include combat tracks
          GameAudioEngine.mainTracks.set(state, soundtrack.tracks);
        });
      }
    });

    // Shuffle default everytime
    // choose from default tracks, shuffle track order once all tracks have been played
    const fallbackTracks = tracks.filter((s) => s.isDefault);

    const currentDefaultSoundtrack = fallbackTracks[(Math.random() * fallbackTracks.length) | 0];
    GameAudioEngine.mainTracks.set('default', currentDefaultSoundtrack.tracks);
  };

  get masterOut(): GainNode {
    return this.audioEngine.masterGain!;
  }

  getTracksForScene(state: 'menu' | 'playing' | 'default') {
    // get tracks for scene, if no tracks, fallback to world of that scene;
    const mainTracksForScene = GameAudioEngine.mainTracks.get(state) || GameAudioEngine.mainTracks.get('default');
    return { mainTracksForScene };
  }

  private _playNextTrack() {
    // play main track
    const { mainTracksForScene } = this.getTracksForScene('default');

    if (!mainTracksForScene) {
      return this.playNextTrack(undefined);
    }

    if (this.currentTrack && this.trackPlayers.get(this.currentTrack) && mainTracksForScene.includes(this.currentTrack)) {
      // we're already playing a track from this playlist, let's keep playing it
      // However don't go through this logic if the currentTrack has ended
      if (!this.trackPlayers.get(this.currentTrack)?.ended) {
        return this.playNextTrack(this.currentTrack);
      }
    }

    let newTrack = mainTracksForScene && mainTracksForScene[Math.floor(Math.random() * mainTracksForScene.length)];
    // check if we're already playing a track from this scene's playlist, if we are, get another one next
    const i = mainTracksForScene.indexOf(this.currentTrack!);
    if (this.currentTrack && i !== -1) {
      if (mainTracksForScene.length > 1) {
        let randomI = Math.floor(Math.random() * mainTracksForScene.length) | 0;
        while (randomI === i) {
          randomI = Math.floor(Math.random() * mainTracksForScene.length) | 0;
        }
        newTrack = mainTracksForScene[randomI];
      }
    }
    this.playNextTrack(newTrack);
  }

  refreshTrack() {
    if (this.playState === AudioPlayState.Paused) {
      // fade out quickly if user generated audio is available
      this.fadeOutTracks(1);
      this.currentTrack = null;
    } else if (this.playState === AudioPlayState.Playing) {
      this._playNextTrack();
    }
  }

  fadeOutTracks(time: number, options?: { exclude?: TrackPlayer }) {
    this.trackPlayers.forEach((player) => {
      if (player !== options?.exclude) {
        player.fadeOut(time);
      }
    });
  }

  playNextTrack(nextTrack: TrackInfo | undefined) {
    if (this.currentTrack === nextTrack) {
      if (this.trackPlayers.get(this.currentTrack)?.ended) {
        // Allow looping if the track ended and we're requesting to play it;
        this.trackPlayers.get(this.currentTrack)?.restart();
      }
      return;
    }

    if (!nextTrack) {
      // user has probably turned off ambient music
      this.fadeOutTracks(1);
      this.currentTrack = null;
    } else if (this.trackPlayers.has(nextTrack)) {
      // track is already playing, let's just fade it back in
      const nextPlayer = this.trackPlayers.get(nextTrack);
      this.fadeOutTracks(10, { exclude: nextPlayer });
      nextPlayer?.fadeIn(11);
      this.currentTrack = nextTrack;
    } else {
      // time to load a new track and start it playing
      const nextPlayer = new TrackPlayer(
        nextTrack,
        this.trackOut,
        () => {
          // on ready: cross fade to new track
          this.fadeOutTracks(8, { exclude: nextPlayer });
          nextPlayer.fadeIn(10);
        },
        () => {
          // on fade out completed: remove track from set and dispose
          nextPlayer.dispose();
          this.trackPlayers.delete(nextTrack);
        }
      );
      // on player song ended; refreshTracks to hopefully get a new track;
      nextPlayer.on('ended', () => {
        setTimeout(
          () => {
            this.refreshTrack();
            // Play a new track after X minute of break; 20s + random btw 0 and 5 minutes
          },
          30 * 1000 + Math.random() * 1000 * 60 * 5
        );
      });
      this.trackPlayers.set(nextTrack, nextPlayer);
      this.currentTrack = nextTrack;
    }

    console.log('Now playing `', nextTrack?.fileName, '`');
  }

  // mobile and tablet have glitchy music playback; However we allow mobile for now until review;
  get platformSupportsMusic() {
    return !isTablet();
  }

  isLoading = true;
  awaitLoadingReady = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.isLoading === false) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  };

  currentGameStatus: MenuStatus = MenuStatus.MAIN_MENU;
  gameState = () => {
    return useGameStore.getState().menuState;
  };

  onABreakUntil = 0;
  refreshPlayState() {
    let newState: AudioPlayState;

    if (this.isLoading) {
      newState = AudioPlayState.Paused;
    } else {
      newState = AudioPlayState.Playing;
    }

    if (newState !== this.playState) {
      this.playState = newState;

      // we refresh the track if the playState has changed for immediate update
      this.refreshTrack();
    }
  }

  get running() {
    return this.audioContext.state !== 'suspended';
  }

  start() {
    requestAudio(this.audioContext).then(async () => {
      // tracks
      if (!this.platformSupportsMusic) {
        return;
      }
      await this.awaitLoadingReady();

      setInterval(() => {
        if (this.gameState() !== this.currentGameStatus) {
          // User has moved to a new scene
          // Check if they're exploring, cause if they are we don't want to change the track
          this.currentGameStatus = this.gameState();
          this.refreshTrack();
        }

        this.refreshPlayState();
      }, 250);
    });
  }
}

function createLimiter(audioContext: AudioContext) {
  const limiter = audioContext.createDynamicsCompressor();
  limiter.threshold.value = 0;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.005;
  limiter.release.value = 0.05;
  return limiter;
}
