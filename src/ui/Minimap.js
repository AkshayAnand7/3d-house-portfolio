// ============================================
// Minimap — Top-down HUD map
// ============================================

import { HOUSE, ROOMS } from '../config.js';

export class Minimap {
  constructor() {
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.scale = 2.5; // pixels per world unit
    this.size = 180;
  }

  update(playerX, playerZ) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const s = this.scale;
    const cx = this.size / 2;
    const cy = this.size / 2;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.size, this.size);

    // Draw house footprint
    ctx.save();
    ctx.translate(cx - playerX * s, cy - playerZ * s);

    // House
    const hw = HOUSE.width * s;
    const hd = HOUSE.depth * s;
    ctx.fillStyle = 'rgba(60, 60, 80, 0.6)';
    ctx.fillRect(-hw / 2, -hd / 2, hw, hd);

    // Room divisions
    ctx.strokeStyle = 'rgba(255, 179, 102, 0.3)';
    ctx.lineWidth = 1;
    
    // Center dividers
    ctx.beginPath();
    ctx.moveTo(0, -hd / 2);
    ctx.lineTo(0, hd / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-hw / 2, 2 * s);
    ctx.lineTo(hw / 2, 2 * s);
    ctx.stroke();

    // Pool
    ctx.fillStyle = 'rgba(0, 100, 200, 0.4)';
    ctx.fillRect(-10 * s / 2, -HOUSE.depth / 2 * s - 8 * s - 5 * s / 2, 10 * s, 5 * s);

    // Road
    ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    ctx.fillRect(31 * s, -50 * s, 8 * s, 100 * s);

    // Garage
    ctx.fillStyle = 'rgba(60, 60, 80, 0.5)';
    ctx.fillRect((HOUSE.width / 2 + 1.5) * s, -4 * s, 7 * s, 8 * s);

    ctx.restore();

    // Player dot (always center)
    ctx.fillStyle = '#FFB366';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Player direction indicator
    ctx.strokeStyle = '#FFB366';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 8);
    ctx.stroke();

    // Border
    ctx.strokeStyle = 'rgba(255, 179, 102, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, this.size, this.size);
  }
}
