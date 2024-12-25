const menuItems = [
  // {
  //     name: '資通安全業務入口網',
  //     enName: 'Cybersecurity Portal',
  //     icon: './images/logo-icon.png'
  // },
  {
    name: "使用機關管理",
    enName: "Agency Management",
    icon: "./images/agency_management.png",
  },
  {
    name: "資安人員管理",
    enName: "Personnel Management",
    icon: "./images/personnel_management.png",
    children: [
      {
        name: "第二層項目-1",
        enName: "Second Level-1",
      },
      {
        name: "第二層項目-2",
        enName: "Second Level-2",
        children: [
          {
            name: "第三層項目-1",
            enName: "Third Level-1",
          },
          {
            name: "第三層項目-2",
            enName: "Third Level-2",
          },
        ],
      },
    ],
  },
  {
    name: "資安履歷",
    enName: "Performance Evaluation",
    icon: "./images/performance_evaluation.png",
  },
  {
    name: "績效評核",
    enName: "Agency Management",
    icon: "./images/agency_management.png",
    children: [
      {
        name: "第二層項目-1",
        enName: "Second Level-1",
      },
      {
        name: "第二層項目-2",
        enName: "Second Level-2",
        children: [
          {
            name: "第三層項目-1",
            enName: "Third Level-1",
          },
          {
            name: "第三層項目-2",
            enName: "Third Level-2",
          },
        ],
      },
    ],
  },
  {
    name: "會議及活動報名",
    enName: "Meeting Registration",
    icon: "./images/meeting_registration.png",
  },
  {
    name: "資通安全維護計畫實施情形填報",
    enName: "Plan Reporting",
    icon: "./images/plan_reporting.png",
  },
  {
    name: "國家資通安全發展方案執行填報",
    enName: "Program Reporting",
    icon: "./images/program_reporting.png",
  },
  {
    name: "資通安全產品管理",
    enName: "Product Management",
    icon: "./images/product_management.png",
  },
  {
    name: "資安治理成熟度評估",
    enName: "Maturity Assessment",
    icon: "./images/maturity_assessment.png",
  },
  {
    name: "國家層級資安風險評估",
    enName: "Risk Assessment",
    icon: "./images/risk_assessment.png",
  },
  {
    name: "資料倉儲與數據戰情中心分析",
    enName: "Data Analysis",
    icon: "./images/data_analysis.png",
  },
  {
    name: "資料調查回復",
    enName: "Data Response",
    icon: "./images/data_response.png",
  },
  {
    name: "電子文件加密標註",
    enName: "Document Encryption",
    icon: "./images/document_encryption.png",
  },
];

function createMenuItem(item, collapseAllChildren) {
  const menuItem = document.createElement("div");
  const menuTitle = document.createElement("div");
  menuTitle.classList.add("menu-title-wrapper");

  if (item.icon) {
    const icon = document.createElement("img");
    icon.src = item.icon;
    icon.alt = item.enName;
    icon.width = 16;
    menuTitle.appendChild(icon);
  }

  const title = document.createElement("span");
  title.textContent = item.name;
  title.classList.add("menu-title");
  menuTitle.appendChild(title);
  menuItem.appendChild(menuTitle);

  // 如果有 children 則建立子菜單
  if (item.children) {
    menuItem.classList.add("sub-menu-item");

    const toggleArrow = document.createElement("span");
    toggleArrow.classList.add("toggle-arrow");
    toggleArrow.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
    menuTitle.appendChild(toggleArrow);

    const submenu = document.createElement("div");
    submenu.classList.add("submenu", "collapsed");

    item.children.forEach((child) => {
      const childItem = createMenuItem(child, collapseAllChildren);
      submenu.appendChild(childItem);
    });
    menuItem.appendChild(submenu);

    toggleArrow.addEventListener("click", (e) => {
      e.stopPropagation();

      submenu.classList.toggle("collapsed");
      toggleArrow.classList.toggle("opened");

      // 更換箭頭圖示
      if (toggleArrow.classList.contains("opened")) {
        toggleArrow.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
      } else {
        collapseAllChildren(submenu);
        toggleArrow.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
      }
    });
  } else {
    menuItem.classList.add("menu-item");
  }

  return menuItem;
}

function collapseAllChildren(submenu) {
  submenu.classList.add("collapsed");

  const allSubmenus = submenu.querySelectorAll(".submenu");
  allSubmenus.forEach((childSub) => {
    childSub.classList.add("collapsed");
  });

  const allArrows = submenu.querySelectorAll(".toggle-arrow");
  allArrows.forEach((arrow) => {
    arrow.classList.remove("opened");
    arrow.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
  });
}

const menuContainer = document.getElementById("menuContainer");

menuItems.forEach((item) => {
  const menuItem = createMenuItem(item, collapseAllChildren);
  menuContainer.appendChild(menuItem);
});

const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");

toggleSidebarBtn.addEventListener("click", () => {
  const app = document.getElementById("app");
  app.classList.toggle("sidebar-collapsed");
  sidebar.classList.toggle("collapsed");
  toggleSidebarBtn.blur();

  const logo = document.querySelector(".sidebar-logo");
  if (sidebar.classList.contains("collapsed")) {
    logo.style.backgroundImage = 'url("../images/logo-icon.png")';
    collapseAllChildren(menuContainer); // 收合所有展開的子選單
  } else {
    logo.style.backgroundImage = 'url("../images/logo.png")';
  }
});

document.querySelectorAll(".menu-title-wrapper").forEach((menuTitle) => {
  menuTitle.addEventListener("mouseenter", () => {
    if (sidebar.classList.contains("collapsed")) {
      const tooltip = document.createElement("div");
      tooltip.className = "popover-tooltip";
      tooltip.textContent = menuTitle.querySelector(".menu-title").textContent;
      document.body.appendChild(tooltip);

      const rect = menuTitle.getBoundingClientRect();
      tooltip.style.top = `${rect.top}px`;
      tooltip.style.left = `${rect.right + 10}px`;
    }
  });

  menuTitle.addEventListener("mouseleave", () => {
    document.querySelectorAll(".popover-tooltip").forEach((tooltip) => {
      tooltip.remove();
    });
  });
});

document.getElementById("searchBtn").addEventListener("click", () => {
  document.querySelector(".search-box").classList.toggle("active");
});
