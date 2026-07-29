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

  // اگر دیتا از JSON بعداً ساخته شد، cards/chips ممکنه تغییر کنن.
  // پس applyFilter باید لیست‌های جدید رو هم بگیرد.
  function refreshListsAndApply() {
    // فقط اگر DOM عوض شده باشه، این به‌روزرسانی ضروریه
    const newChips = $$(".chip");
    const newCards = $$("#cards .card");

    // جایگزینی آرایه‌ها در محدوده‌ی همین تابع با closure:
    // چون cards/chips const بودن، از نسخه جدید applyFilter استفاده می‌کنیم
    // (ساده‌ترین راه: دوباره فیلتر را با query جدید انجام بدیم)

    const filter = (function () {
      const on = $(".chip.on");
      return on ? (on.dataset.filter || "all") : "all";
    })();

    const q = (searchInput?.value || "").trim().toLowerCase();

    newCards.forEach((card) => {
      const type = card.dataset.type || "all";
      const text = (card.innerText || "").toLowerCase();

      const okType = filter === "all" ? true : type === filter;
      const okText = q ? text.includes(q) : true;

      card.classList.toggle("hidden", !(okType && okText));
    });

    // اگر chips جدید اومده باشه، دوباره هندلرها لازم نیست (چون روی click با event delegation بهتره)
    // ولی چون فعلاً event delegation نداریم، فقط در حداقل حالت کاری می‌کنیم:
    newChips.forEach((chip) => {
      if (!chip.dataset.bound) {
        chip.dataset.bound = "1";
        const activate = () => {
          newChips.forEach((c) => c.classList.remove("on"));
          chip.classList.add("on");
          // apply با cards جدید
          refreshListsAndApply();
        };

        chip.addEventListener("click", activate);
        chip.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate();
          }
        });
      }
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

  // جزئیات
  const detailBtns = $$('[data-open]');
  if (detailBtns.length) {
    detailBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.open;
        alert("جزئیات برای آیتم شماره " + id + " (فعلاً نمونه است).");
      });
    });
  }

  // وقتی JSON لود شد و کارت‌ها عوض شدن
  window.addEventListener("news:loaded", () => {
    refreshListsAndApply();

    // هندلر جزئیات برای دکمه‌های جدید (چون ممکنه بعداً ساخته بشن)
    $$('[data-open]').forEach((btn) => {
      if (btn.dataset.boundDetail) return;
      btn.dataset.boundDetail = "1";
      btn.addEventListener("click", () => {
        const id = btn.dataset.open;
        alert("جزئیات برای آیتم شماره " + id + " (فعلاً نمونه است).");
      });
    });
  });
})();
