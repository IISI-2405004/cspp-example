import { showToast } from "./utils.js";

const data = [
  {
    id: 1,
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "IT",
    owner: "小明",
    submitDate: "2024-12-01",
    status: "pending",
  },
  {
    id: 2,
    title: "OOOOOOOOOOOOO",
    department: "HR",
    owner: "小紅",
    submitDate: "2024-12-02",
    status: "closed",
  },
  {
    id: 3,
    title: "OOOOOOOOOOOOOOOOOOOOOO",
    department: "財務",
    owner: "小王",
    submitDate: "2024-12-03",
    status: "reviewing",
  },
  {
    id: 4,
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "IT",
    owner: "小明",
    submitDate: "2024-12-04",
    status: "closed",
  },
  {
    id: 5,
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-05",
    status: "pending",
  },
  {
    id: 6,
    title: "OOOOOOOO",
    department: "財務",
    owner: "小王",
    submitDate: "2024-12-06",
    status: "recheck",
  },
  {
    id: 7,
    title: "OOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-07",
    status: "recheck",
  },
  {
    id: 8,
    title: "OOOOOOOO",
    department: "HR",
    owner: "小紅",
    submitDate: "2024-12-08",
    status: "closed",
  },
  {
    id: 9,
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-09",
    status: "pending",
  },
  {
    id: 10,
    title: "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    department: "IT",
    owner: "小明",
    submitDate: "2024-12-10",
    status: "closed",
  },
  {
    id: 11,
    title: "OOOOO",
    department: "財務",
    owner: "小王",
    submitDate: "2024-12-11",
    status: "pending",
  },
  {
    id: 12,
    title: "OOOOOOOOOOOO",
    department: "行銷",
    owner: "小李",
    submitDate: "2024-12-12",
    status: "closed",
  },
];

let currentPage = 1;
let recordsPerPage = 10;
const sortDirection = {
  id: 1,
  title: 1,
  department: 1,
  submitDate: 1,
  status: 1,
};

function toggleCheckboxState(checkboxes, state) {
  checkboxes.forEach((checkbox) => (checkbox.checked = state));
}

function updateCheckAllState(checkAllId, checkboxesClass) {
  const checkAll = document.getElementById(checkAllId);
  const checkboxes = Array.from(document.querySelectorAll(checkboxesClass));
  const totalChecked = checkboxes.filter((checkbox) => checkbox.checked).length;

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
}

function renderTable() {
  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
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
      <td>${item.title}</td>
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

function updatePaginationInfo() {
  document.getElementById("currentPage").textContent = currentPage;
  document.getElementById("totalRecords").textContent = data.length;
}

document.getElementById("tableBody").addEventListener("click", (e) => {
  const target = e.target;
  if (target.dataset.action === "review") reviewItem(target.dataset.id);
  if (target.dataset.action === "delete") deleteItem(target.dataset.id);
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

function reviewItem(id) {
  alert(`審查項目 ID: ${id}`);
}

function deleteItem(id) {
  if (confirm(`確定要刪除項目 ID: ${id}?`)) {
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index !== -1) {
      data.splice(index, 1);
      renderTable();
      showToast("刪除成功！");
    }
  }
}

renderTable();
