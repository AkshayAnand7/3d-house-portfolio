/**
 * House — Procedural house geometry with Rapier colliders.
 *
 * Builds the house structure using Three.js primitives and registers
 * matching Rapier static box colliders for physics.
 *
 * This is a procedural placeholder. In production, replace with a GLB model
 * loaded via Resources, with collision meshes prefixed "col_".
 */

import * as THREE from 'three';
import type { Physics } from '@core/Physics';

// ---- House dimensions ----
const WALL_H = 3.2;
const WALL_T = 0.2;

export class House {
  readonly group = new THREE.Group();

  constructor(
    private readonly scene: THREE.Scene,
    private readonly physics: Physics,
  ) {
    this.buildStructure();
    this.buildFloors();
    this.buildInteriorWalls();
    this.buildExteriorElements();
    this.buildLighting();

    this.scene.add(this.group);
  }

  // ---- Helpers ----

  private box(
    w: number, h: number, d: number,
    color: number,
    x: number, y: number, z: number,
    options?: { cast?: boolean; receive?: boolean; collider?: boolean },
  ): THREE.Mesh {
    const opts = { cast: true, receive: true, collider: false, ...options };
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = opts.cast;
    mesh.receiveShadow = opts.receive;
    this.group.add(mesh);

    if (opts.collider) {
      this.physics.createStaticBox(
        { x, y, z },
        { x: w / 2, y: h / 2, z: d / 2 },
      );
    }

    return mesh;
  }

  // ---- Structure ----

  private buildStructure(): void {
    // Front wall (z = 5) — with door gap
    this.box(4.5, WALL_H, WALL_T, 0xf5f0e8, -3, WALL_H / 2, 5, { collider: true });
    this.box(4.5, WALL_H, WALL_T, 0xf5f0e8, 3, WALL_H / 2, 5, { collider: true });
    // Above door
    this.box(1.2, WALL_H - 2.3, WALL_T, 0xf5f0e8, 0, WALL_H - (WALL_H - 2.3) / 2, 5, { collider: true });

    // Back wall (z = -5)
    this.box(10.4, WALL_H, WALL_T, 0xf5f0e8, 0, WALL_H / 2, -5, { collider: true });

    // Right wall (x = 5)
    this.box(WALL_T, WALL_H, 10, 0xeee8dd, 5, WALL_H / 2, 0, { collider: true });

    // Left wall (x = -5) — with garage opening
    this.box(WALL_T, WALL_H, 4, 0xeee8dd, -5, WALL_H / 2, 3, { collider: true });
    this.box(WALL_T, WALL_H, 4, 0xeee8dd, -5, WALL_H / 2, -3, { collider: true });
    // Above garage door
    this.box(WALL_T, WALL_H - 2.5, 2, 0xeee8dd, -5, WALL_H - (WALL_H - 2.5) / 2, 0, { collider: true });

    // Garage extension walls
    this.box(5, WALL_H, WALL_T, 0xd8d0c8, -7.5, WALL_H / 2, 5, { collider: true });
    this.box(5, WALL_H, WALL_T, 0xd8d0c8, -7.5, WALL_H / 2, -5, { collider: true });
    this.box(WALL_T, WALL_H, 10, 0xd8d0c8, -10, WALL_H / 2, 0, { collider: true });

    // Roof slab
    this.box(10.4, 0.15, 10, 0x3a3a3a, 0, WALL_H, 0, { cast: false, collider: true });
    this.box(5, 0.15, 10, 0x3a3a3a, -7.5, WALL_H, 0, { cast: false, collider: true });

    // Front door frame
    const doorColor = 0x6b4226;
    this.box(0.08, 2.3, 0.08, doorColor, -0.6, 2.3 / 2, 5.05);
    this.box(0.08, 2.3, 0.08, doorColor, 0.6, 2.3 / 2, 5.05);
    this.box(1.28, 0.08, 0.08, doorColor, 0, 2.3, 5.05);

    // Door panel (slightly open)
    const doorPanel = this.box(1.15, 2.2, 0.06, doorColor, 0, 2.2 / 2, 5.08);
    doorPanel.rotation.y = -0.4;
    doorPanel.position.x = 0.5;
  }

  // ---- Floors ----

  private buildFloors(): void {
    // Main floor
    this.box(10.4, 0.12, 10, 0xf0ece4, 0, 0, 0, { cast: false, receive: true });

    // Garage floor
    this.box(5, 0.12, 10, 0x888888, -7.5, 0, 0, { cast: false, receive: true });

    // Living room carpet
    this.box(4, 0.02, 3, 0xaa3333, -2.5, 0.07, 3, { cast: false });

    // Kitchen tiles
    this.box(4.5, 0.02, 5.5, 0xe8e0d0, -2.3, 0.07, -2.2, { cast: false });
  }

  // ---- Interior Walls ----

  private buildInteriorWalls(): void {
    // Living room / Kitchen divider
    this.box(5, WALL_H, WALL_T, 0xf0ece4, -2.5, WALL_H / 2, 0.5, { collider: true });

    // Bedroom / Kitchen divider
    this.box(WALL_T, WALL_H, 5, 0xf0ece4, 0, WALL_H / 2, -2.5, { collider: true });
    this.box(WALL_T, WALL_H, 4, 0xf0ece4, 0, WALL_H / 2, 3, { collider: true });
  }

  // ---- Exterior Elements ----

  private buildExteriorElements(): void {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x4a7c3f });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.group.add(ground);

    // Ground physics
    this.physics.createGround(-0.05);

    // Road
    this.box(80, 0.05, 7, 0x111111, 0, -0.03, 15, { cast: false, receive: true });

    // Road markings
    for (let i = -35; i < 35; i += 5) {
      this.box(2.5, 0.06, 0.2, 0xffff00, i, -0.02, 15, { cast: false });
    }

    // Driveway
    this.box(6, 0.06, 6, 0xc8c0a8, 0, -0.02, 9, { cast: false });

    // Sidewalk
    this.box(5.5, 0.05, 8, 0xaaaaaa, -7.5, -0.025, 7.4, { cast: false });

    // Front walkway
    this.box(2, 0.05, 4.6, 0xc0b8a0, 0, -0.02, 7.7, { cast: false });

    // Fence
    const fenceColor = 0xffffff;
    for (let i = -12; i <= 12; i += 1.5) {
      this.box(0.06, 1.2, 0.06, fenceColor, i, 0.6, 6, { cast: true });
    }
    this.box(24, 0.06, 0.06, fenceColor, 0, 1.15, 6);
    this.box(24, 0.06, 0.06, fenceColor, 0, 0.6, 6);

    // Trees
    this.createTree(-8, 22);
    this.createTree(8, 22);
    this.createTree(-15, 8);
    this.createTree(10, 8);
    this.createTree(-5, 23);
    this.createTree(5, 25);
  }

  private createTree(x: number, z: number): void {
    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.2, 2, 8),
      new THREE.MeshLambertMaterial({ color: 0x8b6914 }),
    );
    trunk.position.set(x, 1, z);
    trunk.castShadow = true;
    this.group.add(trunk);

    // Canopy layers
    const canopyMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    for (let i = 0; i < 3; i++) {
      const radius = 1.8 - i * 0.4;
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 8, 6),
        canopyMat,
      );
      canopy.position.set(x + (Math.random() - 0.5) * 0.3, 2.5 + i * 0.8, z + (Math.random() - 0.5) * 0.3);
      canopy.castShadow = true;
      this.group.add(canopy);
    }
  }

  // ---- Interior Lighting ----

  private buildLighting(): void {
    // Ceiling light fixtures
    const lightPositions = [
      { x: -2.6, z: 3.1 },   // Living room
      { x: -2.6, z: -3.2 },  // Kitchen
      { x: 2.4, z: -1.5 },   // Bedroom
      { x: -7.5, z: 0 },     // Garage
    ];

    for (const pos of lightPositions) {
      // Fixture mesh
      const fix = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12),
        new THREE.MeshLambertMaterial({ color: 0xfff4d6 }),
      );
      fix.position.set(pos.x, WALL_H - 0.05, pos.z);
      this.group.add(fix);

      // Point light (no shadows for performance)
      const light = new THREE.PointLight(0xfff0d0, 0.9, 7);
      light.position.set(pos.x, WALL_H - 0.2, pos.z);
      this.group.add(light);
    }

    // Porch light
    const porch = new THREE.PointLight(0xffddaa, 1.2, 8);
    porch.position.set(0, 3.0, 5.2);
    this.group.add(porch);

    // Streetlights
    for (const x of [-15, 0, 15]) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 6, 6),
        new THREE.MeshLambertMaterial({ color: 0x333333 }),
      );
      pole.position.set(x, 3, 12);
      pole.castShadow = true;
      this.group.add(pole);

      const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.2, 0.5),
        new THREE.MeshLambertMaterial({ color: 0xfff4d6, emissive: 0xfff4d6, emissiveIntensity: 0.5 }),
      );
      lamp.position.set(x, 5.8, 12);
      this.group.add(lamp);

      const light = new THREE.PointLight(0xfff4d6, 0.8, 15);
      light.position.set(x, 5.6, 13.2);
      this.group.add(light);
    }
  }

  dispose(): void {
    this.scene.remove(this.group);
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
  }
}
