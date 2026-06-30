// ============================================
// Minimap — Top-down HUD map
// ============================================

import { HOUSE, ROOMS } from '../config.js';

export class Minimap {
  constructor() {
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.scale = 5; // pixels per world unit (larger scale for smaller house)
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

    // Draw house footprint (centered at -2.5, 0)
    ctx.save();
    ctx.translate(cx - playerX * s, cy - playerZ * s);

    // House footprint: x -10..5, z -5..5
    const hx = -10;
    const hz = -5;
    const hw = 15.4;
    const hd = 10.4;
    ctx.fillStyle = 'rgba(60, 60, 80, 0.6)';
    ctx.fillRect(hx * s, hz * s, hw * s, hd * s);

    // Room divisions
    ctx.strokeStyle = 'rgba(255, 179, 102, 0.3)';
    ctx.lineWidth = 1;
    
    // Garage divider (x = -5)
    ctx.beginPath();
    ctx.moveTo(-5 * s, -5 * s);
    ctx.lineTo(-5 * s, 5 * s);
    ctx.stroke();

    // Living/Kitchen divider (z = 1)
    ctx.beginPath();
    ctx.moveTo(-5 * s, 1 * s);
    ctx.lineTo(5 * s, 1 * s);
    ctx.stroke();

    // Kitchen/Bedroom divider (x = 0)
    ctx.beginPath();
    ctx.moveTo(0, -5 * s);
    ctx.lineTo(0, 1 * s);
    ctx.stroke();

    // Road
    ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
    ctx.fillRect(-35 * s, 15 * s - 3.5 * s, 70 * s, 7 * s);

    // Driveway
    ctx.fillStyle = 'rgba(180, 170, 150, 0.4)';
    ctx.fillRect(-12 * s, 6 * s, 24 * s, 6 * s);

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
