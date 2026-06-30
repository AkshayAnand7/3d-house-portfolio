// controls.js
// First-person walk controller (pointer lock + touch drag) and
// a simple orbit camera for the overview mode.

const PLAYER_H = 1.65;
const player = { x: 0, y: PLAYER_H, z: 9.5, yaw: Math.PI, pitch: 0 };

let orbitMode = true;
let pointerLocked = false;
const keys = {};

let theta = 0.7, phi = 0.55, radius = 24;
let isDragging = false, prevX = 0, prevY = 0;
let touchLook = null;

function initControls(canvas, camera) {
  window.addEventListener('keydown', e => { keys[e.code] = true; });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  canvas.addEventListener('click', () => {
    if (!orbitMode) canvas.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
    const crosshair = document.getElementById('crosshair');
    if (crosshair) crosshair.style.display = pointerLocked ? 'block' : 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!pointerLocked || orbitMode) return;
    player.yaw -= e.movementX * 0.0022;
    player.pitch -= e.movementY * 0.0022;
    player.pitch = Math.max(-1.2, Math.min(1.2, player.pitch));
  });

  // Touch look (drag) fallback when pointer lock isn't available
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) touchLook = e.touches[0];
  });
  canvas.addEventListener('touchmove', e => {
    if (orbitMode || !touchLook) return;
    const t = e.touches[0];
    player.yaw -= (t.clientX - touchLook.clientX) * 0.005;
    player.pitch = Math.max(-1.2, Math.min(1.2, player.pitch - (t.clientY - touchLook.clientY) * 0.005));
    touchLook = t;
    e.preventDefault();
  }, { passive: false });

  // Orbit drag + zoom
  canvas.addEventListener('mousedown', e => {
    if (orbitMode) { isDragging = true; prevX = e.clientX; prevY = e.clientY; }
  });
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', e => {
    if (!isDragging || !orbitMode) return;
    theta -= (e.clientX - prevX) * 0.008;
    phi = Math.max(0.1, Math.min(1.4, phi + (e.clientY - prevY) * 0.008));
    prevX = e.clientX; prevY = e.clientY;
    updateOrbitCamera(camera);
  });
  canvas.addEventListener('wheel', e => {
    if (!orbitMode) return;
    radius = Math.max(8, Math.min(50, radius + e.deltaY * 0.05));
    updateOrbitCamera(camera);
    e.preventDefault();
  }, { passive: false });
}

function updateOrbitCamera(camera) {
  camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
  camera.position.y = radius * Math.cos(phi);
  camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
  camera.lookAt(-2, 2, 0);
}

/** AABB collision check against the global `colliders` array (colliders.js). */
function collideMove(nx, nz) {
  const r = 0.32;
  let okX = true, okZ = true;

  for (const c of colliders) {
    if (nx + r > c.minX && nx - r < c.maxX &&
        player.z + r > c.minZ && player.z - r < c.maxZ &&
        player.y - 1.5 < c.maxY && player.y + 0.3 > c.minY) {
      okX = false; break;
    }
  }
  for (const c of colliders) {
    if (player.x + r > c.minX && player.x - r < c.maxX &&
        nz + r > c.minZ && nz - r < c.maxZ &&
        player.y - 1.5 < c.maxY && player.y + 0.3 > c.minY) {
      okZ = false; break;
    }
  }
  if (okX) player.x = nx;
  if (okZ) player.z = nz;
}

function updatePlayer(dt, camera) {
  const speed = (keys['ShiftLeft'] || keys['ShiftRight']) ? 5.5 : 3.0;
  let fwd = 0, strafe = 0;
  if (keys['KeyW'] || keys['ArrowUp']) fwd += 1;
  if (keys['KeyS'] || keys['ArrowDown']) fwd -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) strafe += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) strafe -= 1;

  if (fwd || strafe) {
    const len = Math.hypot(fwd, strafe) || 1;
    fwd /= len; strafe /= len;
    const sinY = Math.sin(player.yaw), cosY = Math.cos(player.yaw);
    const dx = (-sinY * fwd + cosY * strafe) * speed * dt;
    const dz = (-cosY * fwd - sinY * strafe) * speed * dt;
    collideMove(player.x + dx, player.z + dz);
  }

  // Keep the player within the outdoor bounds
  player.x = Math.max(-26, Math.min(26, player.x));
  player.z = Math.max(-26, Math.min(26, player.z));

  camera.position.set(player.x, player.y, player.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;
}

function roomAt(x, z) {
  if (z > 5.3) return 'Front yard';
  if (x < -5 && x > -10.2) return 'Garage';
  if (x >= -5 && z > 1) return 'Living room';
  if (x < 0 && z <= 1) {
    if (x > 3 && z < -3) return 'Bathroom';
    return 'Kitchen';
  }
  if (x >= 0 && z <= 1) {
    if (x > 3 && z < -3) return 'Bathroom';
    return 'Bedroom';
  }
  return '';
}

let lastRoom = '';
function updateRoomLabel() {
  const el = document.getElementById('room-label');
  if (!el) return;
  const r = roomAt(player.x, player.z);
  if (r !== lastRoom) {
    lastRoom = r;
    if (r) {
      el.textContent = r;
      el.style.opacity = '1';
    } else {
      el.style.opacity = '0';
    }
  }
}

function enterOrbit(camera) {
  orbitMode = true;
  if (document.exitPointerLock) document.exitPointerLock();
  const hud = document.getElementById('hud');
  if (hud) hud.textContent = 'Drag to rotate · scroll to zoom';
  const label = document.getElementById('room-label');
  if (label) label.style.opacity = '0';
  updateOrbitCamera(camera);
}

function enterWalk(camera) {
  orbitMode = false;
  const hud = document.getElementById('hud');
  if (hud) hud.textContent = 'Click to look around · WASD/arrows to walk · Shift to run';
  player.x = 0; player.z = 8.5; player.yaw = Math.PI; player.pitch = 0;
  camera.position.set(player.x, player.y, player.z);
}
