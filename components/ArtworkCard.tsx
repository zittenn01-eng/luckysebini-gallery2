import Link from 'next/link';
import Image from 'next/image';
import { Artwork } from '@/lib/types';

interface ArtworkCardProps {
  artwork: Artwork;
}

const STATUS_MAP = {
  available: { label: '판매중', color: '#2d6a4f', bg: '#d8f3dc' },
  sold:      { label: '판매완료', color: '#6b6b62', bg: '#ebebeb' },
  reserved:  { label: '예약중', color: '#805b00', bg: '#fef3c7' },
} as const;

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  // image_url(Supabase Storage) 우선, 없으면 /images/ 로컬 폴더
  const imageSrc =
    artwork.image_url && artwork.image_url.trim() !== ''
      ? artwork.image_url
      : artwork.image_filename
      ? `/images/${artwork.image_filename}`
      : null;

  const status = STATUS_MAP[artwork.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.available;
  const isSold = artwork.status === 'sold';

  return (
    <Link
      href={`/artworks/${artwork.id}`}
      className="artwork-card group block rounded-2xl overflow-hidden"
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 12px -2px rgba(0,0,0,0.06)',
      }}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#f0ede8' }}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={artwork.title}
            fill
            className="artwork-img object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c8c4bc" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-xs" style={{ color: '#b0ab9e' }}>이미지 준비 중</span>
          </div>
        )}

        {/* 판매완료 오버레이 */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center"
               style={{ background: 'rgba(250,250,248,0.72)', backdropFilter: 'blur(2px)' }}>
            <span
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: '#6b6b62', color: '#fff', letterSpacing: '0.12em' }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="p-5">
        {/* 카테고리 뱃지 */}
        <div className="flex items-center justify-between mb-2.5">
          {artwork.category && (
            <span
              className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full tracking-wide"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {artwork.category}
            </span>
          )}
          {/* 판매 상태 뱃지 */}
          <span
            className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ml-auto"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {/* 작품명 */}
        <h3
          className="font-semibold text-base leading-snug mb-1.5 line-clamp-2 transition-colors group-hover:text-[var(--accent)]"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg)' }}
        >
          {artwork.title}
        </h3>

        {/* 영어 제목 */}
        {artwork.title_en && (
          <p
            className="text-xs mb-3 line-clamp-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--muted)', fontStyle: 'italic' }}
          >
            {artwork.title_en}
          </p>
        )}

        {/* 가격 */}
        <div className="flex items-center justify-between pt-3"
             style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {artwork.medium || artwork.size_cm || ''}
          </span>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: 'var(--font-display)', color: isSold ? 'var(--muted)' : 'var(--fg)' }}
          >
            {artwork.price.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>
    </Link>
  );
}
