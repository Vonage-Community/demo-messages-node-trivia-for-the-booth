import * as bootstrap from 'bootstrap';
const toast = document.querySelector('div.toast');
const toastText = toast.querySelector('div.toast-body');

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

window.onerror = (message) => alert(message);

const colorMap = {
  'danger': 'text-bg-danger',
  'success': 'text-bg-primary',
  'warn': 'text-bg-warning',
  'info': 'text-bg-info',
};

export const alert = (message, color = 'info') => {
  for (const color of Object.values(colorMap)) {
    toast.classList.remove(color);
  }

  toast.classList.add(colorMap[color]);
  toastText.innerHTML = message;
  toastBootstrap.show();
};

export const danger = (message) => alert(message, 'danger');
export const info = (message) => alert(message, 'info');
export const warn = (message) => alert(message, 'warn');
export const success = (message) => alert(message, 'success');

export const storeMessage = (message, color = 'info') => {
  window.sessionStorage.setItem('toastMessage', JSON.stringify({ message, color }));
};

document.addEventListener('DOMContentLoaded', () => {
  let toastMessage = sessionStorage.getItem('toastMessage');
  let toastColor;
  try {
    const { message, color } = JSON.parse(toastMessage);

    toastMessage = message;
    toastColor = color;
  } catch {
    // fall through
  }

  if (toastMessage) {
    alert(toastMessage, toastColor);
    sessionStorage.removeItem('toastMessage');
  }
});

window.alert = danger;
