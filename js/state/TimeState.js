let timeScale = 1;

export function getTimeScale() {
  return timeScale;
}

export function setTimeScale(val) {
  timeScale = Math.max(0.25, Math.min(3, Math.round(val * 4) / 4));
}

export function nudgeTimeScale(delta) {
  setTimeScale(timeScale + delta);
  return timeScale;
}

export function resetTimeScale() {
  timeScale = 1;
}
