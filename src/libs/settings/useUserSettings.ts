import { create } from "zustand";
import { persist } from "zustand/middleware";



export const useUserSettings = create<{
    sfxVolume:number,
    musicVolume:number,
    setMusicVolume:(value:number)=>void,
    setSfxVolume:(value:number)=>void
}>()(persist((set, get) => ({
    sfxVolume: 1,
    musicVolume: 0.6,
    setMusicVolume: (value) => set({ musicVolume: value }),
    setSfxVolume: (value) => set({ sfxVolume: value }),
}),{name: 'user-settings',partialize:(s)=>({musicVolume:s.musicVolume,sfxVolume:s.sfxVolume})}));