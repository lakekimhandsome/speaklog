-- ═══════════════════════════════════════════════════════════════
-- SpeakLog 신규 프로젝트 설정 확인 (방법 A)
-- ═══════════════════════════════════════════════════════════════
-- 먼저 supabase/schema.sql 전체를 SQL Editor에서 실행한 뒤,
-- 이 파일을 실행해 3개 테이블이 생성됐는지 확인하세요.
-- ═══════════════════════════════════════════════════════════════

SELECT
  table_name,
  CASE
    WHEN table_name IN ('consultations', 'reviews', 'notices') THEN 'OK'
    ELSE 'unexpected'
  END AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 기대 결과: consultations, reviews, notices 3행
