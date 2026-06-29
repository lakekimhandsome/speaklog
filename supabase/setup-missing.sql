-- SpeakLog: 누락된 테이블만 생성 (consultations, notices)
-- Supabase Dashboard → SQL Editor 에서 실행하세요.
-- reviews 테이블이 이미 있다면 이 파일만 실행해도 됩니다.

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

CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations (status);
CREATE INDEX IF NOT EXISTS idx_notices_published_pinned ON notices (published, pinned DESC, published_at DESC);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consultations_insert_public" ON consultations;
CREATE POLICY "consultations_insert_public"
  ON consultations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "consultations_select_admin" ON consultations;
CREATE POLICY "consultations_select_admin"
  ON consultations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "consultations_update_admin" ON consultations;
CREATE POLICY "consultations_update_admin"
  ON consultations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "consultations_delete_admin" ON consultations;
CREATE POLICY "consultations_delete_admin"
  ON consultations FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "notices_select_published" ON notices;
CREATE POLICY "notices_select_published"
  ON notices FOR SELECT TO anon USING (published = true);

DROP POLICY IF EXISTS "notices_insert_admin" ON notices;
CREATE POLICY "notices_insert_admin"
  ON notices FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "notices_select_admin" ON notices;
CREATE POLICY "notices_select_admin"
  ON notices FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "notices_update_admin" ON notices;
CREATE POLICY "notices_update_admin"
  ON notices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "notices_delete_admin" ON notices;
CREATE POLICY "notices_delete_admin"
  ON notices FOR DELETE TO authenticated USING (true);
