// main.js
// Renderer setup, lighting, UI button wiring, and the render loop.
// Depends on: colliders.js (scene/box/cyl/plane), build-exterior.js,
// build-interior.js, controls.js — load order matters, see index.html.

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 28, 70);

const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 200);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

// ---- Build the scene ----
buildExterior();
const ceilLights = buildInterior();

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

const porchLight = new THREE.PointLight(0xFFDDAA, 1.2, 8);
porchLight.position.set(0, 3.3, 5.2);
scene.add(porchLight);

// ---- Controls ----
initControls(canvas, camera);
enterOrbit(camera);

// ---- UI wiring ----
const btnDay = document.getElementById('btn-day');
const btnNight = document.getElementById('btn-night');
const btnOrbit = document.getElementById('btn-orbit');
const btnWalk = document.getElementById('btn-walk');

btnOrbit.addEventListener('click', () => {
  enterOrbit(camera);
  btnOrbit.classList.add('active');
  btnWalk.classList.remove('active');
});
btnWalk.addEventListener('click', () => {
  enterWalk(camera);
  btnWalk.classList.add('active');
  btnOrbit.classList.remove('active');
});

btnDay.addEventListener('click', () => {
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.Fog(0x87CEEB, 28, 70);
  sun.color.set(0xFFF8E1); sun.intensity = 1.3;
  ambient.color.set(0x8899AA); ambient.intensity = 0.65;
  porchLight.intensity = 0.4;
  ceilLights.forEach(l => l.intensity = 0.35);
  btnDay.classList.add('active');
  btnNight.classList.remove('active');
});
btnNight.addEventListener('click', () => {
  scene.background = new THREE.Color(0x0A0A1A);
  scene.fog = new THREE.Fog(0x0A0A1A, 18, 55);
  sun.color.set(0x223355); sun.intensity = 0.12;
  ambient.color.set(0x111A2A); ambient.intensity = 0.22;
  porchLight.intensity = 2.2;
  ceilLights.forEach(l => l.intensity = 1.1);
  btnNight.classList.add('active');
  btnDay.classList.remove('active');
});

// ---- Render loop ----
let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (!orbitMode) {
    updatePlayer(dt, camera);
    updateRoomLabel();
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(loop);
