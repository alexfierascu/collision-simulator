import { $ } from './dom.js';
import { FORM_FIELDS } from '../config/formFields.js';

const STORAGE_KEY = 'collisionSpawnerConfigs';

function readConfigs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function writeConfigs(configs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

function gatherFormValues() {
  const values = {};
  for (const id of FORM_FIELDS) {
    const el = $(id);
    values[id] = el ? el.value : '';
  }
  return values;
}

function applyFormValues(values) {
  for (const id of FORM_FIELDS) {
    const el = $(id);
    if (el && values[id] !== undefined) el.value = values[id];
  }
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

function renderList() {
  const container = $('savedConfigsList');
  if (!container) return;
  const configs = readConfigs();

  if (configs.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = configs.map((cfg, i) => `
    <div class="saved-config-item">
      <span class="config-name">${cfg.name}</span>
      <button type="button" class="load-config-btn" data-idx="${i}" aria-label="Load ${cfg.name}">Load</button>
      <button type="button" class="delete-config-btn secondary" data-idx="${i}" aria-label="Delete ${cfg.name}">&times;</button>
    </div>
  `).join('');
}

export function initSaveLoad() {
  const saveBtn = $('saveConfigBtn');
  const container = $('savedConfigsList');

  saveBtn.addEventListener('click', () => {
    const name = prompt('Configuration name:');
    if (!name) return;
    const configs = readConfigs();
    configs.push({ name, values: gatherFormValues() });
    writeConfigs(configs);
    renderList();
  });

  container.addEventListener('click', (e) => {
    const loadBtn = e.target.closest('.load-config-btn');
    const delBtn = e.target.closest('.delete-config-btn');

    if (loadBtn) {
      const configs = readConfigs();
      const cfg = configs[loadBtn.dataset.idx];
      if (cfg) applyFormValues(cfg.values);
    }

    if (delBtn) {
      const configs = readConfigs();
      configs.splice(delBtn.dataset.idx, 1);
      writeConfigs(configs);
      renderList();
    }
  });

  renderList();
}
