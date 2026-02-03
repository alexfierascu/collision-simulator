import { COLOR_THEMES, THEME_KEYS } from '../config/colorThemes.js';

let activeThemeKey = 'neon';
let lightMode = false;

export function getActiveThemeKey() {
  return activeThemeKey;
}

export function getActiveColors() {
  return COLOR_THEMES[activeThemeKey].colors;
}

export function getActiveAccents() {
  return COLOR_THEMES[activeThemeKey].accents;
}

export function setColorTheme(key) {
  if (COLOR_THEMES[key]) {
    activeThemeKey = key;
    applyAccentsToCSS();
  }
}

export function cycleColorTheme() {
  const idx = THEME_KEYS.indexOf(activeThemeKey);
  const next = THEME_KEYS[(idx + 1) % THEME_KEYS.length];
  setColorTheme(next);
  return next;
}

export function toggleLightMode() {
  lightMode = !lightMode;
  document.documentElement.setAttribute('data-theme', lightMode ? 'light' : 'dark');
  return lightMode;
}

export function isLight() {
  return lightMode;
}

export function getHighlightColor() {
  return lightMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)';
}

export function getCanvasBgColors() {
  if (lightMode) {
    return { inner: '#e8e8f0', outer: '#d0d0dc' };
  }
  return { inner: '#1a1a2e', outer: '#0a0a0f' };
}

export function getGraphBg() {
  return lightMode ? 'rgba(220, 220, 230, 0.9)' : 'rgba(10, 10, 15, 0.9)';
}

export function getGraphGrid() {
  return lightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
}

function applyAccentsToCSS() {
  const accents = COLOR_THEMES[activeThemeKey].accents;
  const root = document.documentElement;
  root.style.setProperty('--accent-cyan', accents.cyan);
  root.style.setProperty('--accent-magenta', accents.magenta);
  root.style.setProperty('--accent-yellow', accents.yellow);
  root.style.setProperty('--accent-green', accents.green);
}
