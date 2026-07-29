// main.js — فیلتر + سرچ + جزئیات (اگر داخل HTML button با data-open داشتی)

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // سال
  const y = $("#y");
  if (y) y.textContent = new Date().getFullYear();

  // فیلتر/جستجو اخبار
  const chips = $$(".chip");
  const cards = $$("#cards .card");
  const searchInput = $("#searchInput");

  function getActiveFilter() {
    const on = $(".chip.on");
    return on ? (on.dataset.filter || "all") : "all";
  }

  function applyFilter() {
    if (!cards.length) return;

    const filter = getActiveFilter();
    const q = (searchInput?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const type = card.dataset.type || "all";
      const text = (card.innerText || "").toLowerCase();

      const okType = filter === "all" ? true : type === filter;
      const okText = q ? text.includes(q) : true;

      card.classList.toggle("hidden", !(okType && okText));
    });
  }

  chips.forEach((chip) => {
    const activate = () => {
      chips.forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      applyFilter();
    };

    chip.addEventListener("click", activate);
    chip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }
  applyFilter();

  // جزئیات (اگر داخل HTML پاپ‌آپ/Modal نداری فعلاً چیزی باز نمی‌کنه)
  // ولی اگر خواستی، می‌تونیم modal واقعی اضافه کنیم.
  const detailBtns = $$('[data-open]');
  if (detailBtns.length) {
    detailBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.open;
        alert("جزئیات برای آیتم شماره " + id + " (فعلاً نمونه است).");
      });
    });
  }
})();
