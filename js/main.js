import { CustomSelect } from "./select.js";
import {
  changePage,
  changePageSize,
  renderTable,
  toggleEditMode,
  updateCheckAllState,
  toggleCheckboxState,
  handleDeleteModal,
} from "./table.js";
import { getBaseUrl } from "./utils.js";

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = getBaseUrl() + "/create.html";
});

renderTable();

new CustomSelect("selectTrigger", "dropdownPanel", (text) => {
  const triggerText = document.getElementById("selectTrigger");
  triggerText.querySelector(".select-trigger-text").textContent =
    text + "筆 / 頁";
  changePageSize(text);
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
