/**
 * Physics — Rapier3D physics world with helpers for colliders and rigid bodies.
 *
 * Initializes the Rapier WASM module.
 * Provides an API for creating static colliders (walls, floors),
 * dynamic rigid bodies (player capsule), and trigger sensors (rooms).
 * Optional debug wireframe rendering.
 */

import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export class Physics {
  world!: RAPIER.World;
  private rapier!: typeof RAPIER;
  private debugMesh: THREE.LineSegments | null = null;
  private debugEnabled = false;

  /** Must be called before anything else. Initializes Rapier WASM. */
  async init(): Promise<void> {
    await RAPIER.init();
    this.rapier = RAPIER;
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  }

  /** Step the physics simulation */
  step(): void {
    this.world.step();
  }

  // ---- Rigid Body Helpers ----

  /**
   * Create a dynamic rigid body with a capsule collider (for the player).
   */
  createPlayerCapsule(
    position: { x: number; y: number; z: number },
    halfHeight: number,
    radius: number,
  ): { rigidBody: RAPIER.RigidBody; collider: RAPIER.Collider } {
    const bodyDesc = this.rapier.RigidBodyDesc.dynamic()
      .setTranslation(position.x, position.y, position.z)
      .lockRotations()  // Prevent tumbling
      .setLinearDamping(0.5);

    const rigidBody = this.world.createRigidBody(bodyDesc);

    const colliderDesc = this.rapier.ColliderDesc.capsule(halfHeight, radius)
      .setFriction(0.0)
      .setRestitution(0.0);

    const collider = this.world.createCollider(colliderDesc, rigidBody);

    return { rigidBody, collider };
  }

  /**
   * Create a static box collider (for walls, floors, furniture).
   */
  createStaticBox(
    position: { x: number; y: number; z: number },
    halfExtents: { x: number; y: number; z: number },
  ): RAPIER.Collider {
    const bodyDesc = this.rapier.RigidBodyDesc.fixed()
      .setTranslation(position.x, position.y, position.z);
    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = this.rapier.ColliderDesc.cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z,
    );

    return this.world.createCollider(colliderDesc, body);
  }

  /**
   * Create a static plane (ground).
   */
  createGround(y: number = 0): RAPIER.Collider {
    const bodyDesc = this.rapier.RigidBodyDesc.fixed()
      .setTranslation(0, y, 0);
    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = this.rapier.ColliderDesc.cuboid(100, 0.1, 100);
    return this.world.createCollider(colliderDesc, body);
  }

  /**
   * Create a trigger sensor (for room detection).
   * Sensor colliders detect overlap but don't block movement.
   */
  createTriggerBox(
    position: { x: number; y: number; z: number },
    halfExtents: { x: number; y: number; z: number },
  ): RAPIER.Collider {
    const bodyDesc = this.rapier.RigidBodyDesc.fixed()
      .setTranslation(position.x, position.y, position.z);
    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = this.rapier.ColliderDesc.cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z,
    ).setSensor(true);

    return this.world.createCollider(colliderDesc, body);
  }

  /**
   * Cast a ray downward from a point. Returns distance to ground.
   */
  raycastDown(
    origin: { x: number; y: number; z: number },
    maxDistance: number,
  ): number | null {
    const ray = new this.rapier.Ray(
      { x: origin.x, y: origin.y, z: origin.z },
      { x: 0, y: -1, z: 0 },
    );

    const hit = this.world.castRay(ray, maxDistance, true);
    if (hit) {
      return hit.timeOfImpact;
    }
    return null;
  }

  // ---- Debug ----

  toggleDebug(scene: THREE.Scene): void {
    this.debugEnabled = !this.debugEnabled;

    if (!this.debugEnabled && this.debugMesh) {
      scene.remove(this.debugMesh);
      this.debugMesh.geometry.dispose();
      this.debugMesh = null;
    }
  }

  updateDebug(scene: THREE.Scene): void {
    if (!this.debugEnabled) return;

    const buffers = this.world.debugRender();

    if (this.debugMesh) {
      scene.remove(this.debugMesh);
      this.debugMesh.geometry.dispose();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(buffers.vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(buffers.colors, 4));

    const material = new THREE.LineBasicMaterial({ vertexColors: true });
    this.debugMesh = new THREE.LineSegments(geometry, material);
    scene.add(this.debugMesh);
  }

  dispose(): void {
    this.world.free();
  }
}
