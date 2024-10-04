export const EnvironmentFeatureTypes = ['plant', 'rock_1', 'rock_2', 'large_rock', 'kelp'] as const;
export type EnvironmentFeatureTypes = (typeof EnvironmentFeatureTypes)[number];

export const FeatureType = ['wood', 'stone', 'cement', 'boulder', 'trampoline'] as const;
export type FeatureType = (typeof FeatureType)[number];

export const IndestructibleType = ['boulder', 'trampoline'] as const;
export type IndestructibleType = (typeof FeatureType)[number];

export type LevelPlatformProp = {
  scale: [x: number, y: number, z: number];
  position: [x: number, y: number, z: number];
  rotation: [x: number, y: number, z: number];
  width: number;
  height: number;
  depth: number;
  color: string;
  uuid: string;
};

export type EnvironmentFeatureProp = {
  type: EnvironmentFeatureTypes;
  scale: [x: number, y: number, z: number];
  position: [x: number, y: number, z: number];
  rotation: [x: number, y: number, z: number];
  width: number;
  height: number;
  depth: number;
  uuid: string;
};

export type LevelFeatureProp = {
  type: FeatureType;
  platformIndex?: number;
  /**
   * Used for level editor
   */
  name?: string;
  scale: [x: number, y: number, z: number];
  position: [x: number, y: number, z: number];
  rotation: [x: number, y: number, z: number];
  width: number;
  height: number;
  depth: number;
  color: string;
  uuid: string;
};

export type LevelData = {
  name: string;
  description?: string;
  image_url?: string;
  totalAmmo: number;
  environment?: Partial<EnvironmentFeatureProp>[];
  platforms: Partial<LevelPlatformProp>[];
  components: Partial<LevelFeatureProp>[];
};
/**
 * The data inside 'content' of a level in the Database
 */
export type LevelDataDB = Omit<LevelData, 'totalAmmo' | 'name'>;
/**
 * Represents a level in the database;
 */
export type LevelType = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: Date;
  wallet: string;
  updated_at: Date;
  author: string;
  total_ammo: number;
  content: LevelDataDB;
};

export type ExpectedLevelDataFromClient = Omit<LevelType, 'author' | 'wallet' | 'created_at' | 'updated_at' | 'id'>;
