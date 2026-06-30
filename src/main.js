// ============================================
// Main Entry Point — GTA Portfolio Villa
// ============================================

import * as THREE from 'three';
import { CAMERA, PLAYER, COLORS, LOADING_TIPS, HOUSE } from './config.js';

// Core
import { InputManager } from './core/InputManager.js';

// Player
import { Player } from './player/Player.js';
import { PlayerController } from './player/PlayerController.js';
import { CameraController } from './player/CameraController.js';

// World
import { createTerrain } from './world/Terrain.js';
import { createHouse } from './world/House.js';
import { createExterior } from './world/Exterior.js';
import { createGarage } from './world/Garage.js';
import { createGate, updateGate } from './world/Gate.js';

// Rooms
import { createLivingRoom } from './rooms/LivingRoom.js';
import { createKitchen } from './rooms/Kitchen.js';
import { createOfficeRoom } from './rooms/OfficeRoom.js';
import { createGarageRoom } from './rooms/GarageRoom.js';
import { createMasterBedroom } from './rooms/MasterBedroom.js';
import { createGamingRoom } from './rooms/GamingRoom.js';
import { createLibrary } from './rooms/Library.js';
import { createBalcony } from './rooms/Balcony.js';
import { createSecretRoom } from './rooms/SecretRoom.js';

// Systems
import { CollisionSystem } from './utils/CollisionSystem.js';
import { InteractionManager } from './interactables/InteractionManager.js';
import { createPostProcessing } from './effects/PostProcessing.js';
import { AudioManager } from './audio/AudioManager.js';
import { Minimap } from './ui/Minimap.js';
import { GeometryFactory } from './utils/GeometryFactory.js';

// ============================================
// Globals
// ============================================
let scene, camera, renderer;
let inputManager, player, playerController, cameraController;
let collisionSystem, interactionManager, audioManager, minimap;
let gateGroup, exteriorData, secretRoom;
let clock, postProcessing;
let collectiblesFound = 0;
let collectibleMeshes = [];
let animatedObjects = [];
let isGameStarted = false;
let isInitDone = false;

// ============================================
// Loading Screen
// ============================================
const loadingBar = document.getElementById('loading-bar');
const loadingTip = document.getElementById('loading-tip');
const loadingEnter = document.getElementById('loading-enter');
const loadingScreen = document.getElementById('loading-screen');
let loadProgress = 0;

// Yield to the browser so it can repaint the loading bar
function yieldFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

async function updateLoading(progress, tip) {
  loadProgress = progress;
  if (loadingBar) loadingBar.style.width = `${progress}%`;
  if (tip && loadingTip) loadingTip.textContent = tip;
  // Let the browser repaint
  await yieldFrame();
}

// ============================================
// Initialize (ASYNC — yields between steps)
// ============================================
async function init() {
  clock = new THREE.Clock();

  // ---- Scene ----
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.fog, 0.008);

  // Sky gradient background
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 2;
  skyCanvas.height = 512;
  const skyCtx = skyCanvas.getContext('2d');
  const gradient = skyCtx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#0a0a2e');
  gradient.addColorStop(0.3, '#1a0a3e');
  gradient.addColorStop(0.5, '#3a1a4e');
  gradient.addColorStop(0.7, '#ff6b35');
  gradient.addColorStop(0.85, '#ffb366');
  gradient.addColorStop(1, '#ffd4a6');
  skyCtx.fillStyle = gradient;
  skyCtx.fillRect(0, 0, 2, 512);
  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  skyTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = skyTexture;
  scene.environment = skyTexture;

  await updateLoading(5, LOADING_TIPS[0]);

  // ---- Camera ----
  camera = new THREE.PerspectiveCamera(
    CAMERA.fov,
    window.innerWidth / window.innerHeight,
    CAMERA.near,
    CAMERA.far
  );

  // ---- Renderer ----
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Cap pixel ratio to 1 for significant performance boost
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  await updateLoading(10, LOADING_TIPS[1]);

  // ---- Lighting ----
  const sunLight = new THREE.DirectionalLight(COLORS.sunLight, 2.0);
  sunLight.position.set(30, 25, -20);
  sunLight.castShadow = true;
  // Lower shadow resolution
  sunLight.shadow.mapSize.width = 512;
  sunLight.shadow.mapSize.height = 512;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 100;
  sunLight.shadow.camera.left = -40;
  sunLight.shadow.camera.right = 40;
  sunLight.shadow.camera.top = 40;
  sunLight.shadow.camera.bottom = -40;
  sunLight.shadow.bias = -0.001;
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(COLORS.ambient, 0.6);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffd4a6, 0x1a3a1a, 0.4);
  scene.add(hemiLight);

  await updateLoading(15, LOADING_TIPS[2]);

  // ---- Systems ----
  inputManager = new InputManager();
  collisionSystem = new CollisionSystem();
  interactionManager = new InteractionManager(inputManager);
  audioManager = new AudioManager();
  minimap = new Minimap();

  await updateLoading(20, 'Building terrain...');

  // ---- Build World (with yields) ----
  createTerrain(scene);
  await updateLoading(30, 'Constructing villa...');

  createHouse(scene, collisionSystem);
  await updateLoading(40, LOADING_TIPS[3]);

  exteriorData = createExterior(scene);
  await updateLoading(50, 'Building garage...');

  createGarage(scene, collisionSystem);
  await updateLoading(55, 'Installing gate...');

  gateGroup = createGate(scene, collisionSystem);
  await updateLoading(60, LOADING_TIPS[4]);

  // ---- Build Rooms (with yields) ----
  createLivingRoom(scene, interactionManager);
  await updateLoading(65, LOADING_TIPS[5]);

  createKitchen(scene, interactionManager);
  await updateLoading(68, 'Setting up projects...');

  createOfficeRoom(scene, interactionManager);
  await updateLoading(72, LOADING_TIPS[7]);

  createGarageRoom(scene, interactionManager);
  await updateLoading(76, 'Decorating bedroom...');

  createMasterBedroom(scene, interactionManager);
  await updateLoading(80, LOADING_TIPS[5]);

  createGamingRoom(scene, interactionManager);
  await updateLoading(84, LOADING_TIPS[8]);

  createLibrary(scene, interactionManager);
  await updateLoading(88, 'Setting up balcony...');

  createBalcony(scene, interactionManager);
  await updateLoading(90, LOADING_TIPS[9]);

  secretRoom = createSecretRoom(scene, interactionManager);
  await updateLoading(92, 'Hiding collectibles...');

  // ---- Collectibles ----
  const collectiblePositions = [
    { x: -12, y: 1.5, z: -8 },
    { x: 8, y: 6.5, z: 10 },
    { x: -10, y: 1.0, z: 15 },
  ];
  collectiblePositions.forEach(pos => {
    const collectible = GeometryFactory.createCollectible(pos.x, pos.y, pos.z);
    scene.add(collectible);
    collectibleMeshes.push(collectible);
  });

  await updateLoading(95, 'Post-processing...');

  // ---- Post-Processing ----
  postProcessing = createPostProcessing(renderer, scene, camera);

  await updateLoading(98, 'Spawning player...');

  // ---- Player ----
  player = new Player(scene);
  cameraController = new CameraController(camera, inputManager);
  playerController = new PlayerController(player, inputManager, collisionSystem, cameraController);

  // ---- Find animated objects ----
  scene.traverse(obj => {
    if (obj.userData.isHologram || obj.userData.floatOffset !== undefined) {
      animatedObjects.push(obj);
    }
  });

  await updateLoading(100, 'Ready!');

  // Show enter prompt
  setTimeout(() => {
    if (loadingTip) loadingTip.style.display = 'none';
    if (loadingEnter) loadingEnter.style.display = 'block';
  }, 300);

  // ---- Event Listeners ----
  window.addEventListener('resize', onResize);
  
  // Start game on click
  const startGame = () => {
    if (isGameStarted) return;
    isGameStarted = true;
    loadingScreen.classList.add('fade-out');
    document.getElementById('hud').style.display = 'block';
    audioManager.init();
    inputManager.lockPointer();
    
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 1200);
  };
  
  loadingScreen.addEventListener('click', startGame);
  document.addEventListener('keydown', () => {
    if (!isGameStarted && loadProgress >= 100) startGame();
  });

  isInitDone = true;
}

// ============================================
// Animation Loop
// ============================================
function animate() {
  requestAnimationFrame(animate);

  if (!isInitDone || !renderer) return;

  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.getElapsedTime();

  if (!isGameStarted) {
    renderer.render(scene, camera);
    return;
  }

  // Update input
  inputManager.update();

  // Update player & camera
  if (!interactionManager.panelOpen) {
    playerController.update(dt);
    cameraController.update(player, dt);
  }

  // Update gate animation
  updateGate(gateGroup, player.position.x, player.position.z, dt);

  // Update interactions
  interactionManager.update(player.position);

  // Update audio
  audioManager.update(player.position.x, player.position.y, player.position.z);

  // Update minimap
  minimap.update(player.position.x, player.position.z);

  // ---- Animate collectibles ----
  collectibleMeshes.forEach((collectible, i) => {
    if (collectible.userData.collected) return;
    
    collectible.children[0].rotation.y = elapsed * 2;
    collectible.children[0].rotation.x = elapsed * 0.5;
    if (!collectible.userData.originalY) collectible.userData.originalY = collectible.position.y;
    collectible.position.y = collectible.userData.originalY + Math.sin(elapsed * 2 + i) * 0.2;
    
    const dx = player.position.x - collectible.position.x;
    const dy = player.position.y - collectible.position.y;
    const dz = player.position.z - collectible.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    if (dist < 2) {
      collectible.userData.collected = true;
      collectible.visible = false;
      collectiblesFound++;
      document.getElementById('collectible-count').textContent = collectiblesFound;
      
      if (collectiblesFound >= 3 && secretRoom) {
        secretRoom.visible = true;
        const hudRoom = document.getElementById('hud-room-name');
        hudRoom.textContent = '🔓 SECRET ROOM UNLOCKED!';
        hudRoom.style.borderColor = '#ffd700';
        setTimeout(() => { hudRoom.style.borderColor = ''; }, 3000);
      }
    }
  });

  // ---- Animate floating objects ----
  animatedObjects.forEach(obj => {
    if (obj.userData.isHologram) {
      obj.rotation.y = elapsed * 0.5 + (obj.userData.floatOffset || 0);
      obj.rotation.x = Math.sin(elapsed * 0.3) * 0.2;
    }
    if (obj.userData.floatOffset !== undefined) {
      const offset = obj.userData.floatOffset || 0;
      obj.position.y += Math.sin(elapsed * 1.5 + offset) * 0.001;
    }
  });

  // ---- Animate water ----
  if (exteriorData && exteriorData.water) {
    exteriorData.water.material.opacity = 0.5 + Math.sin(elapsed * 0.5) * 0.1;
  }

  // ---- Render ----
  postProcessing.composer.render();
}

// ============================================
// Resize Handler
// ============================================
function onResize() {
  if (!camera || !renderer || !postProcessing) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  postProcessing.resize(w, h);
}

// ============================================
// Boot
// ============================================
animate(); // Start render loop immediately (guards with isInitDone)
init().catch(err => {
  console.error('Init failed:', err);
  if (loadingTip) loadingTip.textContent = 'Error: ' + err.message;
});
