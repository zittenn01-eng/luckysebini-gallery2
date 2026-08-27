/**
 * ============================================================
 * 세비니의 갤러리 - Supabase 초기 데이터 시드 스크립트
 * ============================================================
 *
 * 실행 전 준비사항:
 *   1. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력
 *   2. Supabase Dashboard에서 schema.sql 실행 완료 (artworks 테이블 생성)
 *   3. public/data/artworks_fixed.csv 파일 준비
 *
 * 실행 방법:
 *   npm run seed
 *
 * 또는 직접 실행:
 *   npx tsx scripts/seed.ts
 *
 * 주의:
 *   - 실행 시 artworks 테이블의 기존 데이터를 전부 삭제하고 재삽입합니다.
 *   - orders 테이블에 참조 데이터가 있으면 삭제 실패할 수 있습니다.
 * ============================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

// .env.local 로드 (tsx는 Next.js 환경이 아니므로 직접 로드 필요)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ── Supabase 클라이언트 초기화 ────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 시드 스크립트는 RLS를 우회해야 하므로 service_role 키 우선 사용
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ .env.local에 NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없습니다.');
  process.exit(1);
}

const isServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(`🔑 Supabase 키 유형: ${isServiceRole ? 'service_role (RLS 우회)' : 'anon (RLS 적용)'}\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

// ── CSV 파일 경로 ─────────────────────────────────────────────
const CSV_PATH = path.resolve(process.cwd(), 'public/data/artworks_fixed.csv');

// ── CSV 원본 행 타입 ──────────────────────────────────────────
interface CsvRow {
  id: string;
  title: string;
  title_en: string;
  artist_name: string;
  price: string;
  category: string;
  medium: string;
  size_cm: string;
  description: string;
  description_en: string;
  status: string;
  stock: string;
  created_year: string;
  tags: string;            // "|" 구분자 문자열
  image_filename: string;
}

// ── 데이터 변환 함수 ──────────────────────────────────────────
function transformRow(row: CsvRow) {
  return {
    // id는 CSV의 값을 그대로 사용 (SERIAL이지만 명시적 삽입 허용)
    id: Number(row.id) || undefined,

    title:          row.title?.trim() || '',
    title_en:       row.title_en?.trim() || null,

    // "작가미상" → "이세빈" 으로 교체
    artist_name:    row.artist_name?.trim() === '작가미상'
                      ? '이세빈'
                      : (row.artist_name?.trim() || '이세빈'),

    price:          parseInt(row.price, 10) || 0,

    category:       row.category?.trim() || null,
    medium:         row.medium?.trim() || null,
    size_cm:        row.size_cm?.trim() || null,
    description:    row.description?.trim() || null,
    description_en: row.description_en?.trim() || null,

    // status 유효성 검사 ('available' | 'sold' | 'reserved')
    status:         ['available', 'sold', 'reserved'].includes(row.status?.trim())
                      ? row.status.trim()
                      : 'available',

    stock:          parseInt(row.stock, 10) >= 0 ? parseInt(row.stock, 10) : 1,
    created_year:   row.created_year ? parseInt(row.created_year, 10) : null,

    // "|" 구분자 → 문자열 배열
    tags:           row.tags
                      ? row.tags.split('|').map((t) => t.trim()).filter(Boolean)
                      : [],

    image_filename: row.image_filename?.trim() || null,
    image_url:      '',   // Storage 연동 전 빈 문자열로 초기화
  };
}

// ── 메인 시드 함수 ────────────────────────────────────────────
async function seed() {
  console.log('🌱 Lucky Sebini Gallery - 시드 스크립트 시작\n');

  // 1. CSV 파일 존재 확인
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV 파일을 찾을 수 없습니다: ${CSV_PATH}`);
    console.error('   public/data/artworks_fixed.csv 파일을 먼저 준비해주세요.');
    process.exit(1);
  }

  // 2. CSV 파싱
  console.log(`📄 CSV 파일 읽기: ${CSV_PATH}`);
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');

  const { data: rows, errors } = Papa.parse<CsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    console.warn('⚠️  CSV 파싱 경고:', errors);
  }

  console.log(`   → ${rows.length}개 행 파싱 완료\n`);

  // 3. 데이터 변환
  const artworks = rows.map(transformRow);

  // 변환 샘플 미리보기 (첫 2건)
  console.log('🔍 변환 데이터 샘플 (최대 2건):');
  artworks.slice(0, 2).forEach((a, i) => {
    console.log(`   [${i + 1}] ${a.title} | ${a.artist_name} | ${a.price}원 | tags: [${a.tags.join(', ')}]`);
  });
  console.log('');

  // 4. 기존 artworks 데이터 전체 삭제
  console.log('🗑️  기존 artworks 데이터 삭제 중...');

  // 테이블이 존재하는지 먼저 확인
  const { error: tableCheckError } = await supabase
    .from('artworks')
    .select('id')
    .limit(1);

  if (tableCheckError) {
    console.error('❌ artworks 테이블에 접근 실패:', tableCheckError.message);
    console.error('');
    console.error('📌 원인: Supabase에 artworks 테이블이 없습니다.');
    console.error('📌 해결 방법:');
    console.error('   1. Supabase Dashboard → SQL Editor 접속');
    console.error('   2. scripts/schema.sql 내용을 복사하여 실행 (Run)');
    console.error('   3. 테이블 생성 후 npm run seed 재실행');
    process.exit(1);
  }

  // 전체 삭제: 테이블이 비어 있으면 바로 삽입으로 진행
  const { count: existingCount } = await supabase
    .from('artworks')
    .select('*', { count: 'exact', head: true });

  if (existingCount && existingCount > 0) {
    const { error: deleteError } = await supabase
      .from('artworks')
      .delete()
      .gt('id', 0);

    if (deleteError) {
      console.error('❌ 삭제 실패:', deleteError.message);
      console.error('   orders 테이블에 참조 데이터가 있으면 먼저 orders를 삭제해주세요.');
      process.exit(1);
    }
    console.log(`   → 기존 ${existingCount}건 삭제 완료\n`);
  } else {
    console.log('   → 기존 데이터 없음, 바로 삽입 진행\n');
  }

  // 5. 새 데이터 삽입 (배치 처리: 50건씩)
  const BATCH_SIZE = 50;
  let insertedCount = 0;

  for (let i = 0; i < artworks.length; i += BATCH_SIZE) {
    const batch = artworks.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(artworks.length / BATCH_SIZE);

    console.log(`📤 삽입 중 [배치 ${batchNum}/${totalBatches}] (${batch.length}건)...`);

    const { error: insertError } = await supabase
      .from('artworks')
      .insert(batch);

    if (insertError) {
      console.error(`❌ 삽입 실패 (배치 ${batchNum}):`, insertError.message);
      process.exit(1);
    }

    insertedCount += batch.length;
  }

  // 6. 결과 확인
  const { count, error: countError } = await supabase
    .from('artworks')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.warn('⚠️  최종 카운트 확인 실패:', countError.message);
  }

  console.log(`\n✅ 시드 완료!`);
  console.log(`   삽입 요청: ${insertedCount}건`);
  console.log(`   DB 실제 저장: ${count ?? '확인 불가'}건`);
  console.log('\n💡 다음 단계: Supabase Storage에 이미지 업로드 후 image_url을 업데이트하세요.');

  // Windows에서 tsx 종료 시 UV_HANDLE_CLOSING assertion 방지
  process.exit(0);
}

seed().catch((err) => {
  console.error('💥 예기치 않은 오류:', err);
  process.exit(1);
});
