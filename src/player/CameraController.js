// ============================================
// Camera Controller — 3rd/1st Person
// ============================================

import * as THREE from 'three';
import { CAMERA } from '../config.js';

export class CameraController {
  constructor(camera, inputManager) {
    this.camera = camera;
    this.input = inputManager;
    this.yaw = Math.PI; // Start facing the house
    this.pitch = -0.3;
    this.distance = CAMERA.thirdPersonDistance;
    this.isFirstPerson = false;
    this.targetPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    
    // Smoothing
    this.smoothing = CAMERA.smoothing;
  }

  update(player, dt) {
    const input = this.input;
    
    // Toggle camera mode
    if (input.isKeyOnce('KeyV')) {
      this.isFirstPerson = !this.isFirstPerson;
      document.getElementById('crosshair').style.display = this.isFirstPerson ? 'block' : 'none';
      // Show/hide player model in first person
      const model = player.target || player.mesh;
      if (model) model.visible = !this.isFirstPerson;
    }
    
    // Mouse orbit
    if (input.mouse.locked) {
      this.yaw -= input.mouse.dx * CAMERA.sensitivity;
      this.pitch -= input.mouse.dy * CAMERA.sensitivity;
      this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch));
    }
    
    const playerPos = player.position;
    const eyeHeight = player.height * 0.9;
    
    if (this.isFirstPerson) {
      // First person — camera at eye level
      this.targetPosition.set(
        playerPos.x,
        playerPos.y + eyeHeight,
        playerPos.z
      );
      
      this.camera.position.lerp(this.targetPosition, 0.3);
      
      // Look direction
      const lookX = playerPos.x + Math.sin(this.yaw) * 10;
      const lookY = playerPos.y + eyeHeight + Math.sin(this.pitch) * 10;
      const lookZ = playerPos.z + Math.cos(this.yaw) * 10;
      this.camera.lookAt(lookX, lookY, lookZ);
      
    } else {
      // Third person — orbit camera
      const dist = this.distance;
      const height = CAMERA.thirdPersonHeight;
      
      const camX = playerPos.x - Math.sin(this.yaw) * Math.cos(this.pitch) * dist;
      const camY = playerPos.y + eyeHeight - Math.sin(this.pitch) * dist + height;
      const camZ = playerPos.z - Math.cos(this.yaw) * Math.cos(this.pitch) * dist;
      
      this.targetPosition.set(camX, camY, camZ);
      
      // Prevent camera going below ground
      if (this.targetPosition.y < 0.5) this.targetPosition.y = 0.5;
      
      // Smooth follow
      this.camera.position.lerp(this.targetPosition, this.smoothing);
      
      // Look at player
      this.camera.lookAt(
        playerPos.x,
        playerPos.y + eyeHeight * 0.7,
        playerPos.z
      );
    }
  }
}
