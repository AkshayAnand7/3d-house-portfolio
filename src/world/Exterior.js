// ============================================
// Exterior — Pool, Trees, Bushes, Garden, Lamps
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { HOUSE } from '../config.js';

export function createExterior(scene) {
  const group = new THREE.Group();
  group.name = 'exterior';
  
  const halfW = HOUSE.width / 2;
  const halfD = HOUSE.depth / 2;

  // ===== SWIMMING POOL =====
  const poolW = 10;
  const poolD = 5;
  const poolDepth = 1.5;
  const poolX = 0;
  const poolZ = -halfD - 8;

  // Pool basin
  const poolBasinMat = new THREE.MeshStandardMaterial({ color: 0x1a4a7a, roughness: 0.3 });
  
  // Floor
  const poolFloor = new THREE.Mesh(new THREE.BoxGeometry(poolW, 0.1, poolD), poolBasinMat);
  poolFloor.position.set(poolX, -poolDepth, poolZ);
  group.add(poolFloor);

  // Walls
  const pw1 = new THREE.Mesh(new THREE.BoxGeometry(poolW, poolDepth, 0.15), poolBasinMat);
  pw1.position.set(poolX, -poolDepth / 2, poolZ - poolD / 2);
  group.add(pw1);
  const pw2 = new THREE.Mesh(new THREE.BoxGeometry(poolW, poolDepth, 0.15), poolBasinMat);
  pw2.position.set(poolX, -poolDepth / 2, poolZ + poolD / 2);
  group.add(pw2);
  const pw3 = new THREE.Mesh(new THREE.BoxGeometry(0.15, poolDepth, poolD), poolBasinMat);
  pw3.position.set(poolX - poolW / 2, -poolDepth / 2, poolZ);
  group.add(pw3);
  const pw4 = new THREE.Mesh(new THREE.BoxGeometry(0.15, poolDepth, poolD), poolBasinMat);
  pw4.position.set(poolX + poolW / 2, -poolDepth / 2, poolZ);
  group.add(pw4);

  // Water surface
  const waterGeo = new THREE.PlaneGeometry(poolW - 0.3, poolD - 0.3);
  const waterMat = MaterialFactory.poolWater();
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(poolX, -0.1, poolZ);
  water.userData.isWater = true;
  group.add(water);

  // Pool edge/coping
  const copingMat = new THREE.MeshStandardMaterial({ color: 0xe0d8c8, roughness: 0.4 });
  const copingW = 0.4;
  // North
  group.add(makeBox(poolX, 0.05, poolZ - poolD / 2 - copingW / 2, poolW + copingW * 2, 0.1, copingW, copingMat));
  // South
  group.add(makeBox(poolX, 0.05, poolZ + poolD / 2 + copingW / 2, poolW + copingW * 2, 0.1, copingW, copingMat));
  // West
  group.add(makeBox(poolX - poolW / 2 - copingW / 2, 0.05, poolZ, copingW, 0.1, poolD, copingMat));
  // East
  group.add(makeBox(poolX + poolW / 2 + copingW / 2, 0.05, poolZ, copingW, 0.1, poolD, copingMat));

  // Pool underwater lights
  [0x00aaff, 0x0088ff, 0x00ccff].forEach((color, i) => {
    const pLight = new THREE.PointLight(color, 0.6, 8, 2);
    pLight.position.set(poolX - 3 + i * 3, -1, poolZ);
    group.add(pLight);
  });

  // ===== TREES (12) =====
  const treePositions = [];
  // Garden trees around the property
  for (let i = 0; i < 12; i++) {
    let tx, tz;
    let attempts = 0;
    do {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 40;
      tx = Math.cos(angle) * dist;
      tz = Math.sin(angle) * dist;
      attempts++;
    } while (
      attempts < 50 &&
      ((Math.abs(tx) < halfW + 3 && Math.abs(tz) < halfD + 3) || // Inside house
       (tx > 28 && tx < 42) || // On road
       (Math.abs(tx - poolX) < poolW && Math.abs(tz - poolZ) < poolD + 2)) // In pool
    );
    
    if (attempts < 50) {
      const scale = 0.8 + Math.random() * 0.6;
      const tree = GeometryFactory.createTree(tx, tz, scale);
      group.add(tree);
      treePositions.push({ x: tx, z: tz });
    }
  }

  // ===== BUSHES (15) =====
  for (let i = 0; i < 15; i++) {
    let bx, bz;
    let attempts = 0;
    do {
      // Cluster bushes near house and paths
      if (Math.random() < 0.5) {
        // Near house perimeter
        const side = Math.floor(Math.random() * 4);
        switch (side) {
          case 0: bx = -halfW - 1 - Math.random() * 3; bz = (Math.random() - 0.5) * HOUSE.depth; break;
          case 1: bx = halfW + 1 + Math.random() * 3; bz = (Math.random() - 0.5) * HOUSE.depth; break;
          case 2: bx = (Math.random() - 0.5) * HOUSE.width; bz = -halfD - 2 - Math.random() * 4; break;
          case 3: bx = (Math.random() - 0.5) * HOUSE.width; bz = halfD + 2 + Math.random() * 4; break;
        }
      } else {
        bx = (Math.random() - 0.5) * 60;
        bz = (Math.random() - 0.5) * 60;
      }
      attempts++;
    } while (
      attempts < 30 &&
      ((Math.abs(bx) < halfW + 1 && Math.abs(bz) < halfD + 1) || 
       (bx > 28 && bx < 42) ||
       (Math.abs(bx) < 4 && bz > -18 && bz < -11)) // Avoid front porch/entrance
    );
    
    if (attempts < 30) {
      const scale = 0.6 + Math.random() * 0.8;
      group.add(GeometryFactory.createBush(bx, bz, scale));
    }
  }

  // ===== STREET LAMPS =====
  // Along the road
  for (let z = -40; z <= 40; z += 15) {
    group.add(GeometryFactory.createStreetLamp(29, z));
  }
  // Along driveway
  group.add(GeometryFactory.createStreetLamp(17, -6));
  group.add(GeometryFactory.createStreetLamp(17, 6));
  // Garden lamps
  group.add(GeometryFactory.createStreetLamp(-halfW - 4, -halfD - 4));
  group.add(GeometryFactory.createStreetLamp(halfW + 4, -halfD - 4));

  // ===== GARDEN FLOWERS =====
  const flowerColors = [0xff6b6b, 0xff69b4, 0xffa500, 0xffff00, 0xda70d6, 0xff4500];
  for (let i = 0; i < 25; i++) {
    const fx = (Math.random() - 0.5) * 50;
    const fz = (Math.random() - 0.5) * 50;
    if (Math.abs(fx) < halfW + 2 && Math.abs(fz) < halfD + 2) continue;
    if (fx > 28) continue;
    
    const flowerGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 6, 6);
    const flowerMat = new THREE.MeshStandardMaterial({
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
      roughness: 0.8,
    });
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    flower.position.set(fx, 0.1 + Math.random() * 0.1, fz);
    group.add(flower);
    
    // Stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4),
      new THREE.MeshStandardMaterial({ color: 0x228B22 })
    );
    stem.position.set(fx, 0.05, fz);
    group.add(stem);
  }

  scene.add(group);
  return { group, water };
}

function makeBox(x, y, z, w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  return mesh;
}
