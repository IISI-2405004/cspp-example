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

function generateIconHTML(type) {
  switch (type) {
    case "success":
      return '<i class="icon-result fa-solid fa-circle-check"></i>';
    case "error":
      return '<i class="icon-result fa-solid fa-circle-xmark"></i>';
    case "warning":
      return '<i class="icon-result fa-solid fa-circle-exclamation"></i>';
    default:
      return '<i class="icon-result fa-solid fa-circle-info"></i>';
  }
}

export function showResult(title, message, type, duration = 2000) {
  const result = document.createElement("div");
  result.className = `result-message show `;
  const icon = generateIconHTML(type);
  result.innerHTML = `
    <div class="result-container ${type}">
      ${icon}
      <span class="result-title">${title}</span>
      <span class="result-content">${message}</span>
    </div>
    <div class="overlay"></div>
      `;
  document.body.appendChild(result);

  setTimeout(() => result.remove(), duration);
}

export function convertToStatusHTML(status) {
  switch (status) {
    case "pending":
      return `<div class="status-wrapper"><i class="status-icon pending fa-solid fa-circle"></i><span>待審查</span></div>`;
    case "reviewing":
      return `<div class="status-wrapper"><i class="status-icon reviewing fa-solid fa-circle"></i><span>審查中</span></div>`;
    case "recheck":
      return `<div class="status-wrapper"><i class="status-icon recheck fa-solid fa-circle"></i><span>待複審</span></div>`;
    case "closed":
      return `<div class="status-wrapper"><i class="status-icon closed fa-solid fa-circle"></i><span>已結案</span></div>`;
    default:
      return "";
  }
}

export function getBaseUrl() {
  const basePath = window.location.origin.includes("github.io")
    ? window.location.origin + "/cspp-example" // GitHub Pages 路徑
    : window.location.origin; // 本地或其他環境的根路徑
  return basePath;
}
