// ============================================
// House — Modern Luxury Villa Structure
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { HOUSE, COLORS } from '../config.js';

export function createHouse(scene, collisionSystem) {
  const group = new THREE.Group();
  group.name = 'house';
  
  const W = HOUSE.width;
  const D = HOUSE.depth;
  const FH = HOUSE.floorHeight;
  const WT = HOUSE.wallThickness;
  const halfW = W / 2;
  const halfD = D / 2;
  
  const wallMat = MaterialFactory.whiteWall();
  const woodMat = MaterialFactory.wood();
  const glassMat = MaterialFactory.glass();
  const marbleMat = MaterialFactory.marble();
  const roofMat = MaterialFactory.roofTop();

  // Helper to create a wall segment
  function wall(x, y, z, w, h, d, mat = wallMat) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  // ===== GROUND FLOOR =====
  const gFloor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.15, D), marbleMat);
  gFloor.position.set(0, 0.075, 0);
  gFloor.receiveShadow = true;
  group.add(gFloor);
  
  // Register ground floor collision
  collisionSystem.addFloor(-halfW, -halfD, halfW, halfD, 0.15);

  // ---- Exterior walls (Ground Floor) ----
  // Front wall (Z = -halfD)
  wall(-halfW + 5.5, FH / 2, -halfD, 11, FH, WT); // Left solid
  wall(halfW - 5.5, FH / 2, -halfD, 11, FH, WT);  // Right solid
  
  // Left side glass
  const frontGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(2, FH - 0.5, 0.05), glassMat);
  frontGlassLeft.position.set(-3, FH / 2, -halfD);
  group.add(frontGlassLeft);
  
  // Right side glass
  const frontGlassRight = new THREE.Mesh(new THREE.BoxGeometry(2, FH - 0.5, 0.05), glassMat);
  frontGlassRight.position.set(3, FH / 2, -halfD);
  group.add(frontGlassRight);
  
  // Entrance Door Frame & Doors
  const doorGeo = new THREE.BoxGeometry(1.9, FH - 0.5, 0.1);
  const doorMat = MaterialFactory.woodDark();
  
  const doorL = new THREE.Mesh(doorGeo, doorMat);
  doorL.position.set(-1.9, FH / 2, -halfD + 0.95);
  doorL.rotation.y = Math.PI / 2; // Open inwards
  doorL.castShadow = true;
  group.add(doorL);
  
  const doorR = new THREE.Mesh(doorGeo, doorMat);
  doorR.position.set(1.9, FH / 2, -halfD + 0.95);
  doorR.rotation.y = -Math.PI / 2; // Open inwards
  doorR.castShadow = true;
  group.add(doorR);

  // Front Awning / Overhang
  const awning = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 4), MaterialFactory.metal());
  awning.position.set(0, FH, -halfD - 2);
  awning.castShadow = true;
  group.add(awning);

  // Back wall (Z = halfD) — with wide patio opening
  wall(-halfW + 4, FH / 2, halfD, 8, FH, WT); // Left section
  wall(halfW - 4, FH / 2, halfD, 8, FH, WT);  // Right section

  // Left wall (X = -halfW)
  wall(-halfW, FH / 2, 0, WT, FH, D);

  // Right wall (X = halfW)  
  wall(halfW, FH / 2, 0, WT, FH, D);

  // ---- Interior walls (Ground Floor) ----
  // Central Foyer hallway walls
  wall(-3, FH / 2, -halfD / 2 - 1, WT, FH, D / 2 - 4); // Left hallway wall
  wall(3, FH / 2, -halfD / 2 - 1, WT, FH, D / 2 - 4);  // Right hallway wall
  
  // Divider between front and back rooms (Z = 2)
  wall(-halfW / 2 - 1.5, FH / 2, 2, halfW - 3, FH, WT); // Left cross wall
  wall(halfW / 2 + 1.5, FH / 2, 2, halfW - 3, FH, WT);  // Right cross wall

  // ===== SECOND FLOOR =====
  // Second floor slab with stairwell hole
  const sFloorH = 0.2;
  const sFloorY = FH;
  
  // Front slab (Front wall to stair start)
  const slab1D = 11;
  const slab1 = new THREE.Mesh(new THREE.BoxGeometry(W, sFloorH, slab1D), marbleMat);
  slab1.position.set(0, sFloorY, -halfD + slab1D / 2);
  slab1.receiveShadow = true; slab1.castShadow = true;
  group.add(slab1);
  collisionSystem.addFloor(-halfW, -halfD, halfW, -halfD + slab1D, sFloorY + sFloorH / 2);

  // Left side slab (Beside stairs)
  const slab2W = 13;
  const slab2D = 6;
  const slab2 = new THREE.Mesh(new THREE.BoxGeometry(slab2W, sFloorH, slab2D), marbleMat);
  slab2.position.set(-halfW + slab2W / 2, sFloorY, -1 + slab2D / 2);
  slab2.receiveShadow = true; slab2.castShadow = true;
  group.add(slab2);
  collisionSystem.addFloor(-halfW, -1, -halfW + slab2W, -1 + slab2D, sFloorY + sFloorH / 2);

  // Right side slab (Beside stairs)
  const slab3 = new THREE.Mesh(new THREE.BoxGeometry(slab2W, sFloorH, slab2D), marbleMat);
  slab3.position.set(halfW - slab2W / 2, sFloorY, -1 + slab2D / 2);
  slab3.receiveShadow = true; slab3.castShadow = true;
  group.add(slab3);
  collisionSystem.addFloor(halfW - slab2W, -1, halfW, -1 + slab2D, sFloorY + sFloorH / 2);

  // Back slab (Behind stairs)
  const slab4D = 7;
  const slab4 = new THREE.Mesh(new THREE.BoxGeometry(W, sFloorH, slab4D), marbleMat);
  slab4.position.set(0, sFloorY, halfD - slab4D / 2);
  slab4.receiveShadow = true; slab4.castShadow = true;
  group.add(slab4);
  collisionSystem.addFloor(-halfW, halfD - slab4D, halfW, halfD, sFloorY + sFloorH / 2);

  // ---- Exterior walls (Second Floor) ----
  // Front
  wall(-halfW + 4, FH + FH / 2, -halfD, 8, FH, WT);
  wall(halfW - 4, FH + FH / 2, -halfD, 8, FH, WT);
  const front2Glass = new THREE.Mesh(new THREE.BoxGeometry(W - 16, FH - 0.5, 0.05), glassMat);
  front2Glass.position.set(0, FH + FH / 2, -halfD);
  group.add(front2Glass);

  // Back — balcony section has railing instead of wall
  wall(-halfW + 5, FH + FH / 2, halfD, 10, FH, WT);
  // Balcony opening
  const balconyRail = new THREE.Mesh(new THREE.BoxGeometry(W - 10, 1.0, 0.08), glassMat);
  balconyRail.position.set(2, FH + 0.5, halfD);
  group.add(balconyRail);

  // Left wall
  wall(-halfW, FH + FH / 2, 0, WT, FH, D);

  // Right wall
  wall(halfW, FH + FH / 2, 0, WT, FH, D);

  // ---- Interior walls (Second Floor) ----
  // Master bedroom and Library divider
  wall(-halfW / 2 - 1.5, FH + FH / 2, 2, halfW - 3, FH, WT);
  // Gaming room and Balcony divider
  wall(halfW / 2 + 1.5, FH + FH / 2, 2, halfW - 3, FH, WT);
  // Central hallway
  wall(-3, FH + FH / 2, halfD / 2 + 1, WT, FH, D / 2 - 2);

  // ===== ROOF =====
  const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 2, 0.2, D + 2), roofMat);
  roof.position.set(0, FH * 2, 0);
  roof.receiveShadow = true;
  roof.castShadow = true;
  group.add(roof);

  // Roof overhang edge
  const roofEdge = new THREE.Mesh(new THREE.BoxGeometry(W + 2.5, 0.08, D + 2.5), MaterialFactory.metal());
  roofEdge.position.set(0, FH * 2 + 0.1, 0);
  group.add(roofEdge);

  // ===== WOOD ACCENT PANELS =====
  const accentH = 1.5;
  for (let i = 0; i < 3; i++) {
    const accent = new THREE.Mesh(new THREE.BoxGeometry(3, accentH, 0.08), woodMat);
    accent.position.set(-8 + i * 8, accentH / 2, -halfD - 0.1);
    group.add(accent);
  }

  // ===== ENTRANCE PORCHES & STAIRS =====
  // Front Porch
  const fPorch = new THREE.Mesh(new THREE.BoxGeometry(8, 0.15, 4), marbleMat);
  fPorch.position.set(0, 0.075, -halfD - 2);
  fPorch.receiveShadow = true;
  group.add(fPorch);
  collisionSystem.addFloor(-4, -halfD - 4, 4, -halfD, 0.15);

  // Front Stairs
  for (let i = 0; i < 3; i++) {
    const stepH = 0.05;
    const step = new THREE.Mesh(new THREE.BoxGeometry(8, stepH, 0.5), marbleMat);
    step.position.set(0, (2 - i) * stepH + stepH/2, -halfD - 4.25 - i * 0.5);
    step.receiveShadow = true;
    group.add(step);
    
    collisionSystem.addFloor(
      -4, -halfD - 4.5 - i * 0.5,
      4, -halfD - 4.0 - i * 0.5,
      (3 - i) * stepH
    );
  }

  // Back Patio
  const patioW = 14;
  const patioD = 6;
  const bPatio = new THREE.Mesh(new THREE.BoxGeometry(patioW, 0.15, patioD), woodMat);
  bPatio.position.set(0, 0.075, halfD + patioD / 2);
  bPatio.receiveShadow = true;
  group.add(bPatio);
  collisionSystem.addFloor(-patioW/2, halfD, patioW/2, halfD + patioD, 0.15);

  // Back Stairs
  for (let i = 0; i < 3; i++) {
    const stepH = 0.05;
    const step = new THREE.Mesh(new THREE.BoxGeometry(patioW, stepH, 0.5), woodMat);
    step.position.set(0, (2 - i) * stepH + stepH/2, halfD + patioD + 0.25 + i * 0.5);
    step.receiveShadow = true;
    group.add(step);
    
    collisionSystem.addFloor(
      -patioW/2, halfD + patioD + i * 0.5,
      patioW/2, halfD + patioD + 0.5 + i * 0.5,
      (3 - i) * stepH
    );
  }

  // ===== STAIRCASE (Interior) =====
  const stairMat = MaterialFactory.marble();
  const stairCount = 16;
  const stairW = 4; // Wider stairs
  const stairD = 0.35;
  const stairH = (FH - 0.15) / stairCount; // Height to reach second floor
  const stairStartZ = -0.5; // Start near the front door hallway
  
  // The stairs
  for (let i = 0; i < stairCount; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(stairW, stairH, stairD), stairMat);
    step.position.set(0, 0.15 + stairH * (i + 0.5), stairStartZ + i * stairD);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
    
    // Stair collision ramp
    collisionSystem.addFloor(
      -stairW / 2, stairStartZ + i * stairD - stairD / 2,
      stairW / 2, stairStartZ + i * stairD + stairD / 2,
      0.15 + stairH * (i + 1)
    );
  }

  // Stair railings
  const railMat = MaterialFactory.metal();
  const railGeo = new THREE.BoxGeometry(0.04, 1.0, stairCount * stairD);
  [-1, 1].forEach(side => {
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(side * (stairW / 2 - 0.1), (FH - 0.15) / 2 + 0.5 + 0.15, stairStartZ + stairCount * stairD / 2 - stairD / 2);
    rail.rotation.x = -Math.atan2(FH - 0.15, stairCount * stairD); // Negative to slope UP
    group.add(rail);
  });

  // Second Floor Stairwell Safety Glass Railings
  // Left and Right rails alongside the hole
  const safeRailGeoL = new THREE.BoxGeometry(0.05, 1.2, 6);
  const safeRailL = new THREE.Mesh(safeRailGeoL, glassMat);
  safeRailL.position.set(-2, FH + 0.6, 2);
  group.add(safeRailL);

  const safeRailR = new THREE.Mesh(safeRailGeoL, glassMat);
  safeRailR.position.set(2, FH + 0.6, 2);
  group.add(safeRailR);

  // Back railing (placed at z = 5.0 to align with the edge of the hole, not blocking the stairs)
  const safeRailGeoB = new THREE.BoxGeometry(4, 1.2, 0.05);
  const safeRailB = new THREE.Mesh(safeRailGeoB, glassMat);
  safeRailB.position.set(0, FH + 0.6, 5.0);
  group.add(safeRailB);

  // ===== COLLISION REGISTRATION =====
  // Exterior walls
  collisionSystem.addWall(-halfW - WT, -halfD - WT, -halfW, halfD + WT, 0, FH * 2); // Left
  collisionSystem.addWall(halfW, -halfD - WT, halfW + WT, halfD + WT, 0, FH * 2);   // Right
  
  // Front wall with door gap (center 4 units open -> x: -2 to 2)
  collisionSystem.addWall(-halfW, -halfD - WT, -2, -halfD, 0, FH * 2); // Front Left
  collisionSystem.addWall(2, -halfD - WT, halfW, -halfD, 0, FH * 2);   // Front Right
  
  // Back wall with patio gap (center 14 units open -> x: -7 to 7)
  collisionSystem.addWall(-halfW, halfD, -7, halfD + WT, 0, FH * 2);   // Back Left
  collisionSystem.addWall(7, halfD, halfW, halfD + WT, 0, FH * 2);     // Back Right
  
  // Interior walls (simplified — main dividers)
  collisionSystem.addWall(-3 - WT/2, -halfD, -3 + WT/2, -2, 0, FH);  // Left Hallway
  collisionSystem.addWall(3 - WT/2, -halfD, 3 + WT/2, -2, 0, FH);    // Right Hallway
  
  collisionSystem.addWall(-halfW, 2 - WT/2, -3, 2 + WT/2, 0, FH * 2);  // Cross left
  collisionSystem.addWall(3, 2 - WT/2, halfW, 2 + WT/2, 0, FH * 2);    // Cross right

  // Second floor safety railings collision
  collisionSystem.addWall(-2.2, -1, -1.8, 4, FH, FH + 1.2); // Left rail
  collisionSystem.addWall(1.8, -1, 2.2, 4, FH, FH + 1.2);   // Right rail
  collisionSystem.addWall(-2, 3.8, 2, 4.2, FH, FH + 1.2);   // Back rail

  scene.add(group);
  return group;
}
