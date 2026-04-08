// Apex Descent - Player Entity
import { CONFIG } from '../config.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 12;
    this.color = '#e8a87c';
    this.facing = 0;

    // Survival stats
    this.health = CONFIG.PLAYER.MAX_HEALTH;
    this.maxHealth = CONFIG.PLAYER.MAX_HEALTH;
    this.hunger = CONFIG.PLAYER.MAX_HUNGER;
    this.maxHunger = CONFIG.PLAYER.MAX_HUNGER;
    this.thirst = CONFIG.PLAYER.MAX_THIRST;
    this.maxThirst = CONFIG.PLAYER.MAX_THIRST;
    this.stamina = CONFIG.PLAYER.MAX_STAMINA;
    this.maxStamina = CONFIG.PLAYER.MAX_STAMINA;
    this.oxygen = CONFIG.PLAYER.MAX_OXYGEN;
    this.maxOxygen = CONFIG.PLAYER.MAX_OXYGEN;

    // RPG stats
    this.level = 1;
    this.xp = 0;
    this.xpToNext = CONFIG.PLAYER.XP_PER_LEVEL;
    this.statPoints = 0;
    this.techPoints = 0;
    this.unlockedRecipes = new Set(['STONE_PICKAXE', 'STONE_AXE', 'CAMPFIRE', 'THATCH_FOUNDATION', 'THATCH_WALL', 'SPEAR']);

    // Combat stats
    this.damage = CONFIG.PLAYER.BASE_DAMAGE;
    this.armor = CONFIG.PLAYER.BASE_ARMOR;
    this.attackCooldown = 0;
    this.attackSpeed = 0.5; // seconds between attacks
    this.invulnerable = 0;

    // Inventory
    this.inventory = [];
    this.inventorySize = CONFIG.PLAYER.INVENTORY_SIZE;
    this.equippedItem = null;
    this.hotbar = [null, null, null, null, null, null, null, null, null];
    this.selectedHotbar = 0;

    // Movement
    this.speed = CONFIG.PLAYER.MOVE_SPEED;
    this.sprinting = false;

    // State
    this.alive = true;
    this.gatherTarget = null;
    this.gatherTimer = 0;

    // Stats allocation
    this.stats = {
      vitality: 0,     // +10 hp per point
      endurance: 0,    // +10 stamina per point
      strength: 0,     // +2 melee damage per point
      fortitude: 0,    // +2 armor, resist cold/heat per point
      agility: 0,      // +0.1 speed per point
      weight: 0,       // +5 inventory slots per 5 points
    };
  }

  update(dt, input, world) {
    if (!this.alive) return;

    // Movement
    let dx = 0, dy = 0;
    if (input.isDown('KeyW') || input.isDown('ArrowUp')) dy = -1;
    if (input.isDown('KeyS') || input.isDown('ArrowDown')) dy = 1;
    if (input.isDown('KeyA') || input.isDown('ArrowLeft')) dx = -1;
    if (input.isDown('KeyD') || input.isDown('ArrowRight')) dx = 1;

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    // Sprint
    this.sprinting = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
    let moveSpeed = this.speed + this.stats.agility * 0.1;
    if (this.sprinting && this.stamina > 0 && (dx !== 0 || dy !== 0)) {
      moveSpeed *= CONFIG.PLAYER.SPRINT_MULTIPLIER;
      this.stamina -= CONFIG.PLAYER.STAMINA_SPRINT_DRAIN * dt * 60;
    } else if (!this.sprinting || (dx === 0 && dy === 0)) {
      this.stamina = Math.min(this.maxStamina, this.stamina + CONFIG.PLAYER.STAMINA_REGEN * dt * 60);
    }

    const newX = this.x + dx * moveSpeed * dt * 60;
    const newY = this.y + dy * moveSpeed * dt * 60;

    // Collision check
    const tileSize = CONFIG.TILE_SIZE;
    if (world.isWalkable(Math.floor(newX / tileSize), Math.floor(this.y / tileSize))) {
      this.x = newX;
    }
    if (world.isWalkable(Math.floor(this.x / tileSize), Math.floor(newY / tileSize))) {
      this.y = newY;
    }

    // Facing direction
    if (dx !== 0 || dy !== 0) {
      this.facing = Math.atan2(dy, dx);
    }

    // Mouse facing when not moving
    if (dx === 0 && dy === 0) {
      const mdx = input.mouse.worldX - this.x;
      const mdy = input.mouse.worldY - this.y;
      if (Math.abs(mdx) > 5 || Math.abs(mdy) > 5) {
        this.facing = Math.atan2(mdy, mdx);
      }
    }

    // Survival stats drain
    const weatherMod = CONFIG.WEATHER_TYPES[world.weather] || CONFIG.WEATHER_TYPES.CLEAR;
    this.hunger -= CONFIG.PLAYER.HUNGER_RATE * weatherMod.hungerMod * dt;
    this.thirst -= CONFIG.PLAYER.THIRST_RATE * weatherMod.thirstMod * dt;

    // Oxygen in underwater/swamp biomes
    const biome = world.getBiomeAt(this.x, this.y);
    if (biome === CONFIG.BIOMES.OCEAN) {
      this.oxygen -= 0.5 * dt * 60;
    } else {
      this.oxygen = Math.min(this.maxOxygen, this.oxygen + 2 * dt * 60);
    }

    // Health effects
    if (this.hunger <= 0) {
      this.hunger = 0;
      this.health -= 0.3 * dt * 60;
    }
    if (this.thirst <= 0) {
      this.thirst = 0;
      this.health -= 0.5 * dt * 60;
    }
    if (this.oxygen <= 0) {
      this.oxygen = 0;
      this.health -= 1.0 * dt * 60;
    }

    // Health regen when well-fed
    if (this.hunger > 50 && this.thirst > 50 && this.health < this.maxHealth) {
      this.health += CONFIG.PLAYER.HEALTH_REGEN * dt * 60;
    }

    // Clamp stats
    this.health = Math.max(0, Math.min(this.maxHealth, this.health));
    this.hunger = Math.max(0, Math.min(this.maxHunger, this.hunger));
    this.thirst = Math.max(0, Math.min(this.maxThirst, this.thirst));
    this.stamina = Math.max(0, Math.min(this.maxStamina, this.stamina));
    this.oxygen = Math.max(0, Math.min(this.maxOxygen, this.oxygen));

    // Death check
    if (this.health <= 0) {
      this.alive = false;
    }

    // Attack cooldown
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    // Invulnerability
    if (this.invulnerable > 0) this.invulnerable -= dt;

    // Hotbar selection via number keys
    for (let i = 0; i < 9; i++) {
      if (input.justPressed(`Digit${i + 1}`)) {
        this.selectedHotbar = i;
        this.equippedItem = this.hotbar[i];
      }
    }
  }

  addXP(amount) {
    this.xp += amount;
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.statPoints += 3;
      this.techPoints += 1;
      this.xpToNext = Math.floor(CONFIG.PLAYER.XP_PER_LEVEL * Math.pow(CONFIG.PLAYER.XP_SCALING, this.level - 1));
      // Level-up heal
      this.health = Math.min(this.maxHealth, this.health + 20);
      return true; // leveled up
    }
    return false;
  }

  allocateStat(stat) {
    if (this.statPoints <= 0) return false;
    if (!this.stats.hasOwnProperty(stat)) return false;

    this.stats[stat]++;
    this.statPoints--;

    // Apply stat effects
    this.maxHealth = CONFIG.PLAYER.MAX_HEALTH + this.stats.vitality * 10;
    this.maxStamina = CONFIG.PLAYER.MAX_STAMINA + this.stats.endurance * 10;
    this.damage = CONFIG.PLAYER.BASE_DAMAGE + this.stats.strength * 2;
    this.armor = CONFIG.PLAYER.BASE_ARMOR + this.stats.fortitude * 2;
    this.speed = CONFIG.PLAYER.MOVE_SPEED + this.stats.agility * 0.1;
    if (this.stats.weight % 5 === 0 && this.stats.weight > 0) {
      this.inventorySize = CONFIG.PLAYER.INVENTORY_SIZE + (this.stats.weight / 5) * 5;
    }
    return true;
  }

  takeDamage(amount) {
    if (this.invulnerable > 0) return 0;
    const reduced = Math.max(1, amount - this.armor);
    this.health -= reduced;
    this.invulnerable = 0.3;
    return reduced;
  }

  attack() {
    if (this.attackCooldown > 0) return null;
    this.attackCooldown = this.attackSpeed;

    const range = CONFIG.PLAYER.GATHER_RANGE;
    const damage = this.damage + (this.equippedItem ? (this.equippedItem.damage || 0) : 0);
    const toolType = this.equippedItem ? this.equippedItem.toolType : 'HAND';

    return {
      x: this.x + Math.cos(this.facing) * range * 0.5,
      y: this.y + Math.sin(this.facing) * range * 0.5,
      range: range,
      damage: damage,
      toolType: toolType,
      direction: this.facing,
    };
  }

  // Inventory methods
  addItem(type, amount) {
    // Check existing stacks
    const resourceDef = CONFIG.RESOURCE_TYPES[type];
    if (!resourceDef) return amount; // return remainder

    const stackSize = resourceDef.stackSize;

    for (const slot of this.inventory) {
      if (slot && slot.type === type && slot.amount < stackSize) {
        const canAdd = stackSize - slot.amount;
        const adding = Math.min(canAdd, amount);
        slot.amount += adding;
        amount -= adding;
        if (amount <= 0) return 0;
      }
    }

    // New stacks
    while (amount > 0 && this.inventory.length < this.inventorySize) {
      const adding = Math.min(stackSize, amount);
      this.inventory.push({ type, amount: adding, ...resourceDef });
      amount -= adding;
    }

    return amount; // remainder that didn't fit
  }

  removeItem(type, amount) {
    for (let i = this.inventory.length - 1; i >= 0; i--) {
      if (this.inventory[i] && this.inventory[i].type === type) {
        if (this.inventory[i].amount <= amount) {
          amount -= this.inventory[i].amount;
          this.inventory.splice(i, 1);
        } else {
          this.inventory[i].amount -= amount;
          amount = 0;
        }
        if (amount <= 0) return true;
      }
    }
    return amount <= 0;
  }

  hasItem(type, amount) {
    let total = 0;
    for (const slot of this.inventory) {
      if (slot && slot.type === type) total += slot.amount;
    }
    return total >= amount;
  }

  countItem(type) {
    let total = 0;
    for (const slot of this.inventory) {
      if (slot && slot.type === type) total += slot.amount;
    }
    return total;
  }

  equipToHotbar(inventoryIndex, hotbarSlot) {
    if (inventoryIndex < 0 || inventoryIndex >= this.inventory.length) return;
    if (hotbarSlot < 0 || hotbarSlot >= 9) return;
    this.hotbar[hotbarSlot] = this.inventory[inventoryIndex];
    if (hotbarSlot === this.selectedHotbar) {
      this.equippedItem = this.hotbar[hotbarSlot];
    }
  }

  respawn(spawnPoint) {
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.health = this.maxHealth * 0.5;
    this.hunger = this.maxHunger * 0.5;
    this.thirst = this.maxThirst * 0.5;
    this.stamina = this.maxStamina;
    this.oxygen = this.maxOxygen;
    this.alive = true;
    this.invulnerable = 3;
    // Drop some items on death
    const dropCount = Math.floor(this.inventory.length * 0.3);
    for (let i = 0; i < dropCount; i++) {
      if (this.inventory.length > 0) {
        const idx = Math.floor(Math.random() * this.inventory.length);
        this.inventory.splice(idx, 1);
      }
    }
  }
}
