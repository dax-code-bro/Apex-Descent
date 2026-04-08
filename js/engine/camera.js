// Apex Descent - Camera System
import { CONFIG } from '../config.js';

export class Camera {
  constructor(canvasWidth, canvasHeight) {
    this.x = 0;
    this.y = 0;
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.targetX = 0;
    this.targetY = 0;
    this.smoothing = 0.1;
    this.shake = 0;
    this.shakeIntensity = 0;
  }

  follow(entity) {
    this.targetX = entity.x - this.width / 2;
    this.targetY = entity.y - this.height / 2;
  }

  update(dt) {
    this.x += (this.targetX - this.x) * this.smoothing;
    this.y += (this.targetY - this.y) * this.smoothing;

    if (this.shake > 0) {
      this.shake -= dt;
      this.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.y += (Math.random() - 0.5) * this.shakeIntensity;
    }

    // Clamp to world bounds
    const worldPxW = CONFIG.WORLD_WIDTH * CONFIG.TILE_SIZE;
    const worldPxH = CONFIG.WORLD_HEIGHT * CONFIG.TILE_SIZE;
    this.x = Math.max(0, Math.min(this.x, worldPxW - this.width));
    this.y = Math.max(0, Math.min(this.y, worldPxH - this.height));
  }

  addShake(duration, intensity) {
    this.shake = duration;
    this.shakeIntensity = intensity;
  }

  screenToWorld(sx, sy) {
    return { x: sx + this.x, y: sy + this.y };
  }

  worldToScreen(wx, wy) {
    return { x: wx - this.x, y: wy - this.y };
  }

  isVisible(wx, wy, margin = 64) {
    return wx > this.x - margin && wx < this.x + this.width + margin &&
           wy > this.y - margin && wy < this.y + this.height + margin;
  }

  getVisibleTileBounds() {
    const ts = CONFIG.TILE_SIZE;
    return {
      startX: Math.max(0, Math.floor(this.x / ts)),
      startY: Math.max(0, Math.floor(this.y / ts)),
      endX: Math.min(CONFIG.WORLD_WIDTH - 1, Math.ceil((this.x + this.width) / ts)),
      endY: Math.min(CONFIG.WORLD_HEIGHT - 1, Math.ceil((this.y + this.height) / ts)),
    };
  }
}
