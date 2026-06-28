/**
 * 게스트 후기 저장소
 * ─────────────────────────────────────────────
 * 현재: localStorage
 * DB 연동 시: loadGuestReviews / saveGuestReview 내부만 API 호출로 교체
 */
const SpeakLogReviews = (function () {
  "use strict";

  const STORAGE_KEY = "speaklog_guest_reviews";

  function loadGuestReviews() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveGuestReview(review) {
    const reviews = loadGuestReviews();
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    return review;
  }

  function mergeReviews(staticReviews, guestReviews) {
    const merged = [...staticReviews, ...guestReviews];
    return merged.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  function createGuestReview({ author, role, rating, content }) {
    return {
      id: `guest-${Date.now()}`,
      author,
      role: role || "",
      rating: Number(rating),
      content,
      createdAt: new Date().toISOString(),
      source: "guest",
    };
  }

  return {
    loadGuestReviews,
    saveGuestReview,
    mergeReviews,
    createGuestReview,
  };
})();
