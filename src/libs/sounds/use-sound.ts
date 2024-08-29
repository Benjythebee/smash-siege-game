/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * Inspired by `use-sound` by Josh W Comeau
 */
import React from 'react'

import { Howl } from 'howler'

import { HookOptions, PlayFunction, PlayOptions, ReturnedValue } from './types'

/**
 * use internally only; DO NOT USE
 * @internal
 */
export function useSound<T = any>(
  src: string | string[],
  {
    id,
    volume = 1,
    playbackRate = 1,
    soundEnabled = true,
    interrupt = false,
    onload,
    ...delegated
  }: HookOptions<T> = {} as HookOptions,
) {
  const isMounted = React.useRef(false)

  const [duration, setDuration] = React.useState<number | null>(null)

  const [sound, setSound] = React.useState<Howl | null>(null)

  const handleLoad = function () {
    if (typeof onload === 'function') {
      // @ts-ignore
      onload.call(this)
    }

    if (isMounted.current) {
      // @ts-ignore
      setDuration(this.duration() * 1000)
    }

    // @ts-ignore
    setSound(this)
  }

  // We want to lazy-load Howler, since sounds can't play on load anyway.
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      setSound(
        new Howl({
          src: Array.isArray(src) ? src : [src],
          volume,
          rate: playbackRate,
          onload: handleLoad,
          ...delegated,
        }),
      )
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  // When the `src` changes, we have to do a whole thing where we recreate
  // the Howl instance. This is because Howler doesn't expose a way to
  // tweak the sound
  React.useEffect(() => {
    if (sound) {
      setSound(
        new Howl({
          src: Array.isArray(src) ? src : [src],
          volume,
          onload: handleLoad,
          ...delegated,
        }),
      )
    }
    // The linter wants to run this effect whenever ANYTHING changes,
    // but very specifically I only want to recreate the Howl instance
    // when the `src` changes. Other changes should have no effect.
    // Passing array to the useEffect dependencies list will result in
    // ifinite loop so we need to stringify it, for more details check
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(src)])

  // Whenever volume/playbackRate are changed, change those properties
  // on the sound instance.
  React.useEffect(() => {
    if (sound) {
      sound.volume(volume)
    }
    // A weird bug means that including the `sound` here can trigger an
    // error on unmount, where the state loses track of the sprites??
    // No idea, but anyway I don't need to re-run this if only the `sound`
    // changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume])

  React.useEffect(() => {
    if (sound) {
      sound.rate(playbackRate)
    }
    // A weird bug means that including the `sound` here can trigger an
    // error on unmount, where the state loses track of the sprites??
    // No idea, but anyway I don't need to re-run this if only the `sound`
    // changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackRate])

  const play: PlayFunction = React.useCallback(
    (options?: PlayOptions) => {
      if (typeof options === 'undefined') {
        options = { loop: false }
      }

      if (!sound || (!soundEnabled && !options.forceSoundEnabled)) {
        return
      }

      if (interrupt) {
        sound.stop()
      }
      if (options.playbackRate) {
        sound.rate(options.playbackRate)
      }

      const id = sound.play(options.id)
      if(options.position){
        sound.pannerAttr({
          distanceModel: 'inverse',
          refDistance: 10,
        },id)
        sound.pos(...options.position as [number,number,number],id)
      }
      sound.loop(!!options.loop, id)

      return id
    },
    [sound, soundEnabled, interrupt],
  )

  const stop = React.useCallback(
    (id?: string) => {
      if (!sound) {
        return
      }
      if (id) {
        const stringified = parseInt(id)
        sound.loop(false).stop(stringified)
      } else {
        sound.stop(undefined)
      }
    },
    [sound],
  )

  const pause = React.useCallback(
    (id?: string) => {
      if (!sound) {
        return
      }
      if (id) {
        const stringified = parseInt(id)
        sound.pause(stringified)
      } else {
        sound.pause(undefined)
      }
    },
    [sound],
  )

  const returnedValue: ReturnedValue = [
    play,
    {
      sound,
      stop,
      pause,
      duration,
    },
  ]

  return returnedValue
}
