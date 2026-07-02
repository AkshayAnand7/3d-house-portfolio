/**
 * GameScene — Wraps THREE.Scene with project-specific defaults.
 *
 * Sets background, fog, and provides typed helpers.
 */

import * as THREE from 'three';

export class GameScene extends THREE.Scene {
  constructor() {
    super();

    // Sky-blue background
    this.background = new THREE.Color(0x87ceeb);

    // Distance fog for atmosphere
    this.fog = new THREE.Fog(0x87ceeb, 30, 80);
  }
}
