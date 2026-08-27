import type { Metadata } from 'next';
import { Noto_Serif_KR, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const notoSerifKR = Noto_Serif_KR({
  variable: '--font-noto-serif-kr',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '세비니의 갤러리 | Lucky Sebini Gallery',
  description: '이세빈 작가의 손끝에서 피어난 따뜻한 이야기들 — 일러스트, 페인팅, 드로잉 원화 & 에디션 스토어',
  openGraph: {
    title: '세비니의 갤러리',
    description: '이세빈 작가의 감성 아트 갤러리 & 온라인 스토어',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKR.variable} ${playfair.variable}`}
    >
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-serif)' }}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
