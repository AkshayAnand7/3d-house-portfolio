// ============================================
// Collision System — AABB & Raycasting
// ============================================

import * as THREE from 'three';

export class CollisionSystem {
  constructor() {
    this.walls = []; // { min: {x,z}, max: {x,z}, minY, maxY }
    this.floors = []; // { min: {x,z}, max: {x,z}, y }
    this.raycaster = new THREE.Raycaster();
  }

  addWall(x1, z1, x2, z2, minY = 0, maxY = 10) {
    this.walls.push({
      min: { x: Math.min(x1, x2), z: Math.min(z1, z2) },
      max: { x: Math.max(x1, x2), z: Math.max(z1, z2) },
      minY,
      maxY,
    });
  }

  addBox(cx, cz, w, d, minY = 0, maxY = 10) {
    this.addWall(cx - w / 2, cz - d / 2, cx + w / 2, cz + d / 2, minY, maxY);
  }

  addFloor(x1, z1, x2, z2, y) {
    this.floors.push({
      min: { x: Math.min(x1, x2), z: Math.min(z1, z2) },
      max: { x: Math.max(x1, x2), z: Math.max(z1, z2) },
      y,
    });
  }

  getFloorHeight(x, z, currentY = 0) {
    let maxY = 0;
    const stepUpAllowance = 0.6; // Max height player can step up instantly
    
    for (const floor of this.floors) {
      if (x >= floor.min.x && x <= floor.max.x && z >= floor.min.z && z <= floor.max.z) {
        // Only snap to this floor if it's not too far above the player
        if (floor.y <= currentY + stepUpAllowance) {
          if (floor.y > maxY) maxY = floor.y;
        }
      }
    }
    return maxY;
  }

  checkCollision(x, z, radius, y, height) {
    for (const wall of this.walls) {
      // Check Y overlap
      if (y + height < wall.minY || y > wall.maxY) continue;
      
      // Closest point on AABB to circle center
      const closestX = Math.max(wall.min.x, Math.min(x, wall.max.x));
      const closestZ = Math.max(wall.min.z, Math.min(z, wall.max.z));
      
      const dx = x - closestX;
      const dz = z - closestZ;
      const distSq = dx * dx + dz * dz;
      
      if (distSq < radius * radius) {
        return true;
      }
    }
    return false;
  }

  resolveCollision(x, z, radius, y, height) {
    let newX = x;
    let newZ = z;
    
    for (const wall of this.walls) {
      if (y + height < wall.minY || y > wall.maxY) continue;
      
      const closestX = Math.max(wall.min.x, Math.min(newX, wall.max.x));
      const closestZ = Math.max(wall.min.z, Math.min(newZ, wall.max.z));
      
      const dx = newX - closestX;
      const dz = newZ - closestZ;
      const distSq = dx * dx + dz * dz;
      
      if (distSq < radius * radius && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const overlap = radius - dist;
        const nx = dx / dist;
        const nz = dz / dist;
        newX += nx * overlap;
        newZ += nz * overlap;
      } else if (distSq === 0) {
        // Player is inside wall — push out
        const cx = (wall.min.x + wall.max.x) / 2;
        const cz = (wall.min.z + wall.max.z) / 2;
        const dx2 = newX - cx;
        const dz2 = newZ - cz;
        const len = Math.sqrt(dx2 * dx2 + dz2 * dz2) || 1;
        newX += (dx2 / len) * radius * 1.1;
        newZ += (dz2 / len) * radius * 1.1;
      }
    }
    
    return { x: newX, z: newZ };
  }
}
