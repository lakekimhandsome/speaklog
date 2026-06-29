-- SpeakLog: reviews 테이블 스키마 수정
-- Supabase Dashboard → SQL Editor 에서 실행하세요.
-- 기존 reviews 테이블 구조가 다를 때(author, content 없음) 실행합니다.

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS role TEXT DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- 게스트 후기용: user_id 가 있으면 nullable 로 변경
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- 기존 빈 행 보정 (있을 경우)
UPDATE reviews
SET
  author = COALESCE(author, '익명'),
  role = COALESCE(role, ''),
  content = COALESCE(content, ''),
  published = COALESCE(published, true)
WHERE author IS NULL OR content IS NULL;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_insert_public" ON reviews;
CREATE POLICY "reviews_insert_public"
  ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_select_published" ON reviews;
CREATE POLICY "reviews_select_published"
  ON reviews FOR SELECT TO anon USING (published = true);

DROP POLICY IF EXISTS "reviews_select_admin" ON reviews;
CREATE POLICY "reviews_select_admin"
  ON reviews FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "reviews_update_admin" ON reviews;
CREATE POLICY "reviews_update_admin"
  ON reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_delete_admin" ON reviews;
CREATE POLICY "reviews_delete_admin"
  ON reviews FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_reviews_published_created ON reviews (published, created_at DESC);
