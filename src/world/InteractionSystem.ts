/**
 * InteractionSystem — Raycaster-based object interaction.
 *
 * Casts a ray from camera center, detects interactable objects,
 * shows "Press E" prompt, and triggers callbacks.
 *
 * Interactable objects are registered via addInteractable().
 * Decoupled from Player — receives camera reference only.
 */

import * as THREE from 'three';
import { EventEmitter } from '@utils/EventEmitter';

// ---- Types ----

export interface Interactable {
  position: THREE.Vector3;
  radius: number;
  label: string;
  action: string;
}

interface InteractionEvents {
  interact: { action: string; label: string };
  hover: { interactable: Interactable | null };
}

export class InteractionSystem extends EventEmitter<InteractionEvents> {
  private interactables: Interactable[] = [];
  private activeInteractable: Interactable | null = null;

  // DOM elements
  private promptEl: HTMLElement | null;
  private promptText: HTMLElement | null;

  constructor() {
    super();
    this.promptEl = document.getElementById('interaction-prompt');
    this.promptText = document.getElementById('prompt-text');

    // Listen for E key to trigger interaction
    document.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * Register an interactable point in the world.
   */
  addInteractable(
    x: number, y: number, z: number,
    radius: number,
    label: string,
    action: string,
  ): void {
    this.interactables.push({
      position: new THREE.Vector3(x, y, z),
      radius,
      label,
      action,
    });
  }

  /**
   * Update proximity check each frame.
   * Uses simple distance check (cheaper than raycasting for static points).
   */
  update(playerPosition: THREE.Vector3): void {
    let closest: Interactable | null = null;
    let closestDist = Infinity;

    for (const item of this.interactables) {
      const dist = playerPosition.distanceTo(item.position);

      if (dist < item.radius && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }

    if (closest !== this.activeInteractable) {
      this.activeInteractable = closest;
      this.emit('hover', { interactable: closest });
    }

    // Update UI
    if (closest && this.promptEl && this.promptText) {
      this.promptEl.style.display = 'flex';
      this.promptText.textContent = closest.label;
    } else if (this.promptEl) {
      this.promptEl.style.display = 'none';
    }
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'KeyE' && this.activeInteractable) {
      this.emit('interact', {
        action: this.activeInteractable.action,
        label: this.activeInteractable.label,
      });
    }
  };

  dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    this.removeAllListeners();
  }
}
