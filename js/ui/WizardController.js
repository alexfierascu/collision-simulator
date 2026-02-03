import { $ } from './dom.js';
import { PRESETS } from '../config/constants.js';
import { FORM_FIELDS } from '../config/formFields.js';

const SPINNER_UP_SVG = '<svg viewBox="0 0 10 10"><path d="M5 3L9 7H1L5 3Z"/></svg>';
const SPINNER_DOWN_SVG = '<svg viewBox="0 0 10 10"><path d="M5 7L1 3H9L5 7Z"/></svg>';

// Spinners only for numeric inputs (exclude boundaryShape select)
const SPINNER_FIELDS = FORM_FIELDS.filter(id => id !== 'boundaryShape');

function createSpinnerButtons(inputId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'spinner-btns';

  ['up', 'down'].forEach(dir => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'spinner-btn';
    btn.dataset.dir = dir;
    btn.dataset.input = inputId;
    btn.innerHTML = dir === 'up' ? SPINNER_UP_SVG : SPINNER_DOWN_SVG;
    wrapper.appendChild(btn);
  });

  return wrapper;
}

export function initWizard(onStart) {
  const form = $('wizard').querySelector('.wizard-form');

  // Generate spinner buttons for each numeric input
  SPINNER_FIELDS.forEach(id => {
    const input = $(id);
    if (!input) return;
    const inputWrapper = input.closest('.input-wrapper');
    if (!inputWrapper) return;
    const existing = inputWrapper.querySelector('.spinner-btns');
    if (existing) existing.remove();
    inputWrapper.appendChild(createSpinnerButtons(id));
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const p = PRESETS[btn.dataset.preset];
      $('maxBalls').value = p.maxBalls;
      $('ballSize').value = p.ballSize;
      $('spawnRate').value = p.spawnRate;
      $('initialSpeed').value = p.initialSpeed;
      $('maxSpeedInput').value = p.maxSpeed;
      $('minSpeedInput').value = p.minSpeed;
      $('repulsionInput').value = p.repulsionMultiplier;
      $('boundaryBoostInput').value = p.boundaryBoost;
      $('boundaryShape').value = p.boundaryShape;
    });
  });

  // Spinner button delegation
  form.addEventListener('click', (e) => {
    const spinnerBtn = e.target.closest('.spinner-btn');
    if (!spinnerBtn) return;

    const input = $(spinnerBtn.dataset.input);
    const step = parseFloat(input.step) || 1;
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    let value = parseFloat(input.value) || 0;

    value = spinnerBtn.dataset.dir === 'up'
      ? Math.min(max, value + step)
      : Math.max(min, value - step);

    // Round to step precision to avoid float drift
    const decimals = (input.step || '1').split('.')[1];
    input.value = decimals ? value.toFixed(decimals.length) : value;

    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  });

  // Clear preset when manually editing any input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    });
  });

  // Advanced toggle
  const advToggle = $('advancedToggle');
  const advPanel = $('advancedSettings');
  advToggle.addEventListener('click', () => {
    const open = advPanel.style.display !== 'none';
    advPanel.style.display = open ? 'none' : 'flex';
    advToggle.classList.toggle('active', !open);
  });

  // Start button
  $('startBtn').addEventListener('click', onStart);
}

export function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) return;

  const rules = [
    { key: 'balls',    id: 'maxBalls',     min: 10,  max: 500 },
    { key: 'size',     id: 'ballSize',     min: 3,   max: 15 },
    { key: 'cooldown', id: 'spawnRate',    min: 50,  max: 1000 },
    { key: 'speed',    id: 'initialSpeed', min: 1,   max: 15 },
  ];

  for (const { key, id, min, max } of rules) {
    if (!params.has(key)) continue;
    const v = parseInt(params.get(key), 10);
    if (!isNaN(v)) $(id).value = Math.max(min, Math.min(max, v));
  }

  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}
