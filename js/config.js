/**
 * SpeakLog Supabase 설정
 * ─────────────────────────────────────────────
 * 1. Supabase Dashboard → Project Settings → API
 * 2. Project URL 복사 → SUPABASE_URL
 * 3. API Keys 에서 아래 중 하나를 전체 복사 → SUPABASE_ANON_KEY
 *    - "anon" / "public" (eyJ... 로 시작하는 긴 JWT) ← 권장
 *    - 또는 "publishable" (sb_publishable_... 전체 문자열)
 * 4. 새 프로젝트라면 SQL Editor에서 supabase/schema.sql 실행 필수
 */
const SpeakLogConfig = {
  SUPABASE_URL: "https://jdhamejtlrqaeqskanjl.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_tuW_HW9ohBs9E9WEf-Y5Sw_ZjXDQX2j",
};
