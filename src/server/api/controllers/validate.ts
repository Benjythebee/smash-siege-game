import { ExpectedLevelDataFromClient, FeatureType, LevelType } from '../../../common/types';

export const validateLevelData = (levelData: ExpectedLevelDataFromClient) => {
  // Check if the level name is valid
  if (typeof levelData.name == 'undefined' || levelData.name.length < 3) {
    return 'Level name is too short';
  }

  if (levelData.total_ammo < 0) {
    return 'Total ammo cannot be negative';
  }

  if (levelData.total_ammo == 0) {
    return 'Total ammo cannot be 0';
  }

  // Check if the level description is valid
  if (levelData.description && levelData.description.length < 3) {
    return 'Level description is too short';
  }

  // Check images
  if (levelData.image_url && !levelData.image_url.match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g)) {
    return 'Invalid image type';
  }

  if (levelData.image_url) {
    // Check image size
    // @see https://stackoverflow.com/a/49750491/9970490
    let stringLength = levelData.image_url.length - 'data:image/png;base64,'.length;

    let sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    let sizeInKb = sizeInBytes / 1000;
    if (sizeInKb > 100) {
      return 'Image size is too large';
    }
  }

  // Check if the level content is valid
  if (Object.keys(levelData.content).length === 0) {
    return 'Level content is empty';
  }
  // Check if level has all the necessary keys
  if (!('components' in levelData.content) || !('platforms' in levelData.content) || !('environment' in levelData.content)) {
    return 'Level content is missing a necessary keys';
  }

  if (levelData.content.components.length === 0) {
    return 'Level content is missing components';
  }
  if (levelData.content.platforms.length === 0) {
    return 'Level content is missing platforms';
  }

  // For each component, check if it has all the necessary keys
  for (const component of levelData.content.components) {
    if (!('type' in component) || !Array.isArray(component.position) || !Array.isArray(component.scale) || !Array.isArray(component.rotation) || !('platformIndex' in component)) {
      return 'Component is missing a necessary key';
    }

    if (isNaN(Number(component.platformIndex))) {
      return 'Component has an invalid platform index: ' + component.platformIndex;
    }

    if (!FeatureType.includes(component.type!)) {
      return 'Component has an invalid type: ' + component.type;
    }

    if (component.position!.length !== 3) {
      return 'Component position is invalid';
    } else {
      for (const pos of component.position) {
        if (isNaN(Number(pos))) {
          return 'Component position is invalid';
        }
      }
    }

    if (component.scale!.length !== 3) {
      return 'Component scale is invalid';
    } else {
      for (const pos of component.scale) {
        if (isNaN(Number(pos))) {
          return 'Component scale is invalid';
        }
      }
    }

    if (component.rotation!.length !== 3) {
      return 'Component rotation is invalid';
    } else {
      for (const pos of component.rotation) {
        if (isNaN(Number(pos))) {
          return 'Component rotation is invalid';
        }
      }
    }

    return undefined;
  }
};
