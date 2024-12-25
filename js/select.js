export class CustomSelect {
  constructor(triggerId, panelId, callback) {
    this.trigger = document.getElementById(triggerId);
    this.panel = document.getElementById(panelId);
    this.options = this.panel.querySelectorAll(".dropdown-option");
    this.callback = callback;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      this.isOpen = !this.isOpen;
      this.toggleDropdown();
    });

    this.options.forEach((option) => {
      option.addEventListener("click", (e) => {
        const value = option.dataset.value;

        if (typeof this.callback === "function") {
          this.callback(value);
        }

        this.closeDropdown();
      });
    });

    document.addEventListener("click", (e) => {
      if (!this.trigger.contains(e.target) && !this.panel.contains(e.target)) {
        this.isOpen = false;
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.openDropdown();
    } else {
      this.panel.classList.remove("open");
    }
  }

  openDropdown() {
    this.panel.classList.add("open");

    const rect = this.trigger.getBoundingClientRect();
    const panelHeight = this.panel.scrollHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // 重設樣式避免干擾
    this.panel.style.top = "auto";
    this.panel.style.bottom = "auto";

    if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
      this.panel.style.bottom = `${window.innerHeight - rect.top}px`;
      this.panel.style.left = `${rect.left}px`;
    } else {
      this.panel.style.top = `${rect.bottom}px`;
      this.panel.style.left = `${rect.left}px`;
    }

    this.panel.style.width = `${rect.width}px`;
  }

  closeDropdown() {
    this.isOpen = false;
    this.panel.classList.remove("open");
  }
}
