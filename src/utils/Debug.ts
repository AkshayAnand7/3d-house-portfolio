/**
 * Debug — Development utilities.
 *
 * FPS counter, physics debug wireframes, console helpers.
 * Only active when ?debug is in the URL.
 */

export class Debug {
  readonly isActive: boolean;
  private fpsElement: HTMLDivElement | null = null;
  private frames = 0;
  private lastFpsTime = performance.now();

  constructor() {
    this.isActive = window.location.search.includes('debug');

    if (this.isActive) {
      this.createFpsCounter();
      console.log('[Debug] Debug mode active');
    }
  }

  private createFpsCounter(): void {
    this.fpsElement = document.createElement('div');
    this.fpsElement.id = 'debug-fps';
    Object.assign(this.fpsElement.style, {
      position: 'fixed',
      top: '8px',
      right: '8px',
      padding: '4px 10px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: '9999',
      borderRadius: '4px',
      pointerEvents: 'none',
    });
    document.body.appendChild(this.fpsElement);
  }

  update(): void {
    if (!this.isActive) return;

    this.frames++;
    const now = performance.now();
    const elapsed = now - this.lastFpsTime;

    if (elapsed >= 1000) {
      const fps = Math.round((this.frames * 1000) / elapsed);
      if (this.fpsElement) {
        this.fpsElement.textContent = `${fps} FPS`;
      }
      this.frames = 0;
      this.lastFpsTime = now;
    }
  }

  dispose(): void {
    if (this.fpsElement) {
      this.fpsElement.remove();
    }
  }
}
