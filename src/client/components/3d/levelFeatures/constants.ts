/**
 * Max Health of materials, also equivalent to the amount of score points that can be obtained from them
 * Health of -1 means that the material is indestructible
 */
export const featureHealth = {
    wood: 400,
    stone: 800,
    cement: 1200,
    trampoline: -1,
    boulder:-1
  };

export const featurePhysics = {
    wood: { mass: 1, friction: 0.6, restitution: 0.0 },
    stone: { mass: 1, friction: 0.6, restitution: 0.0 },
    cement: { mass: 1.5, friction: 0.6, restitution: 0.1 },
    trampoline: { mass: 0.9, friction: 0.6, restitution: 1.0 },
    boulder: { mass: 1.9, friction: 1.2, restitution: 0.01 }
}