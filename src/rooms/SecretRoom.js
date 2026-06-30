// ============================================
// Secret Room — Hidden Content
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE, COLORS } from '../config.js';

export function createSecretRoom(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'secretRoom';
  group.visible = false; // Hidden until unlocked
  
  const rx = 0;
  const rz = -HOUSE.depth / 2 - 6;
  const ry = 0.15;

  // ---- Secret room structure ----
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1a0a2e,
    emissive: 0x1a0a2e,
    emissiveIntensity: 0.1,
    roughness: 0.8,
  });

  // Floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.1, 6),
    new THREE.MeshStandardMaterial({
      color: 0x0a0a1a,
      emissive: 0x1a0a3e,
      emissiveIntensity: 0.05,
    })
  );
  floor.position.set(rx, ry - 0.05, rz);
  group.add(floor);

  // Walls
  const wh = 4;
  [[0, 0, -3, 6, wh, 0.2], [0, 0, 3, 6, wh, 0.2], [-3, 0, 0, 0.2, wh, 6], [3, 0, 0, 0.2, wh, 6]].forEach(([dx, dy, dz, w, h, d]) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(rx + dx, ry + wh / 2, rz + dz);
    group.add(wall);
  });

  // ---- Neon accents ----
  const neonColors = [COLORS.rgbPink, COLORS.rgbCyan, COLORS.rgbPurple, COLORS.neonBlue];
  for (let i = 0; i < 4; i++) {
    const neon = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.04, 0.04),
      MaterialFactory.neon(neonColors[i])
    );
    neon.position.set(rx, ry + 1 + i * 0.8, rz - 2.9);
    group.add(neon);
    
    const light = new THREE.PointLight(neonColors[i], 0.3, 5, 2);
    light.position.set(rx, ry + 1 + i * 0.8, rz - 2.5);
    group.add(light);
  }

  // ---- Central hologram ----
  const holoGeo = new THREE.IcosahedronGeometry(0.5, 1);
  const holoMat = new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    emissive: COLORS.gold,
    emissiveIntensity: 1.5,
    wireframe: true,
  });
  const hologram = new THREE.Mesh(holoGeo, holoMat);
  hologram.position.set(rx, ry + 2, rz);
  hologram.userData.isHologram = true;
  hologram.userData.floatOffset = 0;
  group.add(hologram);

  // Hologram glow
  const holoLight = new THREE.PointLight(COLORS.gold, 1, 6, 2);
  holoLight.position.set(rx, ry + 2, rz);
  group.add(holoLight);

  // ---- Pedestal ----
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.6, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 })
  );
  pedestal.position.set(rx, ry + 0.15, rz);
  group.add(pedestal);

  interactionManager.register(rx, ry + 2, rz, 3, '🔓 Secret Room', 'secret_room');

  scene.add(group);
  return group;
}
