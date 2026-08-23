// こもれび整体院 デモサイト共通スクリプト
(function () {
  "use strict";

  // ---- ハンバーガーメニュー（SP） ----
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // ---- FAQアコーディオン（複数同時展開可、初期状態は全問閉じる） ----
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";
      question.setAttribute("aria-expanded", String(!isOpen));
      answer.setAttribute("data-open", String(!isOpen));
    });
  });

  // ---- スクロールで浮かび上がるアニメーション ----
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      // 同じグリッド内の要素は少しずつ遅らせて、順番に浮かび上がらせる
      const groups = new Map();
      revealEls.forEach((el) => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });
      groups.forEach((siblings) => {
        siblings.forEach((el, i) => {
          if (siblings.length > 1) {
            el.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
          }
        });
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }


  // ---- ヘッダー: スクロールしたら影を強める ----
  const header = document.querySelector(".site-header");
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    toggleHeaderShadow();
    window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
  }

  // ---- お客様の声ページ: フィルタタブ（見た目のみ、簡易フィルタ実装） ----
  const filterTabs = document.querySelectorAll(".filter-tabs button");
  const voiceCards = document.querySelectorAll("[data-voice-tag]");

  if (filterTabs.length && voiceCards.length) {
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        filterTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        const target = tab.getAttribute("data-filter");

        voiceCards.forEach((card) => {
          const tags = card.getAttribute("data-voice-tag") || "";
          const show = target === "all" || tags.includes(target);
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
})();
