import { Color } from "@react-three/fiber"
import { v4 as uuidv4 } from 'uuid';
import { featureHealth } from "../../components/3d/levelFeatures/constants";
export const EnvironmentFeatureTypes = ['plant','rock_1','rock_2','large_rock','kelp'] as const
export type EnvironmentFeatureTypes = typeof EnvironmentFeatureTypes[number]

export const FeatureType = ['wood','stone','cement','boulder','trampoline'] as const
export type FeatureType = typeof FeatureType[number]

export const IndestructibleType = ['boulder','trampoline'] as const
export type IndestructibleType = typeof FeatureType[number]


export type LevelPlatformProp = {
    scale:[x: number, y: number, z: number],
    position:[x: number, y: number, z: number],
    rotation:[x: number, y: number, z: number],
    width:number,
    height:number,
    depth:number,
    color:string|Color
    uuid:string
}

export type EnvironmentFeatureProp = {
    type:EnvironmentFeatureTypes
    scale:[x: number, y: number, z: number],
    position:[x: number, y: number, z: number],
    rotation:[x: number, y: number, z: number],
    width:number,
    height:number,
    depth:number,
    uuid:string
}

export type LevelFeatureProp = {
    type:FeatureType,
    platformIndex?:number,
    /**
     * Used for level editor
     */
    name?:string, 
    scale:[x: number, y: number, z: number],
    position:[x: number, y: number, z: number],
    rotation:[x: number, y: number, z: number],
    width:number,
    height:number,
    depth:number,
    color:string|Color
    uuid:string
}

export type Breakable<T extends LevelFeatureProp> = T & {
    health:number
    uuid:string
}


export const defaultPlatformProps = (props:Partial<LevelPlatformProp>):LevelPlatformProp => {
    return {
        scale:[1,1,1] as [x: number, y: number, z: number],
        position:[0,0,0] as [x: number, y: number, z: number],
        rotation:[0,0,0] as [x: number, y: number, z: number],
        width:1,
        height:1,
        depth:1,
        color:"#000",
        uuid:props.uuid || uuidv4(),
        ...props
    }
}
export const defaultFeatureProps = (props:Partial<Breakable<LevelFeatureProp>>):Breakable<LevelFeatureProp> => {
    return {
        platformIndex:0,
        scale:[1,1,1] as [x: number, y: number, z: number],
        position:[0,0,0] as [x: number, y: number, z: number],
        rotation:[0,0,0] as [x: number, y: number, z: number],
        width:1,
        height:1,
        depth:1,
        color:"#000",
        type:'wood',
        health:featureHealth['wood'],
        uuid:props.uuid || uuidv4(),
        ...props
    }
}

export const defaultEnvironmentProps = (props:Partial<EnvironmentFeatureProp>):EnvironmentFeatureProp => {
    return {
        scale:[1,1,1] as [x: number, y: number, z: number],
        position:[0,0,0] as [x: number, y: number, z: number],
        rotation:[0,0,0] as [x: number, y: number, z: number],
        width:1,
        height:1,
        depth:1,
        type:'plant',
        ...props,
        uuid:props.uuid || uuidv4(),
    }
}