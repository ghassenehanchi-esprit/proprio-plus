export default function sweetAlert(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `sweetalert-toast sweetalert-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translate(-50%, 0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translate(-50%, 100%)';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);
}
