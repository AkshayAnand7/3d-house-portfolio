// build-interior.js
// Interior dividing walls (with generous, furniture-clear doorways),
// furnished rooms, interior doors, and ceiling light fixtures.
//
// Room layout inside the shell (x -10..5, z -5..5):
//   Garage        x -10..-5   z -5..5
//   Living room   x  -5..0    z  1..5   (open to garage via doorway, open to kitchen/bedroom via doorway)
//   Kitchen       x  -5..0    z -5..1
//   Bedroom       x   0..5    z -5..1   (includes bathroom nook x 3..5 z -5..-3)
//   (x 0..5, z 1..5 is left open as part of the living room / hallway so the
//    whole front of the house reads as one connected open-plan space)
//
// Every doorway gap below is sized at least 1.4m wide and placed away from
// furniture footprints so the player can always walk straight through.

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

  // Leaf swung open flat against the wall, never blocking the gap
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
  scene.add(grp);
  return grp;
}

function buildDividers() {
  // ---- Garage <-> Living room divider (x = -5), doorway z -2..2 (4m wide) ----
  box(0.15, WALL_H, 3, 0xE8E0CC, -5, WALL_H / 2, -3.5);   // wall segment z -5..-2
  box(0.15, WALL_H, 3, 0xE8E0CC, -5, WALL_H / 2, 3.5);    // wall segment z 2..5
  buildDoor(-5, 1.2, -2, Math.PI / 2, 1.6, 2.4, 0xA0876A);

  // ---- Living room <-> Kitchen/Bedroom divider (z = 1), doorway x -2.5..2.5 (5m wide) ----
  box(2.5, WALL_H, 0.15, 0xE8E0CC, -3.75, WALL_H / 2, 1); // wall segment x -5..-2.5
  box(2.5, WALL_H, 0.15, 0xE8E0CC, 3.75, WALL_H / 2, 1);  // wall segment x 2.5..5
  buildDoor(-2.5, 1.2, 1, 0, 1.6, 2.4, 0xA0876A);

  // ---- Kitchen <-> Bedroom divider (x = 0), doorway z -3..0 (3m wide, clear of island/desk) ----
  box(0.15, WALL_H, 1.7, 0xE8E0CC, 0, WALL_H / 2, -4.15); // wall segment z -5..-3.3
  box(0.15, WALL_H, 0.7, 0xE8E0CC, 0, WALL_H / 2, 0.65);  // wall segment z -0.3..1
  buildDoor(0, 1.2, -3.15, Math.PI / 2, 1.6, 2.4, 0xA0876A);

  // ---- Bathroom nook walls (corner x 3..5, z -5..-3), doorway on the open side ----
  box(1.3, WALL_H * 0.72, 0.1, 0xCFE8E0, 4.35, WALL_H * 0.36, -3);
  box(0.1, WALL_H * 0.72, 2, 0xCFE8E0, 3, WALL_H * 0.36, -4);
  buildDoor(3.7, 1.1, -3, 0, 1.1, 2.0, 0xCFE8E0);
}

function buildLivingRoom() {
  plane(4.6, 3.6, 0xB5453A, -2.6, 0.011, 3.1, -Math.PI / 2, 0); // rug

  box(2.4, 0.7, 0.95, 0x35506B, -4.3, 0.35, 4.3, { collide: true }); // sofa, pushed to back-left corner
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

  // A couple of accent chairs near the hallway so the room reads as a real living area
  cyl(0.32, 0.32, 0.7, 10, 0x7A3B2E, 1.4, 0.35, 3.6, { collide: true });
  cyl(0.32, 0.32, 0.7, 10, 0x7A3B2E, 1.4, 0.35, 4.7, { collide: true });
}

function buildKitchen() {
  plane(4.6, 3.5, 0xE2DCC8, -2.6, 0.011, -3.2, -Math.PI / 2, 0); // floor

  box(4.5, 0.9, 0.7, 0xEDEDE8, -3.4, 0.45, -4.55, { collide: true }); // counter run along back wall
  box(0.7, 0.9, 2.6, 0xEDEDE8, -5.55, 0.45, -3.3, { collide: true }); // side run along garage wall
  box(4.5, 0.06, 0.75, 0x444444, -3.4, 0.93, -4.55, { collide: false });
  box(0.75, 0.06, 2.6, 0x444444, -5.55, 0.93, -3.3, { collide: false });

  box(0.8, 0.05, 0.6, 0x222222, -1.8, 0.94, -4.55, { collide: false, cast: false }); // stove
  box(0.6, 0.1, 0.45, 0xAAAAAA, -3.2, 0.95, -4.55, { collide: false, cast: false }); // sink

  box(0.9, 1.8, 0.8, 0xE6E6E6, -1.0, 0.9, -4.6, { collide: true }); // fridge

  box(1.5, 0.9, 0.9, 0xD8C9A3, -2.6, 0.45, -2.0, { collide: true }); // island, kept clear of both doorways
  box(1.5, 0.06, 0.9, 0x3A3A3A, -2.6, 0.93, -2.0, { collide: false });

  cyl(0.17, 0.17, 0.55, 10, 0x333333, -2.05, 0.28, -1.1, { collide: true }); // bar stools
  cyl(0.17, 0.17, 0.55, 10, 0x333333, -3.15, 0.28, -1.1, { collide: true });

  box(1.5, 0.08, 0.85, 0x6B4423, -4.4, 0.75, -1.8, { collide: true }); // dining table, tucked into corner
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -4.95, 0.38, -2.1, { collide: false });
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -3.85, 0.38, -2.1, { collide: false });
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -4.95, 0.38, -1.5, { collide: false });
  cyl(0.06, 0.06, 0.7, 8, 0x4A2E12, -3.85, 0.38, -1.5, { collide: false });

  cyl(0.1, 0.15, 0.2, 10, 0xE8C77A, -2.6, 2.6, -2.0, { collide: false }); // pendant light shade
}

function buildBedroomAndBath() {
  plane(5, 5.5, 0xC9B8D8, 2.4, 0.011, -1.5, -Math.PI / 2, 0); // floor

  box(2, 0.5, 2.6, 0x4A3A6B, 1.0, 0.25, -1.9, { collide: true }); // bed, away from kitchen doorway
  box(2, 0.3, 0.5, 0xEEEEEE, 1.0, 0.6, -3.1, { collide: false }); // pillows
  box(2.1, 0.7, 0.15, 0x6B5A8B, 1.0, 0.6, -3.2, { collide: false }); // headboard

  box(0.5, 0.5, 0.5, 0x5A4530, -0.2, 0.25, -3.1, { collide: true }); // nightstands
  box(0.5, 0.5, 0.5, 0x5A4530, 2.2, 0.25, -3.1, { collide: true });

  box(1.4, 2.2, 0.6, 0x6B4423, 4.6, 1.1, -1.7, { collide: true }); // wardrobe, against right wall

  box(1.4, 0.06, 0.7, 0x8B6F47, 4.5, 0.75, -0.5, { collide: true }); // desk
  box(0.06, 0.75, 0.06, 0x5A4530, 3.9, 0.37, -0.2, { collide: false });
  box(0.06, 0.75, 0.06, 0x5A4530, 5.1, 0.37, -0.2, { collide: false });
  cyl(0.25, 0.25, 0.5, 10, 0x222222, 4.5, 0.25, 0.25, { collide: true }); // desk chair

  plane(2.6, 3, 0xE8D8B0, 1.0, 0.012, -1.9, -Math.PI / 2, 0); // rug under bed

  // Bathroom nook
  plane(1.9, 1.9, 0xCFE8E0, 4, 0.011, -4, -Math.PI / 2, 0);
  box(0.5, 0.55, 0.4, 0xFFFFFF, 4.55, 0.28, -4.6, { collide: true }); // toilet base
  cyl(0.25, 0.25, 0.1, 12, 0xFFFFFF, 4.55, 0.6, -4.6, { collide: false }); // toilet tank
  box(0.7, 0.7, 0.5, 0xFFFFFF, 3.5, 0.35, -4.6, { collide: true }); // sink cabinet
  box(0.6, 0.04, 0.45, 0xDDEEEE, 3.5, 0.72, -4.6, { collide: false }); // sink top
}

function buildGarageInterior() {
  plane(5, 10, 0x9A9A9A, -7.5, 0.011, 0, -Math.PI / 2, 0); // floor

  const carGrp2 = new THREE.Group();
  const cb2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 1.8), new THREE.MeshLambertMaterial({ color: 0x223355 }));
  cb2.position.set(0, 0.5, 0);
  cb2.castShadow = true;
  carGrp2.add(cb2);
  const cab2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 1.7), new THREE.MeshLambertMaterial({ color: 0x1A2840 }));
  cab2.position.set(-0.1, 1.3, 0);
  cab2.castShadow = true;
  carGrp2.add(cab2);
  carGrp2.rotation.y = Math.PI / 2;
  carGrp2.position.set(-7.5, 0, -2.5); // moved back, clear of the garage<->living doorway at z -2..2
  scene.add(carGrp2);
  addCollider(-8.4, -6.6, -4.3, -0.7, 0, 1.7);

  box(2, 1.8, 0.4, 0x5A5A5A, -9.6, 0.9, -4.3, { collide: true }); // tool shelf
  box(1.8, 0.85, 0.6, 0x6B4423, -9.5, 0.42, 3.5, { collide: true }); // workbench, near garage door, clear of doorway
}

function ceilLight(x, z) {
  const fix = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12),
    new THREE.MeshLambertMaterial({ color: 0xFFF4D6 })
  );
  fix.position.set(x, WALL_H - 0.05, z);
  scene.add(fix);

  const pl = new THREE.PointLight(0xFFF0D0, 0.9, 7);
  pl.position.set(x, WALL_H - 0.2, z);
  scene.add(pl);
  return pl;
}

function buildInterior() {
  buildDividers();
  buildLivingRoom();
  buildKitchen();
  buildBedroomAndBath();
  buildGarageInterior();

  return [
    ceilLight(-2.6, 3.1),
    ceilLight(-2.6, -3.2),
    ceilLight(2.4, -1.5),
    ceilLight(-7.5, 0)
  ];
}
