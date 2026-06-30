// ============================================
// Main Entry Point — GTA Portfolio House
// ============================================

import * as THREE from 'three';
import { CAMERA, PLAYER, COLORS, LOADING_TIPS, HOUSE, ROOMS } from './config.js';

// Core
import { InputManager } from './core/InputManager.js';

// Player
import { Player } from './player/Player.js';
import { PlayerController } from './player/PlayerController.js';
import { CameraController } from './player/CameraController.js';

// World
import { createHouse } from './world/House.js';
import { createExterior } from './world/Exterior.js';

// Systems
import { CollisionSystem } from './utils/CollisionSystem.js';
import { InteractionManager } from './interactables/InteractionManager.js';
import { createPostProcessing } from './effects/PostProcessing.js';
import { AudioManager } from './audio/AudioManager.js';
import { Minimap } from './ui/Minimap.js';

// ============================================
// Globals
// ============================================
let scene, camera, renderer;
let inputManager, player, playerController, cameraController;
let collisionSystem, interactionManager, audioManager, minimap;
let exteriorData, houseData;
let clock, postProcessing;
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

function yieldFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

async function updateLoading(progress, tip) {
  loadProgress = progress;
  if (loadingBar) loadingBar.style.width = `${progress}%`;
  if (tip && loadingTip) loadingTip.textContent = tip;
  await yieldFrame();
}

// ============================================
// Room Detection
// ============================================
function getRoomAt(x, z) {
  if (z > 5.3) return 'Front yard';
  if (x < -5 && x > -10.2) return 'GARAGE';
  if (x >= -5 && z > 1) return 'LIVING ROOM';
  if (x < 0 && z <= 1) return 'KITCHEN';
  if (x >= 0 && z <= 1) return 'BEDROOM';
  return '';
}

// ============================================
// Register Interaction Zones
// ============================================
function registerInteractions() {
  // Living Room — About Me (near TV)
  interactionManager.register(-1.2, 1.0, 1.3, 2.5, 'Press E — About Me', 'about_me');

  // Living Room — Personal Story (near bookshelf)
  interactionManager.register(-4.85, 1.0, 2.2, 2.0, 'Press E — My Story', 'personal_story');

  // Kitchen — Skills (near kitchen island)
  interactionManager.register(-2.3, 0.5, -1.8, 2.5, 'Press E — Web Technologies', 'frontend_skills');

  // Kitchen — Backend Skills (near counter)
  interactionManager.register(-3.2, 0.5, -4.5, 2.0, 'Press E — Programming Languages', 'backend_skills');

  // Bedroom — Projects (near desk)
  interactionManager.register(4.1, 0.5, -1.3, 2.5, 'Press E — Projects', 'project_0');

  // Bedroom — Achievements (near wardrobe)
  interactionManager.register(4.2, 1.0, -4.5, 2.0, 'Press E — Achievements', 'achievements');

  // Bedroom — Timeline (near bed)
  interactionManager.register(1.5, 0.5, -1.7, 2.0, 'Press E — My Journey', 'timeline');

  // Garage — Tech Showcase (near workbench)
  interactionManager.register(-9.5, 0.5, 2, 2.5, 'Press E — Tech Showcase', 'tech_showcase');

  // Garage — Contact (near tool shelf)
  interactionManager.register(-9.6, 0.5, -4, 2.5, 'Press E — Contact Me', 'contact');

  // Living Room — Resume (near sofa)
  interactionManager.register(-3.4, 0.5, 4.1, 2.0, 'Press E — Download Resume', 'download_resume');
}

// ============================================
// Initialize
// ============================================
async function init() {
  clock = new THREE.Clock();

  // ---- Scene ----
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.Fog(0x87CEEB, 28, 70);

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  await updateLoading(10, LOADING_TIPS[1]);

  // ---- Lighting ----
  const sun = new THREE.DirectionalLight(0xFFF8E1, 1.3);
  sun.position.set(15, 25, 15);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -25;
  sun.shadow.camera.right = 25;
  sun.shadow.camera.top = 25;
  sun.shadow.camera.bottom = -25;
  sun.shadow.camera.far = 80;
  scene.add(sun);

  const ambient = new THREE.AmbientLight(0x8899AA, 0.65);
  scene.add(ambient);

  await updateLoading(15, LOADING_TIPS[2]);

  // ---- Systems ----
  inputManager = new InputManager();
  collisionSystem = new CollisionSystem();
  interactionManager = new InteractionManager(inputManager);
  audioManager = new AudioManager();
  minimap = new Minimap();

  await updateLoading(20, 'Building world...');

  // ---- Build World ----
  exteriorData = createExterior(scene);
  await updateLoading(40, 'Constructing house...');

  houseData = createHouse(scene, collisionSystem);
  await updateLoading(70, 'Furnishing rooms...');

  // ---- Register Interactions ----
  registerInteractions();
  await updateLoading(85, 'Setting up controls...');

  // ---- Post-Processing ----
  postProcessing = createPostProcessing(renderer, scene, camera);

  await updateLoading(95, 'Spawning player...');

  // ---- Player ----
  player = new Player(scene);
  cameraController = new CameraController(camera, inputManager);
  playerController = new PlayerController(player, inputManager, collisionSystem, cameraController);

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

  // Re-lock pointer on click when panel is closed and game is active
  document.addEventListener('click', (e) => {
    if (!isGameStarted || interactionManager.panelOpen) return;
    const panel = document.getElementById('content-panel');
    if (panel && panel.contains(e.target)) return;
    inputManager.lockPointer();
  });

  isInitDone = true;
}

// ============================================
// Animation Loop
// ============================================
let lastRoom = '';
function animate() {
  requestAnimationFrame(animate);

  if (!isInitDone || !renderer) return;

  const dt = Math.min(clock.getDelta(), 0.05);

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

  // Update interactions
  interactionManager.update(player.position);

  // Update audio
  audioManager.update(player.position.x, player.position.y, player.position.z);

  // Update minimap
  minimap.update(player.position.x, player.position.z);

  // Update room label
  const roomName = getRoomAt(player.position.x, player.position.z);
  if (roomName !== lastRoom) {
    lastRoom = roomName;
    const label = document.getElementById('hud-room-name');
    if (label) {
      label.textContent = roomName || '';
    }
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
animate();
init().catch(err => {
  console.error('Init failed:', err);
  if (loadingTip) loadingTip.textContent = 'Error: ' + err.message;
});
