-- SpeakLog: anon / authenticated 테이블 권한 부여
-- 권한 오류(42501) 발생 시 SQL Editor에서 실행하세요.
-- schema.sql 실행 후에도 접수·후기가 안 되면 이 파일을 실행합니다.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT INSERT ON TABLE public.consultations TO anon;
GRANT ALL ON TABLE public.consultations TO authenticated;

GRANT SELECT, INSERT ON TABLE public.reviews TO anon;
GRANT ALL ON TABLE public.reviews TO authenticated;

GRANT SELECT ON TABLE public.notices TO anon;
GRANT ALL ON TABLE public.notices TO authenticated;

-- 시퀀스가 있을 경우 (UUID 기본값은 보통 불필요)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
