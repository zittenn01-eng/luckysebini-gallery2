# 세비니의 갤러리 (Lucky Sebini Gallery) 🎨

이세빈 작가의 원화 및 에디션 작품을 감상하고 구매할 수 있는 감성 아트 갤러리 웹 애플리케이션입니다.

---

## 📑 목차
1. [프로젝트 소개](#-프로젝트-소개)
2. [기술 스택 및 아키텍처](#-기술-스택-및-아키텍처)
3. [주요 기능 및 UI 디자인](#-주요-기능-및-ui-디자인)
4. [프로젝트 구축 과정](#-프로젝트-구축-과정)
5. [트러블슈팅 및 에러 해결 로그 (Troubleshooting)](#-트러블슈팅-및-에러-해결-로그-troubleshooting)
6. [시작하기 & 로컬 실행](#-시작하기--로컬-실행)
7. [GitHub 및 Vercel 배포](#-github-및-vercel-배포)

---

## 🌟 프로젝트 소개

- **프로젝트명**: `luckysebini-gallery`
- **목적**: 이세빈 작가의 일러스트, 페인팅, 드로잉, 굿즈 컬렉션을 전시하고 고객이 작품을 확인 및 주문할 수 있는 온라인 플랫폼
- **디자인 컨셉**:
  - **배경색**: `#FAFAF8` (따뜻한 크림 화이트)
  - **서체**: 국문 `Noto Serif KR` (감성적인 세리프체) / 영문 `Playfair Display` (클래식 디스플레이체)
  - **인터랙션**: 조용하고 고급스러운 갤러리 무드, 카드 호버 시 부드러운 리프트(Lift) 애니메이션

---

## 🛠 기술 스택 및 아키텍처

- **Frontend**: Next.js 14+ (App Router, React Server Component, TypeScript)
- **Styling**: Tailwind CSS, Vanilla CSS Animation
- **Typography**: `next/font/google` (`Noto_Serif_KR`, `Playfair_Display`)
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Storage)
- **Utilities**: `papaparse` (CSV 파싱), `lucide-react`, `tsx`, `dotenv`

---

## 🖼 주요 기능 및 UI 디자인

| 페이지 / 기능 | 설명 |
|---|---|
| **메인 갤러리 (`/`)** | • Hero 섹션: 타이틀 및 실시간 작품 통계 (총 작품 / 판매중 / 판매완료)<br>• 카테고리 필터: 전체, 일러스트, 페인팅, 드로잉, 피규어 컬렉션, 포스터 세트 등<br>• 반응형 그리드: 모바일 1열, 태블릿 2열, PC 3열 |
| **작품 상세 (`/artworks/[id]`)** | • 6:4 분할 레이아웃: 좌측 대형 이미지(60%) / 우측 상세 정보 패널(40%)<br>• 재료, 규격, 제작연도(아이콘 포함), 스토리 설명, `#태그`<br>• 판매 상태(`available`, `sold`, `reserved`)별 버튼 분기<br>• **구매 모달**: 이름/이메일/연락처 입력 후 `sessionStorage` 저장 |
| **관리자 페이지 (`/admin`)** | • 비밀번호 인증 기반 관리자 센터<br>• 작품 목록 조회 및 실시간 품절/판매중 토글<br>• CSV 대량 업로드 및 자동 파싱 기능 |

---

## 🚀 프로젝트 구축 과정

1. **프로젝트 환경 설정 및 패키지 구성**
   - Next.js App Router 기반 TypeScript 프로젝트 초기화
   - Supabase 클라이언트(`@supabase/supabase-js`), CSV 파서(`papaparse`), 개발 도구(`tsx`, `dotenv`) 설치

2. **데이터베이스 모델링 및 SQL 스키마 작성 (`scripts/schema.sql`)**
   - `artworks` 테이블: 작품 메타데이터(제목, 가격, 카테고리, 규격, 재료, 상태, 이미지 등)
   - `orders` 테이블: 주문 및 결제 정보 관리
   - PostgreSQL RLS(Row Level Security) 정책 및 트리거/헬퍼 함수 정의

3. **CSV 데이터 전처리 및 시딩 시스템 구축 (`scripts/seed.ts`)**
   - `public/data/artworks_fixed.csv` 데이터를 읽어 `artworks` 테이블에 일괄 등록
   - `tags` 파이프(`|`) 구분자 배열 변환, 가격/수량/연도 숫자 파싱, 작가명 자동 정규화

4. **디자인 시스템 및 컴포넌트 구현**
   - 글로벌 폰트 및 감성적인 크림 화이트 컬러 팔레트 구성 (`globals.css`, `layout.tsx`)
   - 스크롤 반응형 `Header`, 미니멀 `Footer`, 호버 애니메이션 `ArtworkCard`, 반응형 `ArtworkGrid`
   - Server Component (`page.tsx`)와 Client Component (`GalleryClient.tsx`, `ArtworkDetailClient.tsx`)의 관심사 분리

---

## 🧩 트러블슈팅 및 에러 해결 로그 (Troubleshooting)

프로젝트 개발 과정에서 발생한 주요 문제들과 해결 방법입니다.

### 1. Supabase SQL Policy 생성 충돌 (`ERROR: 42710`)
- **증상**: Supabase SQL Editor에서 `schema.sql`을 재실행할 때 `policy "artworks_select_public" for table "artworks" already exists` 에러 발생.
- **원인**: PostgreSQL의 `CREATE POLICY`는 `IF NOT EXISTS` 구문을 지원하지 않음.
- **해결**: 모든 `CREATE POLICY` 앞에 `DROP POLICY IF EXISTS`를 명시하여 몇 번을 재실행해도 안전한 멱등성(Idempotency) 스크립트로 개선.

### 2. Supabase URL 경로 형식 오류 (`Invalid path specified in request URL`)
- **증상**: 시드 스크립트 실행 시 `Invalid path specified in request URL` 에러 발생.
- **원인**: `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL` 끝에 `/rest/v1/` 경로가 중복 포함되어 클라이언트 요청 URL이 비정상 생성됨.
- **해결**: URL을 베이스 도메인(`https://[project-id].supabase.co`) 형태로 정정.

### 3. RLS(Row Level Security) INSERT 권한 차단
- **증상**: `new row violates row-level security policy for table "artworks"` 오류로 데이터 삽입 실패.
- **원인**: `schema.sql`의 보안 정책상 익명(`anon`) 키는 INSERT 권한이 없고 인증된 관리자만 쓰기가 가능함.
- **해결**: `seed.ts`에서 RLS를 우회할 수 있는 `SUPABASE_SERVICE_ROLE_KEY`를 우선 사용하도록 클라이언트 초기화 로직 수정.

### 4. 최신 Next.js App Router Dynamic Params 비동기 처리
- **증상**: `app/artworks/[id]/page.tsx` 빌드 시 타입 에러 발생.
- **원인**: 최신 Next.js 버전에서는 동적 라우트의 `params`가 `Promise<{ id: string }>` 형태로 전달됨.
- **해결**: Server Component에서는 `const { id } = await params;`, Client Component에서는 `React.use(params)`를 사용하여 안전하게 언래핑.

### 5. Supabase SERIAL ID 자동 증가로 인한 상세 페이지 404
- **증상**: 메인 페이지에서 1번 작품 클릭 시 `/artworks/1`이 404 에러 발생.
- **원인**: Supabase 테이블의 `id SERIAL`이 재삽입 시 2번부터 시작되어 실제 데이터 ID(2~12)와 CSV ID(1~11)가 불일치함.
- **해결**: `seed.ts`에서 CSV의 명시적 `id`를 그대로 DB `id` 컬럼에 삽입하도록 설정하고 전체 재시딩 진행.

### 6. 이미지 파일명 및 작품 제목/내용 매핑 불일치
- **증상**: 업로드된 카메라 원본 사진 파일명(`20260825_...`)과 작품 제목이 어긋남.
- **해결**:
  - 각 이미지의 실제 내용을 검수하여 정확한 작품 매칭표 수립
  - 3번 작품 **"보물찾기"**(내용: 황금을 찾아서) 신규 배치 및 번호 순차 밀림 처리
  - 10번 **"고양이 커플"**, 11번 **"쿠잔 피규어 컬렉션2"**(내용: 다시보기) 반영 및 기존 캘린더 항목 삭제
  - Node.js 스크립트를 통해 `public/images/artwork_01.jpg ~ artwork_11.jpg`로 자동 리네임 및 CSV/DB 동기화 완료

### 7. 보안 및 환경 변수 보호
- **증상**: GitHub 공개 저장소에 Supabase Service Role Key 등 민감한 비밀값이 유출될 위험.
- **해결**: `.gitignore`에 `.env*` 패턴을 등록하여 `.env.local`이 절대 커밋되지 않도록 차단하고, 배포 및 공유용 템플릿인 `.env.example`을 별도 생성.

---

## 💻 시작하기 & 로컬 실행

### 1. 저장소 클론 및 패키지 설치
```bash
git clone https://github.com/zittenn01-eng/luckysebini-gallery2.git
cd luckysebini-gallery2
npm install
```

### 2. 환경 변수 설정
`.env.example`을 복사하여 `.env.local` 파일을 생성하고 본인의 Supabase 키를 입력합니다.

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 데이터베이스 초기화 및 데이터 시딩
1. Supabase SQL Editor에서 [`scripts/schema.sql`](scripts/schema.sql)을 실행합니다.
2. 터미널에서 초기 데이터를 삽입합니다:
```bash
npm run seed
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

---

## ☁️ GitHub 및 Vercel 배포

### 1. GitHub 저장소
- 저장소 URL: [https://github.com/zittenn01-eng/luckysebini-gallery2](https://github.com/zittenn01-eng/luckysebini-gallery2)
- 메인 브랜치: `main`

### 2. Vercel 원클릭 배포
1. [vercel.com](https://vercel.com)에 로그인 후 **[Add New...] → [Project]** 클릭
2. `luckysebini-gallery2` 저장소 **Import**
3. **Environment Variables** 영역에서 **[Import .env]** 버튼을 클릭하여 `.env.local` 파일을 업로드하거나 복사/붙여넣기
4. **[Deploy]** 버튼을 클릭하여 배포 완료!
