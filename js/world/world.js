// Apex Descent - World Generation
import { CONFIG } from '../config.js';

// Simple seeded PRNG
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return this.seed / 2147483647;
  }
}

// Simplex-like noise using value noise with interpolation
class NoiseGenerator {
  constructor(seed) {
    this.rng = new SeededRandom(seed);
    this.perm = [];
    this.grad = [];
    for (let i = 0; i < 512; i++) {
      this.perm[i] = Math.floor(this.rng.next() * 256);
      this.grad[i] = this.rng.next() * 2 - 1;
    }
  }

  noise2D(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    const n00 = this.dotGrad(ix, iy);
    const n10 = this.dotGrad(ix + 1, iy);
    const n01 = this.dotGrad(ix, iy + 1);
    const n11 = this.dotGrad(ix + 1, iy + 1);

    const nx0 = n00 + sx * (n10 - n00);
    const nx1 = n01 + sx * (n11 - n01);
    return nx0 + sy * (nx1 - nx0);
  }

  dotGrad(ix, iy) {
    const idx = (this.perm[(ix & 255) + this.perm[iy & 255]] & 511);
    return this.grad[idx];
  }

  octaveNoise(x, y, octaves, persistence = 0.5, lacunarity = 2) {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxVal = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxVal += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return total / maxVal;
  }
}

export class World {
  constructor(seed) {
    this.seed = seed || Math.floor(Math.random() * 999999);
    this.width = CONFIG.WORLD_WIDTH;
    this.height = CONFIG.WORLD_HEIGHT;
    this.tiles = [];
    this.resources = [];
    this.timeOfDay = 0.35; // Start at morning
    this.dayCount = 1;
    this.weather = 'CLEAR';
    this.weatherTimer = 60;
    this.weatherDuration = 120;
    this.temperature = 20;

    this.generate();
  }

  generate() {
    const elevation = new NoiseGenerator(this.seed);
    const moisture = new NoiseGenerator(this.seed + 1000);
    const temperature = new NoiseGenerator(this.seed + 2000);
    const detail = new NoiseGenerator(this.seed + 3000);
    const rng = new SeededRandom(this.seed + 4000);

    const biomes = CONFIG.BIOMES;

    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        const nx = x / this.width;
        const ny = y / this.height;

        // Distance from center for island shape
        const dx = nx - 0.5;
        const dy = ny - 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy) * 2;
        const islandMask = 1 - Math.pow(dist, 1.5) * 1.2;

        let e = elevation.octaveNoise(nx * 6, ny * 6, 6, 0.5) * 0.5 + 0.5;
        e = e * islandMask;
        e = Math.max(0, Math.min(1, e));

        let m = moisture.octaveNoise(nx * 4, ny * 4, 4, 0.5) * 0.5 + 0.5;
        let t = temperature.octaveNoise(nx * 3, ny * 3, 3, 0.6) * 0.5 + 0.5;
        // Temperature gradient (colder at top/bottom)
        t = t * 0.6 + (1 - Math.abs(ny - 0.5) * 2) * 0.4;

        const variation = detail.octaveNoise(nx * 20, ny * 20, 2) * 0.5 + 0.5;

        let biome;
        if (e < 0.15) biome = biomes.OCEAN;
        else if (e < 0.2) biome = biomes.BEACH;
        else if (e > 0.85) biome = t < 0.4 ? biomes.SNOW_PEAK : biomes.VOLCANIC;
        else if (e > 0.65) biome = biomes.MOUNTAIN;
        else if (t < 0.3) biome = m > 0.5 ? biomes.TUNDRA : biomes.SNOW_PEAK;
        else if (t > 0.7 && m < 0.3) biome = biomes.DESERT;
        else if (m > 0.7 && e < 0.35) biome = biomes.SWAMP;
        else if (m > 0.5) biome = biomes.DENSE_FOREST;
        else if (m > 0.3) biome = biomes.FOREST;
        else biome = biomes.PLAINS;

        let resource = null;
        const roll = rng.next();

        if (biome.walkable) {
          if ((biome === biomes.FOREST || biome === biomes.DENSE_FOREST) && roll < 0.15) {
            resource = { type: 'TREE', drops: ['WOOD', 'THATCH'], color: biome === biomes.DENSE_FOREST ? '#1a6b1a' : '#2d7a2d', maxHealth: 80, health: 80 };
          } else if (biome === biomes.PLAINS && roll < 0.06) {
            resource = { type: 'TREE', drops: ['WOOD', 'THATCH'], color: '#4a9a4a', maxHealth: 60, health: 60 };
          } else if (biome === biomes.SWAMP && roll < 0.1) {
            resource = { type: 'TREE', drops: ['WOOD', 'FIBER'], color: '#3d6b3d', maxHealth: 70, health: 70 };
          } else if ((biome === biomes.MOUNTAIN || biome === biomes.TUNDRA) && roll < 0.08) {
            resource = { type: 'ROCK', drops: ['STONE', 'METAL_ORE'], color: '#777', maxHealth: 120, health: 120 };
          } else if (biome === biomes.VOLCANIC && roll < 0.1) {
            resource = { type: 'ORE', drops: ['METAL_ORE', 'SULFUR'], color: '#a04020', maxHealth: 150, health: 150 };
          } else if (biome === biomes.SNOW_PEAK && roll < 0.05) {
            resource = { type: 'CRYSTAL', drops: ['CRYSTAL'], color: '#88ddff', maxHealth: 100, health: 100 };
          } else if (roll < 0.03 && biome !== biomes.DESERT) {
            resource = { type: 'BUSH', drops: ['FIBER', 'BERRIES'], color: '#3a7a3a', maxHealth: 30, health: 30 };
          } else if (biome === biomes.BEACH && roll < 0.04) {
            resource = { type: 'ROCK', drops: ['STONE'], color: '#aaa', maxHealth: 60, health: 60 };
          } else if (biome === biomes.DESERT && roll < 0.02) {
            resource = { type: 'ROCK', drops: ['STONE', 'SULFUR'], color: '#c4a35a', maxHealth: 100, health: 100 };
          }
        }

        this.tiles[y][x] = {
          biome,
          elevation: e,
          moisture: m,
          temperature: t,
          variation,
          resource,
          resourceHealth: resource ? resource.health : 0,
          building: null,
        };
      }
    }
  }

  getTile(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.tiles[y][x];
  }

  isWalkable(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    if (!tile.biome.walkable) return false;
    if (tile.building && tile.building.solid) return false;
    return true;
  }

  worldToTile(wx, wy) {
    return {
      x: Math.floor(wx / CONFIG.TILE_SIZE),
      y: Math.floor(wy / CONFIG.TILE_SIZE),
    };
  }

  harvestResource(tileX, tileY, damage) {
    const tile = this.getTile(tileX, tileY);
    if (!tile || !tile.resource) return null;

    tile.resourceHealth -= damage;
    if (tile.resourceHealth <= 0) {
      const drops = tile.resource.drops.map(d => ({
        type: d,
        amount: 1 + Math.floor(Math.random() * 3),
      }));
      tile.resource = null;
      tile.resourceHealth = 0;
      return drops;
    }
    return [];
  }

  placeBuilding(tileX, tileY, building) {
    const tile = this.getTile(tileX, tileY);
    if (!tile || !tile.biome.walkable) return false;
    if (tile.building) return false;
    if (tile.resource) return false;

    tile.building = building;
    return true;
  }

  removeBuilding(tileX, tileY) {
    const tile = this.getTile(tileX, tileY);
    if (!tile || !tile.building) return false;
    tile.building = null;
    return true;
  }

  updateDayCycle(dt) {
    const cycleDuration = CONFIG.DAY_CYCLE.DURATION;
    this.timeOfDay += dt / cycleDuration;
    if (this.timeOfDay >= 1) {
      this.timeOfDay -= 1;
      this.dayCount++;
    }

    // Weather system
    this.weatherTimer -= dt;
    if (this.weatherTimer <= 0) {
      this.changeWeather();
    }
  }

  changeWeather() {
    const types = Object.keys(CONFIG.WEATHER_TYPES);
    const weights = [40, 20, 8, 10, 8, 14]; // CLEAR is most common
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < types.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        this.weather = types[i];
        break;
      }
    }
    this.weatherDuration = 60 + Math.random() * 180;
    this.weatherTimer = this.weatherDuration;
  }

  getTimeString() {
    const totalMinutes = Math.floor(this.timeOfDay * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getBiomeAt(wx, wy) {
    const t = this.worldToTile(wx, wy);
    const tile = this.getTile(t.x, t.y);
    return tile ? tile.biome : null;
  }

  getTemperatureAt(wx, wy) {
    const t = this.worldToTile(wx, wy);
    const tile = this.getTile(t.x, t.y);
    if (!tile) return 20;

    let temp = tile.temperature * 40 - 10; // Range: -10 to 30
    // Time of day modifier
    if (this.timeOfDay < 0.25 || this.timeOfDay > 0.75) temp -= 8;
    // Weather modifier
    if (this.weather === 'HEAT_WAVE') temp += 15;
    if (this.weather === 'BLIZZARD') temp -= 20;
    if (this.weather === 'RAIN') temp -= 5;
    // Elevation
    temp -= tile.elevation * 15;

    return Math.round(temp);
  }

  findSpawnPoint() {
    // Find a walkable beach or plains tile near the center
    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);

    for (let r = 0; r < 100; r++) {
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2;
        const tx = cx + Math.floor(Math.cos(angle) * r);
        const ty = cy + Math.floor(Math.sin(angle) * r);
        const tile = this.getTile(tx, ty);
        if (tile && tile.biome.walkable && !tile.resource &&
          (tile.biome === CONFIG.BIOMES.PLAINS || tile.biome === CONFIG.BIOMES.BEACH || tile.biome === CONFIG.BIOMES.FOREST)) {
          return { x: tx * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2, y: ty * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2 };
        }
      }
    }
    return { x: cx * CONFIG.TILE_SIZE, y: cy * CONFIG.TILE_SIZE };
  }
}
