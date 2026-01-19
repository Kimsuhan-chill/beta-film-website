(function () {
  const lightbox = document.getElementById("lightbox");
  const backdrop = lightbox?.querySelector(".lightbox-backdrop");
  const panel = lightbox?.querySelector(".lightbox-panel");

  const imgEl = document.getElementById("lightboxImg");
  const titleEl = document.getElementById("lightboxTitle");
  const metaEl = document.getElementById("lightboxMeta");
  const tagsEl = document.getElementById("lightboxTags");
  const descEl = document.getElementById("lightboxDesc");

  const prevBtn = lightbox?.querySelector(".lb-prev");
  const nextBtn = lightbox?.querySelector(".lb-next");
  const idxEl = document.getElementById("lbIndex");
  const totalEl = document.getElementById("lbTotal");

  if (!lightbox || !imgEl || !titleEl || !metaEl || !tagsEl || !descEl) return;

  let album = [];
  let currentIndex = 0;

  const parseImages = (raw, fallback) => {
    if (raw && raw.trim()) {
      return raw.split(",").map(s => s.trim()).filter(Boolean);
    }
    return fallback ? [fallback] : [];
  };

  const render = () => {
    if (!album.length) return;

    imgEl.src = album[currentIndex];
    imgEl.alt = titleEl.textContent || "Photo";

    if (idxEl) idxEl.textContent = String(currentIndex + 1);
    if (totalEl) totalEl.textContent = String(album.length);

    if (prevBtn) prevBtn.disabled = album.length <= 1;
    if (nextBtn) nextBtn.disabled = album.length <= 1;
  };

  const open = (data) => {
    album = data.images || [];
    currentIndex = 0;

    titleEl.textContent = data.title || "Untitled";
    metaEl.textContent = data.meta || "";
    tagsEl.textContent = data.tags
      ? `#${String(data.tags).trim().split(/\s+/).join(" #")}`
      : "";
    descEl.textContent = data.desc || "설명이 아직 없습니다.";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    render();
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    imgEl.src = "";
    album = [];
    currentIndex = 0;
    document.body.style.overflow = "";
  };

  const next = () => {
    if (album.length <= 1) return;
    currentIndex = (currentIndex + 1) % album.length;
    render();
  };

  const prev = () => {
    if (album.length <= 1) return;
    currentIndex = (currentIndex - 1 + album.length) % album.length;
    render();
  };

  document.addEventListener("click", (e) => {
    const item = e.target.closest(".archive-item");
    if (!item) return;

    const thumbImg = item.querySelector("img");
    const fallback = thumbImg?.getAttribute("src") || "";

    open({
      title: item.dataset.title,
      meta: item.dataset.meta,
      tags: item.dataset.tags,
      desc: item.dataset.desc,
      images: parseImages(item.dataset.images, fallback),
    });
  });

  backdrop?.addEventListener("click", close);
  panel?.addEventListener("click", (e) => e.stopPropagation());

  prevBtn?.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  nextBtn?.addEventListener("click", (e) => { e.stopPropagation(); next(); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
