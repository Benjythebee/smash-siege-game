import { create } from "zustand";
import { RapierRigidBody } from "@react-three/rapier";
import { AnimationResponse } from "./libs/mona";
import { persist } from "zustand/middleware";
import { LevelData, levelsData } from "./libs/levels";
import { ExplosionType } from "./components/3d/explosions/explosion";
import { Breakable, defaultEnvironmentProps, LevelFeatureProp } from "./libs/levels/types";
import { featureHealth } from "./components/3d/levelFeatures/constants";
import { v4 as uuidv4 } from 'uuid';
import { Vector3 } from "three";
import { onReloadLevel } from "./observables";
import { useLevelBuilderStore } from "./components/ui/LevelBuilder";
import { playSoundProgrammatically } from "./libs/sounds/soundContext";

export enum MenuStatus {
    MAIN_MENU,
    LEVELS,
    HIDDEN,
    SCORE,
    LEVEL_BUILDER,
    CREDITS
}

export type ammoLoadoutType = {
    id:string,
    name:string
    released:boolean
    position?:Vector3
    rotation?:Vector3
}
const generateAmmo = (num:number):ammoLoadoutType[]=>{
    return Array(num).fill(0).map((_,i)=>{
        return {id:'ammo'+i,
            name:'ammo'+i,
            released:false,
            position:new Vector3(0,-8,0)}
    })
}

export const useGameStore = create<{
    level:number,
    scoreByLevel:{ammoUsed:number,score:number}[],
    startGame:(level:number)=>void
    endGame:()=>void
    score:number,
    setScoreByLevel:(score:number,ammoUsed:number)=>void
    incrementScore:(score:number)=>void
    isPaused:boolean
    menuState:MenuStatus
    prevMenuState:MenuStatus
}>()(persist((set,get)=>({
    level:0,
    menuState:MenuStatus.MAIN_MENU,
    prevMenuState:MenuStatus.MAIN_MENU,
    scoreByLevel:[],
    startGame:()=>set({level:0}),
    endGame:()=>set({level:0}),
    isPaused:true,
    score:0,
    incrementScore:(score:number)=>set((state)=>({score:state.score+score})),
    setScoreByLevel:(score:number,ammoUsed:number)=>{
        const arr = get().scoreByLevel
        arr[get().level] = {score,ammoUsed}
        set({scoreByLevel:arr})
    },
}),{
    name:'level-game-store',
    skipHydration:true,
    partialize:(state)=>({scoreByLevel:state.scoreByLevel})
}))

export const useSlingShotStore = create<{
    importedAssets: {[index:string]:AnimationResponse},
    explosions:ExplosionType[],
    currentAmmoIndex:number,
    ammoLoadout:ammoLoadoutType[],
    ammoLoaded:boolean,
    nextAmmo:()=>void
    isOutOfAmmo:()=>boolean
    setCurrentAmmoIndex:(index:number)=>void
    selectImportedAsset:(asset:AnimationResponse)=>void
    currentAmmoRef:RapierRigidBody|null
}>((set,get)=>({
    currentAmmoIndex:-1,
    importedAssets:{},
    explosions:[],
    ammoLoaded:true,
    ammoLoadout:generateAmmo(levelsData[0].totalAmmo),
    isOutOfAmmo:()=>get().currentAmmoIndex>get().ammoLoadout.length-1,
    nextAmmo:()=>set((state)=>{
        if(state.currentAmmoIndex<state.ammoLoadout.length){
            return {currentAmmoIndex:state.currentAmmoIndex+1}
        }
        return {currentAmmoIndex:state.currentAmmoIndex}
    }),
    selectImportedAsset:(asset:AnimationResponse)=>{
        if(get().isOutOfAmmo()) return;
        const m = get().importedAssets
        set((state)=>({importedAssets:{...m,[String(state.currentAmmoIndex)]:asset},ammoLoaded: false}))
    },
    setCurrentAmmoIndex:(index:number)=>set({currentAmmoIndex:index}),
    currentAmmoRef:null
}))

export const useCurrentLevelState = create<LevelData>((set,get)=>{
    const clone = structuredClone(levelsData[0])
    return {
        ...clone,
        components:setComponentsBreakableData(clone.components as any[]),
        environment:clone.environment?.map((e)=>defaultEnvironmentProps(e)) || [],
    }
})

const timeouts:{
    onAllBrokenTimeout:NodeJS.Timeout|null,
    onOutOfAmmoTimeout:NodeJS.Timeout|null
}={
    onAllBrokenTimeout:null,
    onOutOfAmmoTimeout:null
}


useCurrentLevelState.subscribe((state)=>{
    if(!state.components || state.components.length==0){
        return
    }

    if(useGameStore.getState().menuState!==MenuStatus.HIDDEN) return

    const isAllBroken = state.components.every((component)=>(component as Breakable<LevelFeatureProp>).health<=0)

    if(isAllBroken && !timeouts.onAllBrokenTimeout){
        // clear ammo out timeout
        timeouts.onOutOfAmmoTimeout && clearTimeout(timeouts.onOutOfAmmoTimeout)
        
        useGameStore.getState().setScoreByLevel(useGameStore.getState().score,useSlingShotStore.getState().currentAmmoIndex+1)
        timeouts.onAllBrokenTimeout=setTimeout(()=>{
            useGameStore.setState({menuState:MenuStatus.SCORE})
            timeouts.onAllBrokenTimeout=null
        },1000)
    }
})

useSlingShotStore.subscribe((state)=>{
    console.log(state)
    const s = useGameStore.getState()
    console.log('sl',s)
    if(s.menuState!==MenuStatus.HIDDEN) return


    // Show score if we're out of ammo
    if(state.isOutOfAmmo() && !timeouts.onOutOfAmmoTimeout){
        const lastLevelScore = useGameStore.getState().scoreByLevel[useGameStore.getState().level]?.score||0
        const currentSCore = useGameStore.getState().score
        if(lastLevelScore<currentSCore){
            useGameStore.getState().setScoreByLevel(useGameStore.getState().score,useSlingShotStore.getState().currentAmmoIndex+1)
        }
        timeouts.onOutOfAmmoTimeout=setTimeout(()=>{
            useGameStore.setState({menuState:MenuStatus.SCORE})
            timeouts.onAllBrokenTimeout=null
            timeouts.onOutOfAmmoTimeout=null
        },5000)
    }
})
// clear all timeouts on level change
let currentLevel = 0
useGameStore.subscribe((state)=>{
    console.log('g',state)
    if(state.level!==currentLevel){
        // clear all timeouts
        timeouts.onAllBrokenTimeout && clearTimeout(timeouts.onAllBrokenTimeout)
        timeouts.onOutOfAmmoTimeout && clearTimeout(timeouts.onOutOfAmmoTimeout)
        currentLevel = state.level
    }
})


export const pauseGame = ()=>{
    useGameStore.setState({isPaused:true})
}

export const resumeGame = ()=>{
    useGameStore.setState({isPaused:false})
}

export const endGame = ()=>{
    onReloadLevel.notifyObservers()
    useGameStore.setState({
        menuState:MenuStatus.MAIN_MENU,
        level:0,
        score:0,
        })
    loadLevel(0)

    useSlingShotStore.setState({
        currentAmmoIndex:0,
        importedAssets:{},
        ammoLoaded:true,
        explosions:[],
        ammoLoadout:generateAmmo(levelsData[0].totalAmmo),
        currentAmmoRef:null
    })
}

export const resetLevel = (number?:number)=>{
    const level = number ?? useGameStore.getState().level

    onReloadLevel.notifyObservers()
    useGameStore.setState({
        score:0,
        menuState:MenuStatus.HIDDEN,
        isPaused:false,
        ...(number?{level:number}:{})
    })
    loadLevel(level)
    useSlingShotStore.setState({
        currentAmmoIndex:0,
        ammoLoaded:true,
        importedAssets:{},
        explosions:[],
        ammoLoadout:generateAmmo(levelsData[level].totalAmmo),
        currentAmmoRef:null
    })

    timeouts.onAllBrokenTimeout && clearTimeout(timeouts.onAllBrokenTimeout)
    timeouts.onOutOfAmmoTimeout && clearTimeout(timeouts.onOutOfAmmoTimeout)
}

export const clearLevel = ()=>{
    useCurrentLevelState.setState({
        name:'',
        components:[],
        platforms:[],
        environment:[]
    })
    onReloadLevel.notifyObservers()
    useGameStore.setState({
        score:0,
    })
}

export const addExplosion = (explosion:Omit<ExplosionType,'guid'>)=>{
    const explosionSoundNames = ['poof_lower','poof_original'] as const
    const randomExplosionSound = explosionSoundNames[Math.floor(Math.random()*explosionSoundNames.length)]
    playSoundProgrammatically(randomExplosionSound,{ position: explosion.offset })  
    useSlingShotStore.setState((state)=>{
        return {explosions:[...state.explosions,{...explosion,guid:uuidv4()}]}
    })
}

export const moveCurrentAmmo = ( position:Vector3)=>{
    useSlingShotStore.setState((state) => ({
        ammoLoadout: state.ammoLoadout.map((ammo, index) => {
          if (index == state.currentAmmoIndex) {
            console.log('moving ammo '+index)
            return { ...ammo, position: position.clone() };
          }
          return ammo;
        })
      }));
}

export const markAmmoAsReleased = (ammoIndex:number)=>{
    useSlingShotStore.setState((state) => ({
        ammoLoadout: state.ammoLoadout.map((ammo, index) => {
          if (index == ammoIndex) {
            console.log('marking ammo '+index+ ' as released')
            return { ...ammo, released: true };
          }
          return ammo;
        })
      }));
}

export const isAmmoReleased = (ammoIndex:number)=>{
    return useSlingShotStore.getState().ammoLoadout[ammoIndex]?.released || false
}

export const currentAmmoPosition = ()=>{
    const state = useSlingShotStore.getState()
    return state.ammoLoadout[state.currentAmmoIndex]?.position?.clone() || new Vector3()
}

function setComponentsBreakableData(components:LevelFeatureProp[]){
    return components.map((component)=>({...component,health:featureHealth[component.type!], uuid:uuidv4()}))
}

export const loadLevel = (level:number)=>{
    useCurrentLevelState.setState(()=>{
        const isBuilderLevel = useGameStore.getState().menuState == MenuStatus.LEVEL_BUILDER
        const levelData = isBuilderLevel ? useLevelBuilderStore.getState() : structuredClone(levelsData[level])
        const cloned = structuredClone(levelData)
        return {
        ...cloned,
        components:setComponentsBreakableData(cloned.components as any[]),
        platforms:cloned.platforms.map((platform)=>({...platform,uuid:platform.uuid||uuidv4()})),
        environment:cloned.environment?.map((e)=>defaultEnvironmentProps(e)) || [],
    }
    })
}


export const getComponentHealth = (uuid:string)=>{
    return (useCurrentLevelState.getState().components.find((component)=>(component as any).uuid == uuid) as Breakable<LevelFeatureProp>)?.health || 0
}

export const updateComponentInLevel = (uuid:string, data:Partial<Breakable<LevelFeatureProp>>)=>{
    useCurrentLevelState.setState((state)=>{
        return {components:state.components.map((component)=>{
            if('uuid' in component && component.uuid == uuid){
                return {...component,...data}
            }
            return component
        })}
    })
}