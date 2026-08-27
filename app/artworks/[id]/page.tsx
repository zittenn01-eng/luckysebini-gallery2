// Server Component — id로 Supabase에서 작품 데이터 fetch
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Artwork } from '@/lib/types';
import ArtworkDetailClient from '@/components/ArtworkDetailClient';

async function getArtwork(id: number): Promise<Artwork | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Artwork;
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artworkId = Number(id);

  if (isNaN(artworkId)) notFound();

  const artwork = await getArtwork(artworkId);
  if (!artwork) notFound();

  return (
    <div>
      {/* 뒤로가기 */}
      <div
        className="max-w-none px-8 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-60"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)' }}
        >
          ← 갤러리로 돌아가기
        </Link>
      </div>

      {/* 상세 페이지 (Client Component) */}
      <ArtworkDetailClient artwork={artwork} />
    </div>
  );
}
