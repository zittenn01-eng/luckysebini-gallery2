-- =============================================================
-- Lucky Sebini Gallery - Supabase Schema
-- Run in: Supabase Dashboard > SQL Editor
-- =============================================================


-- -------------------------------------------------------------
-- 1. artworks 테이블
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artworks (
  id              SERIAL PRIMARY KEY,
  title           TEXT          NOT NULL,
  title_en        TEXT,
  artist_name     TEXT,
  price           INTEGER       NOT NULL CHECK (price >= 0),
  category        TEXT,
  medium          TEXT,
  size_cm         TEXT,
  description     TEXT,
  description_en  TEXT,
  status          TEXT          NOT NULL DEFAULT 'available'
                    CHECK (status IN ('available', 'sold', 'reserved')),
  stock           INTEGER       NOT NULL DEFAULT 1
                    CHECK (stock >= 0),
  created_year    INTEGER,
  tags            TEXT[],
  image_filename  TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artworks_status     ON artworks (status);
CREATE INDEX IF NOT EXISTS idx_artworks_category   ON artworks (category);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON artworks (created_at DESC);


-- -------------------------------------------------------------
-- 2. orders 테이블
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id   INTEGER     NOT NULL REFERENCES artworks (id) ON DELETE RESTRICT,
  buyer_name   TEXT        NOT NULL,
  buyer_email  TEXT        NOT NULL,
  buyer_phone  TEXT,
  amount       INTEGER     NOT NULL CHECK (amount > 0),
  payment_key  TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_artwork_id ON orders (artwork_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);


-- -------------------------------------------------------------
-- 3. Row Level Security (RLS) 정책
-- (이미 존재하면 DROP 후 재생성 → 재실행 안전)
-- -------------------------------------------------------------

-- artworks: 공개 읽기 / 인증 사용자만 쓰기
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "artworks_select_public"      ON artworks;
DROP POLICY IF EXISTS "artworks_insert_authenticated" ON artworks;
DROP POLICY IF EXISTS "artworks_update_authenticated" ON artworks;
DROP POLICY IF EXISTS "artworks_delete_authenticated" ON artworks;

CREATE POLICY "artworks_select_public"
  ON artworks FOR SELECT USING (true);

CREATE POLICY "artworks_insert_authenticated"
  ON artworks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "artworks_update_authenticated"
  ON artworks FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "artworks_delete_authenticated"
  ON artworks FOR DELETE
  USING (auth.role() = 'authenticated');


-- orders: 누구나 주문 생성 / 관리자 전체 조회 or 구매자 본인 조회
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_insert_public"        ON orders;
DROP POLICY IF EXISTS "orders_select_own"            ON orders;
DROP POLICY IF EXISTS "orders_update_authenticated"  ON orders;

CREATE POLICY "orders_insert_public"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (
    auth.role() = 'authenticated'
    OR buyer_email = current_setting('request.jwt.claims', true)::json->>'email'
  );

CREATE POLICY "orders_update_authenticated"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');


-- -------------------------------------------------------------
-- 4. 헬퍼 함수: 결제 완료 시 stock 차감 + status 자동 업데이트
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION decrement_stock(artwork_row_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE artworks
  SET
    stock  = GREATEST(stock - 1, 0),
    status = CASE WHEN stock - 1 <= 0 THEN 'sold' ELSE status END
  WHERE id = artwork_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- -------------------------------------------------------------
-- 5. 샘플 데이터 (선택 실행 — 주석 해제 후 실행)
-- -------------------------------------------------------------
-- INSERT INTO artworks
--   (title, title_en, artist_name, price, category, medium, size_cm, description, tags, image_filename, image_url)
-- VALUES
--   ('행운을 부르는 해바라기', 'Lucky Sunflower', '세비니 (Sebini)', 150000,
--    'Painting', 'Oil on Canvas', '30 x 30 cm',
--    '따뜻한 햇살과 긍정적인 에너지를 담은 유화 작품입니다.',
--    ARRAY['꽃','유화','행운'], 'sunflower.jpg', ''),
--   ('새벽의 푸른 숲', 'Blue Forest at Dawn', '세비니 (Sebini)', 220000,
--    'Painting', 'Acrylic on Canvas', '40 x 50 cm',
--    '고요한 새벽안개 속 피어나는 숲의 신비로움을 표현했습니다.',
--    ARRAY['숲','아크릴','새벽'], 'blue_forest.jpg', '');


-- =============================================================
-- Supabase Storage 버킷 생성 방법
-- =============================================================
--
-- ■ 방법 1: Dashboard GUI (권장)
--   1. Supabase 콘솔 → 왼쪽 메뉴 [Storage] 클릭
--   2. [New bucket] 버튼 클릭
--   3. Bucket name  : artwork-images
--   4. Public bucket: ON (체크) — 공개 URL로 이미지를 서빙하려면 필수
--   5. [Save] 클릭
--
-- ■ 방법 2: SQL Editor에서 직접 생성
--
--   INSERT INTO storage.buckets (id, name, public)
--   VALUES ('artwork-images', 'artwork-images', true)
--   ON CONFLICT (id) DO NOTHING;
--
-- ■ Storage 접근 정책 추가
--
--   -- 공개 읽기
--   CREATE POLICY "artwork_images_public_read"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'artwork-images');
--
--   -- 인증 사용자(관리자)만 업로드
--   CREATE POLICY "artwork_images_auth_upload"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'artwork-images' AND auth.role() = 'authenticated');
--
-- ■ 업로드 후 공개 URL 형식 (artworks.image_url 에 저장):
--   https://<PROJECT_REF>.supabase.co/storage/v1/object/public/artwork-images/<파일명>
--
-- =============================================================
