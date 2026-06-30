// ============================================
// Player — FBX Character with Animations
// ============================================

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PLAYER } from '../config.js';

export class Player {
  constructor(scene) {
    this.position = new THREE.Vector3(
      PLAYER.spawnPosition.x,
      PLAYER.spawnPosition.y,
      PLAYER.spawnPosition.z
    );
    this.velocity = new THREE.Vector3();
    this.rotation = 0; // Y rotation (euler)
    this.onGround = true;
    this.height = PLAYER.height;
    this.radius = PLAYER.radius;

    // FBX model target
    this.target = null;
    this.mixer = null;
    this.animations = {};
    this.currentState = 'idle';
    this.loaded = false;

    // Placeholder group (shown while FBX loads)
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // FSM state
    this._prevAction = null;

    // Load FBX model
    this._loadModel(scene);
  }

  async _loadModel(scene) {
    const loader = new FBXLoader();
    const modelPath = '/models/girl/';

    try {
      // Load main character model
      const fbx = await loader.loadAsync(modelPath + 'eve_j_gonzales.fbx');
      fbx.scale.setScalar(0.013); // Scale down to fit world (original is huge)
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.target = fbx;
      this.mesh.add(fbx); // Add as child of position group

      // Create animation mixer
      this.mixer = new THREE.AnimationMixer(fbx);

      // Load all animations
      const animFiles = ['idle', 'walk', 'run', 'dance'];
      const loadPromises = animFiles.map(async (name) => {
        const data = await loader.loadAsync(modelPath + name + '.fbx');
        const clip = data.animations[0];
        const action = this.mixer.clipAction(clip);
        this.animations[name] = { clip, action };
      });

      await Promise.all(loadPromises);

      // Setup dance to play once
      if (this.animations.dance) {
        this.animations.dance.action.setLoop(THREE.LoopOnce, 1);
        this.animations.dance.action.clampWhenFinished = true;
      }

      // Listen for dance finish
      this.mixer.addEventListener('finished', () => {
        if (this.currentState === 'dance') {
          this.setState('idle');
        }
      });

      // Start with idle
      this.setState('idle');
      this.loaded = true;
      console.log('✅ Character model loaded');
    } catch (err) {
      console.error('Failed to load character model:', err);
      // Keep the placeholder mesh as fallback
      this._createFallbackMesh();
    }
  }

  _createFallbackMesh() {
    // Simple capsule fallback if FBX fails
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2a4a, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.6, 8, 12), bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    this.mesh.add(body);

    const headMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.7 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), headMat);
    head.position.y = 1.45;
    head.castShadow = true;
    this.mesh.add(head);
    this.loaded = true;
  }

  /**
   * Set animation state with crossfade
   */
  setState(name) {
    if (!this.animations[name] || this.currentState === name) return;

    const newAction = this.animations[name].action;
    const prevAction = this.animations[this.currentState]?.action;

    if (name === 'dance') {
      newAction.reset();
      newAction.setLoop(THREE.LoopOnce, 1);
      newAction.clampWhenFinished = true;
    }

    newAction.enabled = true;

    if (prevAction) {
      // Smooth crossfade from walk<->run
      if ((this.currentState === 'walk' && name === 'run') ||
          (this.currentState === 'run' && name === 'walk')) {
        const ratio = newAction.getClip().duration / prevAction.getClip().duration;
        newAction.time = prevAction.time * ratio;
      } else {
        newAction.time = 0.0;
        newAction.setEffectiveTimeScale(1.0);
        newAction.setEffectiveWeight(1.0);
      }
      newAction.crossFadeFrom(prevAction, 0.3, true);
    }

    newAction.play();
    this.currentState = name;
  }

  update(dt) {
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(dt);
    }

    // Sync mesh position and rotation
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation;
  }
}
