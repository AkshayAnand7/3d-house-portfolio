// ============================================
// Kitchen — Skills (Ground Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';

export function createKitchen(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'kitchen';
  
  const rx = 5;
  const rz = -4;
  const ry = 0.15;

  // ---- Refrigerator (Frontend Skills) ----
  const fridge = GeometryFactory.createAppliance(rx + 5, ry, rz - 2, 1.0, 2.0, 0.8, 0xc0c0c0);
  group.add(fridge);
  interactionManager.register(rx + 5, ry + 1, rz - 2, 2.5, 'Frontend Skills', 'frontend_skills');

  // ---- Oven (Backend Skills) ----
  const oven = GeometryFactory.createAppliance(rx + 5, ry, rz + 1, 0.7, 0.9, 0.7, 0x333333);
  group.add(oven);
  // Counter above oven
  const ovenCounter = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.75),
    MaterialFactory.marble()
  );
  ovenCounter.position.set(rx + 5, ry + 0.95, rz + 1);
  group.add(ovenCounter);
  interactionManager.register(rx + 5, ry + 0.5, rz + 1, 2.5, 'Backend Skills', 'backend_skills');

  // ---- Cabinets (Database Skills) ----
  const cabinetGroup = new THREE.Group();
  cabinetGroup.position.set(rx + 2, ry, rz - 3);
  
  // Upper cabinets
  for (let i = 0; i < 3; i++) {
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.6, 0.4),
      MaterialFactory.woodDark()
    );
    cab.position.set(i * 1.1, 2.2, 0);
    cab.castShadow = true;
    cabinetGroup.add(cab);
    
    // Door handles
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.15, 0.04),
      MaterialFactory.metal()
    );
    handle.position.set(i * 1.1 + 0.3, 2.2, 0.22);
    cabinetGroup.add(handle);
  }
  group.add(cabinetGroup);
  interactionManager.register(rx + 3, ry + 2, rz - 3, 3, 'Database Skills', 'database_skills');

  // ---- Counter Island (DevOps/Cloud) ----
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.9, 1.2),
    MaterialFactory.whiteWall()
  );
  counter.position.set(rx + 2, ry + 0.45, rz);
  counter.castShadow = true;
  group.add(counter);
  
  // Counter top
  const counterTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.06, 1.3),
    MaterialFactory.marble()
  );
  counterTop.position.set(rx + 2, ry + 0.93, rz);
  group.add(counterTop);
  
  interactionManager.register(rx + 2, ry + 0.5, rz, 2.5, 'DevOps & Cloud Skills', 'devops_cloud');

  // ---- Sink ----
  const sinkGeo = new THREE.BoxGeometry(0.6, 0.08, 0.4);
  const sinkMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.8 });
  const sink = new THREE.Mesh(sinkGeo, sinkMat);
  sink.position.set(rx + 5, ry + 0.95, rz - 0.5);
  group.add(sink);

  // Faucet
  const faucet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
    sinkMat
  );
  faucet.position.set(rx + 5, ry + 1.1, rz - 0.7);
  group.add(faucet);

  // ---- Kitchen light ----
  const kitchenLight = new THREE.PointLight(0xfff5e0, 0.6, 10, 2);
  kitchenLight.position.set(rx + 3, 4, rz);
  group.add(kitchenLight);

  scene.add(group);
  return group;
}
