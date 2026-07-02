/**
 * World — Orchestrates all world objects.
 *
 * Creates House, Environment, Player, Rooms, InteractionSystem.
 * Initializes ONLY after Resources are loaded.
 */

import type * as THREE from 'three';
import type { Physics } from '@core/Physics';
import type { Input } from '@core/Input';
import type { Camera } from '@core/Camera';
import type { Resources } from '@core/Resources';
import { Environment } from './Environment';
import { House } from './House';
import { Player } from './Player';
import { Rooms } from './Rooms';
import { InteractionSystem } from './InteractionSystem';
import type { Panels } from '@ui/Panels';
import type { HUD } from '@ui/HUD';

export class World {
  readonly environment: Environment;
  readonly house: House;
  readonly player: Player;
  readonly rooms: Rooms;
  readonly interactions: InteractionSystem;

  constructor(
    scene: THREE.Scene,
    physics: Physics,
    input: Input,
    camera: Camera,
    resources: Resources,
    panels: Panels,
    hud: HUD,
  ) {
    // ---- Environment (lighting, sky) ----
    this.environment = new Environment(scene);

    // ---- House (geometry + physics colliders) ----
    this.house = new House(scene, physics);

    // ---- Player (physics capsule + character model) ----
    this.player = new Player(physics, input, camera, scene, resources);

    // ---- Room Detection ----
    this.rooms = new Rooms();
    this.rooms.on('enter', ({ room }) => {
      hud.setRoomName(room.label);
    });
    this.rooms.on('exit', () => {
      hud.setRoomName('EXTERIOR');
    });

    // ---- Interaction System ----
    this.interactions = new InteractionSystem();
    this.registerInteractions();

    // Connect interactions to panels
    this.interactions.on('interact', ({ action }) => {
      if (!panels.isOpen) {
        panels.open(action);
      }
    });
  }

  private registerInteractions(): void {
    const reg = this.interactions.addInteractable.bind(this.interactions);

    // Living Room
    reg(-1.2, 1.0, 1.3, 2.5, 'Press E — About Me', 'about_me');
    reg(-4.85, 1.0, 2.2, 2.0, 'Press E — My Story', 'personal_story');

    // Kitchen
    reg(-2.3, 0.5, -1.8, 2.5, 'Press E — Web Technologies', 'frontend_skills');
    reg(-3.2, 0.5, -4.5, 2.0, 'Press E — Programming Languages', 'backend_skills');

    // Bedroom
    reg(4.1, 0.5, -1.3, 2.5, 'Press E — Projects', 'project_0');
    reg(4.2, 1.0, -4.5, 2.0, 'Press E — Achievements', 'achievements');
    reg(1.5, 0.5, -1.7, 2.0, 'Press E — My Journey', 'timeline');

    // Garage
    reg(-9.5, 0.5, 2, 2.5, 'Press E — Tech Showcase', 'tech_showcase');
    reg(-9.6, 0.5, -4, 2.5, 'Press E — Contact Me', 'contact');

    // Living Room — Resume
    reg(-3.4, 0.5, 4.1, 2.0, 'Press E — Download Resume', 'download_resume');
  }

  update(dt: number): void {
    this.player.update(dt);
    this.rooms.update(this.player.position);
    this.interactions.update(this.player.position);
  }

  dispose(): void {
    this.environment.dispose();
    this.house.dispose();
    this.player.dispose();
    this.rooms.dispose();
    this.interactions.dispose();
  }
}
