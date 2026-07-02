/**
 * PostProcessing — EffectComposer with render pass and output pass.
 *
 * Bloom is optional and disabled by default for performance.
 * Handles resize via Sizes events.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { Sizes, SizeData } from './Sizes';

export class PostProcessing {
  readonly composer: EffectComposer;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    private readonly sizes: Sizes,
  ) {
    this.composer = new EffectComposer(renderer);

    // Base render pass
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // Output pass (tone mapping + color space)
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    // Listen for resize
    this.sizes.on('resize', this.onResize);
  }

  render(): void {
    this.composer.render();
  }

  private onResize = (data: SizeData): void => {
    this.composer.setSize(data.width, data.height);
  };

  dispose(): void {
    this.sizes.off('resize', this.onResize);
    this.composer.dispose();
  }
}
