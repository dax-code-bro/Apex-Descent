// Apex Descent - Crafting System
export const ITEMS = {
  // Tools - Stone tier
  STONE_PICKAXE: {
    name: 'Stone Pickaxe', type: 'tool', toolType: 'PICKAXE', tier: 1,
    damage: 8, gatherBonus: { ROCK: 2, ORE: 1.5 }, durability: 100,
    color: '#888', recipe: { WOOD: 5, STONE: 8, FIBER: 3 }, techLevel: 0,
  },
  STONE_AXE: {
    name: 'Stone Axe', type: 'tool', toolType: 'AXE', tier: 1,
    damage: 10, gatherBonus: { TREE: 2 }, durability: 100,
    color: '#777', recipe: { WOOD: 5, STONE: 8, FIBER: 3 }, techLevel: 0,
  },
  SPEAR: {
    name: 'Spear', type: 'weapon', toolType: 'SPEAR', tier: 1,
    damage: 15, durability: 80,
    color: '#8B7355', recipe: { WOOD: 8, STONE: 3, FIBER: 5 }, techLevel: 0,
  },
  TORCH: {
    name: 'Torch', type: 'tool', toolType: 'TORCH', tier: 1,
    damage: 5, durability: 60, light: true,
    color: '#ff8800', recipe: { WOOD: 3, THATCH: 5, FIBER: 2 }, techLevel: 0,
  },

  // Tools - Metal tier
  METAL_PICKAXE: {
    name: 'Metal Pickaxe', type: 'tool', toolType: 'PICKAXE', tier: 2,
    damage: 15, gatherBonus: { ROCK: 3, ORE: 2.5, CRYSTAL: 2 }, durability: 250,
    color: '#C0C0C0', recipe: { WOOD: 5, METAL_INGOT: 10, HIDE: 3 }, techLevel: 2,
  },
  METAL_AXE: {
    name: 'Metal Axe', type: 'tool', toolType: 'AXE', tier: 2,
    damage: 18, gatherBonus: { TREE: 3 }, durability: 250,
    color: '#C0C0C0', recipe: { WOOD: 5, METAL_INGOT: 10, HIDE: 3 }, techLevel: 2,
  },
  METAL_SWORD: {
    name: 'Metal Sword', type: 'weapon', toolType: 'SWORD', tier: 2,
    damage: 30, durability: 200,
    color: '#B8B8B8', recipe: { METAL_INGOT: 15, WOOD: 5, HIDE: 5 }, techLevel: 2,
  },
  BOW: {
    name: 'Bow', type: 'weapon', toolType: 'BOW', tier: 1,
    damage: 20, range: 200, durability: 120,
    color: '#8B6914', recipe: { WOOD: 10, FIBER: 15 }, techLevel: 1,
  },

  // Armor - Hide
  HIDE_HELMET: {
    name: 'Hide Helmet', type: 'armor', slot: 'head', tier: 1,
    armor: 5, durability: 80,
    color: '#D2691E', recipe: { HIDE: 8, FIBER: 5 }, techLevel: 1,
  },
  HIDE_CHEST: {
    name: 'Hide Chestpiece', type: 'armor', slot: 'chest', tier: 1,
    armor: 10, durability: 100,
    color: '#D2691E', recipe: { HIDE: 15, FIBER: 8 }, techLevel: 1,
  },
  HIDE_LEGS: {
    name: 'Hide Leggings', type: 'armor', slot: 'legs', tier: 1,
    armor: 8, durability: 90,
    color: '#D2691E', recipe: { HIDE: 12, FIBER: 6 }, techLevel: 1,
  },

  // Armor - Metal
  METAL_HELMET: {
    name: 'Metal Helmet', type: 'armor', slot: 'head', tier: 2,
    armor: 15, durability: 200,
    color: '#808080', recipe: { METAL_INGOT: 12, HIDE: 5 }, techLevel: 3,
  },
  METAL_CHEST: {
    name: 'Metal Chestpiece', type: 'armor', slot: 'chest', tier: 2,
    armor: 25, durability: 250,
    color: '#808080', recipe: { METAL_INGOT: 25, HIDE: 10 }, techLevel: 3,
  },
  METAL_LEGS: {
    name: 'Metal Leggings', type: 'armor', slot: 'legs', tier: 2,
    armor: 20, durability: 220,
    color: '#808080', recipe: { METAL_INGOT: 18, HIDE: 8 }, techLevel: 3,
  },

  // Consumables
  COOKED_MEAT_ITEM: {
    name: 'Cooked Meat', type: 'consumable', consumeType: 'food',
    hungerRestore: 25, healthRestore: 5,
    color: '#8B0000', recipe: { MEAT: 1 }, craftedAt: 'CAMPFIRE', techLevel: 0,
  },
  WATER_BOTTLE_ITEM: {
    name: 'Water Bottle', type: 'consumable', consumeType: 'water',
    thirstRestore: 30,
    color: '#1E90FF', recipe: { FIBER: 3 }, techLevel: 0,
  },
  BANDAGE: {
    name: 'Bandage', type: 'consumable', consumeType: 'heal',
    healthRestore: 25,
    color: '#F5F5DC', recipe: { FIBER: 10 }, techLevel: 0,
  },
  BERRY_MIX: {
    name: 'Berry Mix', type: 'consumable', consumeType: 'food',
    hungerRestore: 10, thirstRestore: 5,
    color: '#8B008B', recipe: { BERRIES: 5 }, techLevel: 0,
  },

  // Processed materials
  METAL_INGOT_ITEM: {
    name: 'Metal Ingot', type: 'material',
    color: '#C0C0C0', recipe: { METAL_ORE: 2 }, craftedAt: 'FORGE', techLevel: 2,
    produces: 'METAL_INGOT',
  },
  ELECTRONICS_ITEM: {
    name: 'Electronics', type: 'material',
    color: '#00FF00', recipe: { METAL_INGOT: 3, CRYSTAL: 2 }, craftedAt: 'FORGE', techLevel: 3,
    produces: 'ELECTRONICS',
  },
  POLYMER_ITEM: {
    name: 'Polymer', type: 'material',
    color: '#4169E1', recipe: { FIBER: 10, METAL_ORE: 2 }, craftedAt: 'FORGE', techLevel: 3,
    produces: 'POLYMER',
  },
};

// Building recipes
export const BUILDINGS = {
  // Thatch tier
  THATCH_FOUNDATION: {
    name: 'Thatch Foundation', type: 'FOUNDATION', tier: 1,
    width: 1, height: 1, solid: false, health: 200,
    color: '#C4A35A', recipe: { THATCH: 10, WOOD: 5 }, techLevel: 0,
  },
  THATCH_WALL: {
    name: 'Thatch Wall', type: 'WALL', tier: 1,
    width: 1, height: 1, solid: true, health: 300,
    color: '#B8963E', recipe: { THATCH: 15, WOOD: 8 }, techLevel: 0,
  },
  THATCH_CEILING: {
    name: 'Thatch Ceiling', type: 'CEILING', tier: 1,
    width: 1, height: 1, solid: false, health: 200,
    color: '#D4B65A', recipe: { THATCH: 12, WOOD: 6 }, techLevel: 0,
  },
  THATCH_DOOR: {
    name: 'Thatch Door', type: 'DOOR', tier: 1,
    width: 1, height: 1, solid: false, health: 150,
    color: '#A08030', recipe: { THATCH: 8, WOOD: 5, FIBER: 3 }, techLevel: 0,
  },

  // Wood tier
  WOOD_FOUNDATION: {
    name: 'Wood Foundation', type: 'FOUNDATION', tier: 2,
    width: 1, height: 1, solid: false, health: 500,
    color: '#8B7355', recipe: { WOOD: 20 }, techLevel: 1,
  },
  WOOD_WALL: {
    name: 'Wood Wall', type: 'WALL', tier: 2,
    width: 1, height: 1, solid: true, health: 750,
    color: '#7A6245', recipe: { WOOD: 30 }, techLevel: 1,
  },
  WOOD_DOOR: {
    name: 'Wood Door', type: 'DOOR', tier: 2,
    width: 1, height: 1, solid: false, health: 400,
    color: '#6B5535', recipe: { WOOD: 20, FIBER: 5 }, techLevel: 1,
  },

  // Stone tier
  STONE_FOUNDATION: {
    name: 'Stone Foundation', type: 'FOUNDATION', tier: 3,
    width: 1, height: 1, solid: false, health: 1500,
    color: '#808080', recipe: { STONE: 40, WOOD: 10 }, techLevel: 2,
  },
  STONE_WALL: {
    name: 'Stone Wall', type: 'WALL', tier: 3,
    width: 1, height: 1, solid: true, health: 2000,
    color: '#707070', recipe: { STONE: 60, WOOD: 15 }, techLevel: 2,
  },

  // Metal tier
  METAL_WALL: {
    name: 'Metal Wall', type: 'WALL', tier: 4,
    width: 1, height: 1, solid: true, health: 5000,
    color: '#A0A0A0', recipe: { METAL_INGOT: 20, STONE: 10 }, techLevel: 3,
  },

  // Utility structures
  CAMPFIRE: {
    name: 'Campfire', type: 'CAMPFIRE', tier: 1,
    width: 1, height: 1, solid: false, health: 100,
    color: '#8B4513', recipe: { WOOD: 10, STONE: 5, THATCH: 5 }, techLevel: 0,
    functional: true, warmth: 10,
  },
  FORGE: {
    name: 'Forge', type: 'FORGE', tier: 2,
    width: 1, height: 1, solid: true, health: 500,
    color: '#555', recipe: { STONE: 30, WOOD: 15, METAL_ORE: 5 }, techLevel: 2,
    functional: true,
  },
  STORAGE_BOX: {
    name: 'Storage Box', type: 'STORAGE', tier: 1,
    width: 1, height: 1, solid: true, health: 200,
    color: '#8B7355', recipe: { WOOD: 20, FIBER: 5 }, techLevel: 1,
    functional: true, slots: 20,
  },
  SLEEPING_BAG: {
    name: 'Sleeping Bag', type: 'BED', tier: 1,
    width: 1, height: 1, solid: false, health: 100,
    color: '#4a2f1a', recipe: { HIDE: 10, FIBER: 15 }, techLevel: 1,
    functional: true, respawnPoint: true,
  },
};

// Tech tree - what tech level unlocks what
export const TECH_TREE = {
  0: ['STONE_PICKAXE', 'STONE_AXE', 'SPEAR', 'TORCH', 'CAMPFIRE', 'THATCH_FOUNDATION', 'THATCH_WALL', 'THATCH_CEILING', 'THATCH_DOOR', 'WATER_BOTTLE_ITEM', 'BANDAGE', 'BERRY_MIX'],
  1: ['BOW', 'HIDE_HELMET', 'HIDE_CHEST', 'HIDE_LEGS', 'WOOD_FOUNDATION', 'WOOD_WALL', 'WOOD_DOOR', 'STORAGE_BOX', 'SLEEPING_BAG'],
  2: ['METAL_PICKAXE', 'METAL_AXE', 'METAL_SWORD', 'FORGE', 'STONE_FOUNDATION', 'STONE_WALL', 'METAL_INGOT_ITEM'],
  3: ['METAL_HELMET', 'METAL_CHEST', 'METAL_LEGS', 'METAL_WALL', 'ELECTRONICS_ITEM', 'POLYMER_ITEM'],
};

export class CraftingSystem {
  constructor(player) {
    this.player = player;
    this.craftQueue = [];
    this.craftTimer = 0;
  }

  canCraft(itemId) {
    const item = ITEMS[itemId] || BUILDINGS[itemId];
    if (!item || !item.recipe) return false;
    if (!this.player.unlockedRecipes.has(itemId)) return false;

    for (const [resource, amount] of Object.entries(item.recipe)) {
      if (!this.player.hasItem(resource, amount)) return false;
    }
    return true;
  }

  craft(itemId) {
    if (!this.canCraft(itemId)) return false;

    const item = ITEMS[itemId] || BUILDINGS[itemId];

    // Consume resources
    for (const [resource, amount] of Object.entries(item.recipe)) {
      this.player.removeItem(resource, amount);
    }

    // If it produces a material, add that
    if (item.produces) {
      this.player.addItem(item.produces, 1);
    } else if (item.type === 'consumable') {
      // Add the consumable item
      this.player.addItem(itemId, 1);
    } else if (BUILDINGS[itemId]) {
      // Building goes into inventory as a placeable
      this.player.addItem(itemId, 1);
    } else {
      // Tool/weapon/armor - add to inventory
      this.player.addItem(itemId, 1);
    }

    // XP for crafting
    this.player.addXP(5 + (item.tier || 1) * 3);

    return true;
  }

  unlockRecipe(itemId) {
    this.player.unlockedRecipes.add(itemId);
  }

  getAvailableRecipes() {
    const recipes = [];
    for (const [id, item] of Object.entries({ ...ITEMS, ...BUILDINGS })) {
      if (this.player.unlockedRecipes.has(id)) {
        recipes.push({ id, ...item, craftable: this.canCraft(id) });
      }
    }
    return recipes;
  }

  unlockTechLevel(level) {
    const unlocks = TECH_TREE[level];
    if (unlocks) {
      for (const id of unlocks) {
        this.player.unlockedRecipes.add(id);
      }
    }
  }

  useConsumable(itemId) {
    const item = ITEMS[itemId];
    if (!item || item.type !== 'consumable') return false;
    if (!this.player.hasItem(itemId, 1)) return false;

    this.player.removeItem(itemId, 1);

    if (item.hungerRestore) this.player.hunger = Math.min(this.player.maxHunger, this.player.hunger + item.hungerRestore);
    if (item.thirstRestore) this.player.thirst = Math.min(this.player.maxThirst, this.player.thirst + item.thirstRestore);
    if (item.healthRestore) this.player.health = Math.min(this.player.maxHealth, this.player.health + item.healthRestore);

    return true;
  }
}
