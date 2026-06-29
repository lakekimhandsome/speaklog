-- ═══════════════════════════════════════════════════════════════
-- SpeakLog DB 정리 — Cafe Radar 테이블 제거
-- ═══════════════════════════════════════════════════════════════
-- 현재 public 스키마:
--   SpeakLog  → consultations, notices, reviews
--   Cafe Radar → job_seekers, jobs, profiles  ← 이 파일에서 삭제
--
-- ⚠️ 실행 전 00-inspect.sql 로 데이터 확인하세요.
-- ⚠️ Cafe Radar 앱을 같은 프로젝트에서 계속 쓸 거면 이 SQL 실행하지 마세요.
--    그 경우 SpeakLog 전용 Supabase 프로젝트를 새로 만드는 것을 권장합니다.
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS job_seekers CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Cafe Radar용 RLS 정책/함수가 남아 있으면 수동 확인:
-- Dashboard → Database → Functions / Policies
