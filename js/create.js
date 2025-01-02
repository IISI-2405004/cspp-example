import { CustomSelect } from "./select.js";
import { showResult, getBaseUrl, convertToStatusHTML } from "./utils.js";

function saveChange() {
  showResult("成功儲存", "即將跳轉到列表...", "success");
  setTimeout(() => {
    window.location.href = getBaseUrl();
  }, 1.5 * 1000);
}

function handleCheckModal() {
  const modal = document.getElementById("checkModal");
  modal.classList.add("open");

  document.getElementById("submitCheckBtn").addEventListener("click", () => {
    modal.classList.remove("open");
    window.location.href = getBaseUrl();
  });

  document.getElementById("cancelCheckBtn").addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = getBaseUrl();
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get("tab");
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((t) => {
    if (t.dataset.tab === tab) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });

  tabContents.forEach((tc) => {
    if (tc.dataset.tab === tab) {
      tc.classList.add("active");
    } else {
      tc.classList.remove("active");
    }
  });

  const submitBtn = document.getElementById("submitCreateBtn");
  const submitBtn2 = document.getElementById("submitCreateBtn2");
  const cancelCreateBtn = document.getElementById("cancelCreateBtn");
  const cancelCreateBtn2 = document.getElementById("cancelCreateBtn2");
  const clearBtn = document.getElementById("clearBtn");

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveChange();
    });
  }
  if (submitBtn2) {
    submitBtn2.addEventListener("click", (e) => {
      e.preventDefault();
      saveChange();
    });
  }

  if (cancelCreateBtn) {
    cancelCreateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleCheckModal();
    });
  }

  if (cancelCreateBtn2) {
    cancelCreateBtn2.addEventListener("click", (e) => {
      e.preventDefault();
      handleCheckModal();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }

  if (document.getElementById("selectLevelTrigger")) {
    new CustomSelect("selectLevelTrigger", "dropdownLevelPanel", (text) => {
      const select = document.getElementById("selectLevelTrigger");
      select.querySelector(".select-trigger-text").innerHTML =
        convertToStatusHTML(text);
      select.dataset.value = text;
    });
  }

  if (document.getElementById("selectTypeTrigger")) {
    new CustomSelect("selectTypeTrigger", "dropdownTypePanel", (text) => {
      const select = document.getElementById("selectTypeTrigger");
      select.querySelector(".select-trigger-text").innerHTML =
        convertToStatusHTML(text);
      select.dataset.value = text;
    });
  }
});
