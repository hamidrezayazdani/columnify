/**
 * Columnify - Advanced Table Column Visibility Manager
 * Author: HamidReza Yazdani
 * License: MIT
 */
class Columnify {
  constructor(options = {}) {
    // Default configuration
    this.defaults = {
      tableSelector: null,
      initialVisibleColumns: "all",
      requiredColumns: [],
      selectorPlacement: "before",
      responsiveMode: false,
      mobileBreakpoint: 768,
      selectorLayout: "dropdown",
      i18n: {
        selectColumns: "Select Columns",
        selectedColumns: "{count} Columns Selected",
        showAllColumns: "Show All",
        hideAllColumns: "Hide All",
      },
    };

    // Merge user options with defaults
    this.config = { ...this.defaults, ...options };
    this.init();
  }

  init() {
    this.table = document.querySelector(this.config.tableSelector);
    if (!this.table) {
      throw new Error("Table not found");
    }

    this.headers = Array.from(this.table.querySelectorAll("thead th"));
    this.columnVisibility = new Array(this.headers.length).fill(true);

    // Create controls and set up event listeners
    this.createControls();
    this.setupEventListeners();

    // Handle responsive visibility
    if (this.config.responsiveMode) {
      this.handleResponsiveVisibility();
      window.addEventListener("resize", () =>
        this.handleResponsiveVisibility()
      );
    }
  }

  shouldShowControls() {
    return (
      !this.config.responsiveMode ||
      (this.config.responsiveMode &&
        window.innerWidth <= this.config.mobileBreakpoint)
    );
  }

  createControls() {
    const container = document.createElement("div");
    container.className = "columnify-controls";

    switch (this.config.selectorLayout) {
      case "toggle":
        this.createToggleSelectors(container);
        break;
      case "dropdown":
      default:
        this.createDropdownSelector(container);
        break;
    }

    if (this.config.selectorPlacement === "before") {
      this.table.parentNode.insertBefore(container, this.table);
    } else {
      this.table.parentNode.insertBefore(container, this.table.nextSibling);
    }

    if (this.config.responsiveMode) {
      container.style.display = this.shouldShowControls() ? "block" : "none";
    }
  }

  createDropdownSelector(container) {
    const dropdown = document.createElement("div");
    dropdown.className = "columnify-dropdown";

    const button = document.createElement("button");
    button.className = "columnify-button";
    button.textContent = this.config.i18n.selectColumns;
    dropdown.appendChild(button);

    const content = document.createElement("div");
    content.className = "columnify-dropdown-content";

    this.headers.forEach((header, index) => {
      if (!this.config.requiredColumns.includes(index)) {
        const label = document.createElement("label");
        label.className = "columnify-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.dataset.column = index;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(header.textContent));
        content.appendChild(label);
      }
    });

    const controls = document.createElement("div");
    controls.className = "columnify-controls-buttons";

    const showAll = document.createElement("button");
    showAll.textContent = this.config.i18n.showAllColumns;
    showAll.onclick = () => this.showAllColumns();

    const hideAll = document.createElement("button");
    hideAll.textContent = this.config.i18n.hideAllColumns;
    hideAll.onclick = () => this.hideAllColumns();

    controls.appendChild(showAll);
    controls.appendChild(hideAll);
    content.appendChild(controls);

    dropdown.appendChild(content);
    container.appendChild(dropdown);
  }

  createToggleSelectors(container) {
    this.headers.forEach((header, index) => {
      if (!this.config.requiredColumns.includes(index)) {
        const toggleContainer = document.createElement("div");
        toggleContainer.className = "columnify-toggle";

        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.id = `column-toggle-${index}`;
        toggle.checked = true;
        toggle.dataset.column = index;

        const label = document.createElement("label");
        label.htmlFor = `column-toggle-${index}`;
        label.textContent = header.textContent;

        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(label);
        container.appendChild(toggleContainer);
      }
    });
  }

  setupEventListeners() {
    if (this.config.selectorLayout === "dropdown") {
      const handleDropdownClick = (e) => {
        const dropdown = e.target.closest(".columnify-dropdown");
        const isButton = e.target.classList.contains("columnify-button");

        // Close all other dropdowns
        document.querySelectorAll(".columnify-dropdown").forEach((d) => {
          if (d !== dropdown) d.classList.remove("active");
        });

        // Toggle clicked dropdown
        if (dropdown && isButton) {
          // Use more precise class manipulation to avoid multiple toggles
          const wasActive = dropdown.classList.contains("active");

          // Only add active class to the clicked dropdown if it wasn't already active
          if (!wasActive) {
            dropdown.classList.add("active");
          }

          // Prevent further propagation
          e.stopPropagation();
          e.preventDefault();
        } else if (!dropdown) {
          // Close all dropdowns if clicking outside
          document.querySelectorAll(".columnify-dropdown").forEach((d) => {
            d.classList.remove("active");
          });
        }
      };

      // Use event listener without capture, and with more precise targeting
      document.addEventListener("click", handleDropdownClick, false);

      // Delegate event listener for checkbox changes
      this.table.parentNode.addEventListener("change", (e) => {
        if (e.target.matches(".columnify-checkbox input")) {
          const columnIndex = parseInt(e.target.dataset.column);
          this.toggleColumn(columnIndex, e.target.checked);
        }
      });
    }
    // Toggle selector event listeners
    else if (this.config.selectorLayout === "toggle") {
      this.table.parentNode.addEventListener("change", (e) => {
        if (e.target.matches(".columnify-toggle input")) {
          const columnIndex = parseInt(e.target.dataset.column);
          this.toggleColumn(columnIndex, e.target.checked);
        }
      });
    }
  }

  handleResponsiveVisibility() {
    const controls =
      this.table.previousElementSibling || this.table.nextElementSibling;

    if (controls && controls.classList.contains("columnify-controls")) {
      controls.style.display = this.shouldShowControls() ? "block" : "none";
    }
  }

  toggleColumn(index, visible) {
    if (this.config.requiredColumns.includes(index)) return;

    this.columnVisibility[index] = visible;
    this.updateVisibility();
  }

  showAllColumns() {
    this.columnVisibility.fill(true);

    this.updateSelectionControls(true);
    this.updateVisibility();
  }

  hideAllColumns() {
    this.columnVisibility = this.columnVisibility.map((_, index) =>
      this.config.requiredColumns.includes(index)
    );

    this.updateSelectionControls(false);
    this.updateVisibility();
  }

  updateSelectionControls(isVisible) {
    if (this.config.selectorLayout === "dropdown") {
      document
        .querySelectorAll(".columnify-checkbox input")
        .forEach((checkbox) => {
          const columnIndex = parseInt(checkbox.dataset.column);
          checkbox.checked =
            isVisible || this.config.requiredColumns.includes(columnIndex);
        });
    } else if (this.config.selectorLayout === "toggle") {
      document.querySelectorAll(".columnify-toggle input").forEach((toggle) => {
        const columnIndex = parseInt(toggle.dataset.column);
        toggle.checked =
          isVisible || this.config.requiredColumns.includes(columnIndex);
      });
    }
  }

  updateVisibility() {
    this.headers.forEach((_, index) => {
      const isVisible = this.columnVisibility[index];
      const cells = this.table.querySelectorAll(
        `tr > *:nth-child(${index + 1})`
      );
      cells.forEach((cell) => {
        cell.style.display = isVisible ? "" : "none";
      });
    });
  }
}

// Make Columnify available globally
window.Columnify = Columnify;
