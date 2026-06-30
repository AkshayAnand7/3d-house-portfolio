// build-exterior.js
// Ground, road, palm trees, fence, parked car, house shell + roof + front door.
//
// House footprint: x -10..5, z -5..5
//   Garage:      x -10..-5
//   Main house:  x  -5..5
// Front wall is at z=5, back wall at z=-5, right wall at x=5, garage end at x=-10.

const WALL_H = 3.2;
const wallColor = 0xD9C49A;
const wallColorSide = 0xCBB488;
const DOOR_W = 1.6;
const DOOR_H = 2.4;

function buildGround() {
  plane(80, 80, 0x4a7c3f, 0, 0, 0, -Math.PI / 2, 0);
  box(24, 0.06, 6, 0xC8C0A8, 0, -0.02, 9.2, { collide: false });
  box(70, 0.05, 7, 0x444444, 0, -0.03, 15, { collide: false });
  for (let i = -30; i < 30; i += 5) box(2.5, 0.06, 0.2, 0xFFFF00, i, -0.02, 15, { collide: false });
  box(5.5, 0.05, 8, 0xAAAAAA, -7.5, -0.025, 7.4, { collide: false }); // driveway
  box(2, 0.05, 4.6, 0xC0B8A0, 0, -0.02, 7.7, { collide: false });     // front walkway
}

function palmTree(x, z) {
  cyl(0.12, 0.18, 4, 8, 0x8B6914, x, 2, z, { collide: true });
  for (let i = 0; i < 7; i++) {
    const a = i * (Math.PI * 2 / 7);
    const fg = new THREE.CylinderGeometry(0.04, 0.06, 2.3, 5);
    const fm = new THREE.MeshLambertMaterial({ color: 0x2D6A1A });
    const fr = new THREE.Mesh(fg, fm);
    fr.position.set(x + Math.cos(a) * 0.8, 4.4 + Math.sin(a * 0.5) * 0.3, z + Math.sin(a) * 0.8);
    fr.rotation.z = Math.cos(a) * 0.7;
    fr.rotation.x = Math.sin(a) * 0.7;
    fr.castShadow = true;
    scene.add(fr);
  }
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.6, 6, 4), new THREE.MeshLambertMaterial({ color: 0x228B22 }));
  top.scale.y = 0.5;
  top.position.set(x, 4.7, z);
  scene.add(top);
}

function buildTreesAndFence() {
  palmTree(-13, 7);
  palmTree(9, 6);
  palmTree(-10, -4);

  for (let i = -11; i <= 11; i += 1.3) {
    if (Math.abs(i) < 2.2) continue; // gap for the front walkway
    box(0.08, 1.1, 0.08, 0xF5F0E0, i, 0.55, 10.3, { collide: false, cast: false });
  }
}

function buildParkedCar() {
  const carGrp = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(4, 1.1, 2), new THREE.MeshLambertMaterial({ color: 0xCC2200 }));
  body.position.set(0, 0.55, 0);
  body.castShadow = true;
  carGrp.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.85), new THREE.MeshLambertMaterial({ color: 0xBB1A00 }));
  cabin.position.set(-0.2, 1.45, 0);
  cabin.castShadow = true;
  carGrp.add(cabin);

  const wsMat = new THREE.MeshLambertMaterial({ color: 0x88CCEE, transparent: true, opacity: 0.7 });
  const frontWS = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.75, 1.7), wsMat);
  frontWS.position.set(0.85, 1.45, 0);
  carGrp.add(frontWS);

  [[-1.2, 0, 1.1], [1.2, 0, 1.1], [-1.2, 0, -1.1], [1.2, 0, -1.1]].forEach(([x, y, z]) => {
    const wg = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 14);
    const w = new THREE.Mesh(wg, new THREE.MeshLambertMaterial({ color: 0x111111 }));
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.38, z);
    w.castShadow = true;
    carGrp.add(w);
  });

  // Parked beside the driveway, clear of the garage door opening
  carGrp.position.set(-7.5, 0, 9);
  scene.add(carGrp);
  addCollider(-9.6, -5.4, 7.7, 10.3, 0, 1.9);
}

/**
 * Visible swinging door mesh + frame at a wall opening, propped open so the
 * walkway is always clear (the wall gap itself defines what's passable —
 * this mesh is decorative dressing on top of that gap).
 */
function buildDoor(x, y, z, ry, w, h, color) {
  const grp = new THREE.Group();

  const frameMat = new THREE.MeshLambertMaterial({ color: 0x4A3520 });
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.1, h + 0.2, 0.18), frameMat);
  left.position.set(-w / 2 - 0.05, 0, 0);
  grp.add(left);
  const right = left.clone();
  right.position.x = w / 2 + 0.05;
  grp.add(right);
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.12, 0.18), frameMat);
  top.position.set(0, h / 2 + 0.06, 0);
  grp.add(top);

  // Leaf, swung open and flat against the wall so it never blocks the gap
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
  scene.add(grp);
  return grp;
}

function buildHouseShell() {
  box(15.4, 0.2, 10.4, 0xC9BFA8, -2.5, -0.1, 0, { collide: false }); // floor slab

  // Roof
  box(15.6, 0.3, 10.6, 0x8B7355, -2.5, WALL_H + 0.15, 0, { collide: false });
  box(15.6, 0.4, 0.3, 0x7A6545, -2.5, WALL_H + 0.45, 5.15, { collide: false });
  box(15.6, 0.4, 0.3, 0x7A6545, -2.5, WALL_H + 0.45, -5.15, { collide: false });
  box(0.3, 0.4, 10.6, 0x7A6545, 5.15, WALL_H + 0.45, 0, { collide: false });
  box(0.3, 0.4, 10.6, 0x7A6545, -10.15, WALL_H + 0.45, 0, { collide: false });

  // Chimney
  box(1, 3, 1, 0x8B7355, 2, WALL_H + 1.5, -3.5, { collide: false });

  // Back wall (z = -5), full length, no openings
  box(15.4, WALL_H, 0.2, wallColor, -2.5, WALL_H / 2, -5);

  // Front wall (z = 5): garage door opening (x -9.5..-5.5) + front door opening (x -0.8..0.8)
  box(0.5, WALL_H, 0.2, wallColorSide, -9.75, WALL_H / 2, 5);      // garage front wall, left of garage door
  box(0.5, WALL_H, 0.2, wallColorSide, -5.25, WALL_H / 2, 5);      // garage front wall, right of garage door
  box(2.5, 0.6, 0.2, wallColorSide, -7.5, WALL_H - 0.3, 5);        // header above garage door
  box(4.4, WALL_H, 0.2, wallColor, -2.95, WALL_H / 2, 5);          // between garage and front door, x -5.15..-0.75
  box(4.2, WALL_H, 0.2, wallColor, 2.9, WALL_H / 2, 5);            // right of front door, x 0.8..5
  box(DOOR_W + 0.4, 0.8, 0.2, wallColor, 0, WALL_H - 0.4, 5);      // header above front door

  // Right wall (x = 5)
  box(0.2, WALL_H, 10, wallColor, 5, WALL_H / 2, 0);

  // Left wall (x = -10), garage end
  box(0.2, WALL_H, 10, wallColorSide, -10, WALL_H / 2, 0);

  // Visible front door, propped open
  buildDoor(-DOOR_W / 2, DOOR_H / 2, 5.05, 0, DOOR_W, DOOR_H, 0x6B4226);

  // Window glass panes (visual only)
  windowPane(5.02, 1.8, 2, Math.PI / 2, 1.6, 1.3);
  windowPane(5.02, 1.8, -2, Math.PI / 2, 1.6, 1.3);
  windowPane(-2, 1.8, -5.02, 0, 1.6, 1.3);
  windowPane(2, 1.8, -5.02, 0, 1.6, 1.3);
  windowPane(-10.02, 1.8, -1, Math.PI / 2, 1.4, 1.2);
  windowPane(-3.5, 1.9, 5.02, 0, 1.2, 1.1);
  windowPane(3.5, 1.9, 5.02, 0, 1.2, 1.1);

  // Ceiling
  box(15.4, 0.15, 10.4, 0xF0EBDD, -2.5, WALL_H, 0, { collide: false, recv: false });

  // Porch steps leading up to the front door
  box(3, 0.15, 0.6, 0xC0A882, 0, 0.075, 5.9, { collide: false });
  box(2.4, 0.15, 0.6, 0xB8A07A, 0, 0.22, 6.45, { collide: false });
}

function windowPane(x, y, z, ry, w, h) {
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.05),
    new THREE.MeshLambertMaterial({ color: 0x88CCEE, transparent: true, opacity: 0.55 })
  );
  glass.rotation.y = ry || 0;
  glass.position.set(x, y, z);
  scene.add(glass);
}

function buildExterior() {
  buildGround();
  buildTreesAndFence();
  buildParkedCar();
  buildHouseShell();
}
