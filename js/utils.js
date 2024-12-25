export function showToast(message, type, duration = 2000) {
  const toast = document.createElement("div");
  toast.className = `toast-message show ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}
