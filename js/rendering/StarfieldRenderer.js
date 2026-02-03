import { isLight } from '../state/ThemeState.js';

const LAYER_COUNT = 3;
const STARS_PER_LAYER = [80, 50, 30];
const LAYER_SPEEDS = [0.15, 0.3, 0.6];
const LAYER_SIZES = [1, 1.5, 2.5];
const LAYER_OPACITIES = [0.4, 0.6, 0.9];

let canvas = null;
let ctx = null;
let layers = [];
let animationId = null;
let width = 0;
let height = 0;

function createStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
  return stars;
}

export function initStarfield(wrapper, canvasSize) {
  destroyStarfield();

  width = canvasSize;
  height = canvasSize;

  canvas = document.createElement('canvas');
  canvas.className = 'starfield-canvas';
  canvas.width = width;
  canvas.height = height;
  wrapper.insertBefore(canvas, wrapper.firstChild);

  ctx = canvas.getContext('2d');

  layers = [];
  for (let i = 0; i < LAYER_COUNT; i++) {
    layers.push(createStars(STARS_PER_LAYER[i]));
  }

  animateStarfield();
}

function animateStarfield() {
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  const light = isLight();
  const now = Date.now() * 0.001;

  for (let l = 0; l < LAYER_COUNT; l++) {
    const stars = layers[l];
    const speed = LAYER_SPEEDS[l];
    const size = LAYER_SIZES[l];
    const baseOpacity = LAYER_OPACITIES[l];

    for (const star of stars) {
      star.y += speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }

      const twinkle = (Math.sin(now * 2 + star.twinkle) + 1) * 0.5;
      const alpha = baseOpacity * (0.5 + twinkle * 0.5);

      ctx.beginPath();
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fillStyle = light
        ? `rgba(80, 80, 120, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
  }

  animationId = requestAnimationFrame(animateStarfield);
}

export function destroyStarfield() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }
  canvas = null;
  ctx = null;
  layers = [];
}

export function getStarfieldCanvas() {
  return canvas;
}
