// ============================================
// Living Room — About Me (Ground Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE } from '../config.js';

export function createLivingRoom(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'livingRoom';
  
  const rx = -7; // Room center X
  const rz = -4; // Room center Z
  const ry = 0.15;

  // ---- Smart TV ----
  const tvGroup = new THREE.Group();
  tvGroup.position.set(rx - 4, ry, rz);
  
  // TV Screen
  const tvScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.5, 2.6),
    MaterialFactory.emissiveScreen(0x0066ff)
  );
  tvScreen.position.y = 1.8;
  tvGroup.add(tvScreen);
  
  // TV Frame
  const tvFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.65, 2.75),
    MaterialFactory.metal()
  );
  tvFrame.position.y = 1.8;
  tvFrame.position.x = -0.01;
  tvGroup.add(tvFrame);
  
  // TV Stand
  const tvStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.5, 2.0),
    MaterialFactory.woodDark()
  );
  tvStand.position.y = 0.25;
  tvGroup.add(tvStand);
  
  // Ambient light from TV
  const tvLight = new THREE.PointLight(0x0066ff, 0.4, 6, 2);
  tvLight.position.set(rx - 3.5, 2, rz);
  tvGroup.add(tvLight);
  
  // Decorative indoor plant next to TV
  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.2, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee })
  );
  plantPot.position.set(rx - 3, ry + 0.25, rz + 2);
  group.add(plantPot);
  
  const plantLeaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.8 })
  );
  plantLeaves.position.set(rx - 3, ry + 0.8, rz + 2);
  plantLeaves.scale.set(1, 1.5, 1);
  group.add(plantLeaves);
  
  group.add(tvGroup);
  interactionManager.register(rx - 3, ry + 1, rz, 3, 'View About Me', 'about_me');

  // ---- Sofa ----
  const sofa = GeometryFactory.createSofa(rx, ry, rz, Math.PI / 2);
  group.add(sofa);
  interactionManager.register(rx, ry + 0.5, rz, 2.5, 'Read My Story', 'personal_story');

  // ---- Coffee Table ----
  const table = GeometryFactory.createCoffeeTable(rx + 1.5, ry, rz);
  group.add(table);
  interactionManager.register(rx + 1.5, ry + 0.5, rz, 2, 'Download Resume', 'download_resume');

  // ---- Rug ----
  const rugGeo = new THREE.PlaneGeometry(4, 3);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.95,
    transparent: true,
    opacity: 0.8,
  });
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(rx, ry + 0.01, rz);
  group.add(rug);

  // ---- Floor lamp ----
  const lampGroup = new THREE.Group();
  lampGroup.position.set(rx - 3.5, ry, rz + 3);
  
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8),
    MaterialFactory.metal()
  );
  pole.position.y = 0.9;
  lampGroup.add(pole);
  
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.3, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: 0xfff5e0, emissive: 0xfff5e0, emissiveIntensity: 0.3 })
  );
  shade.position.y = 1.8;
  lampGroup.add(shade);
  
  const floorLight = new THREE.PointLight(0xfff0d0, 0.6, 8, 2);
  floorLight.position.y = 1.7;
  lampGroup.add(floorLight);
  
  group.add(lampGroup);

  // ---- Wall art ----
  const artGeo = new THREE.BoxGeometry(0.05, 0.8, 1.2);
  const artMat = new THREE.MeshStandardMaterial({
    color: 0x1a3a5a,
    emissive: 0x1a2a4a,
    emissiveIntensity: 0.1,
  });
  const art = new THREE.Mesh(artGeo, artMat);
  art.position.set(rx - 4.8, 2, rz - 2);
  group.add(art);

  scene.add(group);
  return group;
}
