import { CustomSelect } from "./select.js";
import { newsData } from "./mockData.js";

let data = [...newsData];
let currentPage = 1;
let pageSize = 10;

function generatePaginationItemsHTML() {
  const wrapper = document.getElementById("paginationWrapper");
  if (!wrapper) return;

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

  document.querySelectorAll(".pagination-item").forEach((item, index) => {
    item.addEventListener("click", () => changePage(index + 1));
  });
}

function initPagination() {
  generatePaginationItemsHTML();
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
}

function changePageSize(size) {
  pageSize = +size;
  currentPage = 1;
  renderList();
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
  renderList();
}

function updatePaginationInfo() {
  document.getElementById("totalRecords").textContent = data.length;
}

function getTagType(type) {
  switch (type) {
    case "event":
      return "green";
    case "news":
      return "blue";
    default:
      return "";
  }
}

function getTypeTitle(type) {
  switch (type) {
    case "event":
      return "活動";
    case "news":
      return "新聞";
    case "announcement":
      return "公告";
    default:
      return "全部";
  }
}

function generateItemHTML(item) {
  return `
     <li class="news-item" data-id="${item.id}">
        <span class="date">${item.date}</span>
        <span class="tag ${getTagType(item.type)}">${getTypeTitle(
    item.type
  )}</span>
        <p class="content">${item.title}</p>
    </li>
    `;
}

function renderList() {
  initPagination();

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const list = data.slice(start, end);

  const listWrapper = document.getElementById("newsList");

  if (!listWrapper) return;

  const items = list.map(generateItemHTML);
  listWrapper.innerHTML = items.join("");

  updatePaginationInfo();
}

new CustomSelect("selectTrigger", "dropdownPanel", (text) => {
  const triggerText = document.getElementById("selectTrigger");
  triggerText.querySelector(".select-trigger-text").textContent =
    text + "筆 / 頁";
  changePageSize(text);
});

new CustomSelect("selectTypeTrigger", "dropdownTypePanel", (text) => {
  const triggerText = document.getElementById("selectTypeTrigger");
  triggerText.querySelector(".select-trigger-text").textContent =
    getTypeTitle(text);
});

renderList();
