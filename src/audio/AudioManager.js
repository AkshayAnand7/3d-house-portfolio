// ============================================
// Audio Manager — Room-based Music & Ambience
// ============================================

import { ROOMS, HOUSE } from '../config.js';

export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.initialized = false;
    this.masterGain = null;
    this.oscillators = {};
    this.currentRoom = null;
    this.volume = 0.15;
    
    // Room music configs (oscillator-based)
    this.roomConfigs = {
      livingRoom: { type: 'sine', freq: 220, detune: 5, label: 'Lo-fi Ambient' },
      kitchen: { type: 'triangle', freq: 330, detune: 3, label: 'Soft Melody' },
      office: { type: 'sawtooth', freq: 110, detune: 8, label: 'Electronic' },
      garage: { type: 'sine', freq: 165, detune: 2, label: 'Ambient' },
      masterBedroom: { type: 'sine', freq: 196, detune: 4, label: 'Calm' },
      gamingRoom: { type: 'sawtooth', freq: 146.8, detune: 10, label: 'Synthwave' },
      library: { type: 'sine', freq: 261.6, detune: 2, label: 'Peaceful' },
      balcony: { type: 'triangle', freq: 174.6, detune: 5, label: 'Cinematic' },
    };
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.audioCtx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not available:', e);
    }
  }

  update(playerX, playerY, playerZ) {
    if (!this.initialized) return;
    
    const halfW = HOUSE.width / 2;
    const halfD = HOUSE.depth / 2;
    const floorH = HOUSE.floorHeight;
    
    // Determine current room
    let room = 'exterior';
    
    if (Math.abs(playerX) < halfW && Math.abs(playerZ) < halfD) {
      const floor = playerY > floorH - 0.5 ? 1 : 0;
      
      if (floor === 0) {
        if (playerX < 0 && playerZ < 2) room = 'livingRoom';
        else if (playerX >= 0 && playerZ < 2) room = 'kitchen';
        else if (playerX < 0 && playerZ >= 2) room = 'office';
        else room = 'garage';
      } else {
        if (playerX < 0 && playerZ < 2) room = 'masterBedroom';
        else if (playerX >= 0 && playerZ < 2) room = 'gamingRoom';
        else if (playerX < 0 && playerZ >= 2) room = 'library';
        else room = 'balcony';
      }
    }
    
    // Update room name in HUD
    const roomLabel = room === 'exterior' ? 'EXTERIOR' :
      (ROOMS[room] ? ROOMS[room].label : room.toUpperCase());
    const hudRoom = document.getElementById('hud-room-name');
    if (hudRoom) hudRoom.textContent = roomLabel;
    
    // Switch music if room changed
    if (room !== this.currentRoom) {
      this.crossfade(room);
      this.currentRoom = room;
    }
  }

  crossfade(newRoom) {
    if (!this.initialized || !this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    const fadeTime = 1.0;
    
    // Fade out current
    this.masterGain.gain.linearRampToValueAtTime(0, now + fadeTime);
    
    // Stop old oscillators after fade
    setTimeout(() => {
      this.stopAll();
      
      // Start new room music if not exterior
      if (newRoom !== 'exterior' && this.roomConfigs[newRoom]) {
        this.startRoomMusic(newRoom);
      }
    }, fadeTime * 1000);
  }

  startRoomMusic(room) {
    if (!this.initialized || !this.audioCtx) return;
    
    const config = this.roomConfigs[room];
    if (!config) return;
    
    const now = this.audioCtx.currentTime;
    
    // Main oscillator
    const osc = this.audioCtx.createOscillator();
    osc.type = config.type;
    osc.frequency.value = config.freq;
    
    // LFO for subtle vibrato
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = config.detune;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);
    
    // Low-pass filter for warmth
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;
    
    osc.connect(filter);
    filter.connect(this.masterGain);
    
    osc.start(now);
    lfo.start(now);
    
    // Fade in
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 1);
    
    this.oscillators[room] = { osc, lfo, filter };
  }

  stopAll() {
    Object.values(this.oscillators).forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        lfo.stop();
      } catch (e) { /* already stopped */ }
    });
    this.oscillators = {};
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain) {
      this.masterGain.gain.value = v;
    }
  }

  dispose() {
    this.stopAll();
    if (this.audioCtx) this.audioCtx.close();
  }
}
