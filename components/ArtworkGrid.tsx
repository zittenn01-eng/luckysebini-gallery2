import ArtworkCard from './ArtworkCard';
import { Artwork } from '@/lib/types';

interface ArtworkGridProps {
  artworks: Artwork[];
}

export default function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-4xl">🖼️</p>
        <p className="text-base" style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)' }}>
          이 카테고리에 작품이 없습니다
        </p>
      </div>
    );
  }

  return (
    /* 모바일 1열 → 태블릿 2열 → PC 3열 */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
