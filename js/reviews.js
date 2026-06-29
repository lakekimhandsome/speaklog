/**
 * 후기 모듈 (Supabase)
 */
const SpeakLogReviews = (function () {
  "use strict";

  function sortByDate(reviews) {
    return [...reviews].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async function loadReviews() {
    if (!SpeakLogSupabase.isConfigured()) return [];
    try {
      return await SpeakLogAPI.fetchReviews();
    } catch (err) {
      console.error("[SpeakLog] 후기 불러오기 실패:", err);
      return [];
    }
  }

  async function saveReview({ author, role, rating, content }) {
    return SpeakLogAPI.createReview({ author, role, rating, content });
  }

  return {
    loadReviews,
    saveReview,
    sortByDate,
  };
})();
