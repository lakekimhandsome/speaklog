-- SpeakLog DB 정리: 현재 테이블 점검
-- Supabase Dashboard → SQL Editor 에서 먼저 실행하세요.

SELECT
  table_name,
  (SELECT count(*) FROM information_schema.columns c
   WHERE c.table_schema = 'public' AND c.table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 테이블별 컬럼 상세
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'consultations', 'reviews', 'notices',
    'job_seekers', 'jobs', 'profiles'
  )
ORDER BY table_name, ordinal_position;

-- 행 수 확인 (데이터 백업 여부 판단용)
SELECT 'consultations' AS tbl, count(*) FROM consultations
UNION ALL SELECT 'reviews', count(*) FROM reviews
UNION ALL SELECT 'notices', count(*) FROM notices
UNION ALL SELECT 'job_seekers', count(*) FROM job_seekers
UNION ALL SELECT 'jobs', count(*) FROM jobs
UNION ALL SELECT 'profiles', count(*) FROM profiles;
