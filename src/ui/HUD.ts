/**
 * HUD — In-game heads-up display.
 *
 * Room name, minimap, control hints, crosshair.
 */

export class HUD {
  private roomNameEl: HTMLElement | null;
  private crosshairEl: HTMLElement | null;

  constructor() {
    this.roomNameEl = document.getElementById('hud-room-name');
    this.crosshairEl = document.getElementById('crosshair');
  }

  setRoomName(name: string): void {
    if (this.roomNameEl) {
      this.roomNameEl.textContent = name;
    }
  }

  setCrosshairVisible(visible: boolean): void {
    if (this.crosshairEl) {
      this.crosshairEl.style.display = visible ? 'block' : 'none';
    }
  }

  dispose(): void {
    // No cleanup needed
  }
}
