const DEBOUNCE_MS = 3000;
let lastErrorTime = 0;

function showErrorToast(message) {
  const now = Date.now();
  if (now - lastErrorTime < DEBOUNCE_MS) return;
  lastErrorTime = now;

  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast error visible';
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

export function initErrorHandler() {
  window.addEventListener('error', (e) => {
    showErrorToast('Something went wrong. Try refreshing.');
    e.preventDefault();
  });

  window.addEventListener('unhandledrejection', (e) => {
    showErrorToast('Something went wrong. Try refreshing.');
    e.preventDefault();
  });
}
