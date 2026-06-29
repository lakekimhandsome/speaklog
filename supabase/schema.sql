-- SpeakLog Supabase Schema (신규 프로젝트용)
-- ─────────────────────────────────────────────
-- 기존 DB에 Cafe Radar 테이블이 섞여 있다면:
--   1. supabase/00-inspect.sql       — 상태 확인
--   2. supabase/01-drop-cafe-radar.sql — Cafe Radar 테이블 삭제
--   3. supabase/02-reset-speaklog.sql  — SpeakLog 테이블 재생성
--
-- 또는 SpeakLog 전용 Supabase 프로젝트를 새로 만들고 이 파일만 실행하세요.
-- SpeakLog가 사용하는 테이블: consultations, reviews, notices (3개만)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS consultations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  goal        TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author      TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content     TEXT NOT NULL,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  link          TEXT,
  content       TEXT,
  pinned        BOOLEAN NOT NULL DEFAULT false,
  published     BOOLEAN NOT NULL DEFAULT true,
  published_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations (status);
CREATE INDEX IF NOT EXISTS idx_reviews_published_created ON reviews (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_published_pinned ON notices (published, pinned DESC, published_at DESC);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- consultations: 공개 INSERT, 관리자(authenticated)만 조회·수정·삭제
DROP POLICY IF EXISTS "consultations_insert_public" ON consultations;
CREATE POLICY "consultations_insert_public"
  ON consultations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "consultations_select_admin" ON consultations;
CREATE POLICY "consultations_select_admin"
  ON consultations FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "consultations_update_admin" ON consultations;
CREATE POLICY "consultations_update_admin"
  ON consultations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "consultations_delete_admin" ON consultations;
CREATE POLICY "consultations_delete_admin"
  ON consultations FOR DELETE
  TO authenticated
  USING (true);

-- reviews: 공개 INSERT, 공개 SELECT(게시됨), 관리자 전체 관리
DROP POLICY IF EXISTS "reviews_insert_public" ON reviews;
CREATE POLICY "reviews_insert_public"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_select_published" ON reviews;
CREATE POLICY "reviews_select_published"
  ON reviews FOR SELECT
  TO anon
  USING (published = true);

DROP POLICY IF EXISTS "reviews_select_admin" ON reviews;
CREATE POLICY "reviews_select_admin"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "reviews_update_admin" ON reviews;
CREATE POLICY "reviews_update_admin"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_delete_admin" ON reviews;
CREATE POLICY "reviews_delete_admin"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- notices: 공개 SELECT(게시됨), 관리자 전체 관리
DROP POLICY IF EXISTS "notices_select_published" ON notices;
CREATE POLICY "notices_select_published"
  ON notices FOR SELECT
  TO anon
  USING (published = true);

DROP POLICY IF EXISTS "notices_insert_admin" ON notices;
CREATE POLICY "notices_insert_admin"
  ON notices FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "notices_select_admin" ON notices;
CREATE POLICY "notices_select_admin"
  ON notices FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "notices_update_admin" ON notices;
CREATE POLICY "notices_update_admin"
  ON notices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "notices_delete_admin" ON notices;
CREATE POLICY "notices_delete_admin"
  ON notices FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────
-- Table grants (신규 Supabase 프로젝트 필수)
-- RLS만으로는 부족하며, anon/authenticated 에 GRANT 필요
-- ─────────────────────────────────────────────

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT INSERT ON TABLE public.consultations TO anon;
GRANT ALL ON TABLE public.consultations TO authenticated;

GRANT SELECT, INSERT ON TABLE public.reviews TO anon;
GRANT ALL ON TABLE public.reviews TO authenticated;

GRANT SELECT ON TABLE public.notices TO anon;
GRANT ALL ON TABLE public.notices TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ─────────────────────────────────────────────
-- Sample data (선택)
-- ─────────────────────────────────────────────

-- INSERT INTO notices (title, link, pinned, published, published_at) VALUES
--   ('SpeakLog 오픈 이벤트 — 첫 달 특별 혜택!', '#contact', true, true, CURRENT_DATE);
