import { Howl } from 'howler'

export type SpriteMap = {
  [key: string]: [number, number]
}
export type HookOptions<T = any> = T & {
  id?: string
  volume?: number
  playbackRate?: number
  interrupt?: boolean
  soundEnabled?: boolean
  sprite?: SpriteMap
  onload?: () => void
}

export interface PlayOptions {
  id?: string
  loop?: boolean
  position?: number[]
  forceSoundEnabled?: boolean
  playbackRate?: number
}

export type PlayFunction = (options?: PlayOptions) => number | undefined

export interface ExposedData {
  sound: Howl | null
  stop: (id?: string) => void
  pause: (id?: string) => void
  duration: number | null
}

export type ReturnedValue = [PlayFunction, ExposedData]
