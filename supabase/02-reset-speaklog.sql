-- ═══════════════════════════════════════════════════════════════
-- SpeakLog 테이블 초기화 + 올바른 스키마 재생성
-- ═══════════════════════════════════════════════════════════════
-- reviews 가 Cafe Radar 스키마(user_id만 있던 등)로 꼬여 있을 때 실행합니다.
-- consultations, notices, reviews 의 기존 데이터는 모두 삭제됩니다.
--
-- 순서:
--   1. 00-inspect.sql  — 현재 상태 확인
--   2. 01-drop-cafe-radar.sql — Cafe Radar 테이블 삭제 (선택)
--   3. 이 파일 실행
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS notices CASCADE;

-- ─── consultations ───

CREATE TABLE consultations (
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

-- ─── reviews ───

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author      TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content     TEXT NOT NULL,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── notices ───

CREATE TABLE notices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  link          TEXT,
  content       TEXT,
  pinned        BOOLEAN NOT NULL DEFAULT false,
  published     BOOLEAN NOT NULL DEFAULT true,
  published_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── indexes ───

CREATE INDEX idx_consultations_created_at ON consultations (created_at DESC);
CREATE INDEX idx_consultations_status ON consultations (status);
CREATE INDEX idx_reviews_published_created ON reviews (published, created_at DESC);
CREATE INDEX idx_notices_published_pinned ON notices (published, pinned DESC, published_at DESC);

-- ─── RLS ───

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultations_insert_public"
  ON consultations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "consultations_select_admin"
  ON consultations FOR SELECT TO authenticated USING (true);

CREATE POLICY "consultations_update_admin"
  ON consultations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "consultations_delete_admin"
  ON consultations FOR DELETE TO authenticated USING (true);

CREATE POLICY "reviews_insert_public"
  ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "reviews_select_published"
  ON reviews FOR SELECT TO anon USING (published = true);

CREATE POLICY "reviews_select_admin"
  ON reviews FOR SELECT TO authenticated USING (true);

CREATE POLICY "reviews_update_admin"
  ON reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "reviews_delete_admin"
  ON reviews FOR DELETE TO authenticated USING (true);

CREATE POLICY "notices_select_published"
  ON notices FOR SELECT TO anon USING (published = true);

CREATE POLICY "notices_insert_admin"
  ON notices FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "notices_select_admin"
  ON notices FOR SELECT TO authenticated USING (true);

CREATE POLICY "notices_update_admin"
  ON notices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "notices_delete_admin"
  ON notices FOR DELETE TO authenticated USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT INSERT ON TABLE public.consultations TO anon;
GRANT ALL ON TABLE public.consultations TO authenticated;

GRANT SELECT, INSERT ON TABLE public.reviews TO anon;
GRANT ALL ON TABLE public.reviews TO authenticated;

GRANT SELECT ON TABLE public.notices TO anon;
GRANT ALL ON TABLE public.notices TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ─── 샘플 공지 (선택) ───

INSERT INTO notices (title, link, pinned, published, published_at) VALUES
  ('SpeakLog 오픈 이벤트 — 첫 달 특별 혜택!', '#contact', true, true, CURRENT_DATE);
