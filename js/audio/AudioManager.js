import { styleRegistry } from './styles/index.js';
import { trackAction } from '../achievements/Achievements.js';

let audioContext = null;
let masterGain = null;
let oscillators = [];
let musicPlaying = false;
let volume = 0.3;
let currentMusicStyle = 'deepSpace';

function initAudio() {
  if (audioContext) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.value = volume;
}

function stopMusic() {
  oscillators.forEach(osc => {
    try { osc.stop(); } catch (e) { /* already stopped */ }
  });
  oscillators = [];
}

function createMusicStyle(style) {
  stopMusic();
  const creator = styleRegistry[style];
  if (creator) {
    creator(audioContext, masterGain, oscillators, () => musicPlaying);
  }
}

export function toggleMusic(musicBtn, musicStyleSelect) {
  initAudio();

  if (musicPlaying) {
    stopMusic();
    musicPlaying = false;
    musicBtn.textContent = '🔇';
    musicBtn.classList.remove('active');
  } else {
    currentMusicStyle = musicStyleSelect.value;
    createMusicStyle(currentMusicStyle);
    musicPlaying = true;
    trackAction('music');
    musicBtn.textContent = '🔊';
    musicBtn.classList.add('active');
  }
}

export function changeMusicStyle(style) {
  if (musicPlaying) {
    currentMusicStyle = style;
    createMusicStyle(currentMusicStyle);
  }
}

export function setVolume(value) {
  volume = value / 100;
  if (masterGain) {
    masterGain.gain.value = volume;
  }
}

export function stopAndReset(musicBtn) {
  stopMusic();
  musicPlaying = false;
  if (musicBtn) {
    musicBtn.textContent = '🔇';
    musicBtn.classList.remove('active');
  }
}

export function isMusicPlaying() {
  return musicPlaying;
}
