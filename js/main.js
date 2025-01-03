import { CustomSelect } from "./select.js";
import { showToast, getBaseUrl, convertToStatusHTML } from "./utils.js";
import { tableData } from "./mockData.js";

let data = [...tableData];

let isEditMode = false;
let originalData = [];
let currentPage = 1;
let pageSize = 10;

export function toggleCheckboxState(checkboxes, state) {
  checkboxes.forEach((checkbox) => (checkbox.checked = state));
}

export function updateCheckAllState(checkAllId, checkboxesClass) {
  const checkAll = document.getElementById(checkAllId);
  const checkboxes = Array.from(document.querySelectorAll(checkboxesClass));
  const totalChecked = checkboxes.filter((checkbox) => checkbox.checked).length;
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("multiDeleteBtn");

  if (totalChecked === 0) {
    checkAll.checked = false;
    checkAll.classList.remove("intermediate");
  } else if (totalChecked === checkboxes.length) {
    checkAll.checked = true;
    checkAll.classList.remove("intermediate");
  } else {
    checkAll.checked = false;
    checkAll.classList.add("intermediate");
  }

  // 多筆編輯、刪除按鈕狀態
  if (totalChecked > 0) {
    if (editBtn.hasAttribute("disabled")) {
      editBtn.attributes.removeNamedItem("disabled");
    }
    if (deleteBtn.hasAttribute("disabled")) {
      deleteBtn.attributes.removeNamedItem("disabled");
    }
  } else {
    if (editBtn) {
      editBtn.attributes.setNamedItem(document.createAttribute("disabled"));
    }
    deleteBtn.attributes.setNamedItem(document.createAttribute("disabled"));
  }
}

export function renderTable() {
  initPagination();

  const start = (currentPage - 1) * +pageSize;
  const end = start + +pageSize;

  const tableData = data.slice(start, end);

  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;
  tableBody.innerHTML = tableData.map(generateRowHTML).join("");
  updatePaginationInfo();

  // 編輯按鈕兩種模式
  // 1. 單頁面
  const editBtnSinglePage = document.getElementById(
    `editId${data[(currentPage - 1) * pageSize].id}`
  );
  editBtnSinglePage.addEventListener("click", () => {
    window.location.href = getBaseUrl() + "/edit.html";
  });

  // 2. 彈跳視窗
  const editBtnModalPage = document.getElementById(
    `editId${data[(currentPage - 1) * pageSize + 1].id}`
  );
  editBtnModalPage.addEventListener("click", () => {
    handleSingleEditModal();
  });
}

function generateRowHTML(item) {
  return `
    <tr>
      <td class="align-center">
        <input
          class="row-check"
          type="checkbox"
          data-value=${item.id}
          aria-label="選取"
        />
      </td>
      <td class="align-center">${item.id}</td>
      <td class="align-center">${item.submitDate}</td>
      <td><p>${item.ref}</p></td>
      <td><p>${item.organ}</p></td>
      <td>${convertToStatusHTML(item.status)}</td>
      <td class="align-center">
        <div class="btn-group">
          <button 
            id="editId${item.id}"
            class="btn btn-small primary"
            data-action="review"
            data-id="${item.id}"
            aria-label="編輯"
          >編輯</button>
          <button
            class="btn btn-small danger"
            data-action="delete"
            data-id="${item.id}"
            aria-label="刪除"
          >刪除</button>
        </div>
      </td>
    </tr>
  `;
}

function initJumpToPage() {
  const jumpInput = document.getElementById("jumpInput");

  // 在輸入框中按下 Enter 鍵時觸發跳轉
  jumpInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const page = parseInt(jumpInput.value, 10);

      if (
        !isNaN(page) &&
        page >= 1 &&
        page <= Math.ceil(data.length / pageSize)
      ) {
        changePage(page);
        jumpInput.value = page; // 清空輸入框
      } else {
        jumpInput.value = currentPage; // 顯示當前頁碼
      }
    }
  });

  jumpInput.addEventListener("blur", () => {
    jumpInput.value = currentPage; // 顯示當前頁碼
  });
}

function pagination(c, m) {
  const delta = 2; // 左右可見頁碼數量
  const range = [];
  const rangeWithDots = [];
  let l;

  // 完整範圍
  for (let i = 1; i <= m; i++) {
    if (i === 1 || i === m || (i >= c - delta && i <= c + delta)) {
      range.push(i);
    }
  }

  // 帶省略號的範圍
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

function generatePaginationItemsHTML() {
  const wrapper = document.getElementById("paginationWrapper");
  if (!wrapper) return;

  const totalPage = Math.ceil(data.length / pageSize);
  const items = [];
  const pageNumbers = pagination(currentPage, totalPage);

  // 遍歷生成分頁按鈕
  for (let i of pageNumbers) {
    if (i === "...") {
      items.push(
        `<li class="pagination-item ellipsis"><i class="fa-solid fa-ellipsis"></i></li>`
      );
    } else {
      items.push(
        `<li class="pagination-item ${
          i === currentPage ? "active" : ""
        }">${i}</li>`
      );
    }
  }

  wrapper.innerHTML = items.join("");

  document.querySelectorAll(".pagination-item").forEach((item) => {
    if (item.classList.contains("ellipsis")) {
      item.addEventListener("mouseenter", () => {
        const jumpTo =
          item.previousElementSibling &&
          parseInt(item.previousElementSibling.textContent) + 1;
        item.textContent = `${jumpTo}`;
      });

      item.addEventListener("mouseleave", () => {
        item.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
      });

      item.addEventListener("click", () => {
        const jumpTo =
          item.previousElementSibling &&
          parseInt(item.previousElementSibling.textContent) + 1;
        if (jumpTo) changePage(jumpTo);
        item.blur();
      });
    } else {
      item.addEventListener("click", () => {
        changePage(Number(item.textContent));
        item.blur();
      });
    }
  });
}

function initPagination() {
  generatePaginationItemsHTML();
  initJumpToPage();
}

export function changePageSize(size) {
  pageSize = +size;
  currentPage = 1;
  renderTable();
}

export function changePage(page) {
  const paginationItems = document.querySelectorAll(".pagination-item");
  paginationItems[currentPage - 1].classList.remove("active");
  paginationItems[page - 1].classList.add("active");
  currentPage = page;

  if (currentPage === 1) {
    document
      .getElementById("toPrevBtn")
      .attributes.setNamedItem(document.createAttribute("disabled"));
    if (document.getElementById("toNextBtn").hasAttribute("disabled")) {
      document
        .getElementById("toNextBtn")
        .attributes.removeNamedItem("disabled");
    }
  } else if (currentPage === Math.ceil(data.length / pageSize)) {
    document
      .getElementById("toNextBtn")
      .attributes.setNamedItem(document.createAttribute("disabled"));
    if (document.getElementById("toPrevBtn").hasAttribute("disabled")) {
      document
        .getElementById("toPrevBtn")
        .attributes.removeNamedItem("disabled");
    }
  } else {
    if (document.getElementById("toPrevBtn").hasAttribute("disabled")) {
      document
        .getElementById("toPrevBtn")
        .attributes.removeNamedItem("disabled");
    }
    if (document.getElementById("toNextBtn").hasAttribute("disabled")) {
      document
        .getElementById("toNextBtn")
        .attributes.removeNamedItem("disabled");
    }
  }

  document.getElementById("jumpInput").value = currentPage;
  renderTable();
}

function updatePaginationInfo() {
  document.getElementById("totalRecords").textContent = data.length;
}

function deleteItems(ids) {
  ids.split(",").forEach((id) => deleteSingleItem(id));
  renderTable();
  updateCheckAllState("checkAll", ".row-check");
  showToast("刪除成功", "success");
}

function deleteSingleItem(id) {
  const index = data.findIndex((item) => item.id === parseInt(id));
  if (index !== -1) {
    data.splice(index, 1);
  }
}

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

export function handleDeleteModal(ids) {
  const modal = document.getElementById("deleteModal");
  const modalBody = modal.querySelector(".modal-body");
  const items = ids.split(",").join("、");
  modalBody.innerHTML = `<p>是否確定要刪除編號：${items}?</p>`;
  modal.classList.add("open");

  document.getElementById("submitDeleteBtn").addEventListener("click", () => {
    deleteItems(ids);
    modal.classList.remove("open");
  });

  document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

// 切換編輯模式
export function toggleEditMode() {
  isEditMode = true;

  const editBtn = document.getElementById("editBtn");
  const multiDeleteBtn = document.getElementById("multiDeleteBtn");
  const confirmBtn = document.getElementById("submitEditModeBtn");
  const cancelBtn = document.getElementById("cancelEditModeBtn");

  editBtn.classList.add("hidden");
  multiDeleteBtn.classList.add("hidden");
  confirmBtn.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");

  originalData = JSON.parse(JSON.stringify(data)); // 複製原始資料

  renderEditableTable();

  confirmBtn.addEventListener("click", saveChanges);
  cancelBtn.addEventListener("click", () => {
    data = JSON.parse(JSON.stringify(originalData)); // 恢復原始資料
    closedEditMode();
  });
}

function closedEditMode() {
  isEditMode = false;
  const editBtn = document.getElementById("editBtn");
  const multiDeleteBtn = document.getElementById("multiDeleteBtn");
  const confirmBtn = document.getElementById("submitEditModeBtn");
  const cancelBtn = document.getElementById("cancelEditModeBtn");
  editBtn.classList.remove("hidden");
  multiDeleteBtn.classList.remove("hidden");
  confirmBtn.classList.add("hidden");
  cancelBtn.classList.add("hidden");

  if (document.getElementById("checkAll").hasAttribute("disabled")) {
    document.getElementById("checkAll").attributes.removeNamedItem("disabled");
  }

  renderTable();
  updateCheckAllState("checkAll", ".row-check");
}

// 渲染可編輯表格
function renderEditableTable() {
  const checkAll = document.getElementById("checkAll");
  const tableBody = document.getElementById("tableBody");
  const pageData = data.slice(currentPage - 1, pageSize);
  checkAll.attributes.setNamedItem(document.createAttribute("disabled"));
  tableBody.innerHTML = pageData
    .map((item) => generateEditableRowHTML(item))
    .join("");

  data.forEach((item) => {
    if (document.getElementById(`selectStatusTrigger${item.id}`)) {
      const panelId = `dropdownStatusPanel${item.id}`;
      const panelClone = document
        .getElementById("dropdownStatusPanel")
        .cloneNode(true);
      panelClone.id = panelId;
      document.body.appendChild(panelClone);

      new CustomSelect(`selectStatusTrigger${item.id}`, panelId, (text) => {
        const select = document.getElementById(`selectStatusTrigger${item.id}`);
        select.querySelector(".select-trigger-text").innerHTML =
          convertToStatusHTML(text);
        select.dataset.value = text;
        item.status = text;
      });
    }
  });
}

// 產生可編輯列的 HTML
function generateEditableRowHTML(item) {
  const isChecked = document.querySelector(
    `.row-check[data-value="${item.id}"]`
  )?.checked;

  return `
    <tr>
      <td class="align-center">
        <input class="row-check" type="checkbox" data-value="${item.id}" ${
    isChecked ? "checked" : ""
  } aria-label="選取" disabled />
      </td>
      <td class="align-center">${item.id}</td>
      <td class="align-center">
        ${
          isChecked
            ? `
          <div class="datepicker-input small">
            <span id="dateTime" class="text">${item.submitDate}</span>
            <i class="icon-calendar fa-solid fa-calendar-days"></i>
          </div>
        `
            : item.submitDate
        }
      </td>
      <td>
        ${
          isChecked
            ? `<input class="small" type="text" value="${item.ref}" data-id="${item.id}" data-field="ref" />`
            : `<p>${item.ref}</p>`
        }
      </td>
      <td>
        ${
          isChecked
            ? `<input class="small" type="text" value="${item.organ}" data-id="${item.id}" data-field="organ" />`
            : `<p>${item.organ}</p>`
        }
      </td>
       <td>
        ${
          isChecked
            ? `
          <div class="select-trigger small" id="selectStatusTrigger${
            item.id
          }" data-id="${item.id}" data-value="${
                item.status
              }" data-field="status">
            <div class="select-trigger-text">
              ${convertToStatusHTML(item.status)}
            </div>
            <i class="trigger-arrow fa-solid fa-chevron-down"></i>
          </div>
        `
            : convertToStatusHTML(item.status)
        }
      </td>
      <td class="align-center">
        <div class="btn-group">
          <button
            class="btn btn-small primary"
            data-action="review"
            data-id="${item.id}"
            aria-label="編輯"
            disabled
          >編輯</button>
          <button
            class="btn btn-small danger"
            data-action="delete"
            data-id="${item.id}"
            aria-label="刪除"
            disabled
          >刪除</button>
        </div>
      </td>
    </tr>
  `;
}

// 保存修改
function saveChanges() {
  const inputs = document.querySelectorAll(
    "input[data-id], .select-trigger[data-id]"
  );
  const changes = [];

  inputs.forEach((input) => {
    const id = input.dataset.id;
    const field = input.dataset.field;
    const value = input.value ?? input.dataset.value;

    const original = originalData.find((row) => row.id === id);
    if (original[field] !== value) {
      const target = data.find((row) => row.id === id);
      changes.push({ id, field, oldValue: original[field], newValue: value });
      target[field] = value; // 更新資料
    }
  });

  if (changes.length > 0) {
    showChangesModal(changes);
  } else {
    showToast("未檢測到任何變更", "warning");
  }
}

function convertToColumnTitle(field) {
  switch (field) {
    case "ref":
      return "核定文號";
    case "organ":
      return "機關名稱";
    case "status":
      return "狀態";
    default:
      return "";
  }
}

// 彈出變更內容的 Modal
function showChangesModal(changes) {
  const modal = document.getElementById("editModal");
  const modalBody = modal.querySelector(".modal-body");

  const changeList = changes
    .map(
      (change) =>
        `<p>序號：${change.id}，欄位：${convertToColumnTitle(
          change.field
        )}，從「${change.oldValue}」改為「${change.newValue}」</p>`
    )
    .join("");

  modalBody.innerHTML = `
    <p>再次確認您變更的內容：</p>
    <p>(資料沒有真的綁定，僅作為參考畫面)</p>
    ${changeList}
  `;
  modal.classList.add("open");

  const confirmBtn = modal.querySelector("#submitEditBtn");
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-small primary";
  editBtn.id = "editBtn";
  editBtn.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span>編輯</span>`;

  confirmBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    closedEditMode();
    showToast("修改成功", "success");
  });

  const cancelBtn = modal.querySelector("#cancelEditBtn");
  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = `${getBaseUrl()}/create.html?tab=create`;
});

document.getElementById("importBtn").addEventListener("click", () => {
  window.location.href = `${getBaseUrl()}/create.html?tab=import`;
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

document.getElementById("queryCollapseBtn").addEventListener("click", () => {
  const querySection = document.getElementById("querySection");
  querySection.classList.toggle("collapsed");
  if (querySection.classList.contains("collapsed")) {
    document.getElementById(
      "queryCollapseBtn"
    ).innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
  } else {
    document.getElementById(
      "queryCollapseBtn"
    ).innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
  }
});

const prevBtn = document.getElementById("toPrevBtn");
const nextBtn = document.getElementById("toNextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    const page = currentPage - 1;
    changePage(page);
  }
  prevBtn.blur();
});

nextBtn.addEventListener("click", () => {
  if (currentPage < Math.ceil(data.length / pageSize)) {
    const page = currentPage + 1;
    changePage(page);
  }

  nextBtn.blur();
});
