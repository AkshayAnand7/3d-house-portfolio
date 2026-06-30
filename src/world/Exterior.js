// ============================================
// Exterior — Ground, Road, Trees, Fence, Car
// Ported from gta-house reference design
// ============================================

import * as THREE from 'three';
import { HOUSE } from '../config.js';
import { createSportsCar } from '../utils/CarFactory.js';

export function createExterior(scene) {
  const group = new THREE.Group();
  group.name = 'exterior';

  // ---- Helper ----
  function box(w, h, d, color, x, y, z, opts = {}) {
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = opts.cast !== false;
    mesh.receiveShadow = opts.recv !== false;
    group.add(mesh);
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

  // =============================================
  // GROUND & ROAD
  // =============================================
  planeFloor(80, 80, 0x4a7c3f, 0, -0.05, 0); // grass (lowered so road sits on top)
  box(24, 0.06, 6, 0xC8C0A8, 0, -0.02, 9.2, { cast: false }); // driveway
  box(80, 0.05, 7, 0x111111, 0, -0.03, 15, { cast: false }); // road (black)
  for (let i = -35; i < 35; i += 5) {
    box(2.5, 0.06, 0.2, 0xFFFF00, i, -0.02, 15, { cast: false }); // road markings
  }
  box(5.5, 0.05, 8, 0xAAAAAA, -7.5, -0.025, 7.4, { cast: false }); // sidewalk
  box(2, 0.05, 4.6, 0xC0B8A0, 0, -0.02, 7.7, { cast: false }); // front walkway

  // =============================================
  // PALM TREES
  // =============================================
  function palmTree(x, z) {
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 4, 8);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8B6914 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 2, z);
    trunk.castShadow = true;
    group.add(trunk);

    // Fronds
    for (let i = 0; i < 7; i++) {
      const a = i * (Math.PI * 2 / 7);
      const fg = new THREE.CylinderGeometry(0.04, 0.06, 2.3, 5);
      const fm = new THREE.MeshLambertMaterial({ color: 0x2D6A1A });
      const fr = new THREE.Mesh(fg, fm);
      fr.position.set(x + Math.cos(a) * 0.8, 4.4 + Math.sin(a * 0.5) * 0.3, z + Math.sin(a) * 0.8);
      fr.rotation.z = Math.cos(a) * 0.7;
      fr.rotation.x = Math.sin(a) * 0.7;
      fr.castShadow = true;
      group.add(fr);
    }

    // Top canopy
    const top = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 6, 4),
      new THREE.MeshLambertMaterial({ color: 0x228B22 })
    );
    top.scale.y = 0.5;
    top.position.set(x, 4.7, z);
    group.add(top);
  }

  palmTree(-13, 7);
  palmTree(9, 6);
  palmTree(-10, -4);

  // =============================================
  // FENCE
  // =============================================
  for (let i = -11; i <= 11; i += 1.3) {
    if (Math.abs(i) < 2.2) continue; // gap for front path
    box(0.08, 1.1, 0.08, 0xF5F0E0, i, 0.55, 10.3, { cast: false });
  }

  // =============================================
  // PARKED CAR (OUTSIDE)
  // =============================================
  const carGrp = createSportsCar(0xCC2200); // Sleek Red Sports Car
  carGrp.position.set(-7.5, 0, 7.5); // Beside driveway, moved back to avoid clipping the fence
  carGrp.rotation.y = Math.PI / 2; // Facing the road
  group.add(carGrp);

  // =============================================
  // ROAD PROPS & SCENERY
  // =============================================
  function createStreetLight(x, z) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 6, 8), new THREE.MeshLambertMaterial({ color: 0x444444 }));
    pole.position.set(x, 3, z);
    pole.castShadow = true;
    group.add(pole);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8), new THREE.MeshLambertMaterial({ color: 0x444444 }));
    arm.position.set(x, 5.8, z + 0.6);
    arm.rotation.x = Math.PI / 2;
    group.add(arm);

    const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.5), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    fixture.position.set(x, 5.8, z + 1.2);
    group.add(fixture);

    const light = new THREE.PointLight(0xFFF4D6, 0.8, 15);
    light.position.set(x, 5.6, z + 1.2);
    light.castShadow = false; // Disabled for huge performance boost
    group.add(light);
  }

  function createTrafficCone(x, z) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 12), new THREE.MeshLambertMaterial({ color: 0xFF5500 }));
    cone.position.set(x, 0.3, z);
    cone.castShadow = true;
    group.add(cone);
    
    // white stripe
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.15, 12), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    stripe.position.set(x, 0.4, z);
    group.add(stripe);
  }

  function createBusStop(x, z) {
    const shelterMat = new THREE.MeshLambertMaterial({ color: 0x2A3441 });
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x88CCEE, transparent: true, opacity: 0.4 });
    
    // Back glass
    const back = new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, 0.1), glassMat);
    back.position.set(x, 1.25, z);
    group.add(back);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.5), shelterMat);
    roof.position.set(x, 2.55, z + 0.7);
    group.add(roof);

    // Poles
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), shelterMat);
    p1.position.set(x - 1.5, 1.25, z + 1.4);
    group.add(p1);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5), shelterMat);
    p2.position.set(x + 1.5, 1.25, z + 1.4);
    group.add(p2);

    // Bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.5), new THREE.MeshLambertMaterial({ color: 0x8B5A2B }));
    bench.position.set(x, 0.5, z + 0.3);
    bench.castShadow = true;
    group.add(bench);
    
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    leg1.position.set(x - 0.8, 0.25, z + 0.3);
    group.add(leg1);
    
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    leg2.position.set(x + 0.8, 0.25, z + 0.3);
    group.add(leg2);
  }

  function createPark(x, z) {
    // Park base path
    box(10, 0.05, 8, 0xC8C0A8, x, -0.02, z, { cast: false });
    
    // Fountain
    const fBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.4, 16), new THREE.MeshLambertMaterial({ color: 0xD0C8B0 }));
    fBase.position.set(x, 0.2, z);
    group.add(fBase);
    
    const fWater = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.45, 16), new THREE.MeshLambertMaterial({ color: 0x44AAFF, transparent: true, opacity: 0.8 }));
    fWater.position.set(x, 0.22, z);
    group.add(fWater);
    
    const fCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8), new THREE.MeshLambertMaterial({ color: 0xAAAAAA }));
    fCenter.position.set(x, 0.6, z);
    group.add(fCenter);

    // Benches
    const benchMat = new THREE.MeshLambertMaterial({ color: 0x8B5A2B });
    for (let i of [-1, 1]) {
      const bench = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.5), benchMat);
      seat.position.set(0, 0.5, 0);
      seat.castShadow = true;
      bench.add(seat);
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x222222 }));
      leg1.position.set(-0.6, 0.25, 0);
      bench.add(leg1);
      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.4), new THREE.MeshLambertMaterial({ color: 0x222222 }));
      leg2.position.set(0.6, 0.25, 0);
      bench.add(leg2);
      
      bench.position.set(x + (3 * i), 0, z);
      bench.rotation.y = Math.PI / 2;
      group.add(bench);
    }

    // Additional Trees
    palmTree(x - 4, z - 3);
    palmTree(x + 4, z - 3);
    palmTree(x - 4, z + 3);
    palmTree(x + 4, z + 3);
  }

  // Add Streetlights
  createStreetLight(-15, 11);
  createStreetLight(0, 11);
  createStreetLight(15, 11);

  // Add Bus Stop down the road
  createBusStop(12, 10.5);

  // Add Traffic Cones near the edge
  createTrafficCone(18, 11.5);
  createTrafficCone(20, 12.0);
  createTrafficCone(22, 12.0);

  // Add Park Area opposite the road
  createPark(-5, 23);
  createPark(15, 23);

  // =============================================
  // FRONT PORCH
  // =============================================
  // Front porch steps
  box(3, 0.15, 0.6, 0xC0A882, 0, 0.075, 5.9, { cast: false });
  box(2.4, 0.15, 0.6, 0xB8A07A, 0, 0.22, 6.45, { cast: false });

  scene.add(group);
  return { water: null }; // No pool in gta-house design
}
