// Apex Descent - Creature AI System
import { CONFIG } from '../config.js';

const STATES = {
  IDLE: 'idle',
  WANDER: 'wander',
  FLEE: 'flee',
  CHASE: 'chase',
  ATTACK: 'attack',
  DEAD: 'dead',
};

export class Creature {
  constructor(type, x, y) {
    const def = CONFIG.CREATURE_TYPES[type];
    this.type = type;
    this.name = def.name;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.health = def.health;
    this.maxHealth = def.health;
    this.damage = def.damage;
    this.speed = def.speed;
    this.aggressive = def.aggressive;
    this.xpReward = def.xp;
    this.color = def.color;
    this.size = def.size;
    this.drops = def.drops;
    this.facing = Math.random() * Math.PI * 2;

    // AI state
    this.state = STATES.IDLE;
    this.stateTimer = 2 + Math.random() * 3;
    this.target = null;
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.attackCooldown = 0;
    this.aggroRange = this.aggressive ? 150 : 80;
    this.deaggroRange = 250;
    this.attackRange = this.size + 16;
    this.alive = true;
    this.despawnTimer = 0;
    this.homeX = x;
    this.homeY = y;
    this.leashRange = 300;
    this.hitFlash = 0;
  }

  update(dt, player, world) {
    if (!this.alive) {
      this.despawnTimer += dt;
      return;
    }

    this.stateTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.hitFlash > 0) this.hitFlash -= dt;

    const distToPlayer = this.distanceTo(player);

    switch (this.state) {
      case STATES.IDLE:
        this.vx = 0;
        this.vy = 0;
        if (this.stateTimer <= 0) {
          this.state = STATES.WANDER;
          this.wanderAngle = Math.random() * Math.PI * 2;
          this.stateTimer = 2 + Math.random() * 4;
        }
        // Aggro check
        if (player.alive && this.aggressive && distToPlayer < this.aggroRange) {
          this.state = STATES.CHASE;
          this.target = player;
        }
        break;

      case STATES.WANDER:
        this.vx = Math.cos(this.wanderAngle) * this.speed * 0.4;
        this.vy = Math.sin(this.wanderAngle) * this.speed * 0.4;
        this.facing = this.wanderAngle;

        if (this.stateTimer <= 0) {
          this.state = STATES.IDLE;
          this.stateTimer = 1 + Math.random() * 3;
        }

        // Leash back to home
        const distHome = Math.sqrt((this.x - this.homeX) ** 2 + (this.y - this.homeY) ** 2);
        if (distHome > this.leashRange) {
          this.wanderAngle = Math.atan2(this.homeY - this.y, this.homeX - this.x);
        }

        // Random direction change
        if (Math.random() < 0.02) {
          this.wanderAngle += (Math.random() - 0.5) * 1.5;
        }

        // Aggro check
        if (player.alive && this.aggressive && distToPlayer < this.aggroRange) {
          this.state = STATES.CHASE;
          this.target = player;
        }
        break;

      case STATES.CHASE:
        if (!player.alive || distToPlayer > this.deaggroRange) {
          this.state = STATES.WANDER;
          this.wanderAngle = Math.atan2(this.homeY - this.y, this.homeX - this.x);
          this.stateTimer = 3;
          this.target = null;
          break;
        }

        const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
        this.vx = Math.cos(angleToPlayer) * this.speed;
        this.vy = Math.sin(angleToPlayer) * this.speed;
        this.facing = angleToPlayer;

        if (distToPlayer < this.attackRange) {
          this.state = STATES.ATTACK;
        }
        break;

      case STATES.ATTACK:
        this.vx = 0;
        this.vy = 0;

        if (!player.alive || distToPlayer > this.attackRange * 1.5) {
          this.state = STATES.CHASE;
          break;
        }

        if (this.attackCooldown <= 0) {
          this.attackCooldown = 1.0;
          return { type: 'attack', target: player, damage: this.damage };
        }
        break;

      case STATES.FLEE:
        if (distToPlayer > this.deaggroRange) {
          this.state = STATES.WANDER;
          this.stateTimer = 3;
          break;
        }
        const fleeAngle = Math.atan2(this.y - player.y, this.x - player.x);
        this.vx = Math.cos(fleeAngle) * this.speed * 1.3;
        this.vy = Math.sin(fleeAngle) * this.speed * 1.3;
        this.facing = fleeAngle;
        break;
    }

    // Apply movement with collision
    const tileSize = CONFIG.TILE_SIZE;
    const newX = this.x + this.vx * dt * 60;
    const newY = this.y + this.vy * dt * 60;

    if (world.isWalkable(Math.floor(newX / tileSize), Math.floor(this.y / tileSize))) {
      this.x = newX;
    } else {
      this.wanderAngle += Math.PI * 0.5;
    }
    if (world.isWalkable(Math.floor(this.x / tileSize), Math.floor(newY / tileSize))) {
      this.y = newY;
    } else {
      this.wanderAngle += Math.PI * 0.5;
    }

    return null;
  }

  takeDamage(amount) {
    this.health -= amount;
    this.hitFlash = 0.15;

    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      return this.getDrops();
    }

    // Non-aggressive creatures flee, aggressive ones chase
    if (!this.aggressive) {
      this.state = STATES.FLEE;
    } else if (this.state !== STATES.CHASE && this.state !== STATES.ATTACK) {
      this.state = STATES.CHASE;
    }

    return null;
  }

  getDrops() {
    const drops = [];
    for (const [type, maxAmount] of this.drops) {
      const amount = 1 + Math.floor(Math.random() * maxAmount);
      drops.push({ type, amount });
    }
    return drops;
  }

  distanceTo(entity) {
    return Math.sqrt((this.x - entity.x) ** 2 + (this.y - entity.y) ** 2);
  }

  shouldDespawn() {
    return !this.alive && this.despawnTimer > 10;
  }
}

export class CreatureManager {
  constructor(world) {
    this.world = world;
    this.creatures = [];
    this.maxCreatures = 80;
    this.spawnTimer = 0;
    this.spawnInterval = 3;
  }

  init(playerX, playerY) {
    // Initial spawn around spawn area
    this.spawnCreaturesInArea(playerX, playerY, 500, 20);
  }

  spawnCreaturesInArea(cx, cy, radius, count) {
    const ts = CONFIG.TILE_SIZE;
    for (let i = 0; i < count && this.creatures.length < this.maxCreatures; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * radius;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const tileX = Math.floor(x / ts);
      const tileY = Math.floor(y / ts);
      const tile = this.world.getTile(tileX, tileY);
      if (!tile || !tile.biome.walkable) continue;

      const type = this.getCreatureForBiome(tile.biome);
      if (type) {
        this.creatures.push(new Creature(type, x, y));
      }
    }
  }

  getCreatureForBiome(biome) {
    const biomes = CONFIG.BIOMES;
    const roll = Math.random();

    switch (biome) {
      case biomes.FOREST:
      case biomes.DENSE_FOREST:
        if (roll < 0.3) return 'DEER';
        if (roll < 0.5) return 'RABBIT';
        if (roll < 0.7) return 'BOAR';
        if (roll < 0.85) return 'WOLF';
        return 'BEAR';

      case biomes.PLAINS:
        if (roll < 0.35) return 'DEER';
        if (roll < 0.6) return 'RABBIT';
        if (roll < 0.8) return 'BOAR';
        return 'RAPTOR';

      case biomes.DESERT:
        if (roll < 0.4) return 'SNAKE';
        if (roll < 0.7) return 'RAPTOR';
        return 'REX';

      case biomes.TUNDRA:
      case biomes.SNOW_PEAK:
        if (roll < 0.3) return 'RABBIT';
        if (roll < 0.6) return 'WOLF';
        return 'BEAR';

      case biomes.SWAMP:
        if (roll < 0.3) return 'SNAKE';
        if (roll < 0.5) return 'BOAR';
        if (roll < 0.7) return 'RAPTOR';
        return 'WOLF';

      case biomes.MOUNTAIN:
        if (roll < 0.3) return 'BOAR';
        if (roll < 0.5) return 'WOLF';
        if (roll < 0.7) return 'BEAR';
        return 'REX';

      case biomes.VOLCANIC:
        if (roll < 0.5) return 'RAPTOR';
        return 'REX';

      case biomes.BEACH:
        if (roll < 0.5) return 'RABBIT';
        return 'DEER';

      default:
        return 'RABBIT';
    }
  }

  update(dt, player) {
    // Spawn timer
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnCreaturesInArea(player.x, player.y, 600, 3);
    }

    // Update all creatures
    const events = [];
    for (let i = this.creatures.length - 1; i >= 0; i--) {
      const c = this.creatures[i];

      // Despawn far away creatures
      const dist = c.distanceTo(player);
      if (dist > 1500 || c.shouldDespawn()) {
        this.creatures.splice(i, 1);
        continue;
      }

      const event = c.update(dt, player, this.world);
      if (event) events.push(event);
    }

    return events;
  }

  getCreaturesNear(x, y, range) {
    return this.creatures.filter(c => c.alive && c.distanceTo({ x, y }) < range);
  }
}
