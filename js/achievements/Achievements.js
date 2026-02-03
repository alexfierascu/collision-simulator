import { state } from '../state/SimulationState.js';
import { THEME_KEYS } from '../config/colorThemes.js';

const STORAGE_KEY = 'collision-spawner-achievements';
const CHECK_INTERVAL = 500;

const DEFS = [
  { id: 'first_collision',  icon: '💥', name: 'First Blood',    desc: 'Your first collision' },
  { id: 'collisions_100',   icon: '💯', name: 'Century',        desc: 'Reach 100 collisions' },
  { id: 'collisions_1000',  icon: '🏆', name: 'Millennium',     desc: 'Reach 1,000 collisions' },
  { id: 'speed_20',         icon: '⚡', name: 'Speed Demon',    desc: 'A ball exceeds speed 20' },
  { id: 'balls_50',         icon: '🎱', name: 'Crowded',        desc: '50 balls at once' },
  { id: 'balls_100',        icon: '🏠', name: 'Packed House',   desc: '100 balls at once' },
  { id: 'balls_200',        icon: '🐝', name: 'Swarm Lord',     desc: '200 balls at once' },
  { id: 'time_300',         icon: '⏱️', name: 'Marathon',       desc: 'Run for 5 minutes' },
  { id: 'rainbow',          icon: '🌈', name: 'Rainbow Road',   desc: 'Activate rainbow mode' },
  { id: 'explosion',        icon: '💣', name: 'Boom!',          desc: 'Use explosion mode' },
  { id: 'blackhole',        icon: '🕳️', name: 'Event Horizon', desc: 'Use black hole mode' },
  { id: 'screenshot',       icon: '📸', name: 'Photographer',   desc: 'Take a screenshot' },
  { id: 'record',           icon: '🎬', name: 'Director',       desc: 'Record a video' },
  { id: 'all_themes',       icon: '🎨', name: 'Fashionista',    desc: 'Try all 5 color themes' },
  { id: 'music',            icon: '🎵', name: 'DJ',             desc: 'Play some music' },
  { id: 'fullscreen',       icon: '🖥️', name: 'Immersed',      desc: 'Go fullscreen' },
];

let unlocked = new Set();
let actions = new Set();
let usedThemes = new Set(['neon']);
let lastCheck = 0;
let toastQueue = [];
let toastEl = null;
let modalEl = null;

// --- Persistence ---
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) unlocked = new Set(JSON.parse(raw));
  } catch (_) {}
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]));
  } catch (_) {}
}

// --- Core ---
function unlock(id) {
  if (unlocked.has(id)) return;
  unlocked.add(id);
  save();
  const def = DEFS.find(d => d.id === id);
  if (def) showAchievementToast(def);
}

export function trackAction(action) {
  actions.add(action);
}

export function trackThemeUsed(theme) {
  usedThemes.add(theme);
}

export function checkAchievements() {
  const now = Date.now();
  if (now - lastCheck < CHECK_INTERVAL) return;
  lastCheck = now;

  const { balls, collisionCount, maxSpeedReached, rainbowMode, explosionMode, blackholeMode, startTime, pausedTime } = state;
  const elapsed = now - startTime - pausedTime;

  if (collisionCount >= 1) unlock('first_collision');
  if (collisionCount >= 100) unlock('collisions_100');
  if (collisionCount >= 1000) unlock('collisions_1000');
  if (maxSpeedReached >= 20) unlock('speed_20');
  if (balls.length >= 50) unlock('balls_50');
  if (balls.length >= 100) unlock('balls_100');
  if (balls.length >= 200) unlock('balls_200');
  if (elapsed >= 300000) unlock('time_300');
  if (rainbowMode) unlock('rainbow');
  if (explosionMode) unlock('explosion');
  if (blackholeMode) unlock('blackhole');
  if (actions.has('screenshot')) unlock('screenshot');
  if (actions.has('record')) unlock('record');
  if (actions.has('music')) unlock('music');
  if (actions.has('fullscreen')) unlock('fullscreen');
  if (usedThemes.size >= THEME_KEYS.length) unlock('all_themes');
}

// --- Toast ---
function showAchievementToast(def) {
  toastQueue.push(def);
  if (toastQueue.length === 1) drainToastQueue();
}

function drainToastQueue() {
  if (toastQueue.length === 0) return;
  const def = toastQueue[0];

  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'achievement-toast';
    document.body.appendChild(toastEl);
  }

  toastEl.innerHTML = `<span class="achievement-toast-icon">${def.icon}</span><div><strong>${def.name}</strong><small>${def.desc}</small></div>`;
  toastEl.classList.add('visible');

  setTimeout(() => {
    toastEl.classList.remove('visible');
    setTimeout(() => {
      toastQueue.shift();
      drainToastQueue();
    }, 400);
  }, 2500);
}

// --- Modal ---
export function showAchievementsModal() {
  if (modalEl) { hideAchievementsModal(); return; }

  modalEl = document.createElement('div');
  modalEl.className = 'achievement-modal-overlay';
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) hideAchievementsModal();
  });

  const count = unlocked.size;
  const total = DEFS.length;

  let grid = '';
  for (const def of DEFS) {
    const got = unlocked.has(def.id);
    grid += `<div class="achievement-card${got ? ' unlocked' : ''}">
      <span class="achievement-card-icon">${got ? def.icon : '🔒'}</span>
      <strong>${def.name}</strong>
      <small>${def.desc}</small>
    </div>`;
  }

  modalEl.innerHTML = `<div class="achievement-modal">
    <h2>Achievements <span class="achievement-count">${count}/${total}</span></h2>
    <div class="achievement-grid">${grid}</div>
    <button class="wt-btn primary achievement-close" style="margin-top:12px">Close</button>
  </div>`;

  document.body.appendChild(modalEl);
  modalEl.querySelector('.achievement-close').addEventListener('click', hideAchievementsModal);

  requestAnimationFrame(() => modalEl.classList.add('visible'));
}

export function hideAchievementsModal() {
  if (!modalEl) return;
  modalEl.classList.remove('visible');
  setTimeout(() => {
    if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
  }, 300);
}

export function getUnlockedCount() {
  return unlocked.size;
}

export function getTotalCount() {
  return DEFS.length;
}

// Init
load();
