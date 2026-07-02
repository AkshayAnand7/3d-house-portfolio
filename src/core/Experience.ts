/**
 * Experience — Singleton that initializes and orchestrates the entire engine.
 *
 * Holds references to all core systems.
 * Manages the update loop via Time.tick events.
 * No gameplay logic lives here — that's in World.
 */

import { GameScene } from './Scene';
import { Renderer } from './Renderer';
import { Camera } from './Camera';
import { Time, type TickData } from './Time';
import { Sizes } from './Sizes';
import { Input } from './Input';
import { Resources } from './Resources';
import { Physics } from './Physics';
import { PostProcessing } from './PostProcessing';
import { World } from '@world/World';
import { LoadingScreen } from '@ui/LoadingScreen';
import { HUD } from '@ui/HUD';
import { Panels } from '@ui/Panels';
import { Debug } from '@utils/Debug';

export class Experience {
  private static instance: Experience | null = null;

  // Core
  readonly scene: GameScene;
  readonly time: Time;
  readonly sizes: Sizes;
  readonly input: Input;
  readonly camera: Camera;
  readonly renderer: Renderer;
  readonly resources: Resources;
  readonly physics: Physics;
  readonly debug: Debug;

  // Post-processing
  private postProcessing!: PostProcessing;

  // UI
  readonly loadingScreen: LoadingScreen;
  readonly hud: HUD;
  readonly panels: Panels;

  // World (created after resources load)
  private world: World | null = null;

  // Game state
  private isStarted = false;

  private constructor() {
    // ---- Core Systems ----
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.input = new Input();
    this.scene = new GameScene();
    this.camera = new Camera(this.sizes, this.input);
    this.resources = new Resources();
    this.physics = new Physics();

    // ---- Canvas & Renderer ----
    const container = document.getElementById('canvas-container')!;
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    this.renderer = new Renderer(canvas, this.sizes);

    // ---- UI ----
    this.loadingScreen = new LoadingScreen();
    this.hud = new HUD();
    this.panels = new Panels(this.input);

    // ---- Wire Events ----
    this.resources.on('progress', (percent) => {
      this.loadingScreen.setProgress(percent);
    });

    this.resources.on('ready', () => {
      this.loadingScreen.setReady();
    });

    this.loadingScreen.on('start', () => {
      this.startGame();
    });

    // Physics debug toggle
    if (this.debug.isActive) {
      document.addEventListener('keydown', (e) => {
        if (e.code === 'F3') {
          e.preventDefault();
          this.physics.toggleDebug(this.scene);
        }
      });
    }

    // ---- Tick Loop ----
    this.time.on('tick', this.update);

    // ---- Initialize ----
    this.init();
  }

  static getInstance(): Experience {
    if (!Experience.instance) {
      Experience.instance = new Experience();
    }
    return Experience.instance;
  }

  // ---- Initialization (async) ----

  private async init(): Promise<void> {
    try {
      // Initialize physics WASM
      await this.physics.init();

      // Load all assets
      await this.resources.load();

      // Create world (after resources are ready)
      this.world = new World(
        this.scene,
        this.physics,
        this.input,
        this.camera,
        this.resources,
        this.panels,
        this.hud,
      );

      // Post-processing
      this.postProcessing = new PostProcessing(
        this.renderer.instance,
        this.scene,
        this.camera.instance,
        this.sizes,
      );

      // Start the animation loop
      this.time.start();

      console.log('✅ Experience initialized');
    } catch (err) {
      console.error('❌ Experience init failed:', err);
      const tip = document.getElementById('loading-tip');
      if (tip) tip.textContent = `Error: ${(err as Error).message}`;
    }
  }

  // ---- Game Start (after loading screen) ----

  private startGame(): void {
    if (this.isStarted) return;
    this.isStarted = true;

    // Lock pointer
    this.input.requestPointerLock();

    console.log('🎮 Game started');
  }

  // ---- Update Loop ----

  private update = (tick: TickData): void => {
    // Always update input (to consume mouse deltas)
    this.input.update();

    // Camera mouse look (always, so preview works on loading screen)
    this.camera.updateMouseLook();

    // Update world only after game starts
    if (this.isStarted && this.world && !this.panels.isOpen) {
      this.world.update(tick.deltaTime);

      // Physics step
      this.physics.step();

      // Physics debug
      if (this.debug.isActive) {
        this.physics.updateDebug(this.scene);
      }

      // Update crosshair visibility
      this.hud.setCrosshairVisible(this.camera.isFirstPerson);
    }

    // Debug FPS
    this.debug.update();

    // Render
    if (this.postProcessing) {
      this.postProcessing.render();
    } else {
      this.renderer.instance.render(this.scene, this.camera.instance);
    }
  };

  // ---- Cleanup ----

  destroy(): void {
    this.time.dispose();
    this.sizes.dispose();
    this.input.dispose();
    this.camera.dispose();
    this.renderer.dispose();
    this.resources.dispose();
    this.physics.dispose();
    this.loadingScreen.dispose();
    this.hud.dispose();
    this.panels.dispose();
    this.world?.dispose();
    this.debug.dispose();

    Experience.instance = null;
  }
}
