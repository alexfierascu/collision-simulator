const CACHE_VERSION = 'v1';
const CACHE_NAME = `collision-spawner-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/css/styles.css',
  '/manifest.json',
  '/assets/favicon.svg',
  '/assets/favicon-32x32.png',
  '/assets/favicon-16x16.png',
  '/assets/apple-touch-icon.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/js/main.js',
  '/js/config/config.js',
  '/js/config/constants.js',
  '/js/config/colorThemes.js',
  '/js/config/formFields.js',
  '/js/entities/Ball.js',
  '/js/state/SimulationState.js',
  '/js/state/SelectionState.js',
  '/js/state/ThemeState.js',
  '/js/state/TimeState.js',
  '/js/physics/SpatialGrid.js',
  '/js/physics/boundaryStrategies.js',
  '/js/physics/collisions.js',
  '/js/physics/forces.js',
  '/js/physics/spawner.js',
  '/js/simulation/SimulationLoop.js',
  '/js/simulation/KeyboardHandler.js',
  '/js/rendering/BallRenderer.js',
  '/js/rendering/GraphRenderer.js',
  '/js/rendering/ScreenshotRenderer.js',
  '/js/rendering/SelectionRenderer.js',
  '/js/rendering/ShareRenderer.js',
  '/js/rendering/SimulationRenderer.js',
  '/js/rendering/StarfieldRenderer.js',
  '/js/recording/RecordingController.js',
  '/js/recording/RecordingState.js',
  '/js/achievements/Achievements.js',
  '/js/audio/AudioManager.js',
  '/js/audio/audioHelpers.js',
  '/js/audio/noiseGenerator.js',
  '/js/audio/styles/index.js',
  '/js/audio/styles/deepSpace.js',
  '/js/audio/styles/cosmicDrift.js',
  '/js/audio/styles/nebulaWaves.js',
  '/js/audio/styles/blackHoleEcho.js',
  '/js/audio/styles/starPulse.js',
  '/js/audio/styles/solarFlare.js',
  '/js/audio/styles/quantumRush.js',
  '/js/audio/styles/supernovaBreak.js',
  '/js/audio/styles/gridRunner.js',
  '/js/audio/styles/neonCircuit.js',
  '/js/audio/styles/dataStream.js',
  '/js/audio/styles/ionStorm.js',
  '/js/ui/dom.js',
  '/js/ui/Toast.js',
  '/js/ui/WizardController.js',
  '/js/ui/ControlsController.js',
  '/js/ui/AudioControls.js',
  '/js/ui/ShareModal.js',
  '/js/ui/SaveLoadController.js',
  '/js/ui/BallTooltip.js',
  '/js/ui/PinchZoom.js',
  '/js/ui/FpsCounter.js',
  '/js/ui/ModeIndicator.js',
  '/js/ui/Walkthrough.js',
  '/js/utils/math.js',
  '/js/utils/color.js',
  '/js/utils/time.js',
  '/js/utils/errorHandler.js',
];

// Install: precache app shell and all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: purge outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}