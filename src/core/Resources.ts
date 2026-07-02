/**
 * Resources — Centralized asset loader with progress tracking.
 *
 * Uses THREE.LoadingManager for unified progress.
 * Emits 'progress' and 'ready' events.
 * World should ONLY initialize after 'ready' fires.
 */

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EventEmitter } from '@utils/EventEmitter';

// ---- Asset Manifest Types ----

export type AssetType = 'fbx' | 'texture' | 'audio';

export interface AssetDefinition {
  name: string;
  type: AssetType;
  path: string;
}

export type LoadedAsset = THREE.Group | THREE.Texture | AudioBuffer;

interface ResourceEvents {
  progress: number;  // 0–100
  ready: undefined;
}

// ---- Default Asset Manifest ----

const ASSET_MANIFEST: AssetDefinition[] = [
  // Character model
  { name: 'character', type: 'fbx', path: '/models/girl/eve_j_gonzales.fbx' },
  // Character animations
  { name: 'anim_idle', type: 'fbx', path: '/models/girl/idle.fbx' },
  { name: 'anim_walk', type: 'fbx', path: '/models/girl/walk.fbx' },
  { name: 'anim_run', type: 'fbx', path: '/models/girl/run.fbx' },
  { name: 'anim_dance', type: 'fbx', path: '/models/girl/dance.fbx' },
];

export class Resources extends EventEmitter<ResourceEvents> {
  private readonly manager: THREE.LoadingManager;
  private readonly fbxLoader: FBXLoader;
  private readonly textureLoader: THREE.TextureLoader;
  private readonly audioLoader: THREE.AudioLoader;

  /** Loaded assets indexed by name */
  readonly items: Map<string, LoadedAsset> = new Map();

  /** Whether all assets have been loaded */
  isReady = false;

  constructor() {
    super();

    this.manager = new THREE.LoadingManager(
      this.onLoaded,
      this.onProgress,
      this.onError,
    );

    this.fbxLoader = new FBXLoader(this.manager);
    this.textureLoader = new THREE.TextureLoader(this.manager);
    this.audioLoader = new THREE.AudioLoader(this.manager);
  }

  /**
   * Start loading all assets from the manifest.
   */
  async load(): Promise<void> {
    if (ASSET_MANIFEST.length === 0) {
      this.isReady = true;
      this.emit('ready', undefined);
      return;
    }

    const promises = ASSET_MANIFEST.map((asset) => this.loadAsset(asset));
    await Promise.allSettled(promises);
  }

  /**
   * Get a loaded asset by name (typed).
   */
  get<T extends LoadedAsset>(name: string): T | undefined {
    return this.items.get(name) as T | undefined;
  }

  // ---- Private ----

  private async loadAsset(asset: AssetDefinition): Promise<void> {
    try {
      let loaded: LoadedAsset;

      switch (asset.type) {
        case 'fbx':
          loaded = await this.fbxLoader.loadAsync(asset.path);
          break;
        case 'texture':
          loaded = await this.textureLoader.loadAsync(asset.path);
          break;
        case 'audio':
          loaded = await this.audioLoader.loadAsync(asset.path);
          break;
        default:
          throw new Error(`Unknown asset type: ${asset.type}`);
      }

      this.items.set(asset.name, loaded);
    } catch (err) {
      console.error(`[Resources] Failed to load "${asset.name}" from ${asset.path}:`, err);
    }
  }

  private onProgress = (_url: string, loaded: number, total: number): void => {
    const percent = Math.round((loaded / total) * 100);
    this.emit('progress', percent);
  };

  private onLoaded = (): void => {
    this.isReady = true;
    this.emit('ready', undefined);
  };

  private onError = (url: string): void => {
    console.error(`[Resources] Error loading: ${url}`);
  };

  dispose(): void {
    this.items.clear();
    this.removeAllListeners();
  }
}
