import '@vonage/vivid/button';

const startBtn = document.getElementById('startBtn');
startBtn?.addEventListener('click', () => {
  const app = document.getElementById('app');
  app.innerHTML = '<p>Game booting…</p>';
});
