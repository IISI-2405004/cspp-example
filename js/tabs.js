const tabs = document.querySelectorAll(".tab-list .tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));

    contents.forEach((c) => c.classList.remove("active"));

    tab.classList.add("active");

    const targetId = tab.getAttribute("data-tab");
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add("active");
    }
  });
});
