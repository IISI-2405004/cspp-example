const selectTrigger = document.getElementById("selectTrigger");
const selectTriggerText = document.querySelector(
  "#selectTrigger .select-trigger-text"
);
const dropdownPanel = document.getElementById("dropdownPanel");
const options = dropdownPanel.querySelectorAll(".dropdown-option");

let isOpen = false;

selectTrigger.addEventListener("click", (e) => {
  isOpen = !isOpen;
  if (isOpen) {
    openDropdown();
  } else {
    closeDropdown();
  }
});

options.forEach((option) => {
  option.addEventListener("click", (e) => {
    const text = e.target.textContent;
    selectTriggerText.textContent = text + " / 頁";
    closeDropdown();
  });
});

document.addEventListener("click", (e) => {
  if (!selectTrigger.contains(e.target) && !dropdownPanel.contains(e.target)) {
    isOpen = false;
    closeDropdown();
  }
});

function openDropdown() {
  dropdownPanel.classList.add("open");

  const rect = selectTrigger.getBoundingClientRect();
  const panelRect = dropdownPanel.getBoundingClientRect();

  const desiredHeight = panelRect.height < 200 ? panelRect.height : 200; // 與 CSS 中的 max-height 對應
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  // 重設 style 避免前次狀態遺留
  dropdownPanel.style.top = "0px";
  dropdownPanel.style.bottom = "auto";

  dropdownPanel.style.left = rect.left + "px";
  dropdownPanel.style.width = rect.width + "px";

  if (spaceBelow < desiredHeight && spaceAbove > spaceBelow) {
    dropdownPanel.style.top = rect.top - desiredHeight + "px";
  } else {
    dropdownPanel.style.top = rect.bottom + "px";
  }
}

function closeDropdown() {
  dropdownPanel.classList.remove("open");
}
