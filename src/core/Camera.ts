/**
 * Camera — Perspective camera with FPS mouse look, head bob, and camera shake.
 *
 * Supports first-person (FPS) and third-person toggle.
 * Mouse look is driven by Input.mouseDelta when pointer is locked.
 */

import * as THREE from 'three';
import type { Sizes, SizeData } from './Sizes';
import type { Input } from './Input';

export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  sensitivity: number;
  thirdPersonDistance: number;
  thirdPersonHeight: number;
}

const DEFAULT_CONFIG: CameraConfig = {
  fov: 62,
  near: 0.05,
  far: 200,
  sensitivity: 0.002,
  thirdPersonDistance: 3.5,
  thirdPersonHeight: 2.0,
};

export class Camera {
  readonly instance: THREE.PerspectiveCamera;

  /** Yaw (horizontal rotation) in radians */
  yaw = Math.PI;
  /** Pitch (vertical rotation) in radians, clamped */
  pitch = -0.2;

  /** First person or third person mode */
  isFirstPerson = false;

  /** Head bob state */
  private bobPhase = 0;
  private bobIntensity = 0;

  /** Camera shake state */
  private shakeIntensity = 0;
  private shakeDecay = 5;

  /** Sprint FOV transition */
  private baseFov: number;
  private targetFov: number;

  private readonly config: CameraConfig;

  constructor(
    private readonly sizes: Sizes,
    private readonly input: Input,
    config?: Partial<CameraConfig>,
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.baseFov = this.config.fov;
    this.targetFov = this.baseFov;

    this.instance = new THREE.PerspectiveCamera(
      this.config.fov,
      sizes.aspect,
      this.config.near,
      this.config.far,
    );

    this.sizes.on('resize', this.onResize);
  }

  /**
   * Update mouse look from input deltas.
   * Call every frame from Experience.
   */
  updateMouseLook(): void {
    if (!this.input.isPointerLocked) return;

    this.yaw -= this.input.mouseDelta.x * this.config.sensitivity;
    this.pitch -= this.input.mouseDelta.y * this.config.sensitivity;
    this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch));
  }

  /**
   * Update camera position relative to player.
   */
  updatePosition(playerPosition: THREE.Vector3, playerHeight: number, dt: number): void {
    // Toggle camera mode
    if (this.input.wasJustPressed('KeyV')) {
      this.isFirstPerson = !this.isFirstPerson;
    }

    // Head bob
    this.bobPhase += this.bobIntensity * dt * 12;
    const bobY = Math.sin(this.bobPhase) * this.bobIntensity * 0.02;
    const bobX = Math.cos(this.bobPhase * 0.5) * this.bobIntensity * 0.01;

    // Camera shake decay
    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - this.shakeDecay * dt);
    }
    const shakeX = (Math.random() - 0.5) * this.shakeIntensity * 0.05;
    const shakeY = (Math.random() - 0.5) * this.shakeIntensity * 0.05;

    // FOV transition (sprint)
    const currentFov = this.instance.fov;
    const fovLerp = 1 - Math.pow(0.001, dt);
    this.instance.fov = currentFov + (this.targetFov - currentFov) * fovLerp;
    this.instance.updateProjectionMatrix();

    const eyeHeight = playerHeight * 0.9;

    if (this.isFirstPerson) {
      // First-person: camera at eye level
      this.instance.position.set(
        playerPosition.x + bobX + shakeX,
        playerPosition.y + eyeHeight + bobY + shakeY,
        playerPosition.z,
      );

      // Look direction from yaw/pitch
      const lookX = Math.sin(this.yaw) * Math.cos(this.pitch);
      const lookY = Math.sin(this.pitch);
      const lookZ = Math.cos(this.yaw) * Math.cos(this.pitch);

      this.instance.lookAt(
        this.instance.position.x + lookX,
        this.instance.position.y + lookY,
        this.instance.position.z + lookZ,
      );
    } else {
      // Third-person: orbit behind player
      const dist = this.config.thirdPersonDistance;
      const height = this.config.thirdPersonHeight;

      const camX = playerPosition.x - Math.sin(this.yaw) * Math.cos(this.pitch) * dist;
      const camY = playerPosition.y + eyeHeight + height - Math.sin(this.pitch) * dist;
      const camZ = playerPosition.z - Math.cos(this.yaw) * Math.cos(this.pitch) * dist;

      // Smooth follow
      const smoothing = 1 - Math.pow(0.001, dt);
      this.instance.position.lerp(new THREE.Vector3(camX + shakeX, camY + shakeY, camZ), smoothing);

      // Look at player head
      this.instance.lookAt(
        playerPosition.x,
        playerPosition.y + eyeHeight,
        playerPosition.z,
      );
    }
  }

  /** Set head bob intensity (0 = none, 1 = walking, 2 = running) */
  setHeadBob(intensity: number): void {
    this.bobIntensity = intensity;
    if (intensity === 0) {
      // Smoothly reset bob phase
      this.bobPhase = this.bobPhase % (Math.PI * 2);
    }
  }

  /** Trigger camera shake (e.g., on landing) */
  shake(intensity: number): void {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  /** Set sprint FOV (wider during sprint) */
  setSprintFov(isSprinting: boolean): void {
    this.targetFov = isSprinting ? this.baseFov + 8 : this.baseFov;
  }

  private onResize = (data: SizeData): void => {
    this.instance.aspect = data.aspect;
    this.instance.updateProjectionMatrix();
  };

  dispose(): void {
    this.sizes.off('resize', this.onResize);
  }
}
