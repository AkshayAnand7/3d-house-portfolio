/**
 * Time — Manages the animation loop, delta time, and elapsed time.
 *
 * Emits a 'tick' event every frame with timing data.
 * Delta time is clamped to prevent physics explosions on tab switch.
 */

import { EventEmitter } from '@utils/EventEmitter';

export interface TickData {
  deltaTime: number;   // seconds since last frame (clamped)
  elapsedTime: number; // total seconds since start
  frameCount: number;
}

interface TimeEvents {
  tick: TickData;
}

export class Time extends EventEmitter<TimeEvents> {
  private startTime: number;
  private lastTime: number;
  private elapsedTime: number;
  private frameCount: number;
  private rafId: number | null = null;
  private running = false;

  /** Maximum delta time in seconds. Prevents physics explosion on tab resume. */
  private static readonly MAX_DELTA = 0.05; // 50ms = 20 FPS minimum

  constructor() {
    super();
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.elapsedTime = 0;
    this.frameCount = 0;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const rawDelta = (now - this.lastTime) / 1000;
    const deltaTime = Math.min(rawDelta, Time.MAX_DELTA);

    this.lastTime = now;
    this.elapsedTime += deltaTime;
    this.frameCount++;

    this.emit('tick', {
      deltaTime,
      elapsedTime: this.elapsedTime,
      frameCount: this.frameCount,
    });

    this.rafId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.stop();
    this.removeAllListeners();
  }
}
