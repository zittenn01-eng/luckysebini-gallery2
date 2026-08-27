'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/#gallery', label: '갤러리' },
  { href: '/admin', label: '관리자' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(250,250,248,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="group flex flex-col leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span
            className="text-lg font-semibold tracking-wide transition-colors"
            style={{ color: 'var(--fg)' }}
          >
            세비니의 갤러리
          </span>
          <span
            className="text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Lucky Sebini Gallery
          </span>
        </Link>

        {/* 내비게이션 */}
        <nav className="flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`filter-btn text-sm tracking-wide pb-0.5 ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
