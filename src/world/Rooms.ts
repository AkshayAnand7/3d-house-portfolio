/**
 * Rooms — Logical room zones with trigger detection.
 *
 * Uses simple AABB checks against player position.
 * Emits room:enter and room:exit events for HUD, audio, etc.
 */

import { EventEmitter } from '@utils/EventEmitter';
import type * as THREE from 'three';

// ---- Types ----

export interface RoomDefinition {
  id: string;
  label: string;
  /** Axis-aligned bounding box */
  min: { x: number; z: number };
  max: { x: number; z: number };
  /** Y range (for multi-floor) */
  minY?: number;
  maxY?: number;
}

interface RoomEvents {
  enter: { room: RoomDefinition };
  exit: { room: RoomDefinition };
}

// ---- Room Definitions ----

const ROOM_DEFINITIONS: RoomDefinition[] = [
  { id: 'living_room', label: 'LIVING ROOM', min: { x: -5, z: 0.5 }, max: { x: 0, z: 5 } },
  { id: 'kitchen', label: 'KITCHEN', min: { x: -5, z: -5 }, max: { x: 0, z: 0.5 } },
  { id: 'bedroom', label: 'BEDROOM', min: { x: 0, z: -5 }, max: { x: 5, z: 5 } },
  { id: 'garage', label: 'GARAGE', min: { x: -10, z: -5 }, max: { x: -5, z: 5 } },
];

export class Rooms extends EventEmitter<RoomEvents> {
  private currentRoom: RoomDefinition | null = null;

  get current(): RoomDefinition | null {
    return this.currentRoom;
  }

  get currentLabel(): string {
    return this.currentRoom?.label ?? 'EXTERIOR';
  }

  /**
   * Check which room the player is in.
   * Call every frame with player position.
   */
  update(playerPos: THREE.Vector3): void {
    let foundRoom: RoomDefinition | null = null;

    for (const room of ROOM_DEFINITIONS) {
      const inXZ =
        playerPos.x >= room.min.x &&
        playerPos.x <= room.max.x &&
        playerPos.z >= room.min.z &&
        playerPos.z <= room.max.z;

      const inY =
        (room.minY === undefined || playerPos.y >= room.minY) &&
        (room.maxY === undefined || playerPos.y <= room.maxY);

      if (inXZ && inY) {
        foundRoom = room;
        break;
      }
    }

    if (foundRoom !== this.currentRoom) {
      if (this.currentRoom) {
        this.emit('exit', { room: this.currentRoom });
      }
      this.currentRoom = foundRoom;
      if (this.currentRoom) {
        this.emit('enter', { room: this.currentRoom });
      }
    }
  }

  dispose(): void {
    this.removeAllListeners();
  }
}
