// ============================================
// Garage Room — Achievements (Ground Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';

export function createGarageRoom(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'garageRoom';
  
  const rx = 5;
  const rz = 8;
  const ry = 0.15;

  // ---- Certificate Frames on walls ----
  const certPositions = [
    { x: rx + 5, y: 2.2, z: rz - 1.5 },
    { x: rx + 5, y: 2.2, z: rz + 0 },
    { x: rx + 5, y: 2.2, z: rz + 1.5 },
  ];
  
  certPositions.forEach((pos, i) => {
    const cert = GeometryFactory.createCertFrame(pos.x, pos.y, pos.z);
    cert.rotation.y = -Math.PI / 2;
    group.add(cert);
  });
  
  interactionManager.register(rx + 4, ry + 2, rz, 3.5, 'View Achievements', 'achievements');

  // ---- Trophy Shelf ----
  const shelfMat = MaterialFactory.woodDark();
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(3, 0.06, 0.4), shelfMat);
  shelf.position.set(rx + 2, ry + 1.2, rz + 3);
  group.add(shelf);
  
  // Trophies on shelf
  for (let i = 0; i < 4; i++) {
    const trophy = GeometryFactory.createTrophy(rx + 1 + i * 0.7, ry + 1.26, rz + 3);
    const scale = 0.7 + Math.random() * 0.5;
    trophy.scale.set(scale, scale, scale);
    group.add(trophy);
  }

  // ---- Display case ----
  const caseMat = new THREE.MeshPhysicalMaterial({
    color: 0xaaddff,
    transparent: true,
    opacity: 0.2,
    roughness: 0.05,
    metalness: 0.1,
  });
  const displayCase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.8), caseMat);
  displayCase.position.set(rx + 2, ry + 0.75, rz - 2);
  group.add(displayCase);

  // Spotlight
  const spotLight = new THREE.SpotLight(0xffd700, 1, 8, Math.PI / 6, 0.3);
  spotLight.position.set(rx + 2, 4.5, rz);
  spotLight.target.position.set(rx + 2, 0, rz + 3);
  group.add(spotLight);
  group.add(spotLight.target);

  scene.add(group);
  return group;
}
