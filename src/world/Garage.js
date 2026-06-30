// ============================================
// Garage — Structure + Supercar
// ============================================

import * as THREE from 'three';
import { MaterialFactory } from '../utils/MaterialFactory.js';
import { GeometryFactory } from '../utils/GeometryFactory.js';
import { HOUSE } from '../config.js';

export function createGarage(scene, collisionSystem) {
  const group = new THREE.Group();
  group.name = 'garageExterior';
  
  const gx = HOUSE.width / 2 + 5;
  const gz = 0;
  const gw = 7;
  const gd = 8;
  const gh = 4;
  
  const wallMat = MaterialFactory.whiteWall();
  const floorMat = MaterialFactory.driveway();
  
  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(gw, 0.1, gd), floorMat);
  floor.position.set(gx, 0.05, gz);
  floor.receiveShadow = true;
  group.add(floor);
  
  // Walls
  // Back
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(gw, gh, 0.3), wallMat);
  backWall.position.set(gx, gh / 2, gz + gd / 2);
  backWall.castShadow = true;
  group.add(backWall);
  
  // Left (connects to house)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, gh, gd), wallMat);
  leftWall.position.set(gx - gw / 2, gh / 2, gz);
  leftWall.castShadow = true;
  group.add(leftWall);
  
  // Right
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, gh, gd), wallMat);
  rightWall.position.set(gx + gw / 2, gh / 2, gz);
  rightWall.castShadow = true;
  group.add(rightWall);
  
  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(gw + 0.5, 0.15, gd + 0.5), MaterialFactory.roofTop());
  roof.position.set(gx, gh, gz);
  roof.castShadow = true;
  group.add(roof);
  
  // Garage door (front) — partially open
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.7 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(gw - 0.6, gh * 0.3, 0.1), doorMat);
  door.position.set(gx, gh * 0.85, gz - gd / 2);
  group.add(door);
  
  // Garage interior light
  const garageLight = new THREE.PointLight(0xfff5e0, 0.8, 12, 2);
  garageLight.position.set(gx, gh - 0.5, gz);
  group.add(garageLight);
  
  // Supercar inside garage
  const car = GeometryFactory.createSupercar(gx, gz);
  group.add(car);
  
  // Collision
  collisionSystem.addWall(gx - gw / 2 - 0.15, gz + gd / 2, gx + gw / 2 + 0.15, gz + gd / 2 + 0.3, 0, gh); // Back
  collisionSystem.addWall(gx - gw / 2 - 0.3, gz - gd / 2, gx - gw / 2, gz + gd / 2, 0, gh); // Left
  collisionSystem.addWall(gx + gw / 2, gz - gd / 2, gx + gw / 2 + 0.3, gz + gd / 2, 0, gh); // Right

  scene.add(group);
  return group;
}
