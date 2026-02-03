let frames = [];
let visible = false;
let el = null;

export function initFpsCounter() {
  el = document.getElementById('fpsCounter');
}

export function updateFps() {
  if (!visible || !el) return;
  const now = performance.now();
  frames.push(now);
  while (frames.length > 0 && now - frames[0] > 1000) frames.shift();
  el.textContent = frames.length + ' FPS';
}

export function toggleFpsCounter() {
  visible = !visible;
  if (el) el.style.display = visible ? 'block' : 'none';
  if (!visible) frames = [];
}
