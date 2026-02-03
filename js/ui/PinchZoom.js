let wrapper = null;
let scale = 1;
let translateX = 0;
let translateY = 0;
let lastDistance = 0;
let lastCenter = { x: 0, y: 0 };
let pinching = false;
let lastPinchEnd = 0;

function dist(t1, t2) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function center(t1, t2) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
}

function onTouchStart(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    pinching = true;
    lastDistance = dist(e.touches[0], e.touches[1]);
    lastCenter = center(e.touches[0], e.touches[1]);
  }
}

function onTouchMove(e) {
  if (!pinching || e.touches.length < 2) return;
  e.preventDefault();

  const d = dist(e.touches[0], e.touches[1]);
  const c = center(e.touches[0], e.touches[1]);

  const scaleDelta = d / lastDistance;
  scale = Math.max(1, Math.min(5, scale * scaleDelta));

  translateX += c.x - lastCenter.x;
  translateY += c.y - lastCenter.y;

  lastDistance = d;
  lastCenter = c;

  clamp();
  apply();
}

function onTouchEnd(e) {
  if (e.touches.length < 2 && pinching) {
    pinching = false;
    lastPinchEnd = Date.now();

    if (scale < 1.05) {
      scale = 1;
      translateX = 0;
      translateY = 0;
      apply();
    }
  }
}

function clamp() {
  if (scale <= 1) {
    translateX = 0;
    translateY = 0;
    return;
  }
  const maxPan = (scale - 1) * (wrapper ? wrapper.offsetWidth : 300) / 2;
  translateX = Math.max(-maxPan, Math.min(maxPan, translateX));
  translateY = Math.max(-maxPan, Math.min(maxPan, translateY));
}

function apply() {
  if (!wrapper) return;
  if (scale <= 1) {
    wrapper.style.transform = '';
  } else {
    wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }
}

export function initPinchZoom(canvasWrapper) {
  wrapper = canvasWrapper;
  wrapper.addEventListener('touchstart', onTouchStart, { passive: false });
  wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
  wrapper.addEventListener('touchend', onTouchEnd);
}

export function destroyPinchZoom() {
  if (wrapper) {
    wrapper.style.transform = '';
    wrapper.removeEventListener('touchstart', onTouchStart);
    wrapper.removeEventListener('touchmove', onTouchMove);
    wrapper.removeEventListener('touchend', onTouchEnd);
  }
  wrapper = null;
  scale = 1;
  translateX = 0;
  translateY = 0;
}

export function wasPinchRecent() {
  return Date.now() - lastPinchEnd < 350;
}

export function getZoomScale() {
  return scale;
}
