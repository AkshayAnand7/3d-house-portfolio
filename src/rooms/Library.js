// ============================================
// Library — Learning (Second Floor)
// ============================================

import * as THREE from 'three';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE, PORTFOLIO } from '../config.js';

export function createLibrary(scene, interactionManager) {
  const group = new THREE.Group();
  group.name = 'library';
  
  const rx = -7;
  const rz = 8;
  const ry = HOUSE.floorHeight + 0.15;

  // ---- Bookshelves ----
  const shelfPositions = [
    { x: rx - 3.5, z: rz - 1, rot: Math.PI / 2 },
    { x: rx - 3.5, z: rz + 2, rot: Math.PI / 2 },
    { x: rx + 1, z: rz + 3.5, rot: 0 },
  ];
  
  shelfPositions.forEach(pos => {
    const shelf = GeometryFactory.createBookshelf(pos.x, ry, pos.z, pos.rot);
    group.add(shelf);
  });

  // ---- Books on shelves ----
  const bookColors = PORTFOLIO.learning.map(l => parseInt(l.color.replace('#', '0x')));
  
  for (let s = 0; s < shelfPositions.length; s++) {
    const sp = shelfPositions[s];
    for (let row = 0; row < 4; row++) {
      for (let b = 0; b < 5; b++) {
        const color = bookColors[(s * 20 + row * 5 + b) % bookColors.length];
        const thickness = 0.03 + Math.random() * 0.05;
        const bookHeight = 0.22 + Math.random() * 0.08;
        
        let bx, bz;
        if (sp.rot === Math.PI / 2) {
          bx = sp.x + 0.05;
          bz = sp.z - 0.5 + b * 0.25;
        } else {
          bx = sp.x - 0.5 + b * 0.25;
          bz = sp.z + 0.05;
        }
        
        const book = GeometryFactory.createBook(
          bx, ry + 0.3 + row * 0.5, bz,
          color, thickness
        );
        if (sp.rot === Math.PI / 2) book.rotation.y = Math.PI / 2;
        group.add(book);
      }
    }
  }
  
  interactionManager.register(rx - 2, ry + 1, rz + 1, 4, 'Knowledge Base', 'learning');

  // ---- Reading Desk ----
  const readDesk = GeometryFactory.createDesk(rx + 1, ry, rz - 1, 1.5, 0.8);
  group.add(readDesk);

  // Open book on desk
  const openBook = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.02, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xfff8e7, roughness: 0.9 })
  );
  openBook.position.set(rx + 1, ry + 0.79, rz - 1);
  group.add(openBook);

  // Reading chair
  const chair = GeometryFactory.createChair(rx + 1, ry, rz + 0.2, Math.PI);
  group.add(chair);

  // ---- Warm lighting ----
  const warmLight1 = new THREE.PointLight(0xffd494, 0.5, 8, 2);
  warmLight1.position.set(rx - 2, ry + 3.5, rz);
  group.add(warmLight1);
  
  const warmLight2 = new THREE.PointLight(0xffd494, 0.3, 6, 2);
  warmLight2.position.set(rx + 1, ry + 1.5, rz - 1);
  group.add(warmLight2);

  // ---- Globe ----
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x4a90d9, roughness: 0.5 })
  );
  globe.position.set(rx + 2, ry + 0.95, rz - 1.3);
  group.add(globe);

  scene.add(group);
  return group;
}
