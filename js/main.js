document.addEventListener("DOMContentLoaded", () => {
  // Archive 페이지가 아니면 아무것도 하지 않음
  const archiveGrid = document.querySelector(".archive-grid");
  if (!archiveGrid) return;

  const items = Array.from(document.querySelectorAll(".archive-item"));
  const themeChips = document.querySelectorAll(".archive-filters [data-theme]");
  const artistSelect = document.getElementById("artistFilter");
  const tagInput = document.getElementById("tagSearch");
  const countText = document.querySelector(".archive-count-text");

  // 현재 선택 상태를 저장하는 변수들
  let currentTheme = "all";
  let currentArtist = "all";
  let currentKeyword = "";

  function normalize(str) {
    return (str || "").toString().toLowerCase().trim();
  }

  // 실제 필터 적용 함수
  function applyArchiveFilter() {
    let visibleCount = 0;
    const keyword = normalize(currentKeyword).replace(/^#/, ""); // # 제거

    items.forEach((item) => {
      const itemTheme = item.getAttribute("data-theme") || "all";
      const itemArtist = item.getAttribute("data-artist") || "all";
      const itemTagsAttr = item.getAttribute("data-tags") || "";

      const titleText =
        item.querySelector(".archive-title")?.textContent || "";
      const tagsText =
        item.querySelector(".archive-tags")?.textContent || "";

      const fullText = normalize(itemTagsAttr + " " + titleText + " " + tagsText);

      // 각 조건에 맞는지 체크
      const themeMatch =
        currentTheme === "all" || currentTheme === itemTheme;

      const artistMatch =
        currentArtist === "all" || currentArtist === itemArtist;

      const keywordMatch =
        keyword === "" || fullText.includes(keyword);

      const isVisible = themeMatch && artistMatch && keywordMatch;

      item.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount += 1;
    });

    // 상단 "총 n 작품" 숫자 갱신
    if (countText) {
      countText.textContent = `총 ${visibleCount} 작품`;
    }
  }

  // ① 테마 chip 클릭 이벤트
  themeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selectedTheme = chip.getAttribute("data-theme") || "all";
      currentTheme = selectedTheme;

      themeChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      applyArchiveFilter();
    });
  });

  // ② Artist 셀렉트 변경 이벤트 (지금 구현하려는 부분)
  if (artistSelect) {
    artistSelect.addEventListener("change", () => {
      currentArtist = artistSelect.value || "all";
      applyArchiveFilter();
    });
  }

  // ③ Tag / Keyword 입력 이벤트 (이미 UI 있는 부분)
  if (tagInput) {
    tagInput.addEventListener("input", () => {
      currentKeyword = tagInput.value;
      applyArchiveFilter();
    });
  }

  // 페이지 처음 로딩될 때 한 번 실행
  applyArchiveFilter();
});
