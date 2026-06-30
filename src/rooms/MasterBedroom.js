// ============================================
// Master Bedroom — Timeline (Second Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE } from '../config.js';

export function createMasterBedroom(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'masterBedroom';
  
  const rx = -7;
  const rz = -4;
  const ry = HOUSE.floorHeight + 0.15;

  // ---- Bed ----
  const bed = GeometryFactory.createBed(rx, ry, rz - 1);
  group.add(bed);

  // ---- Nightstands ----
  [-1, 1].forEach(side => {
    const ns = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.4),
      MaterialFactory.woodDark()
    );
    ns.position.set(rx + side * 1.5, ry + 0.25, rz - 2);
    ns.castShadow = true;
    group.add(ns);
    
    // Lamp on nightstand
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.25, 8),
      new THREE.MeshStandardMaterial({ color: 0xfff5e0, emissive: 0xfff0c0, emissiveIntensity: 0.4 })
    );
    lamp.position.set(rx + side * 1.5, ry + 0.62, rz - 2);
    group.add(lamp);
  });

  // ---- Timeline holographic display ----
  // Floating timeline cards
  const timelineColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4];
  const timelineIcons = ['🎓', '🏫', '💻', '🚀'];
  
  for (let i = 0; i < 4; i++) {
    const cardGroup = new THREE.Group();
    const cx = rx - 3 + i * 0.8;
    const cy = ry + 1.5 + Math.sin(i * 0.8) * 0.2;
    const cz = rz + 2;
    
    cardGroup.position.set(cx, cy, cz);
    
    // Card
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.8, 0.04),
      new THREE.MeshStandardMaterial({
        color: timelineColors[i],
        emissive: timelineColors[i],
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
      })
    );
    cardGroup.add(card);
    
    // Glow
    const glowLight = new THREE.PointLight(timelineColors[i], 0.2, 3, 2);
    glowLight.position.set(0, 0, 0.1);
    cardGroup.add(glowLight);
    
    cardGroup.userData.floatOffset = i * 1.5;
    group.add(cardGroup);
  }
  
  interactionManager.register(rx - 1.5, ry + 1.5, rz + 2, 3, 'View My Timeline', 'timeline');

  // ---- Wardrobe ----
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.2, 0.6),
    MaterialFactory.woodDark()
  );
  wardrobe.position.set(rx + 3, ry + 1.1, rz + 3);
  wardrobe.castShadow = true;
  group.add(wardrobe);

  // ---- Ceiling light ----
  const ceilingLight = new THREE.PointLight(0xfff0d0, 0.5, 10, 2);
  ceilingLight.position.set(rx, ry + 4, rz);
  group.add(ceilingLight);

  scene.add(group);
  return group;
}
