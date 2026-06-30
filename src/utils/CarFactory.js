import * as THREE from 'three';

export function createSportsCar(primaryColor) {
  const grp = new THREE.Group();
  
  const bodyMat = new THREE.MeshLambertMaterial({ color: primaryColor });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x050505, transparent: true, opacity: 0.85, roughness: 0.1, metalness: 0.8 });
  const rimMat = new THREE.MeshLambertMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 });

  // Lower body
  const bodyGeo = new THREE.BoxGeometry(4.2, 0.7, 1.9);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.45, 0);
  body.castShadow = true;
  grp.add(body);

  // Front bumper curve (approximate with a rotated box)
  const bumperF = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.9), bodyMat);
  bumperF.position.set(1.8, 0.4, 0);
  bumperF.rotation.z = Math.PI / 12;
  bumperF.castShadow = true;
  grp.add(bumperF);

  // Cabin
  const cabinGeo = new THREE.BoxGeometry(2.0, 0.65, 1.6);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(-0.3, 1.1, 0);
  cabin.castShadow = true;
  grp.add(cabin);

  // Front windshield
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 1.55), glassMat);
  frontGlass.position.set(0.8, 1.05, 0);
  frontGlass.rotation.z = -Math.PI / 6;
  grp.add(frontGlass);

  // Rear windshield
  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 1.55), glassMat);
  rearGlass.position.set(-1.4, 1.05, 0);
  rearGlass.rotation.z = Math.PI / 6;
  grp.add(rearGlass);

  // Side windows
  const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.05), glassMat);
  sideGlassL.position.set(-0.3, 1.1, 0.8);
  grp.add(sideGlassL);
  
  const sideGlassR = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.05), glassMat);
  sideGlassR.position.set(-0.3, 1.1, -0.8);
  grp.add(sideGlassR);

  // Wheels
  [[-1.3, 0.35, 0.95], [1.3, 0.35, 0.95], [-1.3, 0.35, -0.95], [1.3, 0.35, -0.95]].forEach(([wx, wy, wz]) => {
    // Tire
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 20), darkMat);
    tire.rotation.x = Math.PI / 2;
    tire.position.set(wx, wy, wz);
    tire.castShadow = true;
    grp.add(tire);
    // Rim
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.27, 8), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(wx, wy, wz);
    grp.add(rim);
  });

  // Headlights
  const hlMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 });
  const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.4), hlMat);
  hl1.position.set(2.15, 0.55, 0.65);
  hl1.rotation.z = Math.PI / 12;
  grp.add(hl1);
  const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.4), hlMat);
  hl2.position.set(2.15, 0.55, -0.65);
  hl2.rotation.z = Math.PI / 12;
  grp.add(hl2);

  // Taillights
  const tlMat = new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.8 });
  const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.5), tlMat);
  tl1.position.set(-2.1, 0.55, 0.6);
  grp.add(tl1);
  const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.5), tlMat);
  tl2.position.set(-2.1, 0.55, -0.6);
  grp.add(tl2);

  // Grille
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 1.0), darkMat);
  grille.position.set(2.15, 0.35, 0);
  grille.rotation.z = Math.PI / 12;
  grp.add(grille);

  // Spoiler
  const spoilerPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.1), darkMat);
  spoilerPillar1.position.set(-1.9, 0.85, 0.5);
  grp.add(spoilerPillar1);
  const spoilerPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.1), darkMat);
  spoilerPillar2.position.set(-1.9, 0.85, -0.5);
  grp.add(spoilerPillar2);
  const spoilerWing = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 1.8), bodyMat);
  spoilerWing.position.set(-2.05, 1.0, 0);
  spoilerWing.rotation.z = Math.PI / 16;
  grp.add(spoilerWing);

  // Twin Exhausts
  const exhaustMat = new THREE.MeshLambertMaterial({ color: 0x888888, metalness: 0.8 });
  const ex1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 8), exhaustMat);
  ex1.rotation.z = Math.PI / 2;
  ex1.position.set(-2.1, 0.25, 0.4);
  grp.add(ex1);
  const ex2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 8), exhaustMat);
  ex2.rotation.z = Math.PI / 2;
  ex2.position.set(-2.1, 0.25, -0.4);
  grp.add(ex2);

  return grp;
}
