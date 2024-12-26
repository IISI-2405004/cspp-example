import { CustomSelect } from "./select.js";
import {
  changePage,
  toggleEditMode,
  updateCheckAllState,
  toggleCheckboxState,
  handleDeleteModal,
} from "./table.js";

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = "create.html";
});

new CustomSelect("selectTrigger", "dropdownPanel", (text) => {
  pageSize = text;
  currentPage = 1;
  const triggerText = document.getElementById("selectTrigger");
  triggerText.querySelector(".select-trigger-text").textContent =
    text + "筆 / 頁";
  renderTable();
});

const prevBtn = document.getElementById("toPrevBtn");
const nextBtn = document.getElementById("toNextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    const page = currentPage - 1;
    changePage(page);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < Math.ceil(data.length / pageSize)) {
    const page = currentPage + 1;
    changePage(page);
  }
});

document.querySelectorAll(".pagination-item").forEach((item, index) => {
  item.addEventListener("click", () => changePage(index + 1));
});

document.getElementById("tableBody").addEventListener("click", (e) => {
  const target = e.target;
  if (target.dataset.action === "delete") handleDeleteModal(target.dataset.id);
});

document.getElementById("checkAll").addEventListener("change", (e) => {
  toggleCheckboxState(
    document.querySelectorAll(".row-check"),
    e.target.checked
  );
  updateCheckAllState("checkAll", ".row-check");
});

document.getElementById("tableBody").addEventListener("change", (e) => {
  if (e.target.classList.contains("row-check")) {
    updateCheckAllState("checkAll", ".row-check");
  }
});

document.getElementById("editBtn").addEventListener("click", toggleEditMode);

document.getElementById("multiDeleteBtn").addEventListener("click", () => {
  const checkedItems = Array.from(document.querySelectorAll(".row-check"))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.parentNode.nextElementSibling.textContent);
  handleDeleteModal(checkedItems.join(","));
});
