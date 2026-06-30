// ============================================
// Geometry Factory — Procedural 3D Objects
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from './MaterialFactory.js';
import { COLORS } from '../config.js';

export const GeometryFactory = {

  // ---- Trees ----
  createTree(x, z, scale = 1) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    
    // Trunk
    const trunkH = (2 + Math.random() * 1.5) * scale;
    const trunkGeo = new THREE.CylinderGeometry(0.15 * scale, 0.25 * scale, trunkH, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    group.add(trunk);

    // Canopy — random between sphere and cone types
    const canopyType = Math.random();
    const canopyY = trunkH;
    if (canopyType < 0.5) {
      // Sphere canopy
      const r = (1.5 + Math.random()) * scale;
      const canopyGeo = new THREE.SphereGeometry(r, 8, 8);
      const canopyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.28 + Math.random() * 0.05, 0.6, 0.25 + Math.random() * 0.1),
        roughness: 0.9,
      });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.y = canopyY + r * 0.6;
      canopy.castShadow = true;
      canopy.receiveShadow = true;
      group.add(canopy);
    } else {
      // Layered cone canopy
      for (let i = 0; i < 3; i++) {
        const r = (1.8 - i * 0.4) * scale;
        const h = 1.5 * scale;
        const coneGeo = new THREE.ConeGeometry(r, h, 8);
        const coneMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(0.28 + Math.random() * 0.05, 0.6, 0.22 + i * 0.04),
          roughness: 0.9,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = canopyY + i * h * 0.6;
        cone.castShadow = true;
        group.add(cone);
      }
    }
    
    return group;
  },

  // ---- Bushes ----
  createBush(x, z, scale = 1) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const r = (0.3 + Math.random() * 0.4) * scale;
      const geo = new THREE.SphereGeometry(r, 7, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.3 + Math.random() * 0.06, 0.7, 0.2 + Math.random() * 0.1),
        roughness: 0.95,
      });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(
        (Math.random() - 0.5) * 0.6 * scale,
        r * 0.6,
        (Math.random() - 0.5) * 0.6 * scale
      );
      sphere.castShadow = true;
      group.add(sphere);
    }
    
    return group;
  },

  // ---- Street Lamp ----
  createStreetLamp(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.8 });
    
    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4, 8), poleMat);
    pole.position.y = 2;
    pole.castShadow = true;
    group.add(pole);
    
    // Arm
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), poleMat);
    arm.position.set(0.5, 3.9, 0);
    arm.rotation.z = Math.PI / 2;
    group.add(arm);
    
    // Lamp head
    const lampGeo = new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0xfff5e0,
      emissive: 0xfff5e0,
      emissiveIntensity: 1,
    });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(1.0, 3.8, 0);
    lamp.rotation.x = Math.PI;
    group.add(lamp);
    
    // Light
    const light = new THREE.PointLight(0xffe4b5, 1.5, 15, 2);
    light.position.set(1.0, 3.7, 0);
    group.add(light);
    
    return group;
  },

  // ---- Supercar ----
  createSupercar(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    
    const bodyMat = MaterialFactory.carBody();
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111122,
      transparent: true,
      opacity: 0.5,
      roughness: 0.05,
      metalness: 0.3,
    });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.6 });
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff2200, emissiveIntensity: 0.5 });
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 });

    // Main body - low and sleek
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 4.5), bodyMat);
    body.position.y = 0.45;
    body.castShadow = true;
    group.add(body);

    // Upper cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 2), glassMat);
    cabin.position.set(0, 0.9, -0.3);
    group.add(cabin);

    // Hood (front slope)
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 1.2), bodyMat);
    hood.position.set(0, 0.55, -1.5);
    hood.rotation.x = -0.15;
    hood.castShadow = true;
    group.add(hood);

    // Rear
    const rear = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 0.6), bodyMat);
    rear.position.set(0, 0.6, 1.8);
    rear.castShadow = true;
    group.add(rear);

    // Spoiler
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.4), bodyMat);
    spoiler.position.set(0, 1.0, 2.0);
    group.add(spoiler);
    const spoilerStandGeo = new THREE.BoxGeometry(0.08, 0.3, 0.08);
    const sL = new THREE.Mesh(spoilerStandGeo, bodyMat);
    sL.position.set(-0.6, 0.85, 2.0);
    group.add(sL);
    const sR = new THREE.Mesh(spoilerStandGeo, bodyMat);
    sR.position.set(0.6, 0.85, 2.0);
    group.add(sR);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const positions = [
      [-1.0, 0.3, -1.3],
      [1.0, 0.3, -1.3],
      [-1.0, 0.3, 1.3],
      [1.0, 0.3, 1.3],
    ];
    positions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, wy, wz);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      group.add(wheel);
      // Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.22, 8), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 }));
      rim.position.set(wx, wy, wz);
      rim.rotation.z = Math.PI / 2;
      group.add(rim);
    });

    // Headlights
    const hlGeo = new THREE.BoxGeometry(0.3, 0.12, 0.05);
    const hlL = new THREE.Mesh(hlGeo, headlightMat);
    hlL.position.set(-0.7, 0.5, -2.28);
    group.add(hlL);
    const hlR = new THREE.Mesh(hlGeo, headlightMat);
    hlR.position.set(0.7, 0.5, -2.28);
    group.add(hlR);

    // Tail lights
    const tlGeo = new THREE.BoxGeometry(0.4, 0.1, 0.05);
    const tlL = new THREE.Mesh(tlGeo, lightMat);
    tlL.position.set(-0.7, 0.55, 2.13);
    group.add(tlL);
    const tlR = new THREE.Mesh(tlGeo, lightMat);
    tlR.position.set(0.7, 0.55, 2.13);
    group.add(tlR);

    group.rotation.y = Math.PI / 2;
    group.scale.set(1.2, 1.2, 1.2);
    
    return group;
  },

  // ---- Sofa ----
  createSofa(x, y, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    
    const mat = MaterialFactory.fabric(0x2a2a4a);
    
    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 1), mat);
    seat.position.y = 0.35;
    seat.castShadow = true;
    group.add(seat);
    
    // Back
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.25), mat);
    back.position.set(0, 0.7, -0.4);
    back.castShadow = true;
    group.add(back);
    
    // Arms
    const armGeo = new THREE.BoxGeometry(0.25, 0.5, 1);
    const armL = new THREE.Mesh(armGeo, mat);
    armL.position.set(-1.15, 0.5, 0);
    group.add(armL);
    const armR = new THREE.Mesh(armGeo, mat);
    armR.position.set(1.15, 0.5, 0);
    group.add(armR);
    
    // Cushions
    const cushMat = MaterialFactory.fabric(0x3a3a5a);
    for (let i = -1; i <= 1; i++) {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.6), cushMat);
      cushion.position.set(i * 0.8, 0.6, 0.05);
      group.add(cushion);
    }
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 6);
    const legMat = MaterialFactory.metal();
    [[-1.1, 0.075, 0.4], [1.1, 0.075, 0.4], [-1.1, 0.075, -0.4], [1.1, 0.075, -0.4]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });
    
    return group;
  },

  // ---- Coffee Table ----
  createCoffeeTable(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Top - glass
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), MaterialFactory.glass());
    top.position.y = 0.45;
    group.add(top);
    
    // Frame
    const frameMat = MaterialFactory.metal();
    const frameGeo = new THREE.BoxGeometry(1.0, 0.04, 0.5);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 0.3;
    group.add(frame);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 6);
    [[-0.5, 0.225, 0.2], [0.5, 0.225, 0.2], [-0.5, 0.225, -0.2], [0.5, 0.225, -0.2]].forEach(pos => {
      const leg = new THREE.Mesh(legGeo, frameMat);
      leg.position.set(...pos);
      group.add(leg);
    });
    
    return group;
  },

  // ---- Monitor on Desk ----
  createMonitor(x, y, z, screenColor = 0x0088ff, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    
    // Screen
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.55, 0.03),
      MaterialFactory.emissiveScreen(screenColor)
    );
    screen.position.y = 0.55;
    group.add(screen);
    
    // Bezel
    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.65, 0.04),
      MaterialFactory.metal()
    );
    bezel.position.y = 0.55;
    bezel.position.z = -0.01;
    group.add(bezel);
    
    // Stand
    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8),
      MaterialFactory.metal()
    );
    stand.position.y = 0.15;
    group.add(stand);
    
    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.02, 0.2),
      MaterialFactory.metal()
    );
    base.position.y = 0.02;
    group.add(base);
    
    return group;
  },

  // ---- Desk ----
  createDesk(x, y, z, w = 2.4, d = 0.8, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    
    const mat = MaterialFactory.woodDark();
    
    // Top
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), mat);
    top.position.y = 0.75;
    top.castShadow = true;
    group.add(top);
    
    // Legs
    const legGeo = new THREE.BoxGeometry(0.06, 0.75, 0.06);
    const offX = w / 2 - 0.1;
    const offZ = d / 2 - 0.1;
    [[-offX, 0.375, offZ], [offX, 0.375, offZ], [-offX, 0.375, -offZ], [offX, 0.375, -offZ]].forEach(pos => {
      const leg = new THREE.Mesh(legGeo, mat);
      leg.position.set(...pos);
      group.add(leg);
    });
    
    return group;
  },

  // ---- Bookshelf ----
  createBookshelf(x, y, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    
    const mat = MaterialFactory.woodDark();
    
    // Frame
    const sideGeo = new THREE.BoxGeometry(0.06, 2.2, 0.4);
    const sideL = new THREE.Mesh(sideGeo, mat);
    sideL.position.set(-0.7, 1.1, 0);
    group.add(sideL);
    const sideR = new THREE.Mesh(sideGeo, mat);
    sideR.position.set(0.7, 1.1, 0);
    group.add(sideR);
    
    // Back
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.03), mat);
    backPanel.position.set(0, 1.1, -0.18);
    group.add(backPanel);
    
    // Shelves
    const shelfGeo = new THREE.BoxGeometry(1.4, 0.04, 0.38);
    for (let i = 0; i < 5; i++) {
      const shelf = new THREE.Mesh(shelfGeo, mat);
      shelf.position.set(0, i * 0.5 + 0.15, 0);
      group.add(shelf);
    }
    
    return group;
  },

  // ---- Book ----
  createBook(x, y, z, color = 0xff6b6b, thickness = 0.06) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    const bookMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    const pagesMat = new THREE.MeshStandardMaterial({ color: 0xfff8e7, roughness: 0.9 });
    
    // Cover
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, thickness), bookMat);
    group.add(cover);
    
    // Pages edge
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, thickness - 0.02), pagesMat);
    pages.position.x = 0.005;
    group.add(pages);
    
    return group;
  },

  // ---- Bed ----
  createBed(x, y, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    
    const frameMat = MaterialFactory.woodDark();
    const mattressMat = MaterialFactory.fabric(0xf5f0e8);
    const pillowMat = MaterialFactory.fabric(0xe8e0d0);
    const blanketMat = MaterialFactory.fabric(0x2a3a5a);
    
    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 2.4), frameMat);
    frame.position.y = 0.15;
    frame.castShadow = true;
    group.add(frame);
    
    // Headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 0.1), frameMat);
    headboard.position.set(0, 0.7, -1.15);
    headboard.castShadow = true;
    group.add(headboard);
    
    // Mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 2.2), mattressMat);
    mattress.position.y = 0.4;
    group.add(mattress);
    
    // Pillows
    const pillowGeo = new THREE.BoxGeometry(0.5, 0.12, 0.35);
    const pL = new THREE.Mesh(pillowGeo, pillowMat);
    pL.position.set(-0.4, 0.55, -0.8);
    group.add(pL);
    const pR = new THREE.Mesh(pillowGeo, pillowMat);
    pR.position.set(0.4, 0.55, -0.8);
    group.add(pR);
    
    // Blanket
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 1.4), blanketMat);
    blanket.position.set(0, 0.53, 0.3);
    group.add(blanket);
    
    return group;
  },

  // ---- Certificate Frame ----
  createCertFrame(x, y, z, color = 0xffd700) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.3, metalness: 0.5 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.04), frameMat);
    group.add(frame);
    
    // Inner (paper)
    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.45, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xfff8e7, roughness: 0.9 })
    );
    inner.position.z = 0.02;
    group.add(inner);
    
    // Gold seal
    const seal = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 16),
      MaterialFactory.gold()
    );
    seal.position.set(0.15, -0.12, 0.03);
    group.add(seal);
    
    return group;
  },

  // ---- Trophy ----
  createTrophy(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    const mat = MaterialFactory.gold();
    
    // Base
    group.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.2), mat));
    group.children[0].position.y = 0.025;
    
    // Stem
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.2, 8), mat));
    group.children[1].position.y = 0.15;
    
    // Cup
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.15, 12), mat));
    group.children[2].position.y = 0.32;
    
    // Handles
    const handleGeo = new THREE.TorusGeometry(0.05, 0.015, 6, 8, Math.PI);
    const hL = new THREE.Mesh(handleGeo, mat);
    hL.position.set(-0.14, 0.32, 0);
    hL.rotation.z = -Math.PI / 2;
    group.add(hL);
    const hR = new THREE.Mesh(handleGeo, mat);
    hR.position.set(0.14, 0.32, 0);
    hR.rotation.z = Math.PI / 2;
    group.add(hR);
    
    return group;
  },

  // ---- Chair ----
  createChair(x, y, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    
    const mat = MaterialFactory.fabric(0x333344);
    const metalMat = MaterialFactory.metal();
    
    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), mat);
    seat.position.y = 0.45;
    group.add(seat);
    
    // Back
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.06), mat);
    back.position.set(0, 0.75, -0.22);
    group.add(back);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6);
    [[-0.2, 0.225, 0.2], [0.2, 0.225, 0.2], [-0.2, 0.225, -0.2], [0.2, 0.225, -0.2]].forEach(pos => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(...pos);
      group.add(leg);
    });
    
    return group;
  },

  // ---- Kitchen Appliance (box with details) ----
  createAppliance(x, y, z, w, h, d, color = 0xcccccc, hasHandle = true) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    body.position.y = h / 2;
    body.castShadow = true;
    group.add(body);
    
    if (hasHandle) {
      const handleMat = MaterialFactory.metal();
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, h * 0.5, 0.04), handleMat);
      handle.position.set(w / 2 - 0.1, h * 0.55, d / 2 + 0.03);
      group.add(handle);
    }
    
    return group;
  },

  // ---- Collectible Star ----
  createCollectible(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    
    // Star shape using octahedron
    const geo = new THREE.OctahedronGeometry(0.2, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 1,
      roughness: 0.2,
      metalness: 0.8,
    });
    const star = new THREE.Mesh(geo, mat);
    group.add(star);
    
    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);
    
    // Point light
    const light = new THREE.PointLight(0xffd700, 0.8, 5, 2);
    group.add(light);
    
    group.userData.isCollectible = true;
    group.userData.collected = false;
    
    return group;
  },
};
