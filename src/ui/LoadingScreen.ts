/**
 * LoadingScreen — Full-screen loading overlay with progress.
 *
 * Driven by Resources.progress events.
 * Shows portfolio name and roles.
 * Transitions to game on click after loading completes.
 */

import gsap from 'gsap';
import { EventEmitter } from '@utils/EventEmitter';

interface LoadingEvents {
  start: undefined;
}

export class LoadingScreen extends EventEmitter<LoadingEvents> {
  private element: HTMLElement | null;
  private barElement: HTMLElement | null;
  private tipElement: HTMLElement | null;
  private enterElement: HTMLElement | null;
  private isReady = false;

  private readonly tips = [
    'Constructing luxury villa...',
    'Planting garden trees...',
    'Polishing marble floors...',
    'Setting up the office...',
    'Filling the pool...',
    'Hanging certificates...',
  ];

  constructor() {
    super();
    this.element = document.getElementById('loading-screen');
    this.barElement = document.getElementById('loading-bar');
    this.tipElement = document.getElementById('loading-tip');
    this.enterElement = document.getElementById('loading-enter');

    if (this.element) {
      this.element.addEventListener('click', this.onStartClick);
    }
    document.addEventListener('keydown', this.onStartKey);
  }

  /** Update progress bar (0-100) */
  setProgress(percent: number): void {
    if (this.barElement) {
      this.barElement.style.width = `${percent}%`;
    }

    // Update tip text based on progress
    const tipIndex = Math.min(
      Math.floor((percent / 100) * this.tips.length),
      this.tips.length - 1,
    );
    if (this.tipElement) {
      this.tipElement.textContent = this.tips[tipIndex];
    }
  }

  /** Mark loading as complete, show "CLICK TO ENTER" */
  setReady(): void {
    this.isReady = true;
    if (this.tipElement) {
      this.tipElement.style.display = 'none';
    }
    if (this.enterElement) {
      this.enterElement.style.display = 'block';
    }
  }

  private startGame(): void {
    if (!this.element) return;

    // Animate out
    gsap.to(this.element, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        if (this.element) {
          this.element.style.display = 'none';
        }
      },
    });

    // Show HUD
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = 'block';

    this.emit('start', undefined);

    // Cleanup
    if (this.element) {
      this.element.removeEventListener('click', this.onStartClick);
    }
    document.removeEventListener('keydown', this.onStartKey);
  }

  private onStartClick = (): void => {
    if (this.isReady) this.startGame();
  };

  private onStartKey = (): void => {
    if (this.isReady) this.startGame();
  };

  dispose(): void {
    if (this.element) {
      this.element.removeEventListener('click', this.onStartClick);
    }
    document.removeEventListener('keydown', this.onStartKey);
    this.removeAllListeners();
  }
}
