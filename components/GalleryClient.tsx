'use client';

import { useState, useMemo } from 'react';
import ArtworkGrid from './ArtworkGrid';
import { Artwork } from '@/lib/types';

const CATEGORIES = [
  '전체',
  '일러스트',
  '페인팅',
  '드로잉',
  '피규어 컬렉션',
  '포스터 세트',
  '캘린더',
];

interface GalleryClientProps {
  artworks: Artwork[];
}

export default function GalleryClient({ artworks }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered = useMemo(() => {
    if (activeCategory === '전체') return artworks;
    return artworks.filter((a) => a.category === activeCategory);
  }, [artworks, activeCategory]);

  return (
    <section id="gallery" className="max-w-6xl mx-auto px-6 lg:px-8 pb-16">
      {/* 갤러리 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
          >
            작품 목록
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            총 {filtered.length}점
          </p>
        </div>

        {/* 카테고리 필터 탭 */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn text-sm pb-0.5 ${activeCategory === cat ? 'active' : ''}`}
              style={{
                color: activeCategory === cat ? 'var(--accent)' : 'var(--muted)',
                fontFamily: 'var(--font-serif)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 그리드 */}
      <ArtworkGrid artworks={filtered} />
    </section>
  );
}
