/**
 * Sizes — Tracks viewport dimensions and pixel ratio.
 *
 * Listens to window resize events and emits 'resize' for
 * Camera and Renderer to react to.
 */

import { EventEmitter } from '@utils/EventEmitter';

export interface SizeData {
  width: number;
  height: number;
  pixelRatio: number;
  aspect: number;
}

interface SizesEvents {
  resize: SizeData;
}

export class Sizes extends EventEmitter<SizesEvents> {
  width: number;
  height: number;
  pixelRatio: number;
  aspect: number;

  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.aspect = this.width / this.height;

    window.addEventListener('resize', this.onResize);
  }

  private onResize = (): void => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.aspect = this.width / this.height;

    this.emit('resize', {
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
      aspect: this.aspect,
    });
  };

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.removeAllListeners();
  }
}
