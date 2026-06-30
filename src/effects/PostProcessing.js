// ============================================
// Post Processing — Bloom, SSAO, DOF
// ============================================

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export function createPostProcessing(renderer, scene, camera) {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);

  // Base render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Output pass (tone mapping + color space)
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // Disable Bloom for performance
  const bloomPass = null;

  return {
    composer,
    bloomPass,
    resize(w, h) {
      composer.setSize(w, h);
    },
  };
}
