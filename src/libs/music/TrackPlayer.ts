import EventEmitter from 'events'

import { isSafari } from './detectors'
import { TrackInfo } from './GameAudioEngine'

export type TrackState = 'loading' | 'loadError' | 'playing' | 'fadeOut' | 'muted' | 'disposed'

export class TrackPlayer extends EventEmitter {
  audioContext: AudioContext
  timeout?: any
  state: TrackState = 'loading'
  output: GainNode
  destination: AudioNode
  track: TrackInfo
  pendingFadeIn: number | null = null
  // eslint-disable-next-line @typescript-eslint/ban-types
  onStop?: Function
  element: HTMLAudioElement
  targetVolume: number
  _disposed = false

  ended = false

  constructor(track: TrackInfo, destination: AudioNode, onStart?: () => void, onStop?: () => void) {
    super()
    this.audioContext = destination.context as AudioContext
    this.destination = destination
    this.track = track
    this.onStop = onStop
    this.output = this.destination.context.createGain()
    this.targetVolume = typeof track.volume === 'number' ? track.volume : 1

    this.output.gain.value = 0.0000001
    this.output.connect(destination)

    this.element = document.createElement('audio')

    const canPlayOpus = this.element.canPlayType('audio/webm; codecs="opus"')
    const useFallback = !canPlayOpus && !!track.fallback
    const fileName = useFallback ? track.fallback : track.fileName

    if (fileName) {
      const startPosition = 0 // (Date.now() / 1000) % track.duration
      this.element.crossOrigin = 'anonymous'

      // this.element.loop = true
      this.element.src = this.musicUri + `/${fileName}`
      this.element.currentTime = startPosition

      const source = this.audioContext.createMediaElementSource(this.element)
      source.connect(this.output)

      const onEndedCallBack = () => {
        this.ended = true
        this.emit('ended')
      }
      tryPlayAudio(this.element, onEndedCallBack)
        .then(() => {
          this.ended = false
          if (this.element.muted) {
            this.element.muted = false
          }
          if (this.state === 'loading') {
            this.state = 'muted'
            if (this.pendingFadeIn != null) {
              this.fadeIn(this.pendingFadeIn)
            }
            onStart && onStart()
          }
        })
        .catch((err) => {
          console.error('cannot play audio', err)
          this.state = 'loadError'
        })

      document.body.appendChild(this.element)
    } else {
      console.log('cannot play audio')
      this.state = 'loadError'
    }
  }

  restart = () => {
    this.element.pause()
    this.element.currentTime = 0
    this.output.gain.value = 0.001
    this.ended = false
    this.element.play()
    this.fadeIn(2)
  }

  get musicUri() {
    return `./sounds/` // cdn is default
  }

  fadeIn(timeConstant: number) {
    this.guardDisposed()

    clearTimeout(this.timeout)
    if (this.state === 'loading') {
      // queue fade in once audio starts playing
      this.pendingFadeIn = timeConstant
    } else if (this.state === 'muted' || this.state === 'fadeOut') {
      this.pendingFadeIn = null
      this.state = 'playing'
      this.output.gain.setTargetAtTime(
        this.targetVolume,
        this.audioContext.currentTime,
        timeConstant,
      )
    }
  }

  fadeOut(timeConstant: number) {
    this.guardDisposed()

    if (this.state === 'loading') {
      // cancel the fade in and call onStopped
      // this audio player is no longer needed!
      this.pendingFadeIn = null
      this.state = 'muted'
      this.onStop && this.onStop()
    } else if (this.state === 'playing') {
      // fade out
      this.state = 'fadeOut'
      this.output.gain.setTargetAtTime(0.00000001, this.audioContext.currentTime, timeConstant)

      // notify onStop if we hit 0
      // this can be cancelled if we get another fadeIn (handle if user came back to suburb before the music had fully faded out)
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.state = 'muted'
        this.onStop && this.onStop()
      }, timeConstant * 5000)
      // this x5 will make sure that we never stop the track before it has faded out, but it also means we end up overshooting by quite a bit sometimes
      // timeConstants are weird: https://stackoverflow.com/questions/20588678/webaudio-how-does-timeconstant-in-settargetattime-work
    }
  }

  guardDisposed() {
    // ensure we can't interact with instance after dispose
    if (this.state === 'disposed') throw new Error('Track player has already been disposed')
  }

  dispose() {
    this.guardDisposed()

    this.state = 'disposed'
    this.output.disconnect(this.destination)
    this.element.remove()
  }
}

function tryPlayAudio(player: HTMLAudioElement, onEndedCallBack?: (ev: Event) => void) {
  return new Promise((resolve, reject) => {
    if (isSafari()) {
      // set the audio level to avoid initial pop in safari
      // also can't be zero otherwise audio glitches out like crazy
      player.volume = 0.01
    }
    player.onended = onEndedCallBack || null
    player
      .play()
      .then(resolve)
      .catch((error: any) => {
        if (isSafari()) {
          justPlayItSafariYouFuck(player)
            .then(resolve)
            .catch(() => {
              // try again but muted
              player.muted = true
              justPlayItSafariYouFuck(player).then(resolve).catch(reject)
            })
        } else {
          // try again but muted
          player.muted = true
          player
            .play()
            .then(resolve)
            .catch(() => reject(error))
        }
      })
  })
}

function justPlayItSafariYouFuck(player: HTMLAudioElement) {
  // https://github.com/mediaelement/mediaelement/issues/2410
  return new Promise((resolve, reject) => {
    // trigger audio start on keydown or touchmove
    document.addEventListener('keydown', handler, true)
    document.addEventListener('touchstart', handler, true)
    function handler() {
      document.removeEventListener('keydown', handler, true)
      document.removeEventListener('touchstart', handler, true)
      player.play().then(resolve).catch(reject)
    }
  })
}
