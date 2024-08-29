import { EnvironmentFeatureProp, LevelFeatureProp, LevelPlatformProp } from "./levels/types"
import levelZero from './levels/level.0'
import levelOne from './levels/level.1'
import levelTwo from './levels/level.2'
import levelThree from './levels/level.3'
import levelFour from './levels/level.4'
import levelFive from './levels/level.5'
import levelSix from './levels/level.6'

export type LevelData = {
    name:string,
    totalAmmo:number,
    environment?:Partial<EnvironmentFeatureProp>[],
    platforms:Partial<LevelPlatformProp>[],
    components:Partial<LevelFeatureProp>[]
}

export const levelsData:LevelData[]= [
    levelZero,
    levelOne,
    levelTwo,
    levelThree,
    levelFour,
    levelFive,
    levelSix
]
