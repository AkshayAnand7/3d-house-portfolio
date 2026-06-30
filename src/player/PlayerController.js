// ============================================
// Player Controller — Movement & Animation FSM
// ============================================

import * as THREE from 'three';
import { PLAYER } from '../config.js';

export class PlayerController {
  constructor(player, inputManager, collisionSystem, cameraController) {
    this.player = player;
    this.input = inputManager;
    this.collision = collisionSystem;
    this.camera = cameraController;
    this.velocityY = 0;
    this.isGrounded = true;
  }

  update(dt) {
    const input = this.input;
    const player = this.player;

    // Speed
    const isRunning = input.isKey('ShiftLeft') || input.isKey('ShiftRight');
    const speed = isRunning ? PLAYER.runSpeed : PLAYER.walkSpeed;

    // Direction from camera
    const cameraYaw = this.camera ? this.camera.yaw : 0;

    let moveX = 0;
    let moveZ = 0;

    if (input.isKey('KeyW') || input.isKey('ArrowUp')) moveZ -= 1;
    if (input.isKey('KeyS') || input.isKey('ArrowDown')) moveZ += 1;
    if (input.isKey('KeyA') || input.isKey('ArrowLeft')) moveX -= 1;
    if (input.isKey('KeyD') || input.isKey('ArrowRight')) moveX += 1;

    // Normalize
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
    }

    // Rotate movement by camera yaw
    const sinY = Math.sin(cameraYaw);
    const cosY = Math.cos(cameraYaw);
    const worldX = -moveZ * sinY - moveX * cosY;
    const worldZ = -moveZ * cosY + moveX * sinY;

    // ---- Animation State Machine ----
    const isMoving = len > 0;
    const isDancing = player.currentState === 'dance';

    if (!isDancing) {
      if (isMoving) {
        player.setState(isRunning ? 'run' : 'walk');
      } else {
        // Dancing on KeyF
        if (input.isKeyOnce('KeyF') && this.isGrounded) {
          player.setState('dance');
        } else if (this.isGrounded && this.velocityY === 0) {
          player.setState('idle');
        }
      }
    }

    // Jump Logic (Space key)
    if (input.isKeyOnce('Space') && this.isGrounded && !isDancing) {
      this.velocityY = PLAYER.jumpForce;
      this.isGrounded = false;
      player.setState('walk'); // Jump pose can just use walk/run for now
    }

    // Don't move while dancing
    const actualSpeed = isDancing ? 0 : speed;

    // Apply movement
    let newX = player.position.x + worldX * actualSpeed * dt;
    let newZ = player.position.z + worldZ * actualSpeed * dt;

    // Rotate player to face movement direction
    if (isMoving && !isDancing) {
      const targetRotation = Math.atan2(worldX, worldZ);
      // Smooth rotation
      let diff = targetRotation - player.rotation;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      player.rotation += diff * Math.min(1, dt * 10);
    }

    // Gravity
    this.velocityY += PLAYER.gravity * dt;
    let newY = player.position.y + this.velocityY * dt;

    // Floor collision
    const floorHeight = this.collision.getFloorHeight(newX, newZ, player.position.y);
    if (newY <= floorHeight) {
      newY = floorHeight;
      this.velocityY = 0;
      this.isGrounded = true;
    }

    // Prevent falling off map
    if (newY < -5) {
      newY = 0;
      newX = PLAYER.spawnPosition.x;
      newZ = PLAYER.spawnPosition.z;
      this.velocityY = 0;
    }

    // Wall collision
    const resolved = this.collision.resolveCollision(
      newX, newZ, player.radius, newY, player.height
    );

    player.position.x = resolved.x;
    player.position.y = newY;
    player.position.z = resolved.z;

    player.update(dt);
  }
}
