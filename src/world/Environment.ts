/**
 * Environment — Lighting, sky, and atmosphere.
 *
 * Sets up sun, ambient light, and hemisphere light.
 * Handles shadow camera configuration.
 */

import * as THREE from 'three';

export class Environment {
  readonly sun: THREE.DirectionalLight;
  readonly ambient: THREE.AmbientLight;
  readonly hemisphere: THREE.HemisphereLight;

  constructor(scene: THREE.Scene) {
    // ---- Sun (directional light with shadows) ----
    this.sun = new THREE.DirectionalLight(0xfff8e1, 1.3);
    this.sun.position.set(15, 25, 15);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -25;
    this.sun.shadow.camera.right = 25;
    this.sun.shadow.camera.top = 25;
    this.sun.shadow.camera.bottom = -25;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 80;
    this.sun.shadow.bias = -0.0005;
    scene.add(this.sun);

    // ---- Ambient ----
    this.ambient = new THREE.AmbientLight(0x8899aa, 0.65);
    scene.add(this.ambient);

    // ---- Hemisphere (sky + ground bounce) ----
    this.hemisphere = new THREE.HemisphereLight(0x87ceeb, 0x4a7c3f, 0.3);
    scene.add(this.hemisphere);
  }

  dispose(): void {
    this.sun.dispose();
    this.ambient.dispose();
    this.hemisphere.dispose();
  }
}
