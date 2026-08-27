export default function Footer() {
  return (
    <footer
      className="mt-24 py-12 border-t"
      style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 왼쪽: 브랜드명 */}
        <div className="text-center sm:text-left space-y-1">
          <p
            className="text-sm font-semibold tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
          >
            세비니의 갤러리
          </p>
          <p
            className="text-xs tracking-wider uppercase"
            style={{ color: 'var(--muted)' }}
          >
            Lucky Sebini Gallery
          </p>
        </div>

        {/* 오른쪽: 카피라이트 */}
        <p
          className="text-xs text-center sm:text-right leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          © {new Date().getFullYear()} 이세빈 작가의 작품을 소개합니다
          <br />
          <span className="opacity-60">Handcrafted with ♥ · Powered by Supabase & Next.js</span>
        </p>
      </div>
    </footer>
  );
}
