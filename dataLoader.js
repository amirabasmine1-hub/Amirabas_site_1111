// dataLoader.js — لود JSON خبرها و ساخت کارت‌ها
(() => {
  const container = document.getElementById("cards");
  if (!container) return;

  // نوع کارت‌ها با کلاس دیتا (همون فیلتر شما)
  function createCard(item) {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.type = item.type;

    article.innerHTML = `
      <div class="thumb"></div>
      <div class="body">
        <div class="meta-row">
          <div class="tag">${item.tag || item.type}</div>
          <div class="time">${item.time || ""}</div>
        </div>
        <h3>${item.title || ""}</h3>
        <p>${item.summary || ""}</p>
      </div>
      <div class="actions">
        <button class="small-btn primary" type="button" data-open="${item.id}">
          جزئیات
        </button>
        <a class="small-btn" href="${item.link || "#"}" target="_blank" rel="noopener">
          رفتن به روبیکا
        </a>
      </div>
    `;
    return article;
  }

  async function loadNews() {
    try {
      const res = await fetch("data/news.json", { cache: "no-store" });
      if (!res.ok) throw new Error("JSON load failed: " + res.status);
      const items = await res.json();

      // پاکسازی محتوای فعلی (نمونه‌هایی که تو HTML گذاشتی)
      container.innerHTML = "";

      items.forEach((item) => container.appendChild(createCard(item)));
      // بعد از ساخت کارت‌ها، اگر main.js فیلتر رو همون موقع اجرا کنه اوکیه.
      // برای اینکه مطمئن بشه، یک event می‌فرستیم:
      window.dispatchEvent(new Event("news:loaded"));
    } catch (e) {
      console.error(e);
      container.innerHTML = `
        <div style="padding:16px;color:rgba(255,255,255,.7);">
          خطا در لود news.json. لطفاً مسیر data/news.json رو چک کن.
        </div>
      `;
    }
  }

  loadNews();
})();
