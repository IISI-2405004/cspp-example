import { CustomSelect } from "./select.js";
import {
  changePage,
  toggleEditMode,
  updateCheckAllState,
  toggleCheckboxState,
  handleDeleteModal,
} from "./table.js";
import { getBaseUrl } from "./utils.js";

function handleBeforeCloseModal() {
  const modal = document.getElementById("checkModal");
  const editModal = document.getElementById("editSingleModal");
  modal.classList.add("open");

  modal.querySelector(".overlay").addEventListener("click", () => {
    modal.classList.remove("open");
  });

  document.getElementById("closeCheckModal").addEventListener("click", () => {
    modal.classList.remove("open");
  });

  document.getElementById("cancelCheckBtn").addEventListener("click", () => {
    modal.classList.remove("open");
  });

  document.getElementById("submitCheckBtn").addEventListener("click", () => {
    modal.classList.remove("open");
    editModal.classList.remove("open");
  });
}

function handleSingleEditModal(ids) {
  const modal = document.getElementById("editSingleModal");
  modal.classList.add("open");

  modal.querySelector(".overlay").addEventListener("click", () => {
    handleBeforeCloseModal();
  });

  document.getElementById("closeSingleModal").addEventListener("click", () => {
    handleBeforeCloseModal();
  });

  document
    .getElementById("cancelEditSingleBtn")
    .addEventListener("click", () => {
      handleBeforeCloseModal();
    });

  document
    .getElementById("submitEditSingleBtn")
    .addEventListener("click", () => {
      modal.classList.remove("open");
    });
}

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = getBaseUrl() + "/create.html";
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

// 編輯按鈕兩種模式
// 1. 單頁面
const editBtnSinglePage = document.getElementById("editId0001");
editBtnSinglePage.addEventListener("click", () => {
  window.location.href = getBaseUrl() + "/edit.html";
});

// 2. 彈跳視窗
const editBtnModalPage = document.getElementById("editId0002");
editBtnModalPage.addEventListener("click", () => {
  handleSingleEditModal();
});
