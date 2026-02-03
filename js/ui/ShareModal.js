import { $ } from './dom.js';
import { CONFIG } from '../config/config.js';
import { state } from '../state/SimulationState.js';
import { formatTime } from '../utils/time.js';
import { showToast } from './Toast.js';
import { generateShareImage } from '../rendering/ShareRenderer.js';

function generateShareUrl() {
  const params = new URLSearchParams({
    balls: CONFIG.maxBalls,
    size: CONFIG.ballRadius,
    cooldown: CONFIG.spawnCooldown,
    speed: CONFIG.initialSpeed,
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

function getShareData() {
  const elapsed = Date.now() - state.startTime - state.pausedTime;
  return {
    url: generateShareUrl(),
    balls: state.balls.length,
    collisions: state.collisionCount,
    maxSpeed: state.maxSpeedReached.toFixed(1),
    time: formatTime(elapsed),
    settings: `${CONFIG.maxBalls} balls, size ${CONFIG.ballRadius}`,
  };
}

export function showShareModal() {
  const data = getShareData();
  $('shareUrl').value = data.url;

  generateShareImage();

  $('shareStats').innerHTML = `
    <div class="stat-row"><span class="stat-label">Balls</span><span class="stat-value">${data.balls}</span></div>
    <div class="stat-row"><span class="stat-label">Total Collisions</span><span class="stat-value">${data.collisions}</span></div>
    <div class="stat-row"><span class="stat-label">Max Speed</span><span class="stat-value">${data.maxSpeed}</span></div>
    <div class="stat-row"><span class="stat-label">Time Elapsed</span><span class="stat-value">${data.time}</span></div>
    <div class="stat-row"><span class="stat-label">Settings</span><span class="stat-value">${data.settings}</span></div>
  `;

  const modal = $('shareModal');
  modal.classList.add('visible');

  const firstBtn = modal.querySelector('button');
  if (firstBtn) firstBtn.focus();
}

export function hideShareModal() {
  $('shareModal').classList.remove('visible');
}

function copyShareUrl() {
  const url = $('shareUrl').value;
  navigator.clipboard.writeText(url).then(() => {
    showToast('URL copied to clipboard!');
  }).catch(() => {
    $('shareUrl').select();
    document.execCommand('copy');
    showToast('URL copied to clipboard!');
  });
}

function downloadShareImage() {
  generateShareImage();
  const shareCanvas = $('shareCanvas');
  const link = document.createElement('a');
  link.download = `collision-spawner-${Date.now()}.png`;
  link.href = shareCanvas.toDataURL('image/png');
  link.click();
  showToast('Image saved!');
}

function copyAllStats() {
  const data = getShareData();
  const text = `Collision Spawner Results

Balls: ${data.balls}
Collisions: ${data.collisions}
Max Speed: ${data.maxSpeed}
Time: ${data.time}

Settings: ${data.settings}

Try it: ${data.url}`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Stats copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy');
  });
}

function trapFocus(e) {
  const modal = $('shareModal');
  if (!modal.classList.contains('visible')) return;

  const focusable = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function initShareModal() {
  $('shareBtn').addEventListener('click', showShareModal);
  $('copyUrlBtn').addEventListener('click', copyShareUrl);
  $('closeModalBtn').addEventListener('click', hideShareModal);
  $('downloadShareBtn').addEventListener('click', downloadShareImage);
  $('copyAllBtn').addEventListener('click', copyAllStats);
  $('shareModal').addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') hideShareModal();
  });

  document.addEventListener('keydown', trapFocus);
}
