/**
 * Player — Physics-driven FPS controller with character model.
 *
 * Uses Rapier capsule collider for physics-based movement.
 * Supports: WASD movement, mouse look, jump, sprint, gravity.
 * Optionally loads an FBX character for third-person view.
 */

import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { Physics } from '@core/Physics';
import type { Input } from '@core/Input';
import type { Camera } from '@core/Camera';
import type { Resources } from '@core/Resources';
import { EventEmitter } from '@utils/EventEmitter';

// ---- Config ----

export interface PlayerConfig {
  height: number;
  radius: number;
  walkSpeed: number;
  runSpeed: number;
  jumpImpulse: number;
  spawnPosition: { x: number; y: number; z: number };
  eyeHeight: number;
}

const DEFAULT_CONFIG: PlayerConfig = {
  height: 1.65,
  radius: 0.32,
  walkSpeed: 4.0,
  runSpeed: 7.0,
  jumpImpulse: 5.5,
  spawnPosition: { x: 0, y: 2, z: 8.5 },
  eyeHeight: 1.5,
};

interface PlayerEvents {
  footstep: undefined;
  landed: { velocity: number };
  roomChange: { room: string };
}

export class Player extends EventEmitter<PlayerEvents> {
  readonly position = new THREE.Vector3();
  private rigidBody: RAPIER.RigidBody;
  private isGrounded = false;
  private wasGrounded = false;

  /** Movement state */
  private isSprinting = false;

  /** Character model (third-person) */
  private characterGroup: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private animations: Map<string, THREE.AnimationAction> = new Map();
  private currentAnim = 'idle';

  /** Footstep timing */
  private stepPhase = 0;
  private stepInterval = 0.5; // seconds between steps

  private readonly config: PlayerConfig;

  constructor(
    private readonly physics: Physics,
    private readonly input: Input,
    private readonly camera: Camera,
    private readonly scene: THREE.Scene,
    private readonly resources: Resources,
    config?: Partial<PlayerConfig>,
  ) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Create physics capsule
    const spawn = this.config.spawnPosition;
    const result = this.physics.createPlayerCapsule(
      { x: spawn.x, y: spawn.y, z: spawn.z },
      this.config.height * 0.35,  // half height of capsule cylinder
      this.config.radius,
    );
    this.rigidBody = result.rigidBody;

    // Load character model
    this.loadCharacter();
  }

  private loadCharacter(): void {
    const charFbx = this.resources.get<THREE.Group>('character');
    if (!charFbx) {
      this.createFallbackMesh();
      return;
    }

    const clone = charFbx.clone();
    clone.scale.setScalar(0.013);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.characterGroup = new THREE.Group();
    this.characterGroup.add(clone);
    this.scene.add(this.characterGroup);

    // Animation mixer
    this.mixer = new THREE.AnimationMixer(clone);

    // Load animation clips
    const animNames = ['idle', 'walk', 'run', 'dance'] as const;
    for (const name of animNames) {
      const animFbx = this.resources.get<THREE.Group>(`anim_${name}`);
      if (animFbx && animFbx.animations.length > 0) {
        const action = this.mixer.clipAction(animFbx.animations[0]);
        if (name === 'dance') {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
        }
        this.animations.set(name, action);
      }
    }

    // Dance finish → idle
    this.mixer.addEventListener('finished', () => {
      if (this.currentAnim === 'dance') {
        this.setAnimation('idle');
      }
    });

    // Start idle
    this.setAnimation('idle');
  }

  private createFallbackMesh(): void {
    this.characterGroup = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2a4a, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.6, 8, 12), bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    this.characterGroup.add(body);

    const headMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.7 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), headMat);
    head.position.y = 1.45;
    head.castShadow = true;
    this.characterGroup.add(head);

    this.scene.add(this.characterGroup);
  }

  update(dt: number): void {
    // ---- Ground Detection ----
    this.wasGrounded = this.isGrounded;
    const pos = this.rigidBody.translation();
    const groundDist = this.physics.raycastDown(
      { x: pos.x, y: pos.y, z: pos.z },
      this.config.height * 0.6 + 0.2,
    );
    this.isGrounded = groundDist !== null && groundDist < this.config.height * 0.6 + 0.1;

    // Landing shake
    if (this.isGrounded && !this.wasGrounded) {
      const vel = this.rigidBody.linvel();
      const fallSpeed = Math.abs(vel.y);
      if (fallSpeed > 3) {
        this.camera.shake(Math.min(fallSpeed * 0.3, 2));
        this.emit('landed', { velocity: fallSpeed });
      }
    }

    // ---- Movement ----
    this.isSprinting = this.input.isPressed('ShiftLeft') || this.input.isPressed('ShiftRight');
    const speed = this.isSprinting ? this.config.runSpeed : this.config.walkSpeed;

    let moveX = 0;
    let moveZ = 0;
    if (this.input.isPressed('KeyW') || this.input.isPressed('ArrowUp')) moveZ -= 1;
    if (this.input.isPressed('KeyS') || this.input.isPressed('ArrowDown')) moveZ += 1;
    if (this.input.isPressed('KeyA') || this.input.isPressed('ArrowLeft')) moveX -= 1;
    if (this.input.isPressed('KeyD') || this.input.isPressed('ArrowRight')) moveX += 1;

    const inputLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
    const isMoving = inputLen > 0;

    if (isMoving) {
      moveX /= inputLen;
      moveZ /= inputLen;
    }

    // Rotate by camera yaw
    const sinY = Math.sin(this.camera.yaw);
    const cosY = Math.cos(this.camera.yaw);
    const worldX = -moveZ * sinY - moveX * cosY;
    const worldZ = -moveZ * cosY + moveX * sinY;

    // Apply velocity (preserve Y for gravity)
    const currentVel = this.rigidBody.linvel();
    this.rigidBody.setLinvel(
      {
        x: worldX * speed,
        y: currentVel.y,
        z: worldZ * speed,
      },
      true,
    );

    // ---- Jump ----
    if (this.input.wasJustPressed('Space') && this.isGrounded) {
      this.rigidBody.applyImpulse({ x: 0, y: this.config.jumpImpulse, z: 0 }, true);
    }

    // ---- Dance ----
    if (this.input.wasJustPressed('KeyF') && this.isGrounded && !isMoving) {
      this.setAnimation('dance');
    }

    // ---- Sync Position ----
    const bodyPos = this.rigidBody.translation();
    this.position.set(bodyPos.x, bodyPos.y - this.config.height * 0.35 - this.config.radius, bodyPos.z);

    // ---- Camera ----
    this.camera.setSprintFov(this.isSprinting && isMoving);
    this.camera.setHeadBob(isMoving ? (this.isSprinting ? 2 : 1) : 0);
    this.camera.updatePosition(this.position, this.config.height, dt);

    // ---- Character Model ----
    if (this.characterGroup) {
      this.characterGroup.position.copy(this.position);

      // Hide in first person
      this.characterGroup.visible = !this.camera.isFirstPerson;

      // Face movement direction
      if (isMoving) {
        const targetRot = Math.atan2(worldX, worldZ);
        const currentRot = this.characterGroup.rotation.y;
        const lerpFactor = 1 - Math.pow(0.001, dt);
        this.characterGroup.rotation.y = currentRot + (targetRot - currentRot) * lerpFactor;
      }
    }

    // ---- Animation ----
    const isDancing = this.currentAnim === 'dance';
    if (!isDancing) {
      if (isMoving) {
        this.setAnimation(this.isSprinting ? 'run' : 'walk');
      } else {
        this.setAnimation('idle');
      }
    }

    if (this.mixer) {
      this.mixer.update(dt);
    }

    // ---- Footsteps ----
    if (isMoving && this.isGrounded) {
      this.stepPhase += dt;
      const interval = this.isSprinting ? this.stepInterval * 0.6 : this.stepInterval;
      if (this.stepPhase >= interval) {
        this.stepPhase = 0;
        this.emit('footstep', undefined);
      }
    } else {
      this.stepPhase = 0;
    }
  }

  private setAnimation(name: string): void {
    if (this.currentAnim === name) return;

    const newAction = this.animations.get(name);
    const prevAction = this.animations.get(this.currentAnim);

    if (!newAction) return;

    if (name === 'dance') {
      newAction.reset();
      newAction.setLoop(THREE.LoopOnce, 1);
      newAction.clampWhenFinished = true;
    }

    newAction.enabled = true;

    if (prevAction) {
      // Smooth crossfade for walk↔run
      if (
        (this.currentAnim === 'walk' && name === 'run') ||
        (this.currentAnim === 'run' && name === 'walk')
      ) {
        const ratio = newAction.getClip().duration / prevAction.getClip().duration;
        newAction.time = prevAction.time * ratio;
      } else {
        newAction.time = 0;
        newAction.setEffectiveTimeScale(1);
        newAction.setEffectiveWeight(1);
      }
      newAction.crossFadeFrom(prevAction, 0.3, true);
    }

    newAction.play();
    this.currentAnim = name;
  }

  dispose(): void {
    if (this.characterGroup) {
      this.scene.remove(this.characterGroup);
    }
    this.removeAllListeners();
  }
}
