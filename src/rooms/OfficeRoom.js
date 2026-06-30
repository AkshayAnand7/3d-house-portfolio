// ============================================
// Office Room — Projects (Ground Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { PORTFOLIO } from '../config.js';

export function createOfficeRoom(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'officeRoom';
  
  const rx = -7;
  const rz = 8;
  const ry = 0.15;

  // ---- Main Desk with 4 Monitors ----
  const desk = GeometryFactory.createDesk(rx, ry, rz, 4, 1.0);
  group.add(desk);

  // 4 Monitors — one for each project
  const projectColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4];
  for (let i = 0; i < 4; i++) {
    const mx = rx - 1.5 + i * 1.1;
    const monitor = GeometryFactory.createMonitor(mx, ry + 0.78, rz - 0.2, projectColors[i]);
    group.add(monitor);
    interactionManager.register(mx, ry + 1.2, rz - 0.2, 2, PORTFOLIO.projects[i].title, `project_${i}`);
  }

  // ---- Office Chair ----
  const chair = GeometryFactory.createChair(rx, ry, rz + 1.5, 0);
  group.add(chair);

  // ---- Whiteboard ----
  const wbGroup = new THREE.Group();
  wbGroup.position.set(rx - 3.5, ry, rz + 2);
  
  const wbBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.2, 2.0),
    new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.4 })
  );
  wbBoard.position.y = 1.6;
  wbGroup.add(wbBoard);
  
  // Whiteboard frame
  const wbFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.3, 2.1),
    MaterialFactory.metal()
  );
  wbFrame.position.set(-0.01, 1.6, 0);
  wbGroup.add(wbFrame);
  
  group.add(wbGroup);

  // ---- Keyboard on desk ----
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.02, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.5 })
  );
  keyboard.position.set(rx, ry + 0.79, rz + 0.1);
  group.add(keyboard);

  // ---- Mouse ----
  const mouse = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.02, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.5 })
  );
  mouse.position.set(rx + 0.35, ry + 0.79, rz + 0.1);
  group.add(mouse);

  // ---- Desk lamp ----
  const deskLamp = new THREE.PointLight(0xfff5e0, 0.5, 6, 2);
  deskLamp.position.set(rx + 1.5, ry + 1.5, rz);
  group.add(deskLamp);

  // ---- Plant pot ----
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.08, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  pot.position.set(rx + 1.8, ry + 0.85, rz - 0.3);
  group.add(pot);
  
  const plant = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9 })
  );
  plant.position.set(rx + 1.8, ry + 1.0, rz - 0.3);
  group.add(plant);

  scene.add(group);
  return group;
}
