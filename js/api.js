/**
 * SpeakLog Supabase API
 */
const SpeakLogAPI = (function () {
  "use strict";

  function db() {
    const client = SpeakLogSupabase.getClient();
    if (!client) throw new Error("Supabase가 설정되지 않았습니다. js/config.js를 확인해 주세요.");
    return client;
  }

  function formatNoticeDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return String(isoDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  }

  function mapReview(row) {
    return {
      id: row.id,
      author: row.author,
      role: row.role || "",
      rating: row.rating,
      content: row.content,
      published: row.published,
      createdAt: row.created_at,
    };
  }

  function mapNotice(row) {
    const date = row.published_at || row.created_at;
    return {
      id: row.id,
      title: row.title,
      link: row.link || "",
      content: row.content || "",
      pinned: row.pinned,
      published: row.published,
      date,
      dateLabel: formatNoticeDate(date),
    };
  }

  function mapConsultation(row) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || "",
      goal: row.goal || "",
      message: row.message || "",
      status: row.status,
      createdAt: row.created_at,
    };
  }

  async function fetchReviews() {
    const { data, error } = await db()
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapReview);
  }

  async function createReview({ author, role, rating, content }) {
    const { error } = await db()
      .from("reviews")
      .insert({
        author,
        role: role || "",
        rating: Number(rating),
        content,
        published: true,
      });

    if (error) throw error;

    return {
      author,
      role: role || "",
      rating: Number(rating),
      content,
      published: true,
      createdAt: new Date().toISOString(),
    };
  }

  async function fetchNotices() {
    const { data, error } = await db()
      .from("notices")
      .select("*")
      .eq("published", true)
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapNotice);
  }

  async function submitConsultation({ name, phone, email, goal, message }) {
    const { error } = await db()
      .from("consultations")
      .insert({
        name,
        phone,
        email: email || null,
        goal: goal || null,
        message: message || null,
        status: "pending",
      });

    if (error) throw error;

    return {
      name,
      phone,
      email: email || "",
      goal: goal || "",
      message: message || "",
      status: "pending",
    };
  }

  /* ── Admin ── */

  async function signIn(email, password) {
    const { data, error } = await db().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await db().auth.signOut();
    if (error) throw error;
  }

  async function getSession() {
    const client = SpeakLogSupabase.getClient();
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session;
  }

  function onAuthStateChange(callback) {
    const client = SpeakLogSupabase.getClient();
    if (!client) return { data: { subscription: { unsubscribe() {} } } };
    return client.auth.onAuthStateChange(callback);
  }

  async function fetchAllConsultations() {
    const { data, error } = await db()
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapConsultation);
  }

  async function updateConsultationStatus(id, status) {
    const { data, error } = await db()
      .from("consultations")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapConsultation(data);
  }

  async function deleteConsultation(id) {
    const { error } = await db().from("consultations").delete().eq("id", id);
    if (error) throw error;
  }

  async function fetchAllReviews() {
    const { data, error } = await db()
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapReview);
  }

  async function updateReview(id, patch) {
    const payload = {};
    if ("published" in patch) payload.published = patch.published;
    if ("author" in patch) payload.author = patch.author;
    if ("role" in patch) payload.role = patch.role;
    if ("rating" in patch) payload.rating = patch.rating;
    if ("content" in patch) payload.content = patch.content;

    const { data, error } = await db()
      .from("reviews")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapReview(data);
  }

  async function deleteReview(id) {
    const { error } = await db().from("reviews").delete().eq("id", id);
    if (error) throw error;
  }

  async function fetchAllNotices() {
    const { data, error } = await db()
      .from("notices")
      .select("*")
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(mapNotice);
  }

  async function createNotice({ title, link, content, pinned, published, publishedAt }) {
    const { data, error } = await db()
      .from("notices")
      .insert({
        title,
        link: link || null,
        content: content || null,
        pinned: Boolean(pinned),
        published: published !== false,
        published_at: publishedAt || new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (error) throw error;
    return mapNotice(data);
  }

  async function updateNotice(id, patch) {
    const payload = {};
    if ("title" in patch) payload.title = patch.title;
    if ("link" in patch) payload.link = patch.link || null;
    if ("content" in patch) payload.content = patch.content || null;
    if ("pinned" in patch) payload.pinned = patch.pinned;
    if ("published" in patch) payload.published = patch.published;
    if ("publishedAt" in patch) payload.published_at = patch.publishedAt;

    const { data, error } = await db()
      .from("notices")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapNotice(data);
  }

  async function deleteNotice(id) {
    const { error } = await db().from("notices").delete().eq("id", id);
    if (error) throw error;
  }

  return {
    fetchReviews,
    createReview,
    fetchNotices,
    submitConsultation,
    signIn,
    signOut,
    getSession,
    onAuthStateChange,
    fetchAllConsultations,
    updateConsultationStatus,
    deleteConsultation,
    fetchAllReviews,
    updateReview,
    deleteReview,
    fetchAllNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    formatNoticeDate,
  };
})();
