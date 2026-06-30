// ============================================
// Gate — Animated Main Entrance Gate
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE } from '../config.js';

export function createGate(scene, collisionSystem) {
  const group = new THREE.Group();
  group.name = 'gate';
  
  const gateX = HOUSE.width / 2 + 10;
  const gateZ = 0;
  const gateW = 3;
  const gateH = 3;
  
  const metalMat = MaterialFactory.metalGate();
  
  // Gate posts
  const postGeo = new THREE.BoxGeometry(0.4, gateH + 0.5, 0.4);
  const postL = new THREE.Mesh(postGeo, metalMat);
  postL.position.set(gateX, (gateH + 0.5) / 2, gateZ - gateW / 2 - 0.2);
  postL.castShadow = true;
  group.add(postL);
  
  const postR = new THREE.Mesh(postGeo, metalMat);
  postR.position.set(gateX, (gateH + 0.5) / 2, gateZ + gateW / 2 + 0.2);
  postR.castShadow = true;
  group.add(postR);
  
  // Post caps
  const capGeo = new THREE.BoxGeometry(0.5, 0.1, 0.5);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.9 });
  const capL = new THREE.Mesh(capGeo, capMat);
  capL.position.set(gateX, gateH + 0.55, gateZ - gateW / 2 - 0.2);
  group.add(capL);
  const capR = new THREE.Mesh(capGeo, capMat);
  capR.position.set(gateX, gateH + 0.55, gateZ + gateW / 2 + 0.2);
  group.add(capR);
  
  // Gate panels (two doors)
  const panelGeo = new THREE.BoxGeometry(0.08, gateH - 0.3, gateW / 2 - 0.1);
  
  const leftDoor = new THREE.Mesh(panelGeo, metalMat);
  leftDoor.position.set(gateX, gateH / 2, gateZ - gateW / 4);
  leftDoor.castShadow = true;
  group.add(leftDoor);
  
  const rightDoor = new THREE.Mesh(panelGeo, metalMat);
  rightDoor.position.set(gateX, gateH / 2, gateZ + gateW / 4);
  rightDoor.castShadow = true;
  group.add(rightDoor);
  
  // Gate bars (vertical detail)
  const barGeo = new THREE.CylinderGeometry(0.02, 0.02, gateH - 0.5, 6);
  for (let i = -2; i <= 2; i++) {
    [-1, 1].forEach(side => {
      const bar = new THREE.Mesh(barGeo, metalMat);
      bar.position.set(gateX + 0.05, gateH / 2, gateZ + side * (gateW / 4) + i * 0.3);
      group.add(bar);
    });
  }
  
  // Fence extending from gate
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.8 });
  // Left fence
  const fenceL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2, 15), fenceMat);
  fenceL.position.set(gateX, 1, gateZ - gateW / 2 - 8);
  group.add(fenceL);
  // Right fence
  const fenceR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2, 15), fenceMat);
  fenceR.position.set(gateX, 1, gateZ + gateW / 2 + 8);
  group.add(fenceR);
  
  // Fence posts
  for (let i = 0; i < 6; i++) {
    [-1, 1].forEach(side => {
      const fp = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 2.3, 0.12),
        fenceMat
      );
      fp.position.set(gateX, 1.15, gateZ + side * (gateW / 2 + 1.5 + i * 2.5));
      group.add(fp);
    });
  }

  // Gate collision (when closed)
  collisionSystem.addWall(
    gateX - 0.2, gateZ - gateW / 2 - 0.3,
    gateX + 0.2, gateZ + gateW / 2 + 0.3,
    0, gateH
  );

  // Animation state
  group.userData.isOpen = false;
  group.userData.openProgress = 0;
  group.userData.leftDoor = leftDoor;
  group.userData.rightDoor = rightDoor;
  group.userData.gateX = gateX;
  group.userData.gateZ = gateZ;

  scene.add(group);
  return group;
}

export function updateGate(gateGroup, playerX, playerZ, dt) {
  if (!gateGroup) return;
  
  const { gateX, gateZ, leftDoor, rightDoor } = gateGroup.userData;
  const dist = Math.sqrt((playerX - gateX) ** 2 + (playerZ - gateZ) ** 2);
  
  const shouldOpen = dist < 8;
  const speed = 2;
  
  if (shouldOpen && gateGroup.userData.openProgress < 1) {
    gateGroup.userData.openProgress = Math.min(1, gateGroup.userData.openProgress + dt * speed);
  } else if (!shouldOpen && gateGroup.userData.openProgress > 0) {
    gateGroup.userData.openProgress = Math.max(0, gateGroup.userData.openProgress - dt * speed);
  }
  
  const p = gateGroup.userData.openProgress;
  const offset = p * 1.5;
  leftDoor.position.z = gateZ - 1.5 / 2 - offset;
  rightDoor.position.z = gateZ + 1.5 / 2 + offset;
}
