const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function readStoredRole() {
  try {
    return localStorage.getItem("tf-role");
  } catch {
    return null;
  }
}

function writeStoredRole(role) {
  try {
    localStorage.setItem("tf-role", role);
  } catch {
    document.body.dataset.roleFallback = role;
  }
}

function setupRoleState() {
  const role = readStoredRole() || document.body.dataset.roleFallback || "Recruiter";
  qsa("[data-role-option]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.roleOption === role ? "true" : "false");
    if (!button.dataset.roleBound) {
      button.dataset.roleBound = "true";
      button.addEventListener("click", () => {
        writeStoredRole(button.dataset.roleOption);
        setupRoleState();
      });
    }
  });
  qsa("[data-role-only]").forEach((item) => {
    const allowed = item.dataset.roleOnly.split(",");
    item.classList.toggle("hide", !allowed.includes(role));
  });
  const roleLabel = qs("[data-current-role]");
  if (roleLabel) roleLabel.textContent = role;
  document.body.dataset.role = role.toLowerCase();
}

function setupTabs() {
  qsa("[data-tabs]").forEach((group) => {
    qsa("[data-tab]", group).forEach((tab) => {
      tab.addEventListener("click", () => {
        qsa("[data-tab]", group).forEach((t) => t.classList.remove("active"));
        qsa("[data-panel]", group).forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        qs(`[data-panel="${tab.dataset.tab}"]`, group)?.classList.add("active");
      });
    });
  });
}

function setupFiltering() {
  const search = qs("[data-search]");
  const status = qs("[data-status-filter]");
  const stage = qs("[data-stage-filter]");
  const minScore = qs("[data-score-filter]");
  const filter = () => {
    const term = (search?.value || "").toLowerCase();
    const list = qs("[data-filter-list]");
    qsa("[data-filter-row]").forEach((row) => {
      const text = row.textContent.toLowerCase();
      const statusOk = !status || status.value === "all" || row.dataset.status === status.value;
      const stageOk = !stage || stage.value === "all" || row.dataset.stage === stage.value;
      const scoreOk = !minScore || Number(row.dataset.score || 0) >= Number(minScore.value || 0);
      row.classList.toggle("hide", !(text.includes(term) && statusOk && stageOk && scoreOk));
    });
    if (list) {
      const visibleRows = qsa("[data-filter-row]", list).filter((row) => !row.classList.contains("hide")).length;
      qs("[data-empty-state]")?.classList.toggle("is-visible", visibleRows === 0);
    }
  };
  [search, status, stage, minScore].filter(Boolean).forEach((el) => el.addEventListener("input", filter));
  filter();
}

function setupFaq() {
  qsa("[data-faq] .faq-q").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      item.classList.toggle("open");
      button.querySelector("span:last-child").textContent = item.classList.contains("open") ? "-" : "+";
    });
  });
}

function setupAuth() {
  qsa("[data-auth-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      qsa("[required]", form).forEach((field) => {
        const helper = field.closest(".field")?.querySelector(".helper") || field.closest("[data-check-field]")?.querySelector(".helper");
        const isEmail = field.type === "email" && !field.value.includes("@");
        const isPassword = field.name === "password" && field.value.length < 8;
        const isCheckbox = field.type === "checkbox" && !field.checked;
        const bad = !field.value || isEmail || isPassword || isCheckbox;
        field.classList.toggle("error", bad);
        if (helper) helper.textContent = bad ? field.dataset.error || "Please complete this field." : "";
        valid = valid && !bad;
      });
      const confirm = qs("[name='confirm']", form);
      const password = qs("[name='password']", form);
      if (confirm && password && confirm.value !== password.value) {
        confirm.classList.add("error");
        confirm.closest(".field").querySelector(".helper").textContent = "Passwords must match.";
        valid = false;
      }
      const notice = qs("[data-form-notice]", form);
      if (notice && valid) notice.textContent = "Validated. Redirecting to role-aware dashboard...";
    });
  });
}

function setupTableOverflow() {
  qsa("table").forEach((table) => {
    if (table.parentElement?.classList.contains("table-wrap")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "table-wrap";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}

function setupKanban() {
  let dragged = null;
  qsa("[draggable='true']").forEach((card) => {
    card.addEventListener("dragstart", () => { dragged = card; card.style.opacity = ".45"; });
    card.addEventListener("dragend", () => { card.style.opacity = "1"; dragged = null; updateKanbanCounts(); });
  });
  qsa("[data-kanban-column]").forEach((column) => {
    column.addEventListener("dragover", (event) => { event.preventDefault(); column.classList.add("drop"); });
    column.addEventListener("dragleave", () => column.classList.remove("drop"));
    column.addEventListener("drop", () => {
      column.classList.remove("drop");
      if (dragged) {
        column.appendChild(dragged);
        dragged.dataset.stage = column.dataset.kanbanColumn;
        const stageBadge = qs("[data-card-stage]", dragged);
        if (stageBadge) {
          stageBadge.textContent = column.dataset.kanbanColumn.toUpperCase();
          stageBadge.className = `badge ${column.dataset.kanbanColumn}`;
        }
      }
    });
  });
  updateKanbanCounts();
}

function updateKanbanCounts() {
  qsa("[data-kanban-column]").forEach((column) => {
    const count = qsa(".candidate-card", column).length;
    const badge = qs("[data-count]", column);
    if (badge) badge.textContent = String(count);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupRoleState();
  setupTabs();
  setupFiltering();
  setupFaq();
  setupAuth();
  setupTableOverflow();
  setupKanban();
});
