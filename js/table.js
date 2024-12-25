import { showToast } from "./utils.js";
import { CustomSelect } from "./select.js";

let data = [
  {
    id: "0001",
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "IT",
    owner: "小明",
    submitDate: "2024-12-01",
    status: "pending",
  },
  {
    id: "0002",
    title: "OOOOOOOOOOOOO",
    department: "HR",
    owner: "小紅",
    submitDate: "2024-12-02",
    status: "closed",
  },
  {
    id: "0003",
    title: "OOOOOOOOOOOOOOOOOOOOOO",
    department: "財務",
    owner: "小王",
    submitDate: "2024-12-03",
    status: "reviewing",
  },
  {
    id: "0004",
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "IT",
    owner: "小明",
    submitDate: "2024-12-04",
    status: "closed",
  },
  {
    id: "0005",
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-05",
    status: "pending",
  },
  {
    id: "0006",
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "財務",
    owner: "小王",
    submitDate: "2024-12-06",
    status: "recheck",
  },
  {
    id: "0007",
    title: "OOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-07",
    status: "recheck",
  },
  {
    id: "0008",
    title: "OOOOOOOO",
    department: "HR",
    owner: "小紅",
    submitDate: "2024-12-08",
    status: "closed",
  },
  {
    id: "0009",
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-09",
    status: "pending",
  },
  {
    id: "0010",
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "IT",
    owner: "小明",
    submitDate: "2024-12-10",
    status: "closed",
  },
  {
    id: "0011",
    title: "OOOOO",
    department: "財務",
    owner: "小王",
    submitDate: "2024-12-11",
    status: "pending",
  },
  {
    id: "0012",
    title: "OOOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-12",
    status: "closed",
  },
];

let isEditMode = false;
let originalData = [];
let currentPage = 1;
let pageSize = document
  .querySelector("#selectTrigger .select-trigger-text")
  .textContent.split("筆")[0];

function toggleCheckboxState(checkboxes, state) {
  checkboxes.forEach((checkbox) => (checkbox.checked = state));
}

function updateCheckAllState(checkAllId, checkboxesClass) {
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

function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const tableData = data.slice(start, end);

  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = tableData.map(generateRowHTML).join("");
  updatePaginationInfo();
}

function convertToStatusHTML(status) {
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

function generateRowHTML(item) {
  return `
    <tr>
      <td class="custom-width"><input class="row-check" type="checkbox" data-value=${
        item.id
      } /></td>
      <td class="custom-width">${item.id}</td>
      <td><p>${item.title}</p></td>
      <td>${item.department}</td>
      <td>${item.submitDate}</td>
      <td>${convertToStatusHTML(item.status)}</td>
      <td class="custom-width">
        <div class="btn-group">
          <button class="btn btn-small secondary" data-action="review" data-id="${
            item.id
          }">審查</button>
          <button class="btn btn-small danger" data-action="delete" data-id="${
            item.id
          }">刪除</button>
        </div>
      </td>
    </tr>
  `;
}

function generatePaginationItemsHTML() {
  const wrapper = document.getElementById("paginationWrapper");
  const totalPage = Math.ceil(data.length / pageSize);
  const items = [];
  for (let i = 1; i <= totalPage; i++) {
    if (i === currentPage) {
      items.push(`<li class="pagination-item active">${i}</li>`);
    } else {
      items.push(`<li class="pagination-item">${i}</li>`);
    }
  }
  wrapper.innerHTML = items.join("");
}

function changePage(page) {
  const paginationItems = document.querySelectorAll(".pagination-item");
  paginationItems[currentPage - 1].classList.remove("active");
  paginationItems[page - 1].classList.add("active");
  currentPage = page;

  if (currentPage === 1) {
    document
      .getElementById("toPrevBtn")
      .attributes.setNamedItem(document.createAttribute("disabled"));
    document.getElementById("toNextBtn").attributes.removeNamedItem("disabled");
  } else if (currentPage === Math.ceil(data.length / pageSize)) {
    document
      .getElementById("toNextBtn")
      .attributes.setNamedItem(document.createAttribute("disabled"));
    document.getElementById("toPrevBtn").attributes.removeNamedItem("disabled");
  } else {
    document.getElementById("toPrevBtn").attributes.removeNamedItem("disabled");
    document.getElementById("toNextBtn").attributes.removeNamedItem("disabled");
  }
  renderTable();
}

function updatePaginationInfo() {
  document.getElementById("totalRecords").textContent = data.length;
}

function deleteItem(id) {
  const index = data.findIndex((item) => item.id === parseInt(id));
  if (index !== -1) {
    data.splice(index, 1);
    renderTable();
    showToast("刪除成功", "success");
  }
}

function handleDeleteModal(ids) {
  const modal = document.getElementById("deleteModal");
  const modalBody = modal.querySelector(".modal-body");
  const items = ids.split(",").join("、");
  modalBody.innerHTML = `<p>是否確定要刪除編號：${items}?</p>`;
  modal.classList.add("open");

  document.getElementById("submitDeleteBtn").addEventListener("click", () => {
    deleteItem(id);
    modal.classList.remove("open");
  });

  document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

// 切換編輯模式
function toggleEditMode() {
  const editBtn = document.getElementById("editBtn");
  const confirmBtn = document.createElement("button");
  const cancelBtn = document.createElement("button");

  confirmBtn.className = "btn btn-small primary";
  confirmBtn.id = "submitEditModeBtn";
  confirmBtn.innerText = "確認";
  cancelBtn.className = "btn btn-small secondary";
  cancelBtn.id = "cancelEditModeBtn";
  cancelBtn.innerText = "取消";

  const parent = editBtn.parentNode;
  editBtn.classList.add("hidden");
  parent.prepend(confirmBtn);
  parent.prepend(cancelBtn);

  originalData = JSON.parse(JSON.stringify(data)); // 複製原始資料
  document
    .getElementById("multiDeleteBtn")
    .attributes.setNamedItem(document.createAttribute("disabled"));
  isEditMode = true;

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
  document.getElementById("checkAll").attributes.removeNamedItem("disabled");
  editBtn.classList.remove("hidden");
  document.getElementById("submitEditModeBtn").remove();
  document.getElementById("cancelEditModeBtn").remove();
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
      <td class="custom-width">
        <input class="row-check" type="checkbox" data-value="${item.id}" ${
    isChecked ? "checked" : ""
  } disabled />
      </td>
      <td class="custom-width">${item.id}</td>
      <td>
        ${
          isChecked
            ? `<input type="text" value="${item.title}" data-id="${item.id}" data-field="title" />`
            : `<p>${item.title}</p>`
        }
      </td>
      <td>${item.department}</td>
      <td>${item.submitDate}</td>
      <td>
        ${
          isChecked
            ? `
          <div class="select-trigger" id="selectStatusTrigger${
            item.id
          }" data-id="${item.id}" data-value="${
                item.status
              }" data-field="status">
            <span class="select-trigger-text">
              ${convertToStatusHTML(item.status)}
            </span>
            <i class="trigger-arrow fa-solid fa-chevron-down"></i>
          </div>
        `
            : convertToStatusHTML(item.status)
        }
      </td>
      <td class="custom-width">
        <div class="btn-group">
          <button class="btn btn-small secondary" data-action="review" data-id="${
            item.id
          }" disabled>審查</button>
          <button class="btn btn-small danger" data-action="delete" data-id="${
            item.id
          }" disabled>刪除</button>
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
    case "title":
      return "項目標題";
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
        `<p>編號：${change.id}，欄位：${convertToColumnTitle(
          change.field
        )}，從「${change.oldValue}」改為「${change.newValue}」</p>`
    )
    .join("");

  modalBody.innerHTML = `
    <p>再次確認您變更的內容：</p>
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

generatePaginationItemsHTML();
renderTable();

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
