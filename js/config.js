// Apex Descent - Game Configuration
export const CONFIG = {
  // Display
  TILE_SIZE: 32,
  VIEWPORT_TILES_X: 30,
  VIEWPORT_TILES_Y: 20,

  // World
  WORLD_WIDTH: 512,
  WORLD_HEIGHT: 512,
  CHUNK_SIZE: 16,

  // Biomes
  BIOMES: {
    OCEAN: { id: 0, name: 'Ocean', color: '#1a5276', walkable: false },
    BEACH: { id: 1, name: 'Beach', color: '#f9e79f', walkable: true },
    FOREST: { id: 2, name: 'Forest', color: '#27ae60', walkable: true },
    DENSE_FOREST: { id: 3, name: 'Dense Forest', color: '#1e8449', walkable: true },
    PLAINS: { id: 4, name: 'Plains', color: '#82e0aa', walkable: true },
    DESERT: { id: 5, name: 'Desert', color: '#f0b27a', walkable: true },
    TUNDRA: { id: 6, name: 'Tundra', color: '#d5dbdb', walkable: true },
    SWAMP: { id: 7, name: 'Swamp', color: '#6c7a4e', walkable: true },
    MOUNTAIN: { id: 8, name: 'Mountain', color: '#7f8c8d', walkable: true },
    SNOW_PEAK: { id: 9, name: 'Snow Peak', color: '#f0f3f4', walkable: true },
    VOLCANIC: { id: 10, name: 'Volcanic', color: '#641e16', walkable: true },
  },

  // Player
  PLAYER: {
    MAX_HEALTH: 100,
    MAX_HUNGER: 100,
    MAX_THIRST: 100,
    MAX_STAMINA: 100,
    MAX_OXYGEN: 100,
    MOVE_SPEED: 3,
    SPRINT_MULTIPLIER: 1.8,
    HUNGER_RATE: 0.08,
    THIRST_RATE: 0.12,
    STAMINA_REGEN: 0.5,
    STAMINA_SPRINT_DRAIN: 0.8,
    HEALTH_REGEN: 0.02,
    INVENTORY_SIZE: 30,
    BASE_DAMAGE: 5,
    BASE_ARMOR: 0,
    GATHER_RANGE: 48,
    BUILD_RANGE: 96,
    XP_PER_LEVEL: 100,
    XP_SCALING: 1.15,
  },

  // Day/Night
  DAY_CYCLE: {
    DURATION: 600,  // seconds for full cycle
    DAWN: 0.2,
    NOON: 0.5,
    DUSK: 0.75,
    MIDNIGHT: 0.0,
  },

  // Resources
  RESOURCE_TYPES: {
    WOOD: { name: 'Wood', icon: '🪵', stackSize: 50, color: '#8B4513' },
    STONE: { name: 'Stone', icon: '🪨', stackSize: 50, color: '#808080' },
    FIBER: { name: 'Fiber', icon: '🌿', stackSize: 100, color: '#228B22' },
    METAL_ORE: { name: 'Metal Ore', icon: '⛏️', stackSize: 30, color: '#B87333' },
    HIDE: { name: 'Hide', icon: '🦴', stackSize: 20, color: '#D2691E' },
    MEAT: { name: 'Raw Meat', icon: '🥩', stackSize: 10, color: '#DC143C' },
    BERRIES: { name: 'Berries', icon: '🫐', stackSize: 30, color: '#4B0082' },
    THATCH: { name: 'Thatch', icon: '🌾', stackSize: 100, color: '#DAA520' },
    CRYSTAL: { name: 'Crystal', icon: '💎', stackSize: 15, color: '#00CED1' },
    SULFUR: { name: 'Sulfur', icon: '🟡', stackSize: 20, color: '#FFD700' },
    POLYMER: { name: 'Polymer', icon: '🔷', stackSize: 20, color: '#4169E1' },
    ELECTRONICS: { name: 'Electronics', icon: '⚡', stackSize: 10, color: '#00FF00' },
    COOKED_MEAT: { name: 'Cooked Meat', icon: '🍖', stackSize: 10, color: '#8B0000' },
    WATER_BOTTLE: { name: 'Water Bottle', icon: '💧', stackSize: 5, color: '#1E90FF' },
    METAL_INGOT: { name: 'Metal Ingot', icon: '🔩', stackSize: 20, color: '#C0C0C0' },
  },

  // Creatures
  CREATURE_TYPES: {
    DEER: { name: 'Deer', health: 40, damage: 0, speed: 2.5, aggressive: false, xp: 15, color: '#c4903d', size: 14, drops: [['MEAT', 2], ['HIDE', 1]] },
    RABBIT: { name: 'Rabbit', health: 15, damage: 0, speed: 3.5, aggressive: false, xp: 5, color: '#d4a574', size: 8, drops: [['MEAT', 1]] },
    BOAR: { name: 'Boar', health: 60, damage: 12, speed: 2, aggressive: false, xp: 20, color: '#5c4033', size: 14, drops: [['MEAT', 3], ['HIDE', 2]] },
    WOLF: { name: 'Wolf', health: 80, damage: 18, speed: 3, aggressive: true, xp: 35, color: '#696969', size: 14, drops: [['MEAT', 2], ['HIDE', 3]] },
    BEAR: { name: 'Bear', health: 200, damage: 30, speed: 2.2, aggressive: true, xp: 80, color: '#4a3728', size: 20, drops: [['MEAT', 5], ['HIDE', 5]] },
    RAPTOR: { name: 'Raptor', health: 120, damage: 25, speed: 4, aggressive: true, xp: 60, color: '#4a7a3d', size: 16, drops: [['MEAT', 3], ['HIDE', 3]] },
    REX: { name: 'Rex', health: 500, damage: 60, speed: 2.5, aggressive: true, xp: 200, color: '#3d5c3a', size: 28, drops: [['MEAT', 10], ['HIDE', 8]] },
    SNAKE: { name: 'Snake', health: 30, damage: 15, speed: 2, aggressive: true, xp: 15, color: '#2d5016', size: 8, drops: [['MEAT', 1], ['HIDE', 1]] },
    FISH: { name: 'Fish', health: 10, damage: 0, speed: 1.5, aggressive: false, xp: 5, color: '#5f9ea0', size: 8, drops: [['MEAT', 1]] },
  },

  // Weather
  WEATHER_TYPES: {
    CLEAR: { name: 'Clear', hungerMod: 1, thirstMod: 1, staminaMod: 1 },
    RAIN: { name: 'Rain', hungerMod: 1.1, thirstMod: 0.8, staminaMod: 1.1 },
    STORM: { name: 'Storm', hungerMod: 1.2, thirstMod: 0.7, staminaMod: 1.3 },
    HEAT_WAVE: { name: 'Heat Wave', hungerMod: 1.1, thirstMod: 1.5, staminaMod: 1.2 },
    BLIZZARD: { name: 'Blizzard', hungerMod: 1.4, thirstMod: 1.0, staminaMod: 1.5 },
    FOG: { name: 'Fog', hungerMod: 1.0, thirstMod: 1.0, staminaMod: 1.0 },
  },
};
