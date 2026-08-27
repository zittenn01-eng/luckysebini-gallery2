// Server Component — Supabase에서 데이터를 서버에서 직접 fetch
import { createClient } from '@supabase/supabase-js';
import GalleryClient from '@/components/GalleryClient';
import { Artwork } from '@/lib/types';

async function getArtworks(): Promise<Artwork[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }
  return (data as Artwork[]) ?? [];
}

export default async function HomePage() {
  const artworks = await getArtworks();

  return (
    <div>
      {/* ── Hero 섹션 ──────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-start gap-6">

          {/* 데코 라인 */}
          <div
            className="w-10 h-[2px] rounded-full"
            style={{ background: 'var(--accent)' }}
          />

          {/* 메인 헤드라인 */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.3] tracking-tight max-w-2xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
          >
            이세빈 작가의 손끝에서
            <br />
            피어난 이야기들
          </h1>

          {/* 서브텍스트 */}
          <p
            className="text-base lg:text-lg leading-relaxed max-w-lg"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)' }}
          >
            따뜻한 감성과 섬세한 선으로 담아낸 세계.
            <br className="hidden sm:block" />
            원화부터 한정판 에디션까지, 일상에 예술을 더해드립니다.
          </p>

          {/* 통계 */}
          <div
            className="flex items-center gap-8 pt-2"
            style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}
          >
            {[
              { value: artworks.length, label: '총 작품' },
              { value: artworks.filter(a => a.status === 'available').length, label: '판매중' },
              { value: artworks.filter(a => a.status === 'sold').length, label: '판매완료' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-2xl font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
                >
                  {value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 배경 데코 원 */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,111,71,0.06) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
      </section>

      {/* ── 갤러리 섹션 (Client Component) ────────────── */}
      <div className="pt-14">
        <GalleryClient artworks={artworks} />
      </div>
    </div>
  );
}
