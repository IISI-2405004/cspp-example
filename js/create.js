import { CustomSelect } from "./select.js";
import { convertToStatusHTML } from "./table.js";
import { showResult } from "./utils.js";

function saveChange() {
  showResult("成功儲存", "即將跳轉到列表...", "success");
  setTimeout(() => {
    window.location.href = "/index.html";
  }, 1.5 * 1000);
}

function handleCheckModal(ids) {
  const modal = document.getElementById("checkModal");
  modal.classList.add("open");

  document.getElementById("submitCheckBtn").addEventListener("click", () => {
    modal.classList.remove("open");
    window.location.href = "/index.html";
  });

  document.getElementById("cancelCheckBtn").addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/index.html";
});

new CustomSelect("selectTrigger", "dropdownStatusPanel", (text) => {
  const select = document.getElementById(`selectStatusTrigger${item.id}`);
  select.querySelector(".select-trigger-text").innerHTML =
    convertToStatusHTML(text);
  select.dataset.value = text;
});

const submitBtn = document.getElementById("submitCreateBtn");
const cancelCreateBtn = document.getElementById("cancelCreateBtn");

cancelCreateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleCheckModal();
});

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  saveChange();
});
