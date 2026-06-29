/**
 * SpeakLog 관리자 페이지
 */
(function () {
  "use strict";

  const STATUS_LABELS = {
    pending: "대기",
    contacted: "연락완료",
    completed: "완료",
    cancelled: "취소",
  };

  const LEARNER_TYPE_LABELS = {
    work: "직장인 회화",
    elementary: "초등학생",
    middle: "중학생",
    high: "고등학생",
    student: "대학생 / 취업 준비",
    travel: "여행 영어",
    beginner: "영어회화 초보",
    other: "기타",
  };

  function getLearnerTypeLabel(value) {
    if (!value) return "-";
    return LEARNER_TYPE_LABELS[value] || value;
  }

  function $(sel) {
    return document.querySelector(sel);
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function formatDateTime(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function showLogin() {
    $("#login-screen").hidden = false;
    $("#admin-app").hidden = true;
    $("#admin-user-email").textContent = "";

    const form = $("#login-form");
    const submitBtn = form?.querySelector('button[type="submit"]');
    if (form) form.reset();
    if (submitBtn) submitBtn.disabled = false;
    setStatus($("#login-status"), "");
  }

  function showAdmin(email) {
    $("#login-screen").hidden = true;
    $("#admin-app").hidden = false;
    $("#admin-user-email").textContent = email || "";
    setStatus($("#login-status"), "");
  }

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = "form-note" + (type ? ` form-note--${type}` : "");
  }

  function switchPanel(panelId) {
    document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.panel === panelId);
    });
    document.querySelectorAll(".admin-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `panel-${panelId}`);
    });
  }

  async function loadConsultations() {
    const tbody = $("#consultations-tbody");
    const empty = $("#consultations-empty");
    const countEl = $("#consultations-count");

    try {
      const items = await SpeakLogAPI.fetchAllConsultations();
      const pendingCount = items.filter((i) => i.status === "pending").length;
      if (countEl) countEl.textContent = pendingCount ? String(pendingCount) : "";

      if (!items.length) {
        tbody.innerHTML = "";
        empty.hidden = false;
        return;
      }

      empty.hidden = true;
      tbody.innerHTML = items
        .map(
          (item) => `
        <tr>
          <td class="cell-muted">${formatDateTime(item.createdAt)}</td>
          <td><strong>${escapeHtml(item.name)}</strong></td>
          <td><a href="tel:${escapeHtml(item.phone.replace(/-/g, ""))}">${escapeHtml(item.phone)}</a></td>
          <td class="cell-muted">${escapeHtml(item.email) || "-"}</td>
          <td class="cell-muted">${escapeHtml(getLearnerTypeLabel(item.goal))}</td>
          <td class="cell-truncate" title="${escapeHtml(item.message)}">${escapeHtml(item.message) || "-"}</td>
          <td>
            <select class="status-select" data-status="${item.status}" data-id="${item.id}">
              ${Object.entries(STATUS_LABELS)
                .map(
                  ([value, label]) =>
                    `<option value="${value}"${item.status === value ? " selected" : ""}>${label}</option>`
                )
                .join("")}
            </select>
          </td>
          <td>
            <div class="admin-actions">
              <button type="button" class="btn btn-danger btn-sm" data-delete-consultation="${item.id}">삭제</button>
            </div>
          </td>
        </tr>`
        )
        .join("");

      tbody.querySelectorAll(".status-select").forEach((select) => {
        select.addEventListener("change", async () => {
          const id = select.dataset.id;
          const status = select.value;
          select.disabled = true;
          try {
            await SpeakLogAPI.updateConsultationStatus(id, status);
            select.dataset.status = status;
            await loadConsultations();
          } catch (err) {
            alert("상태 변경에 실패했습니다.");
            console.error(err);
          } finally {
            select.disabled = false;
          }
        });
      });

      tbody.querySelectorAll("[data-delete-consultation]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("이 상담 신청을 삭제할까요?")) return;
          btn.disabled = true;
          try {
            await SpeakLogAPI.deleteConsultation(btn.dataset.deleteConsultation);
            await loadConsultations();
          } catch (err) {
            alert("삭제에 실패했습니다.");
            console.error(err);
            btn.disabled = false;
          }
        });
      });
    } catch (err) {
      console.error(err);
      empty.hidden = false;
      empty.textContent = "데이터를 불러오지 못했습니다.";
    }
  }

  async function loadReviews() {
    const list = $("#reviews-list");
    const empty = $("#reviews-empty");

    try {
      const items = await SpeakLogAPI.fetchAllReviews();

      if (!items.length) {
        list.innerHTML = "";
        empty.hidden = false;
        return;
      }

      empty.hidden = true;
      list.innerHTML = items
        .map(
          (item) => `
        <article class="admin-review-card${item.published ? "" : " is-hidden"}">
          <div class="admin-review-meta">
            <strong>${escapeHtml(item.author)}</strong>
            ${item.role ? `<span>${escapeHtml(getLearnerTypeLabel(item.role))}</span>` : ""}
            <span class="admin-review-stars">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</span>
            <span class="badge ${item.published ? "badge--published" : "badge--hidden"}">${item.published ? "게시중" : "숨김"}</span>
            <span class="cell-muted">${formatDateTime(item.createdAt)}</span>
          </div>
          <p class="admin-review-content">${escapeHtml(item.content)}</p>
          <div class="admin-actions">
            <button type="button" class="btn btn-outline btn-sm" data-toggle-review="${item.id}" data-published="${item.published}">
              ${item.published ? "숨기기" : "게시하기"}
            </button>
            <button type="button" class="btn btn-danger btn-sm" data-delete-review="${item.id}">삭제</button>
          </div>
        </article>`
        )
        .join("");

      list.querySelectorAll("[data-toggle-review]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.toggleReview;
          const published = btn.dataset.published !== "true";
          btn.disabled = true;
          try {
            await SpeakLogAPI.updateReview(id, { published });
            await loadReviews();
          } catch (err) {
            alert("변경에 실패했습니다.");
            console.error(err);
            btn.disabled = false;
          }
        });
      });

      list.querySelectorAll("[data-delete-review]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("이 후기를 삭제할까요?")) return;
          btn.disabled = true;
          try {
            await SpeakLogAPI.deleteReview(btn.dataset.deleteReview);
            await loadReviews();
          } catch (err) {
            alert("삭제에 실패했습니다.");
            console.error(err);
            btn.disabled = false;
          }
        });
      });
    } catch (err) {
      console.error(err);
      empty.hidden = false;
      empty.textContent = "데이터를 불러오지 못했습니다.";
    }
  }

  function resetNoticeForm() {
    $("#notice-form").hidden = true;
    $("#notice-id").value = "";
    $("#notice-title").value = "";
    $("#notice-link").value = "";
    $("#notice-content").value = "";
    $("#notice-date").value = new Date().toISOString().slice(0, 10);
    $("#notice-pinned").checked = false;
    $("#notice-published").checked = true;
    setStatus($("#notice-form-status"), "");
  }

  function openNoticeForm(notice) {
    const form = $("#notice-form");
    form.hidden = false;
    $("#notice-id").value = notice?.id || "";
    $("#notice-title").value = notice?.title || "";
    $("#notice-link").value = notice?.link || "";
    $("#notice-content").value = notice?.content || "";
    $("#notice-date").value = notice?.date
      ? String(notice.date).slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    $("#notice-pinned").checked = Boolean(notice?.pinned);
    $("#notice-published").checked = notice ? Boolean(notice.published) : true;
    setStatus($("#notice-form-status"), "");
    form.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function loadNotices() {
    const tbody = $("#notices-tbody");
    const empty = $("#notices-empty");

    try {
      const items = await SpeakLogAPI.fetchAllNotices();

      if (!items.length) {
        tbody.innerHTML = "";
        empty.hidden = false;
        return;
      }

      empty.hidden = true;
      tbody.innerHTML = items
        .map(
          (item) => `
        <tr>
          <td class="cell-muted">${escapeHtml(item.dateLabel || item.date)}</td>
          <td>
            ${item.pinned ? '<span class="badge badge--pinned">고정</span> ' : ""}
            <strong>${escapeHtml(item.title)}</strong>
          </td>
          <td>${item.pinned ? "✓" : "-"}</td>
          <td><span class="badge ${item.published ? "badge--published" : "badge--hidden"}">${item.published ? "게시" : "비공개"}</span></td>
          <td>
            <div class="admin-actions">
              <button type="button" class="btn btn-outline btn-sm" data-edit-notice="${item.id}">수정</button>
              <button type="button" class="btn btn-danger btn-sm" data-delete-notice="${item.id}">삭제</button>
            </div>
          </td>
        </tr>`
        )
        .join("");

      const noticeMap = Object.fromEntries(items.map((n) => [n.id, n]));

      tbody.querySelectorAll("[data-edit-notice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          openNoticeForm(noticeMap[btn.dataset.editNotice]);
        });
      });

      tbody.querySelectorAll("[data-delete-notice]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("이 공지사항을 삭제할까요?")) return;
          btn.disabled = true;
          try {
            await SpeakLogAPI.deleteNotice(btn.dataset.deleteNotice);
            resetNoticeForm();
            await loadNotices();
          } catch (err) {
            alert("삭제에 실패했습니다.");
            console.error(err);
            btn.disabled = false;
          }
        });
      });
    } catch (err) {
      console.error(err);
      empty.hidden = false;
      empty.textContent = "데이터를 불러오지 못했습니다.";
    }
  }

  async function loadAllData() {
    await Promise.all([loadConsultations(), loadReviews(), loadNotices()]);
  }

  let activeUserId = null;

  async function applyAuthSession(session) {
    const userId = session?.user?.id ?? null;

    if (userId) {
      if (activeUserId === userId) return;
      activeUserId = userId;
      showAdmin(session.user.email);
      await loadAllData();
      return;
    }

    if (!activeUserId) return;
    activeUserId = null;
    showLogin();
  }

  function initLogin() {
    const form = $("#login-form");
    const status = $("#login-status");
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!SpeakLogSupabase.isConfigured()) {
        setStatus(status, "config.js에 Supabase 설정을 입력해 주세요.", "error");
        return;
      }

      const email = form.email.value.trim();
      const password = form.password.value;

      submitBtn.disabled = true;
      setStatus(status, "로그인 중…");

      try {
        await SpeakLogAPI.signIn(email, password);
        setStatus(status, "");
      } catch (err) {
        console.error(err);
        setStatus(status, "이메일 또는 비밀번호가 올바르지 않습니다.", "error");
        submitBtn.disabled = false;
      }
    });

    $("#logout-btn").addEventListener("click", async () => {
      const logoutBtn = $("#logout-btn");
      if (logoutBtn) logoutBtn.disabled = true;

      try {
        await SpeakLogAPI.signOut();
      } catch (err) {
        console.error(err);
        alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        if (logoutBtn) logoutBtn.disabled = false;
      }
    });
  }

  function initNavigation() {
    document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchPanel(btn.dataset.panel));
    });

    $("#refresh-consultations").addEventListener("click", loadConsultations);
    $("#refresh-reviews").addEventListener("click", loadReviews);
    $("#add-notice-btn").addEventListener("click", () => openNoticeForm(null));
    $("#cancel-notice-btn").addEventListener("click", resetNoticeForm);

    $("#notice-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $("#notice-form-status");
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const id = $("#notice-id").value;
      const title = $("#notice-title").value.trim();

      if (!title) {
        setStatus(status, "제목을 입력해 주세요.", "error");
        return;
      }

      const payload = {
        title,
        link: $("#notice-link").value.trim(),
        content: $("#notice-content").value.trim(),
        pinned: $("#notice-pinned").checked,
        published: $("#notice-published").checked,
        publishedAt: $("#notice-date").value,
      };

      submitBtn.disabled = true;
      setStatus(status, "저장 중…");

      try {
        if (id) {
          await SpeakLogAPI.updateNotice(id, payload);
        } else {
          await SpeakLogAPI.createNotice(payload);
        }
        resetNoticeForm();
        await loadNotices();
        setStatus(status, "저장되었습니다.", "success");
      } catch (err) {
        console.error(err);
        setStatus(status, "저장에 실패했습니다.", "error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  async function init() {
    showLogin();

    if (!SpeakLogSupabase.isConfigured()) {
      setStatus($("#login-status"), "config.js에 Supabase URL과 Anon Key를 입력해 주세요.", "error");
    }

    initLogin();
    initNavigation();

    SpeakLogAPI.onAuthStateChange((_event, session) => {
      applyAuthSession(session);
    });

    const session = await SpeakLogAPI.getSession();
    await applyAuthSession(session);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
