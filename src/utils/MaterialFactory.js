// ============================================
// Material Factory — PBR Materials
// ============================================

import * as THREE from 'three';
import { COLORS } from '../config.js';

const textureLoader = new THREE.TextureLoader();

// Create a simple noise texture for rough surfaces
function createNoiseTexture(size = 256, intensity = 0.05) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255 * intensity;
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Marble pattern texture
function createMarbleTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f0ece4';
  ctx.fillRect(0, 0, size, size);
  
  // Veins
  ctx.strokeStyle = 'rgba(180, 170, 155, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    let x = Math.random() * size;
    let y = Math.random() * size;
    ctx.moveTo(x, y);
    for (let j = 0; j < 8; j++) {
      x += (Math.random() - 0.5) * 80;
      y += (Math.random() - 0.5) * 80;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  
  // Subtle noise
  const imageData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    imageData.data[i] += noise;
    imageData.data[i + 1] += noise;
    imageData.data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

// Wood grain texture
function createWoodTexture(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, '#8B6914');
  gradient.addColorStop(0.3, '#9B7924');
  gradient.addColorStop(0.5, '#7B5904');
  gradient.addColorStop(0.7, '#9B7924');
  gradient.addColorStop(1, '#8B6914');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Wood grain lines
  for (let y = 0; y < size; y += 3) {
    ctx.strokeStyle = `rgba(60, 40, 10, ${0.05 + Math.random() * 0.1})`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.1) * 5);
    for (let x = 0; x < size; x += 10) {
      ctx.lineTo(x, y + Math.sin((y + x) * 0.05) * 5);
    }
    ctx.stroke();
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Grass texture
function createGrassTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#2d5a1e';
  ctx.fillRect(0, 0, size, size);
  
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const shade = 30 + Math.random() * 40;
    ctx.fillStyle = `rgb(${shade}, ${60 + Math.random() * 50}, ${shade * 0.5})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 2 + Math.random() * 4);
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 20);
  return tex;
}

// Cache materials
const cache = {};

export const MaterialFactory = {
  
  whiteWall() {
    if (!cache.whiteWall) {
      const roughTex = createNoiseTexture(256, 0.03);
      roughTex.repeat.set(4, 4);
      cache.whiteWall = new THREE.MeshStandardMaterial({
        color: COLORS.whiteWall,
        roughness: 0.85,
        metalness: 0,
        roughnessMap: roughTex,
      });
    }
    return cache.whiteWall;
  },

  wood() {
    if (!cache.wood) {
      cache.wood = new THREE.MeshStandardMaterial({
        color: COLORS.wood,
        map: createWoodTexture(),
        roughness: 0.6,
        metalness: 0.05,
      });
    }
    return cache.wood;
  },

  woodDark() {
    if (!cache.woodDark) {
      cache.woodDark = new THREE.MeshStandardMaterial({
        color: COLORS.woodDark,
        roughness: 0.5,
        metalness: 0.05,
      });
    }
    return cache.woodDark;
  },

  glass() {
    if (!cache.glass) {
      cache.glass = new THREE.MeshPhysicalMaterial({
        color: COLORS.glass,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.8,
        thickness: 0.1,
        envMapIntensity: 1,
      });
    }
    return cache.glass;
  },

  marble() {
    if (!cache.marble) {
      cache.marble = new THREE.MeshStandardMaterial({
        color: COLORS.marble,
        map: createMarbleTexture(),
        roughness: 0.15,
        metalness: 0.05,
      });
    }
    return cache.marble;
  },

  metal() {
    if (!cache.metal) {
      cache.metal = new THREE.MeshStandardMaterial({
        color: COLORS.metal,
        roughness: 0.3,
        metalness: 0.85,
      });
    }
    return cache.metal;
  },

  metalGate() {
    if (!cache.metalGate) {
      cache.metalGate = new THREE.MeshStandardMaterial({
        color: COLORS.metalGate,
        roughness: 0.25,
        metalness: 0.9,
      });
    }
    return cache.metalGate;
  },

  grass() {
    if (!cache.grass) {
      cache.grass = new THREE.MeshStandardMaterial({
        color: COLORS.grass,
        map: createGrassTexture(),
        roughness: 0.95,
        metalness: 0,
      });
    }
    return cache.grass;
  },

  road() {
    if (!cache.road) {
      const roughTex = createNoiseTexture(256, 0.1);
      roughTex.repeat.set(6, 40);
      cache.road = new THREE.MeshStandardMaterial({
        color: COLORS.road,
        roughness: 0.9,
        metalness: 0,
        roughnessMap: roughTex,
      });
    }
    return cache.road;
  },

  sidewalk() {
    if (!cache.sidewalk) {
      cache.sidewalk = new THREE.MeshStandardMaterial({
        color: COLORS.sidewalk,
        roughness: 0.8,
        metalness: 0,
      });
    }
    return cache.sidewalk;
  },

  poolWater() {
    if (!cache.poolWater) {
      cache.poolWater = new THREE.MeshPhysicalMaterial({
        color: COLORS.poolWater,
        transparent: true,
        opacity: 0.6,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.5,
      });
    }
    return cache.poolWater;
  },

  carBody() {
    if (!cache.carBody) {
      cache.carBody = new THREE.MeshPhysicalMaterial({
        color: COLORS.carBody,
        roughness: 0.15,
        metalness: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
    }
    return cache.carBody;
  },

  emissiveScreen(color = 0x0088ff) {
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.3,
    });
  },

  roofTop() {
    if (!cache.roofTop) {
      cache.roofTop = new THREE.MeshStandardMaterial({
        color: COLORS.roofTop,
        roughness: 0.7,
        metalness: 0.2,
      });
    }
    return cache.roofTop;
  },

  gold() {
    if (!cache.gold) {
      cache.gold = new THREE.MeshStandardMaterial({
        color: COLORS.gold,
        roughness: 0.2,
        metalness: 0.9,
        emissive: COLORS.gold,
        emissiveIntensity: 0.1,
      });
    }
    return cache.gold;
  },

  neon(color) {
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 2,
      roughness: 0.3,
      metalness: 0.1,
    });
  },

  driveway() {
    if (!cache.driveway) {
      cache.driveway = new THREE.MeshStandardMaterial({
        color: COLORS.driveway,
        roughness: 0.75,
        metalness: 0,
      });
    }
    return cache.driveway;
  },

  fabric(color = 0x3a3a5a) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.95,
      metalness: 0,
    });
  },
};
