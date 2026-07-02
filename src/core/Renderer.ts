/**
 * Renderer — WebGL renderer with shadows, tone mapping, and resize.
 *
 * Responsible ONLY for render configuration.
 * Render calls are driven by Experience via the tick loop.
 */

import * as THREE from 'three';
import type { Sizes, SizeData } from './Sizes';

export class Renderer {
  readonly instance: THREE.WebGLRenderer;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly sizes: Sizes,
  ) {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });

    // Shadow config
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

    // Tone mapping
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.2;

    // Color space
    this.instance.outputColorSpace = THREE.SRGBColorSpace;

    // Initial size
    this.resize({
      width: sizes.width,
      height: sizes.height,
      pixelRatio: sizes.pixelRatio,
      aspect: sizes.aspect,
    });

    // Listen for resize
    this.sizes.on('resize', this.resize);
  }

  private resize = (data: SizeData): void => {
    this.instance.setSize(data.width, data.height);
    this.instance.setPixelRatio(data.pixelRatio);
  };

  dispose(): void {
    this.sizes.off('resize', this.resize);
    this.instance.dispose();
  }
}
