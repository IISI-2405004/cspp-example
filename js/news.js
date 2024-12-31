import { CustomSelect } from "./select.js";
import { newsData } from "./mockData.js";

let data = [...newsData];
let currentPage = 1;
let pageSize = 10;

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
      });
    } else {
      item.addEventListener("click", () => {
        changePage(Number(item.textContent));
      });
    }
  });
}

function initPagination() {
  generatePaginationItemsHTML();

  const prevBtn = document.getElementById("toPrevBtn");
  const nextBtn = document.getElementById("toNextBtn");

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPage = Math.ceil(data.length / pageSize);
    if (currentPage < totalPage) {
      changePage(currentPage + 1);
    }
  });
}

function changePage(page) {
  currentPage = page;
  renderList();
}

function changePageSize(size) {
  pageSize = +size;
  currentPage = 1;
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
