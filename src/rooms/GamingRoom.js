// ============================================
// Gaming Room — Tech Showcase (Second Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE, COLORS } from '../config.js';

export function createGamingRoom(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'gamingRoom';
  
  const rx = 5;
  const rz = -4;
  const ry = HOUSE.floorHeight + 0.15;

  // ---- RGB Light Strips ----
  const rgbColors = [COLORS.rgbPink, COLORS.rgbCyan, COLORS.rgbPurple];
  
  // Ceiling edge strips
  const stripGeo = new THREE.BoxGeometry(8, 0.04, 0.04);
  rgbColors.forEach((color, i) => {
    const strip = new THREE.Mesh(stripGeo, MaterialFactory.neon(color));
    strip.position.set(rx + 2, ry + 4.7, rz - 3 + i * 3);
    group.add(strip);
    
    const stripLight = new THREE.PointLight(color, 0.3, 6, 2);
    stripLight.position.set(rx + 2, ry + 4.5, rz - 3 + i * 3);
    group.add(stripLight);
  });

  // Side strips
  const sideStripGeo = new THREE.BoxGeometry(0.04, 0.04, 8);
  [rx - 0.5, rx + 7].forEach((x, i) => {
    const sideStrip = new THREE.Mesh(sideStripGeo, MaterialFactory.neon(rgbColors[i % 3]));
    sideStrip.position.set(x, ry + 4.7, rz);
    group.add(sideStrip);
  });

  // ---- Gaming PC Setup ----
  const desk = GeometryFactory.createDesk(rx + 3, ry, rz - 2, 2.0, 0.8);
  group.add(desk);

  // Main monitor
  const mainMonitor = GeometryFactory.createMonitor(rx + 3, ry + 0.78, rz - 2.2, COLORS.rgbCyan);
  mainMonitor.scale.set(1.3, 1.3, 1.3);
  group.add(mainMonitor);

  // Side monitors
  const leftMon = GeometryFactory.createMonitor(rx + 1.8, ry + 0.78, rz - 2.2, COLORS.rgbPink, 0.2);
  group.add(leftMon);
  const rightMon = GeometryFactory.createMonitor(rx + 4.2, ry + 0.78, rz - 2.2, COLORS.rgbPurple, -0.2);
  group.add(rightMon);

  // RGB Keyboard
  const kbMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: COLORS.rgbCyan,
    emissiveIntensity: 0.2,
  });
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.18), kbMat);
  keyboard.position.set(rx + 3, ry + 0.8, rz - 1.5);
  group.add(keyboard);

  // Gaming chair
  const gChair = GeometryFactory.createChair(rx + 3, ry, rz - 0.8, Math.PI);
  group.add(gChair);

  // ---- Tech Showcase Panels ----
  interactionManager.register(rx + 3, ry + 1.5, rz - 2, 3, 'Technology Showcase', 'tech_showcase');

  // ---- Floating holographic tech icons ----
  const techColors = [0x61dafb, 0x00d8ff, 0xff6b6b, 0x4ecdc4, 0xffd700];
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const hx = rx + 3 + Math.cos(angle) * 2.5;
    const hz = rz + 1.5 + Math.sin(angle) * 1.5;
    
    const hologram = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.15, 0),
      new THREE.MeshStandardMaterial({
        color: techColors[i],
        emissive: techColors[i],
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.7,
      })
    );
    hologram.position.set(hx, ry + 2 + Math.sin(i) * 0.3, hz);
    hologram.userData.floatOffset = i * 1.2;
    hologram.userData.isHologram = true;
    group.add(hologram);
  }

  // ---- Ambient lighting ----
  const ambientLight = new THREE.PointLight(COLORS.rgbPurple, 0.3, 12, 2);
  ambientLight.position.set(rx + 3, ry + 3, rz);
  group.add(ambientLight);

  scene.add(group);
  return group;
}
