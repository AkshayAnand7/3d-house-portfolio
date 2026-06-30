// ============================================
// Balcony — Contact (Second Floor)
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE, COLORS } from '../config.js';

export function createBalcony(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'balcony';
  
  const rx = 5;
  const rz = 10;
  const ry = HOUSE.floorHeight + 0.15;

  // ---- Balcony floor extension ----
  const balcFloor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.15, 4),
    MaterialFactory.marble()
  );
  balcFloor.position.set(rx, ry - 0.075, rz + 2);
  balcFloor.receiveShadow = true;
  group.add(balcFloor);

  // ---- Glass railing ----
  const railGlass = new THREE.Mesh(
    new THREE.BoxGeometry(10, 1.0, 0.06),
    new THREE.MeshPhysicalMaterial({
      color: 0xaaddff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.05,
    })
  );
  railGlass.position.set(rx, ry + 0.5, rz + 4);
  group.add(railGlass);

  // Metal rail top
  const railTop = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.05, 0.08),
    MaterialFactory.metal()
  );
  railTop.position.set(rx, ry + 1.05, rz + 4);
  group.add(railTop);

  // Side railings
  [-1, 1].forEach(side => {
    const sideRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.0, 4),
      new THREE.MeshPhysicalMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.05,
      })
    );
    sideRail.position.set(rx + side * 5, ry + 0.5, rz + 2);
    group.add(sideRail);
  });

  // ---- Contact cards floating ----
  const contactItems = [
    { icon: '⌨', label: 'GitHub', color: 0x333333, x: -1.5 },
    { icon: '💼', label: 'LinkedIn', color: 0x0077b5, x: -0.5 },
    { icon: '✉', label: 'Email', color: 0xea4335, x: 0.5 },
    { icon: '📄', label: 'Resume', color: 0x4caf50, x: 1.5 },
  ];

  contactItems.forEach(item => {
    const cardGroup = new THREE.Group();
    cardGroup.position.set(rx + item.x * 2, ry + 1.5, rz + 2);
    
    // Card background
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.6, 0.06),
      new THREE.MeshStandardMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.85,
      })
    );
    cardGroup.add(card);
    
    // Glow
    const glow = new THREE.PointLight(item.color, 0.3, 3, 2);
    glow.position.set(0, 0, 0.2);
    cardGroup.add(glow);
    
    cardGroup.userData.floatOffset = item.x * 0.8;
    group.add(cardGroup);
  });

  interactionManager.register(rx, ry + 1, rz + 2, 4, 'Contact Me', 'contact');

  // ---- Lounge chairs ----
  [-1, 1].forEach(side => {
    const lounger = new THREE.Group();
    lounger.position.set(rx + side * 3.5, ry, rz + 2.5);
    
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.15, 1.8),
      MaterialFactory.fabric(0x444466)
    );
    seat.position.y = 0.3;
    lounger.add(seat);
    
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.5, 0.15),
      MaterialFactory.fabric(0x444466)
    );
    back.position.set(0, 0.45, -0.8);
    back.rotation.x = -0.3;
    lounger.add(back);
    
    group.add(lounger);
  });

  // ---- Plants ----
  [{ x: rx - 4, z: rz + 3.5 }, { x: rx + 4, z: rz + 3.5 }].forEach(pos => {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.12, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    pot.position.set(pos.x, ry + 0.15, pos.z);
    group.add(pot);
    
    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9 })
    );
    foliage.position.set(pos.x, ry + 0.45, pos.z);
    group.add(foliage);
  });

  // ---- Ambient light ----
  const balcLight = new THREE.PointLight(0xffd494, 0.4, 10, 2);
  balcLight.position.set(rx, ry + 3, rz + 2);
  group.add(balcLight);

  scene.add(group);
  return group;
}
