// colliders.js
// Shared scene reference, geometry helpers, and the AABB collider list
// used for simple walk-collision against walls and furniture.

const scene = new THREE.Scene();
const colliders = []; // { minX, maxX, minZ, maxZ, minY, maxY }

/**
 * Add a box mesh to the scene.
 * opts: { ry, cast, recv, collide }
 */
function box(w, h, d, color, x, y, z, opts) {
  opts = opts || {};
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.y = opts.ry || 0;
  mesh.position.set(x, y, z);
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.recv !== false;
  scene.add(mesh);

  if (opts.collide !== false) {
    const hw = w / 2, hd = d / 2;
    colliders.push({
      minX: x - hw, maxX: x + hw,
      minZ: z - hd, maxZ: z + hd,
      minY: y - h / 2, maxY: y + h / 2
    });
  }
  return mesh;
}

/**
 * Add a cylinder mesh to the scene.
 * opts: { ry, collide }
 */
function cyl(rt, rb, h, segs, color, x, y, z, opts) {
  opts = opts || {};
  const geo = new THREE.CylinderGeometry(rt, rb, h, segs);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  if (opts.ry) mesh.rotation.y = opts.ry;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  if (opts.collide) {
    colliders.push({
      minX: x - rt - 0.05, maxX: x + rt + 0.05,
      minZ: z - rt - 0.05, maxZ: z + rt + 0.05,
      minY: y - h / 2, maxY: y + h / 2
    });
  }
  return mesh;
}

/** Add a flat plane (floor, rug, glass pane, wall art). */
function plane(w, h, color, x, y, z, rx, ry, opts) {
  opts = opts || {};
  const geo = new THREE.PlaneGeometry(w, h);
  const mat = new THREE.MeshLambertMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: !!opts.transparent,
    opacity: opts.opacity !== undefined ? opts.opacity : 1
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.x = rx || 0;
  mesh.rotation.y = ry || 0;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

/** Manually push a custom AABB collider (e.g. for grouped meshes like cars). */
function addCollider(minX, maxX, minZ, maxZ, minY, maxY) {
  colliders.push({ minX, maxX, minZ, maxZ, minY, maxY });
}
