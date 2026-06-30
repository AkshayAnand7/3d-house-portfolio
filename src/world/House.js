// ============================================
// House — GTA-Style Single-Floor House (Updated Design)
// Ported from gta-house reference with doors, wider doorways, repositioned furniture
// ============================================

import * as THREE from 'three';
import { HOUSE } from '../config.js';
import { createSportsCar } from '../utils/CarFactory.js';

export function createHouse(scene, collisionSystem) {
  const group = new THREE.Group();
  group.name = 'house';

  const WALL_H = HOUSE.floorHeight;
  const DOOR_W = 1.6;
  const DOOR_H = 2.4;
  const wallColor = 0xD9C49A;
  const wallColorSide = 0xCBB488;

  // ---- Helpers ----
  function box(w, h, d, color, x, y, z, opts = {}) {
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    if (opts.ry) mesh.rotation.y = opts.ry;
    mesh.position.set(x, y, z);
    mesh.castShadow = opts.cast !== false;
    mesh.receiveShadow = opts.recv !== false;
    group.add(mesh);
    if (opts.collide !== false) {
      const hw = w / 2, hd = d / 2;
      collisionSystem.addWall(x - hw, z - hd, x + hw, z + hd, y - h / 2, y + h / 2);
    }
    return mesh;
  }

  function cyl(rt, rb, h, segs, color, x, y, z, opts = {}) {
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat);
    mesh.position.set(x, y, z);
    if (opts.ry) mesh.rotation.y = opts.ry;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    if (opts.collide) {
      collisionSystem.addWall(x - rt - 0.05, z - rt - 0.05, x + rt + 0.05, z + rt + 0.05, y - h / 2, y + h / 2);
    }
    return mesh;
  }

  function planeFloor(w, h, color, x, y, z) {
    const mat = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  function windowPane(x, y, z, ry, w, h) {
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.05),
      new THREE.MeshLambertMaterial({ color: 0x88CCEE, transparent: true, opacity: 0.55 })
    );
    glass.rotation.y = ry || 0;
    glass.position.set(x, y, z);
    group.add(glass);
  }

  // Door with frame, handle, and leaf swung open
  function buildDoor(x, y, z, ry, w, h, color) {
    const grp = new THREE.Group();
    const frameMat = new THREE.MeshLambertMaterial({ color: 0xEDE6D0 });

    const left = new THREE.Mesh(new THREE.BoxGeometry(0.08, h + 0.15, 0.14), frameMat);
    left.position.set(-w / 2 - 0.04, 0, 0);
    grp.add(left);
    const right = left.clone();
    right.position.x = w / 2 + 0.04;
    grp.add(right);
    const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.24, 0.1, 0.14), frameMat);
    top.position.set(0, h / 2 + 0.05, 0);
    grp.add(top);

    // Leaf swung open flat against the wall
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, h, 0.06), new THREE.MeshLambertMaterial({ color }));
    leaf.position.set(-w / 2, 0, -w / 2 + 0.03);
    leaf.rotation.y = Math.PI / 2;
    grp.add(leaf);

    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshLambertMaterial({ color: 0xC9A227 }));
    handle.position.set(-w / 2 + 0.05, 0, -w * 0.9 + 0.03);
    grp.add(handle);

    grp.position.set(x, y, z);
    grp.rotation.y = ry || 0;
    grp.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    group.add(grp);
    return grp;
  }

  // Front door (exterior, slightly different frame color)
  function buildFrontDoor(x, y, z, ry, w, h, color) {
    const grp = new THREE.Group();
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x4A3520 });

    const left = new THREE.Mesh(new THREE.BoxGeometry(0.1, h + 0.2, 0.18), frameMat);
    left.position.set(-w / 2 - 0.05, 0, 0);
    grp.add(left);
    const right = left.clone();
    right.position.x = w / 2 + 0.05;
    grp.add(right);
    const topF = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.12, 0.18), frameMat);
    topF.position.set(0, h / 2 + 0.06, 0);
    grp.add(topF);

    const leaf = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, h, 0.08), new THREE.MeshLambertMaterial({ color }));
    leaf.position.set(-w / 2, 0, -w / 2 + 0.04);
    leaf.rotation.y = Math.PI / 2;
    grp.add(leaf);

    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshLambertMaterial({ color: 0xC9A227 }));
    handle.position.set(-w / 2 + 0.06, 0, -w * 0.92 + 0.04);
    grp.add(handle);

    grp.position.set(x, y, z);
    grp.rotation.y = ry || 0;
    grp.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    group.add(grp);
    return grp;
  }

  // =============================================
  // HOUSE SHELL
  // =============================================
  // Floor slab
  box(15.4, 0.2, 10.4, 0xC9BFA8, -2.5, -0.1, 0, { collide: false });
  collisionSystem.addFloor(-10.2, -5.2, 5.2, 5.2, 0.0);

  // Roof
  box(15.6, 0.3, 10.6, 0x8B7355, -2.5, WALL_H + 0.15, 0, { collide: false });
  box(15.6, 0.4, 0.3, 0x7A6545, -2.5, WALL_H + 0.45, 5.15, { collide: false });
  box(15.6, 0.4, 0.3, 0x7A6545, -2.5, WALL_H + 0.45, -5.15, { collide: false });
  box(0.3, 0.4, 10.6, 0x7A6545, 5.15, WALL_H + 0.45, 0, { collide: false });
  box(0.3, 0.4, 10.6, 0x7A6545, -10.15, WALL_H + 0.45, 0, { collide: false });

  // Chimney
  box(1, 3, 1, 0x8B7355, 2, WALL_H + 1.5, -3.5, { collide: false });

  // Ceiling
  box(15.4, 0.15, 10.4, 0xF0EBDD, -2.5, WALL_H, 0, { collide: false, recv: false });

  // ---- Exterior Walls ----
  // Back wall (z = -5), full length
  box(15.4, WALL_H, 0.2, wallColor, -2.5, WALL_H / 2, -5);

  // Front wall (z = 5): garage door opening + front door opening
  box(0.5, WALL_H, 0.2, wallColorSide, -9.75, WALL_H / 2, 5);
  box(0.5, WALL_H, 0.2, wallColorSide, -5.25, WALL_H / 2, 5);
  box(2.5, 0.6, 0.2, wallColorSide, -7.5, WALL_H - 0.3, 5, { collide: false }); // header above garage door
  box(4.4, WALL_H, 0.2, wallColor, -2.95, WALL_H / 2, 5);      // between garage and front door
  box(4.2, WALL_H, 0.2, wallColor, 2.9, WALL_H / 2, 5);         // right of front door
  box(DOOR_W + 0.4, 0.8, 0.2, wallColor, 0, WALL_H - 0.4, 5, { collide: false }); // header above front door

  // Right wall (x = 5)
  box(0.2, WALL_H, 10, wallColor, 5, WALL_H / 2, 0);

  // Left wall (x = -10), garage end
  box(0.2, WALL_H, 10, wallColorSide, -10, WALL_H / 2, 0);

  // Visible front door, propped open (centered at x=0)
  buildFrontDoor(0, DOOR_H / 2, 5.05, 0, DOOR_W, DOOR_H, 0x6B4226);

  // Window glass panes
  windowPane(5.02, 1.8, 2, Math.PI / 2, 1.6, 1.3);
  windowPane(5.02, 1.8, -2, Math.PI / 2, 1.6, 1.3);
  windowPane(-2, 1.8, -5.02, 0, 1.6, 1.3);
  windowPane(2, 1.8, -5.02, 0, 1.6, 1.3);
  windowPane(-10.02, 1.8, -1, Math.PI / 2, 1.4, 1.2);
  windowPane(-3.5, 1.9, 5.02, 0, 1.2, 1.1);
  windowPane(3.5, 1.9, 5.02, 0, 1.2, 1.1);

  // Porch steps
  box(3, 0.15, 0.6, 0xC0A882, 0, 0.075, 5.9, { collide: false });
  box(2.4, 0.15, 0.6, 0xB8A07A, 0, 0.22, 6.45, { collide: false });

  // =============================================
  // INTERIOR DIVIDERS WITH DOORS
  // =============================================
  // Garage <-> Living room (x = -5), doorway z -2..2
  box(0.15, WALL_H, 3, 0xE8E0CC, -5, WALL_H / 2, -3.5);
  box(0.15, WALL_H, 3, 0xE8E0CC, -5, WALL_H / 2, 3.5);
  buildDoor(-5, 1.2, -2, Math.PI / 2, 1.6, 2.4, 0xA0876A);

  // Living room <-> Kitchen/Bedroom (z = 1), doorway x -2.5..2.5
  box(2.5, WALL_H, 0.15, 0xE8E0CC, -3.75, WALL_H / 2, 1);
  box(2.5, WALL_H, 0.15, 0xE8E0CC, 3.75, WALL_H / 2, 1);
  buildDoor(-2.5, 1.2, 1, 0, 1.6, 2.4, 0xA0876A);

  // Kitchen <-> Bedroom (x = 0), doorway z -3..0
  box(0.15, WALL_H, 1.7, 0xE8E0CC, 0, WALL_H / 2, -4.15);
  box(0.15, WALL_H, 0.7, 0xE8E0CC, 0, WALL_H / 2, 0.65);
  buildDoor(0, 1.2, -3.15, Math.PI / 2, 1.6, 2.4, 0xA0876A);

  // Bathroom nook walls
  box(1.3, WALL_H * 0.72, 0.1, 0xCFE8E0, 4.35, WALL_H * 0.36, -3);
  box(0.1, WALL_H * 0.72, 2, 0xCFE8E0, 3, WALL_H * 0.36, -4);
  buildDoor(3.7, 1.1, -3, 0, 1.1, 2.0, 0xCFE8E0);

  // =============================================
  // LIVING ROOM (x -5..5, z 1..5)
  // =============================================
  planeFloor(4.6, 3.6, 0xB5453A, -2.6, 0.011, 3.1); // rug

  box(2.4, 0.7, 0.95, 0x35506B, -4.3, 0.35, 4.3, { collide: true }); // sofa
  box(0.85, 0.9, 0.95, 0x2C435C, -4.3, 0.45, 3.85, { collide: false, recv: false }); // back cushion
  box(0.28, 0.5, 0.95, 0xE8D8B0, -3.15, 0.25, 4.3, { collide: true }); // armrest
  box(0.28, 0.5, 0.95, 0xE8D8B0, -5.45, 0.25, 4.3, { collide: true });

  box(1.3, 0.35, 0.65, 0x6B4423, -3.6, 0.18, 2.9, { collide: true }); // coffee table

  box(1.6, 0.5, 0.4, 0x3A2A1A, -2.6, 0.25, 1.45, { collide: true }); // TV stand
  box(1.4, 0.85, 0.07, 0x111111, -2.6, 1.05, 1.27, { collide: false }); // TV

  box(0.32, 2.1, 1.4, 0x6B4423, -5.55, 1.05, 2.0, { collide: true }); // bookshelf
  for (let i = 0; i < 4; i++) box(0.27, 0.04, 1.3, 0x8B6F47, -5.55, 0.3 + i * 0.52, 2.0, { collide: false, cast: false });

  cyl(0.04, 0.04, 1.6, 8, 0x222222, -1.3, 0.8, 4.5, { collide: true }); // floor lamp pole
  cyl(0.3, 0.2, 0.35, 10, 0xE8D8A8, -1.3, 1.65, 4.5, { collide: false }); // lamp shade

  box(0.05, 0.8, 1.0, 0x222222, -5.9, 1.9, 3.2, { ry: Math.PI / 2, collide: false }); // wall art

  // Accent chairs near the hallway
  cyl(0.32, 0.32, 0.7, 10, 0x7A3B2E, 1.4, 0.35, 3.6, { collide: true });
  cyl(0.32, 0.32, 0.7, 10, 0x7A3B2E, 1.4, 0.35, 4.7, { collide: true });

  // =============================================
  // KITCHEN (x -5..0, z -5..1)
  // =============================================
  planeFloor(4.6, 3.5, 0xE2DCC8, -2.6, 0.011, -3.2); // floor

  box(4.5, 0.9, 0.7, 0xEDEDE8, -3.4, 0.45, -4.55, { collide: true }); // counter run
  box(0.7, 0.9, 2.6, 0xEDEDE8, -5.55, 0.45, -3.3, { collide: true });
  box(4.5, 0.06, 0.75, 0x444444, -3.4, 0.93, -4.55, { collide: false });
  box(0.75, 0.06, 2.6, 0x444444, -5.55, 0.93, -3.3, { collide: false });

  box(0.8, 0.05, 0.6, 0x222222, -1.8, 0.94, -4.55, { collide: false, cast: false }); // stove
  box(0.6, 0.1, 0.45, 0xAAAAAA, -3.2, 0.95, -4.55, { collide: false, cast: false }); // sink

  box(0.9, 1.8, 0.8, 0xE6E6E6, -1.0, 0.9, -4.6, { collide: true }); // fridge

  box(1.5, 0.9, 0.9, 0xD8C9A3, -2.6, 0.45, -2.0, { collide: true }); // island
  box(1.5, 0.06, 0.9, 0x3A3A3A, -2.6, 0.93, -2.0, { collide: false });

  cyl(0.17, 0.17, 0.55, 10, 0x333333, -2.05, 0.28, -1.1, { collide: true }); // bar stools
  cyl(0.17, 0.17, 0.55, 10, 0x333333, -3.15, 0.28, -1.1, { collide: true });

  box(1.5, 0.08, 0.85, 0x6B4423, -4.4, 0.75, -1.8, { collide: true }); // dining table
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -4.95, 0.38, -2.1, { collide: false });
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -3.85, 0.38, -2.1, { collide: false });
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -4.95, 0.38, -1.5, { collide: false });
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -3.85, 0.38, -1.5, { collide: false });

  cyl(0.1, 0.15, 0.2, 10, 0xE8C77A, -2.6, 2.6, -2.0, { collide: false }); // pendant light

  // =============================================
  // BEDROOM & BATHROOM (x 0..5, z -5..1)
  // =============================================
  planeFloor(5, 5.5, 0xC9B8D8, 2.4, 0.011, -1.5); // floor

  box(2, 0.5, 2.6, 0x4A3A6B, 1.0, 0.25, -1.9, { collide: true }); // bed
  box(2, 0.3, 0.5, 0xEEEEEE, 1.0, 0.6, -3.1, { collide: false }); // pillows
  box(2.1, 0.7, 0.15, 0x6B5A8B, 1.0, 0.6, -3.2, { collide: false }); // headboard

  box(0.5, 0.5, 0.5, 0x5A4530, -0.2, 0.25, -3.1, { collide: true }); // nightstands
  box(0.5, 0.5, 0.5, 0x5A4530, 2.2, 0.25, -3.1, { collide: true });

  box(1.4, 2.2, 0.6, 0x6B4423, 4.6, 1.1, -1.7, { collide: true }); // wardrobe

  box(1.4, 0.06, 0.7, 0x8B6F47, 4.5, 0.75, -0.5, { collide: true }); // desk
  box(0.06, 0.75, 0.06, 0x5A4530, 3.9, 0.37, -0.2, { collide: false });
  box(0.06, 0.75, 0.06, 0x5A4530, 5.1, 0.37, -0.2, { collide: false });
  cyl(0.25, 0.25, 0.5, 10, 0x222222, 4.5, 0.25, 0.25, { collide: true }); // desk chair

  planeFloor(2.6, 3, 0xE8D8B0, 1.0, 0.012, -1.9); // rug under bed

  // Bathroom nook
  planeFloor(1.9, 1.9, 0xCFE8E0, 4, 0.011, -4);
  box(0.5, 0.55, 0.4, 0xFFFFFF, 4.55, 0.28, -4.6, { collide: true }); // toilet
  cyl(0.25, 0.25, 0.1, 12, 0xFFFFFF, 4.55, 0.6, -4.6, { collide: false });
  box(0.7, 0.7, 0.5, 0xFFFFFF, 3.5, 0.35, -4.6, { collide: true }); // sink
  box(0.6, 0.04, 0.45, 0xDDEEEE, 3.5, 0.72, -4.6, { collide: false });

  // =============================================
  // GARAGE (x -10..-5, z -5..5)
  // =============================================
  planeFloor(5, 10, 0x9A9A9A, -7.5, 0.011, 0); // floor

  // Car inside garage (moved back, clear of doorway)
  const carGrp = createSportsCar(0x224488); // Blue sports car
  carGrp.rotation.y = Math.PI / 2;
  carGrp.position.set(-7.5, 0, -2.5);
  group.add(carGrp);
  collisionSystem.addWall(-8.4, -4.3, -6.6, -0.7, 0, 1.7);

  box(2, 1.8, 0.4, 0x5A5A5A, -9.6, 0.9, -4.3, { collide: true }); // tool shelf
  box(1.8, 0.85, 0.6, 0x6B4423, -9.5, 0.42, 3.5, { collide: true }); // workbench

  // =============================================
  // CEILING LIGHTS
  // =============================================
  const ceilLights = [];
  function ceilLight(x, z) {
    const fix = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12),
      new THREE.MeshLambertMaterial({ color: 0xFFF4D6 })
    );
    fix.position.set(x, WALL_H - 0.05, z);
    group.add(fix);
    const pl = new THREE.PointLight(0xFFF0D0, 0.9, 7);
    pl.position.set(x, WALL_H - 0.2, z);
    group.add(pl);
    ceilLights.push(pl);
  }

  ceilLight(-2.6, 3.1);   // Living room
  ceilLight(-2.6, -3.2);  // Kitchen
  ceilLight(2.4, -1.5);   // Bedroom
  ceilLight(-7.5, 0);     // Garage

  // Porch light
  const porchLight = new THREE.PointLight(0xFFDDAA, 1.2, 8);
  porchLight.position.set(0, 3.0, 5.2);
  group.add(porchLight);

  scene.add(group);
  return { group, ceilLights };
}
