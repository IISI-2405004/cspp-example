export function showToast(message, type, duration = 2000) {
  const toast = document.createElement("div");
  toast.className = `toast-message show ${type} closeable`;
  toast.innerHTML = `<span class="toast-content">${message}</span><i class="close-btn fa-solid fa-xmark"></i>`;
  document.body.appendChild(toast);

  const closeBtn = toast.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    toast.remove();
  });

  if (!toast) return;

  let timer = setTimeout(() => toast.remove(), duration);

  toast.addEventListener("mouseover", () => {
    clearTimeout(timer);
  });

  toast.addEventListener("mouseout", () => {
    timer = setTimeout(() => toast.remove(), duration);
  });
}
