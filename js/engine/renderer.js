// Apex Descent - Renderer
import { CONFIG } from '../config.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.particles = [];
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawWorld(world, camera) {
    const ts = CONFIG.TILE_SIZE;
    const bounds = camera.getVisibleTileBounds();
    const ctx = this.ctx;

    for (let y = bounds.startY; y <= bounds.endY; y++) {
      for (let x = bounds.startX; x <= bounds.endX; x++) {
        const tile = world.getTile(x, y);
        if (!tile) continue;

        const sx = Math.floor(x * ts - camera.x);
        const sy = Math.floor(y * ts - camera.y);

        // Base biome color
        ctx.fillStyle = tile.biome.color;
        ctx.fillRect(sx, sy, ts, ts);

        // Tile detail variations
        if (tile.variation > 0.7) {
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.fillRect(sx, sy, ts, ts);
        }
      }
    }
  }

  drawResources(world, camera) {
    const ts = CONFIG.TILE_SIZE;
    const bounds = camera.getVisibleTileBounds();
    const ctx = this.ctx;

    for (let y = bounds.startY; y <= bounds.endY; y++) {
      for (let x = bounds.startX; x <= bounds.endX; x++) {
        const tile = world.getTile(x, y);
        if (!tile || !tile.resource) continue;

        const sx = Math.floor(x * ts - camera.x + ts / 2);
        const sy = Math.floor(y * ts - camera.y + ts / 2);

        this.drawResource(ctx, tile.resource, sx, sy, tile.resourceHealth);
      }
    }
  }

  drawResource(ctx, resource, x, y, health) {
    const maxHealth = resource.maxHealth || 100;
    const scale = 0.5 + 0.5 * (health / maxHealth);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    switch (resource.type) {
      case 'TREE':
        // Trunk
        ctx.fillStyle = '#5D4E37';
        ctx.fillRect(-3, -2, 6, 10);
        // Canopy
        ctx.fillStyle = resource.color || '#2d7a2d';
        ctx.beginPath();
        ctx.arc(0, -6, 10, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ROCK':
        ctx.fillStyle = resource.color || '#888';
        ctx.beginPath();
        ctx.moveTo(-8, 4);
        ctx.lineTo(-5, -8);
        ctx.lineTo(5, -6);
        ctx.lineTo(9, 3);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.stroke();
        break;

      case 'BUSH':
        ctx.fillStyle = resource.color || '#3a7a3a';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c44';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(Math.cos(i * 2.1) * 4, Math.sin(i * 2.1) * 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'ORE':
        ctx.fillStyle = resource.color || '#b87333';
        ctx.beginPath();
        ctx.moveTo(-7, 5);
        ctx.lineTo(-9, -3);
        ctx.lineTo(-2, -7);
        ctx.lineTo(6, -5);
        ctx.lineTo(8, 2);
        ctx.lineTo(3, 6);
        ctx.closePath();
        ctx.fill();
        // Sparkle
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(-2, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'CRYSTAL':
        ctx.fillStyle = resource.color || '#00CED1';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(5, 0);
        ctx.lineTo(3, 8);
        ctx.lineTo(-3, 8);
        ctx.lineTo(-5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
    }

    ctx.restore();
  }

  drawEntity(entity, camera) {
    const ctx = this.ctx;
    const sx = Math.floor(entity.x - camera.x);
    const sy = Math.floor(entity.y - camera.y);

    if (!camera.isVisible(entity.x, entity.y)) return;

    ctx.save();
    ctx.translate(sx, sy);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, entity.size * 0.6, entity.size * 0.7, entity.size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = entity.color;
    ctx.beginPath();
    ctx.arc(0, 0, entity.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Direction indicator
    if (entity.facing !== undefined) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      const dx = Math.cos(entity.facing) * entity.size * 0.6;
      const dy = Math.sin(entity.facing) * entity.size * 0.6;
      ctx.arc(dx, dy, entity.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawPlayer(player, camera) {
    const ctx = this.ctx;
    const sx = Math.floor(player.x - camera.x);
    const sy = Math.floor(player.y - camera.y);

    ctx.save();
    ctx.translate(sx, sy);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 12, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#e8a87c';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c68c5c';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction indicator (eyes)
    const dx = Math.cos(player.facing) * 5;
    const dy = Math.sin(player.facing) * 5;
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(dx - 2, dy - 1, 2, 0, Math.PI * 2);
    ctx.arc(dx + 2, dy - 1, 2, 0, Math.PI * 2);
    ctx.fill();

    // Equipped tool indicator
    if (player.equippedItem) {
      const toolDx = Math.cos(player.facing) * 16;
      const toolDy = Math.sin(player.facing) * 16;
      ctx.fillStyle = player.equippedItem.color || '#aaa';
      ctx.fillRect(toolDx - 3, toolDy - 3, 6, 6);
    }

    ctx.restore();
  }

  drawBuildings(buildings, camera) {
    const ctx = this.ctx;
    const ts = CONFIG.TILE_SIZE;

    for (const b of buildings) {
      const sx = Math.floor(b.x * ts - camera.x);
      const sy = Math.floor(b.y * ts - camera.y);

      if (!camera.isVisible(b.x * ts, b.y * ts, ts * 2)) continue;

      ctx.fillStyle = b.color || '#8B7355';
      ctx.fillRect(sx, sy, ts * b.width, ts * b.height);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, ts * b.width, ts * b.height);

      // Door indicator
      if (b.type === 'DOOR') {
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(sx + 4, sy + 4, ts * b.width - 8, ts * b.height - 8);
      }

      // Campfire glow
      if (b.type === 'CAMPFIRE') {
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(sx + ts / 2, sy + ts / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,100,0,0.15)';
        ctx.beginPath();
        ctx.arc(sx + ts / 2, sy + ts / 2, ts * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Forge glow
      if (b.type === 'FORGE') {
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(sx + ts / 2, sy + ts / 2, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawHealthBar(entity, camera, current, max) {
    if (current >= max) return;
    const ctx = this.ctx;
    const sx = Math.floor(entity.x - camera.x);
    const sy = Math.floor(entity.y - camera.y - entity.size - 8);
    const width = 30;
    const height = 4;
    const ratio = current / max;

    ctx.fillStyle = '#333';
    ctx.fillRect(sx - width / 2, sy, width, height);
    ctx.fillStyle = ratio > 0.5 ? '#4CAF50' : ratio > 0.25 ? '#FF9800' : '#f44336';
    ctx.fillRect(sx - width / 2, sy, width * ratio, height);
  }

  drawDayNightOverlay(timeOfDay, weather) {
    const ctx = this.ctx;
    let alpha = 0;

    // Night darkness
    if (timeOfDay < 0.2) {
      alpha = 0.4 * (1 - timeOfDay / 0.2);
    } else if (timeOfDay > 0.75) {
      alpha = 0.4 * ((timeOfDay - 0.75) / 0.25);
    }

    if (alpha > 0) {
      ctx.fillStyle = `rgba(10, 10, 40, ${alpha})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Weather overlays
    if (weather === 'RAIN' || weather === 'STORM') {
      this.drawRain(weather === 'STORM' ? 200 : 80);
    }
    if (weather === 'FOG') {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    if (weather === 'BLIZZARD') {
      ctx.fillStyle = 'rgba(220, 230, 240, 0.35)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawRain(150, '#dde');
    }
    if (weather === 'HEAT_WAVE') {
      ctx.fillStyle = 'rgba(255, 150, 0, 0.08)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  drawRain(count, color = '#aaddff') {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const t = Date.now();
    for (let i = 0; i < count; i++) {
      const x = (Math.sin(i * 127.1 + t * 0.003) * 0.5 + 0.5) * this.canvas.width;
      const y = ((t * 0.5 + i * 73.7) % this.canvas.height);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 1, y + 8);
      ctx.stroke();
    }
  }

  addParticle(x, y, color, life = 1, vx = 0, vy = 0) {
    this.particles.push({ x, y, color, life, maxLife: life, vx, vy, size: 3 });
  }

  updateAndDrawParticles(dt, camera) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 30 * dt; // gravity

      const alpha = p.life / p.maxLife;
      const sx = p.x - camera.x;
      const sy = p.y - camera.y;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  drawDropPod(pod, camera) {
    if (!pod || !pod.active) return;
    const ctx = this.ctx;
    const sx = pod.x - camera.x;
    const sy = pod.y - camera.y;

    // Pod body
    ctx.fillStyle = '#667';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 20);
    ctx.lineTo(sx + 15, sy + 10);
    ctx.lineTo(sx - 15, sy + 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#889';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Beacon light
    ctx.fillStyle = `rgba(0, 200, 255, ${0.3 + Math.sin(Date.now() * 0.005) * 0.2})`;
    ctx.beginPath();
    ctx.arc(sx, sy - 22, 5, 0, Math.PI * 2);
    ctx.fill();

    // Beacon beam
    ctx.strokeStyle = `rgba(0, 200, 255, ${0.1 + Math.sin(Date.now() * 0.003) * 0.05})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 22);
    ctx.lineTo(sx, sy - 200);
    ctx.stroke();
  }
}
