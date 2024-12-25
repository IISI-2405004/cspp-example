import { showToast } from "./utils.js";

const data = [
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

let currentPage = 1;
const pageSize = document
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
    editBtn.attributes.setNamedItem(document.createAttribute("disabled"));
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
      <td class="custom-width"><input class="row-check" type="checkbox" /></td>
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
    showToast("刪除成功");
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

generatePaginationItemsHTML();
renderTable();

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

document.getElementById("multiDeleteBtn").addEventListener("click", () => {
  const checkedItems = Array.from(document.querySelectorAll(".row-check"))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.parentNode.nextElementSibling.textContent);
  handleDeleteModal(checkedItems.join(","));
});
