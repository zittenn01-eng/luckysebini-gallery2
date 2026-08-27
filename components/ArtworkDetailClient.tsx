'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Artwork } from '@/lib/types';

// ── 아이콘 (inline SVG) ────────────────────────────────────
function IconBrush() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
      <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
    </svg>
  );
}
function IconRuler() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/>
      <path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}

// ── 구매 모달 ─────────────────────────────────────────────
interface BuyModalProps {
  artwork: Artwork;
  onClose: () => void;
}

function BuyModal({ artwork, onClose }: BuyModalProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '이름을 입력해주세요';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = '올바른 이메일을 입력해주세요';
    if (!form.phone.trim()) e.phone = '전화번호를 입력해주세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // sessionStorage에 구매 정보 저장
    sessionStorage.setItem(
      'pendingOrder',
      JSON.stringify({
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        price: artwork.price,
        buyerName: form.name,
        buyerEmail: form.email,
        buyerPhone: form.phone,
      })
    );

    router.push(
      `/checkout?artworkId=${artwork.id}&price=${artwork.price}&title=${encodeURIComponent(artwork.title)}`
    );
  };

  return (
    // 딤 배경
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 모달 박스 */}
      <div
        className="w-full max-w-md rounded-3xl p-7 sm:p-8 relative"
        style={{ background: '#fff', boxShadow: '0 24px 64px -12px rgba(0,0,0,0.25)' }}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full transition-colors hover:opacity-60"
          style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="닫기"
        >
          <IconX />
        </button>

        {/* 헤더 */}
        <div className="mb-6 space-y-1 pr-6">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            구매 신청
          </p>
          <h2
            className="text-xl font-semibold leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
          >
            {artwork.title}
          </h2>
          <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}>
            {artwork.price.toLocaleString('ko-KR')}원
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {[
            { key: 'name',  label: '성함',    type: 'text',  placeholder: '홍길동' },
            { key: 'email', label: '이메일',   type: 'email', placeholder: 'example@mail.com' },
            { key: 'phone', label: '전화번호', type: 'tel',   placeholder: '010-1234-5678' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label
                className="block text-xs font-semibold"
                style={{ color: 'var(--fg)' }}
              >
                {label} <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{
                  border: errors[key]
                    ? '1.5px solid #e07070'
                    : '1.5px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--fg)',
                  fontFamily: 'var(--font-serif)',
                }}
              />
              {errors[key] && (
                <p className="text-[11px]" style={{ color: '#c0392b' }}>
                  {errors[key]}
                </p>
              )}
            </div>
          ))}

          <p className="text-[11px] pt-1" style={{ color: 'var(--muted)' }}>
            입력하신 정보는 결제 및 배송에만 사용됩니다.
          </p>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all mt-2 hover:opacity-90 active:scale-[0.99]"
            style={{
              background: 'var(--fg)',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'var(--font-serif)',
            }}
          >
            결제 페이지로 이동 →
          </button>
        </form>
      </div>
    </div>
  );
}

// ── 메인 Client Component ─────────────────────────────────
interface ArtworkDetailClientProps {
  artwork: Artwork;
}

export default function ArtworkDetailClient({ artwork }: ArtworkDetailClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isSold = artwork.status === 'sold';
  const isReserved = artwork.status === 'reserved';

  const imageSrc =
    !imgError && artwork.image_url && artwork.image_url.trim() !== ''
      ? artwork.image_url
      : !imgError && artwork.image_filename
      ? `/images/${artwork.image_filename}`
      : null;

  return (
    <>
      {/* ── 레이아웃: 좌 60% 이미지 / 우 40% 정보 ── */}
      <div className="flex flex-col lg:flex-row min-h-[80vh]">

        {/* ── 좌: 작품 이미지 (60%) ──────────────────── */}
        <div
          className="lg:w-[60%] relative flex items-center justify-center"
          style={{ background: '#f0ede8', minHeight: '50vw' }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={artwork.title}
              fill
              className="object-contain p-6 sm:p-10"
              priority
              onError={() => setImgError(true)}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#c8c4bc" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p className="text-sm" style={{ color: '#b0ab9e' }}>이미지 준비 중</p>
            </div>
          )}

          {/* SOLD 오버레이 */}
          {isSold && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(250,250,248,0.65)', backdropFilter: 'blur(3px)' }}
            >
              <span
                className="px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase"
                style={{ background: '#3d3d3a', color: '#fff' }}
              >
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* ── 우: 정보 패널 (40%) ─────────────────────── */}
        <div
          className="lg:w-[40%] flex flex-col justify-between p-8 sm:p-10 lg:p-12 overflow-y-auto"
          style={{ background: 'var(--bg)' }}
        >
          {/* 상단 정보 */}
          <div className="space-y-6">

            {/* 1. 카테고리 뱃지 */}
            {artwork.category && (
              <span
                className="inline-block text-xs font-medium px-3 py-1 rounded-full tracking-wide"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                {artwork.category}
              </span>
            )}

            {/* 2. 작품명 한국어 */}
            <div className="space-y-1.5">
              <h1
                className="text-3xl sm:text-4xl font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}
              >
                {artwork.title}
              </h1>

              {/* 3. 작품명 영어 */}
              {artwork.title_en && (
                <p
                  className="text-base italic"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--muted)' }}
                >
                  {artwork.title_en}
                </p>
              )}

              {/* 4. 작가명 */}
              <p className="text-sm pt-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)' }}>
                by {artwork.artist_name || '이세빈'}
              </p>
            </div>

            {/* 5. 구분선 */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* 6. 재료 / 크기 / 연도 */}
            <div className="space-y-3">
              {[
                { icon: <IconBrush />, label: '재료', value: artwork.medium },
                { icon: <IconRuler />, label: '크기',  value: artwork.size_cm },
                { icon: <IconCalendar />, label: '제작연도', value: artwork.created_year?.toString() },
              ]
                .filter((row) => row.value)
                .map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span style={{ color: 'var(--accent)' }}>{icon}</span>
                    <span className="text-xs w-16 shrink-0" style={{ color: 'var(--muted)' }}>{label}</span>
                    <span className="text-sm" style={{ color: 'var(--fg)', fontFamily: 'var(--font-serif)' }}>
                      {value}
                    </span>
                  </div>
                ))}
            </div>

            {/* 7. 작품 설명 */}
            {artwork.description && (
              <p
                className="text-sm leading-[1.9] whitespace-pre-line"
                style={{ color: 'var(--muted)', fontFamily: 'var(--font-serif)' }}
              >
                {artwork.description}
              </p>
            )}

            {/* 8. 태그 */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--border)', color: 'var(--muted)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 하단: 가격 + 버튼 */}
          <div className="space-y-5 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>

            {/* 9. 구분선 이미 위에 있으므로 생략 */}

            {/* 10. 가격 */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>판매 가격</span>
              <span
                className="text-3xl font-semibold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: isSold ? 'var(--muted)' : 'var(--accent)',
                }}
              >
                {artwork.price.toLocaleString('ko-KR')}원
              </span>
            </div>

            {/* 11. 구매하기 / 판매완료 버튼 */}
            {isSold ? (
              <button
                disabled
                className="w-full py-4 rounded-xl text-sm font-semibold tracking-wide"
                style={{
                  background: 'var(--border)',
                  color: 'var(--muted)',
                  cursor: 'not-allowed',
                  fontFamily: 'var(--font-serif)',
                  border: 'none',
                }}
              >
                판매 완료된 작품입니다
              </button>
            ) : isReserved ? (
              <button
                disabled
                className="w-full py-4 rounded-xl text-sm font-semibold tracking-wide"
                style={{
                  background: '#fef3c7',
                  color: '#805b00',
                  cursor: 'not-allowed',
                  fontFamily: 'var(--font-serif)',
                  border: 'none',
                }}
              >
                예약 중인 작품입니다
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-4 rounded-xl text-sm font-semibold tracking-wide transition-all hover:opacity-85 active:scale-[0.99]"
                style={{
                  background: 'var(--fg)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-serif)',
                  border: 'none',
                }}
              >
                구매하기
              </button>
            )}

            <p className="text-[11px] text-center" style={{ color: 'var(--muted)' }}>
              안전한 토스페이먼츠 결제 · 파손 방지 안심 포장 배송
            </p>
          </div>
        </div>
      </div>

      {/* 구매 모달 */}
      {showModal && (
        <BuyModal artwork={artwork} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
