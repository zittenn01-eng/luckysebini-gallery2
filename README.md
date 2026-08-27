# 세비니의 갤러리 (Lucky Sebini Gallery) 🎨

이세빈 작가의 작품을 소개하고 판매하는 온라인 아트 갤러리 웹 애플리케이션입니다.

## ✨ 주요 기능

- **메인 갤러리 (`/`)**: 감성적인 갤러리 UI, 카테고리별 실시간 필터링, 부드러운 카드 호버 인터랙션
- **작품 상세 페이지 (`/artworks/[id]`)**: 6:4 분할 레이아웃, 상세 스펙(재료, 크기, 연도), 태그, 판매 상태 표시 및 구매 모달
- **관리자 페이지 (`/admin`)**: 비밀번호 인증, 작품 목록 조회/상태 변경, CSV 대량 업로드
- **데이터베이스 연동**: Supabase DB (`artworks`, `orders`) 연동 및 RLS 보안 정책 적용
- **데이터 시딩 (`scripts/seed.ts`)**: CSV 데이터 파싱 및 Supabase 일괄 삽입

## 🛠️ 기술 스택

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS, Google Fonts (Noto Serif KR, Playfair Display)
- **Database / Backend**: Supabase (PostgreSQL, RLS, Storage)
- **Tools**: Papaparse, Lucide React, TSX

## 🚀 시작하기

### 1. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env.local`을 생성하고 키 값을 입력합니다.

```bash
cp .env.example .env.local
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 데이터베이스 초기화 및 시드
1. Supabase SQL Editor에서 `scripts/schema.sql`을 실행하여 테이블을 생성합니다.
2. 아래 명령어로 초기 데이터를 삽입합니다.

```bash
npm run seed
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.
