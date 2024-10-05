import { LevelData } from '../../../../../../common/types';

export function cleanLevel(object: LevelData) {
  // cleanup object
  // remove uuid
  object.platforms = object.platforms.map((plat) => {
    //@ts-ignore
    const { uuid, health, ...rest } = plat;
    return rest;
  });
  object.environment = object.environment!.map((env) => {
    //@ts-ignore
    const { uuid, health, ...rest } = env;
    return rest;
  });
  object.components = object.components.map((comp) => {
    //@ts-ignore
    const { uuid, health, ...rest } = comp;
    return rest;
  });
  return object;
}
