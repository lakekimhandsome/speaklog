/**
 * Supabase 클라이언트 (GitHub Pages 정적 사이트용)
 */
const SpeakLogSupabase = (function () {
  "use strict";

  let client = null;

  function isConfigured() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = SpeakLogConfig;
    return (
      Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
      SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
      SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
    );
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (client) return client;

    if (typeof supabase === "undefined" || !supabase.createClient) {
      console.error("[SpeakLog] Supabase JS SDK가 로드되지 않았습니다.");
      return null;
    }

    client = supabase.createClient(
      SpeakLogConfig.SUPABASE_URL,
      SpeakLogConfig.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          storage: window.sessionStorage,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );

    return client;
  }

  return { getClient, isConfigured };
})();
