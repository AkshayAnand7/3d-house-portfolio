/**
 * Input — Central keyboard and mouse state manager.
 *
 * Tracks pressed keys, mouse deltas, and pointer lock state.
 * Provides frame-accurate one-shot key detection via wasJustPressed/Released.
 * Pointer lock is panel-aware — won't lock when UI panels are open.
 */

import { EventEmitter } from '@utils/EventEmitter';

interface InputEvents {
  pointerLockChange: { locked: boolean };
}

export class Input extends EventEmitter<InputEvents> {
  /** Current frame key state */
  private keysDown: Set<string> = new Set();
  /** Keys pressed this frame (cleared each update) */
  private keysJustPressed: Set<string> = new Set();
  /** Keys released this frame (cleared each update) */
  private keysJustReleased: Set<string> = new Set();

  /** Mouse delta accumulated between frames */
  private mouseDeltaAccum = { x: 0, y: 0 };
  /** Mouse delta for this frame (set during update) */
  mouseDelta = { x: 0, y: 0 };

  /** Whether pointer lock is active */
  isPointerLocked = false;

  /** External flag: set to true to prevent pointer lock requests */
  panelOpen = false;

  constructor() {
    super();
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('mousedown', this.onMouseDown);
  }

  // ---- Key Queries ----

  isPressed(code: string): boolean {
    return this.keysDown.has(code);
  }

  wasJustPressed(code: string): boolean {
    return this.keysJustPressed.has(code);
  }

  wasJustReleased(code: string): boolean {
    return this.keysJustReleased.has(code);
  }

  // ---- Pointer Lock ----

  requestPointerLock(): void {
    if (!this.panelOpen && !this.isPointerLocked) {
      document.body.requestPointerLock();
    }
  }

  exitPointerLock(): void {
    if (this.isPointerLocked) {
      document.exitPointerLock();
    }
  }

  // ---- Per-frame update ----

  update(): void {
    this.mouseDelta.x = this.mouseDeltaAccum.x;
    this.mouseDelta.y = this.mouseDeltaAccum.y;
    this.mouseDeltaAccum.x = 0;
    this.mouseDeltaAccum.y = 0;

    // Clear one-shot sets at end of frame
    this.keysJustPressed.clear();
    this.keysJustReleased.clear();
  }

  // ---- Event Handlers ----

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.keysDown.has(e.code)) {
      this.keysJustPressed.add(e.code);
    }
    this.keysDown.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keysDown.delete(e.code);
    this.keysJustReleased.add(e.code);
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (this.isPointerLocked) {
      this.mouseDeltaAccum.x += e.movementX || 0;
      this.mouseDeltaAccum.y += e.movementY || 0;
    }
  };

  private onMouseDown = (): void => {
    if (!this.isPointerLocked && !this.panelOpen) {
      this.requestPointerLock();
    }
  };

  private onPointerLockChange = (): void => {
    this.isPointerLocked = document.pointerLockElement === document.body;
    this.emit('pointerLockChange', { locked: this.isPointerLocked });
  };

  dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('mousedown', this.onMouseDown);
    this.removeAllListeners();
  }
}
