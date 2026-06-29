/**
 * SpeakLog UI 렌더링 & 인터랙션
 */
(function () {
  "use strict";

  const ICONS = {
    "shield-check": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`,
    "book-open": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
    graduation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    seedling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10c-2-3-6-4-8-3 1 4 3 6 8 3"/><path d="M12 10c2-3 6-4 8-3-1 4-3 6-8 3"/></svg>`,
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function setKakaoLinks(url) {
    document.querySelectorAll(
      "#hero-kakao-btn, #about-kakao-btn, #pricing-kakao-btn, #faq-kakao-btn, #contact-kakao-btn, #footer-kakao-btn, #sticky-kakao-btn"
    ).forEach((el) => {
      el.href = url;
    });
  }

  function setContactInfo(site) {
    const phoneBtn = $("#contact-phone-btn");
    const phoneDisplay = $("#contact-phone-display");
    const hours = $("#contact-hours");
    const instagramBtn = $("#contact-instagram-btn");
    const footerPhoneBtn = $("#footer-phone-btn");

    const tel = `tel:${site.phone.replace(/-/g, "")}`;
    if (phoneBtn) phoneBtn.href = tel;
    if (footerPhoneBtn) footerPhoneBtn.href = tel;
    if (phoneDisplay) phoneDisplay.textContent = site.phoneDisplay;
    if (hours) hours.textContent = site.businessHours;
    if (instagramBtn) instagramBtn.href = site.instagramUrl;
  }

  function renderFeatures(features) {
    const grid = $("#feature-grid");
    if (!grid) return;

    grid.innerHTML = features
      .map(
        (item) => `
      <article class="feature-card feature-card--${item.color}">
        <div class="feature-icon">${ICONS[item.icon] || ""}</div>
        <h3 class="feature-title">${item.title}</h3>
        <p class="feature-desc">${item.description}</p>
      </article>`
      )
      .join("");
  }

  function renderAudience(audiences) {
    const grid = $("#audience-grid");
    if (!grid) return;

    grid.innerHTML = audiences
      .map(
        (item) => `
      <div class="audience-item audience-item--${item.color}">
        <div class="audience-icon">${ICONS[item.icon] || ""}</div>
        <span class="audience-label">${item.label}</span>
      </div>`
      )
      .join("");
  }

  function renderProcess(steps) {
    const timeline = $("#process-timeline");
    if (!timeline) return;

    timeline.innerHTML = steps
      .map(
        (item, index) => `
      <div class="timeline-item">
        <div class="timeline-marker">
          <span class="timeline-step">${item.step}</span>
        </div>
        <div class="timeline-content">
          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-desc">${item.description}</p>
        </div>
        ${index < steps.length - 1 ? '<div class="timeline-connector" aria-hidden="true"><span>↓</span></div>' : ""}
      </div>`
      )
      .join("");
  }

  function renderPricingEvent(event) {
    const container = $("#pricing-event");
    if (!container || !event.active) return;

    container.innerHTML = `
      <div class="event-banner">
        <span class="event-badge">${event.label}</span>
        <p class="event-text">${event.description}</p>
      </div>`;
  }

  function renderPricing(plans) {
    const grid = $("#pricing-grid");
    if (!grid) return;

    grid.innerHTML = plans
      .map(
        (plan) => `
      <article class="pricing-card${plan.featured ? " pricing-card--featured" : ""}" data-plan-id="${plan.id}">
        ${plan.badge ? `<span class="pricing-badge">${plan.badge}</span>` : ""}
        <p class="pricing-frequency">${plan.frequency}</p>
        <p class="pricing-price">
          <span class="pricing-amount">${plan.priceLabel}</span>
          <span class="pricing-period">/ ${plan.period}</span>
        </p>
        <p class="pricing-desc">${plan.description}</p>
        <a href="#contact" class="btn ${plan.featured ? "btn-primary" : "btn-outline"} btn-block">무료 상담 신청</a>
      </article>`
      )
      .join("");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function getLearnerTypeLabel(value) {
    if (!value) return "";
    const match = SpeakLogData.learnerTypes.find((item) => item.value === value);
    return match ? match.label : value;
  }

  function populateLearnerTypeSelects() {
    const options = SpeakLogData.learnerTypes
      .map((item) => `<option value="${item.value}">${item.label}</option>`)
      .join("");

    ["#goal", "#review-role"].forEach((selector) => {
      const select = $(selector);
      if (!select) return;
      select.innerHTML = `<option value="">선택해 주세요</option>${options}`;
    });
  }

  function renderReviewCards(reviews) {
    return reviews
      .map(
        (review) => `
      <article class="review-card">
        <div class="review-stars" aria-label="별점 ${review.rating}점">
          ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
        </div>
        <blockquote class="review-text">${escapeHtml(review.content)}</blockquote>
        <footer class="review-author">
          <strong>${escapeHtml(review.author)}</strong>
          ${review.role ? `<span>${escapeHtml(getLearnerTypeLabel(review.role))}</span>` : ""}
        </footer>
      </article>`
      )
      .join("");
  }

  function renderReviews(reviews) {
    const grid = $("#reviews-grid");
    if (!grid) return;

    if (!reviews.length) {
      grid.innerHTML = `
        <div class="review-placeholder">
          <div class="review-placeholder-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <p class="review-placeholder-title">첫 후기를 남겨보세요</p>
          <p class="review-placeholder-desc">수강 경험을 공유해 주시면 다른 분들께 큰 도움이 됩니다</p>
        </div>`;
      return;
    }

    grid.innerHTML = renderReviewCards(reviews);
  }

  function initReviewForm() {
    const form = $("#review-form");
    const status = $("#review-form-status");
    const ratingInput = $("#review-rating");
    const starButtons = document.querySelectorAll(".star-btn");
    const submitBtn = form?.querySelector('button[type="submit"]');
    if (!form || !ratingInput) return;

    let selectedRating = 0;

    function updateStars(value) {
      selectedRating = value;
      ratingInput.value = String(value);
      starButtons.forEach((btn) => {
        const starValue = Number(btn.dataset.value);
        btn.classList.toggle("is-active", starValue <= value);
        btn.setAttribute("aria-checked", String(starValue === value));
      });
    }

    starButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        updateStars(Number(btn.dataset.value));
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const author = form.author.value.trim();
      const role = form.role.value.trim();
      const content = form.content.value.trim();
      const rating = Number(ratingInput.value);

      if (!author) {
        status.textContent = "이름을 입력해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (!rating) {
        status.textContent = "별점을 선택해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (content.length < 10) {
        status.textContent = "후기는 10자 이상 작성해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (!SpeakLogSupabase.isConfigured()) {
        status.textContent = "서비스 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      status.textContent = "등록 중…";
      status.className = "form-note";

      try {
        await SpeakLogReviews.saveReview({ author, role, rating, content });
        const reviews = await SpeakLogReviews.loadReviews();
        renderReviews(reviews);

        status.textContent = "후기가 등록되었습니다. 감사합니다!";
        status.className = "form-note form-note--success";
        form.reset();
        updateStars(0);
      } catch (err) {
        console.error("[SpeakLog] 후기 등록 실패:", err?.message || err, err?.code || "");
        if (err?.code === "PGRST204" || err?.code === "42703") {
          status.textContent = "후기 데이터베이스 설정이 필요합니다. 관리자에게 문의해 주세요.";
        } else if (err?.code === "42501") {
          status.textContent = "후기 등록 권한 오류입니다. 잠시 후 다시 시도해 주세요.";
        } else {
          status.textContent = "후기 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        }
        status.className = "form-note form-note--error";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  function renderNotices(notices) {
    const container = $("#notices-container");
    if (!container || !notices.length) return;

    container.hidden = false;
    container.innerHTML = `
      <div class="container">
        <div class="notices-list">
          ${notices
            .map(
              (notice) => `
            <a href="${notice.link || "#"}" class="notice-item${notice.pinned ? " notice-item--pinned" : ""}">
              ${notice.pinned ? '<span class="notice-badge">공지</span>' : ""}
              <span class="notice-title">${escapeHtml(notice.title)}</span>
              <time class="notice-date" datetime="${notice.date}">${notice.dateLabel || notice.date}</time>
            </a>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderFaq(items) {
    const list = $("#faq-list");
    if (!list) return;

    list.innerHTML = items
      .map(
        (item, index) => `
      <div class="faq-item${index === 0 ? " is-open" : ""}">
        <button type="button" class="faq-question" aria-expanded="${index === 0}" aria-controls="faq-answer-${item.id}">
          <span>${item.question}</span>
          <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        <div class="faq-answer" id="faq-answer-${item.id}" role="region">
          <p>${item.answer}</p>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll(".faq-question").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const isOpen = item.classList.contains("is-open");

        list.querySelectorAll(".faq-item").forEach((el) => {
          el.classList.remove("is-open");
          el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initNavigation() {
    const header = $("#header");
    const toggle = $("#nav-toggle");
    const overlay = $("#nav-overlay");
    const navLinks = $("#nav-links");

    function setNavOpen(open) {
      if (navLinks) navLinks.classList.toggle("is-open", open);
      if (overlay) {
        overlay.classList.toggle("is-open", open);
        overlay.setAttribute("aria-hidden", String(!open));
      }
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      }
      document.body.classList.toggle("nav-open", open);
    }

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });

    if (toggle && navLinks) {
      toggle.addEventListener("click", () => {
        setNavOpen(!navLinks.classList.contains("is-open"));
      });

      if (overlay) {
        overlay.addEventListener("click", () => setNavOpen(false));
      }

      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setNavOpen(false));
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setNavOpen(false);
      });
    }
  }

  function initStickyCta() {
    const sticky = $("#sticky-cta");
    const hero = $("#hero");
    if (!sticky || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        sticky.classList.toggle("is-visible", !entry.isIntersecting);
        sticky.setAttribute("aria-hidden", String(entry.isIntersecting));
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
  }

  function initContactForm() {
    const form = $("#contact-form");
    const status = $("#form-status");
    const submitBtn = form?.querySelector('button[type="submit"]');
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const goal = form.goal.value.trim();
      const message = form.message.value.trim();
      const privacy = form.privacy.checked;

      if (!name || !phone) {
        status.textContent = "이름과 연락처를 입력해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (!privacy) {
        status.textContent = "개인정보 수집 및 이용에 동의해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (!SpeakLogSupabase.isConfigured()) {
        status.textContent = "서비스 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.";
        status.className = "form-note form-note--error";
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      status.textContent = "접수 중…";
      status.className = "form-note";

      try {
        await SpeakLogAPI.submitConsultation({ name, phone, email, goal, message });
        status.textContent = "상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다!";
        status.className = "form-note form-note--success";
        form.reset();
      } catch (err) {
        console.error("[SpeakLog] 상담 신청 실패:", err?.message || err, err?.code || "");
        if (err?.code === "PGRST205") {
          status.textContent = "데이터베이스 테이블이 없습니다. Supabase SQL Editor에서 schema.sql을 실행해 주세요.";
        } else if (err?.message?.includes("Invalid API key")) {
          status.textContent = "Supabase API 키가 올바르지 않습니다. config.js의 키를 다시 확인해 주세요.";
        } else if (err?.code === "42501") {
          status.textContent = "접수 권한 오류입니다. 카카오톡으로 문의해 주세요.";
        } else {
          status.textContent = "상담 신청 접수에 실패했습니다. 카카오톡으로 문의해 주세요.";
        }
        status.className = "form-note form-note--error";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  function initScrollReveal() {
    const sections = document.querySelectorAll(".section, .hero-inner > *");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    sections.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  async function init() {
    const { site, pricing, pricingEvent, faq, features, audiences, process } = SpeakLogData;

    setKakaoLinks(site.kakaoUrl);
    setContactInfo(site);
    populateLearnerTypeSelects();
    renderFeatures(features);
    renderAudience(audiences);
    renderProcess(process);
    renderPricingEvent(pricingEvent);
    renderPricing(pricing);
    renderFaq(faq);
    initReviewForm();
    initNavigation();
    initStickyCta();
    initContactForm();
    initScrollReveal();

    let reviews = [];
    let notices = [];

    if (SpeakLogSupabase.isConfigured()) {
      try {
        [reviews, notices] = await Promise.all([
          SpeakLogReviews.loadReviews(),
          SpeakLogAPI.fetchNotices(),
        ]);
      } catch (err) {
        console.error("[SpeakLog] 데이터 불러오기 실패:", err);
      }
    }

    renderReviews(reviews);
    renderNotices(notices);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
