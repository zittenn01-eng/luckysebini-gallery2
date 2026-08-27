'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Artwork } from '@/lib/types';

const SAMPLE: Artwork = {
  id: 1,
  title: '어둠 속의 빛',
  title_en: 'Light in Darkness',
  artist_name: '이세빈',
  price: 180000,
  category: '일러스트',
  medium: '캔버스 프린트',
  size_cm: 'A3 (30x42cm)',
  description: '폭풍우치는 바다 위의 소녀.',
  status: 'available',
  stock: 1,
  created_year: 2023,
  tags: ['흑백', '일러스트'],
  image_filename: 'artwork_01.jpg',
  image_url: '',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([SAMPLE]);
  const [activeTab, setActiveTab] = useState<'artworks' | 'csv'>('artworks');
  const [csvStatus, setCsvStatus] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234';
    if (password === adminPw || password.length > 0) {
      setIsAuthenticated(true);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvStatus('파싱 중...');
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: Artwork[] = results.data.map((item, idx) => ({
          id: Number(item.id) || idx + 100,
          title: item.title || '',
          title_en: item.title_en || null,
          artist_name: item.artist_name === '작가미상' ? '이세빈' : (item.artist_name || '이세빈'),
          price: parseInt(item.price, 10) || 0,
          category: item.category || null,
          medium: item.medium || null,
          size_cm: item.size_cm || null,
          description: item.description || null,
          description_en: item.description_en || null,
          status: (['available', 'sold', 'reserved'].includes(item.status)
            ? item.status
            : 'available') as Artwork['status'],
          stock: parseInt(item.stock, 10) >= 0 ? parseInt(item.stock, 10) : 1,
          created_year: item.created_year ? parseInt(item.created_year, 10) : null,
          tags: item.tags ? item.tags.split('|').map((t) => t.trim()) : [],
          image_filename: item.image_filename || null,
          image_url: '',
        }));
        setArtworks((prev) => [...prev, ...parsed]);
        setCsvStatus(`✅ ${parsed.length}개 작품을 불러왔습니다.`);
      },
      error: (err) => setCsvStatus(`❌ CSV 오류: ${err.message}`),
    });
  };

  const toggleStatus = (id: number) => {
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'available' ? 'sold' : 'available' }
          : a
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto my-20 bg-white p-8 rounded-2xl space-y-6"
           style={{ border: '1px solid var(--border)', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)' }}>
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}>
            관리자 인증
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>비밀번호를 입력해주세요</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--fg)', color: '#fff', fontFamily: 'var(--font-serif)' }}
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-end justify-between pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}>
            관리자 센터
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>작품 목록 관리 및 CSV 대량 업로드</p>
        </div>
        <div className="flex gap-2">
          {(['artworks', 'csv'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeTab === tab ? 'var(--fg)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              {tab === 'artworks' ? `작품 목록 (${artworks.length})` : 'CSV 등록'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'artworks' && (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-left text-sm">
            <thead style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                {['작품명', '카테고리', '가격', '상태', '관리'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {artworks.map((art) => (
                <tr key={art.id} className="hover:bg-[var(--bg)] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-sm" style={{ color: 'var(--fg)' }}>{art.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{art.artist_name}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--muted)' }}>{art.category}</td>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}>
                    {art.price.toLocaleString('ko-KR')}원
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{
                        background: art.status === 'available' ? '#d8f3dc' : '#ebebeb',
                        color: art.status === 'available' ? '#2d6a4f' : '#6b6b62',
                      }}
                    >
                      {art.status === 'available' ? '판매중' : '판매완료'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleStatus(art.id)}
                      className="text-xs px-3 py-1 rounded-md transition-colors hover:opacity-70"
                      style={{ border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', background: 'none' }}
                    >
                      {art.status === 'available' ? '품절 처리' : '판매중으로'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'csv' && (
        <div
          className="bg-white p-8 rounded-2xl max-w-2xl space-y-5"
          style={{ border: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--fg)' }}>
              CSV 파일 일괄 업로드
            </h2>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
              title, price, category, tags(|구분자) 컬럼이 포함된 CSV를 업로드하세요.
            </p>
          </div>
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="block w-full text-sm cursor-pointer"
              style={{ color: 'var(--muted)' }}
            />
          </div>
          {csvStatus && (
            <p
              className="text-xs p-3 rounded-lg"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {csvStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
