// ============================================
// Terrain — Ground, Road, Sidewalk, Driveway
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';

export function createTerrain(scene) {
  const group = new THREE.Group();
  group.name = 'terrain';

  // ---- Large ground plane (grass) ----
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const ground = new THREE.Mesh(groundGeo, MaterialFactory.grass());
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  group.add(ground);

  // ---- Road ----
  const roadGeo = new THREE.PlaneGeometry(8, 200);
  const road = new THREE.Mesh(roadGeo, MaterialFactory.road());
  road.rotation.x = -Math.PI / 2;
  road.position.set(35, 0.01, 0);
  road.receiveShadow = true;
  group.add(road);

  // Road lane markings
  const markMat = new THREE.MeshStandardMaterial({ color: 0xddddaa, roughness: 0.9 });
  for (let z = -90; z < 90; z += 6) {
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 3), markMat);
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(35, 0.02, z);
    group.add(mark);
  }

  // Road edge lines
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  [-1, 1].forEach(side => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 200), edgeMat);
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(35 + side * 3.8, 0.02, 0);
    group.add(edge);
  });

  // ---- Sidewalk ----
  const sidewalkGeo = new THREE.BoxGeometry(3, 0.12, 200);
  const sidewalkL = new THREE.Mesh(sidewalkGeo, MaterialFactory.sidewalk());
  sidewalkL.position.set(30, 0.06, 0);
  sidewalkL.receiveShadow = true;
  group.add(sidewalkL);

  // ---- Driveway ----
  const drivewayGeo = new THREE.PlaneGeometry(6, 18);
  const driveway = new THREE.Mesh(drivewayGeo, MaterialFactory.driveway());
  driveway.rotation.x = -Math.PI / 2;
  driveway.position.set(20, 0.02, 0);
  driveway.receiveShadow = true;
  group.add(driveway);

  // Driveway connection to road
  const driveConn = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), MaterialFactory.driveway());
  driveConn.rotation.x = -Math.PI / 2;
  driveConn.position.set(26, 0.02, 0);
  driveConn.receiveShadow = true;
  group.add(driveConn);

  scene.add(group);
  return group;
}
