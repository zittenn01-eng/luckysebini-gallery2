# 세비니의 갤러리 (Lucky Sebini Gallery) 🎨

이세빈 작가의 작품을 소개하고 판매하는 온라인 아트 갤러리 웹 애플리케이션 개발 기록 및 문서입니다.

---

## 📑 프로젝트 개요

- **저장소**: [luckysebini-gallery2 (GitHub)](https://github.com/zittenn01-eng/luckysebini-gallery2)
- **기술 스택**: Next.js 14+ (App Router, TypeScript), Supabase (PostgreSQL, RLS), Tailwind CSS, Papaparse
- **디자인 컨셉**:
  - 배경색 `#FAFAF8` (따뜻한 크림 화이트)
  - 한글 폰트 `Noto Serif KR` / 영문 폰트 `Playfair Display`
  - 조용하고 고급스러운 갤러리 분위기 & 부드러운 카드 호버 애니메이션

---

## 🛠️ 개발 진행 단계별 [요구 프롬프트 ➔ 처리 ➔ 오류 ➔ 해결] 기록

---

### 1단계: Supabase 데이터베이스 연동 및 CSV 시딩 스크립트 작성

#### 💬 사용자 요구 프롬프트
> "아래 CSV 데이터를 Supabase artworks 테이블에 업로드하는 스크립트(scripts/seed.ts)를 만들어줘.  
> CSV 파일 경로: `public/data/artworks_fixed.csv`  
> 처리 조건: tags는 '|' 구분자 배열 변환, price/stock/created_year 숫자 변환, artist_name이 '작가미상'이면 '이세빈'으로 변경, image_url은 빈 문자열로 초기화, 실행 전 기존 데이터 전체 삭제 후 재삽입  
> package.json scripts에 추가: 'seed': 'tsx scripts/seed.ts'"

#### ⚙️ 처리 내용
- `scripts/schema.sql`을 작성하여 `artworks` 및 `orders` 테이블 스키마, RLS 보안 정책, 재고 트리거 정의
- `scripts/seed.ts`에 CSV 파싱(`papaparse`) 및 데이터 정규화, Supabase 일괄 삽입 로직 구현
- `package.json`에 `seed` 명령어 등록

#### ❌ 발생한 오류 메시지
1. **SQL 정책 중복 에러**:
   ```text
   ERROR: 42710: policy "artworks_select_public" for table "artworks" already exists
   ```
2. **URL 경로 중복 에러**:
   ```text
   Error: Invalid path specified in request URL
   ```
3. **RLS 보안 권한 에러**:
   ```text
   Error: new row violates row-level security policy for table "artworks"
   ```

#### 💡 해결 방법
1. **SQL 정책 멱등성 확보**: `schema.sql`의 모든 `CREATE POLICY` 앞에 `DROP POLICY IF EXISTS`를 추가하여 몇 번을 재실행해도 충돌 없이 실행되도록 수정.
2. **Supabase 베이스 URL 정정**: `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL` 끝에 붙어있던 `/rest/v1/` 경로를 제거하고 `https://mhoqpcltiwmtewdyytcm.supabase.co` 순수 도메인으로 변경.
3. **Service Role Key 적용**: `seed.ts`에서 익명(`anon`) 키 대신 RLS를 우회할 수 있는 `SUPABASE_SERVICE_ROLE_KEY`를 환경 변수로 읽어 초기화하도록 수정하여 11건 데이터 전체 정상 삽입 완료.

---

### 2단계: 메인 페이지 및 갤러리 UI 컴포넌트 구현

#### 💬 사용자 요구 프롬프트
> "luckysebini-gallery의 메인 페이지와 컴포넌트를 구현해줘.  
> 디자인 컨셉: 배경색 #FAFAF8, 한국어 Noto Serif KR, 영어 Playfair Display, 고급스러운 아트 갤러리, 카드 hover 시 떠오르는 애니메이션  
> 구현할 파일: components/Header.tsx, components/Footer.tsx, components/ArtworkCard.tsx, components/ArtworkGrid.tsx, components/GalleryClient.tsx, app/page.tsx"

#### ⚙️ 처리 내용
- `app/globals.css`: 세련된 크림 화이트 컬러 팔레트, 그림자, 카드 호버 트랜지션 정의
- `app/layout.tsx`: `next/font/google`을 활용한 `Noto_Serif_KR` 및 `Playfair_Display` 폰트 최적화
- `components/Header.tsx` & `Footer.tsx`: 블러 배경 네비게이션 및 작가 저작권 푸터
- `components/ArtworkCard.tsx` & `ArtworkGrid.tsx`: 3열 반응형 그리드, 상태 뱃지, 가격 포맷팅
- `components/GalleryClient.tsx`: 카테고리(일러스트, 페인팅, 드로잉 등) 실시간 필터 탭
- `app/page.tsx`: Server Component에서 Supabase 데이터를 직접 조회하고 상단 Hero 통계(총 작품, 판매중, 판매완료) 출력

---

### 3단계: 작품 상세 페이지 구현 및 구매 모달 연동

#### 💬 사용자 요구 프롬프트
> "luckysebini-gallery의 작품 상세 페이지를 구현해줘.  
> 파일 경로: `app/artworks/[id]/page.tsx`  
> 페이지 레이아웃: 좌측 60% 작품 이미지 / 우측 40% 작품 정보 패널  
> 우측 정보 패널: 카테고리 뱃지, 작품명(한/영), 작가명, 구분선, 재료/크기/제작연도(아이콘), 설명, #태그, 가격, 구매하기 버튼(상태별 활성/비활성)  
> 구매하기 클릭 시: 이름, 이메일, 전화번호 입력 모달창 ➔ 확인 시 /checkout 이동 및 sessionStorage에 저장  
> Supabase에서 id로 데이터를 불러오는 서버 컴포넌트로 구현"

#### ⚙️ 처리 내용
- `app/artworks/[id]/page.tsx`: Server Component로 Supabase에서 ID 기반 작품 조회
- `components/ArtworkDetailClient.tsx`: Client Component로 분리하여 6:4 레이아웃, 모달 팝업, 유효성 검사, `sessionStorage` 저장 인터랙션 구현

#### ❌ 발생한 오류 메시지
- Next.js 최신 App Router에서 동적 라우트 매개변수 타입 오류:
  ```text
  Type 'PageProps' does not satisfy the constraint... params is Promise<{ id: string }>
  ```

#### 💡 해결 방법
- `app/artworks/[id]/page.tsx`에서 `const { id } = await params;` 비동기 처리를 적용하여 타입 호환성 및 빌드 성공.

---

### 4단계: 상세 페이지 404 에러 및 ID 불일치 해결

#### 💬 사용자 요구 프롬프트
> "(404 This page could not be found 캡처 화면 첨부 및 접근 불가 문의)"

#### ❌ 발생한 오류 원인
- 메인 페이지에서 1번 작품 클릭 시 `/artworks/1`이 404 반환.
- **원인**: Supabase 테이블의 `id`가 `SERIAL`로 설정되어 기존 데이터를 지우고 다시 넣을 때 ID가 2번부터 12번까지로 생성되어 1번 작품이 존재하지 않았음.

#### 💡 해결 방법
- `scripts/seed.ts`의 `transformRow`에서 주석 처리되어 있던 `id: Number(row.id)`를 활성화하여 CSV의 ID(1~11)가 DB에 그대로 고정 삽입되도록 수정 후 `npm run seed` 재실행.

---

### 5단계: 작품 이미지 파일 매핑 및 오류 해결

#### 💬 사용자 요구 프롬프트
> "이미지가 안나오네" ➔ "있는데? (20260825_... 파일 목록 첨부)" ➔ "이미지와 제목이 맞지 않아"

#### ❌ 발생한 오류 원인
- `public/images/artwork_01.jpg` 경로에 실제 파일이 없고 카메라 원본 파일명(`20260825_205149.jpg` 등)으로 업로드되어 있었음.
- 단순 순서대로 이름을 바꿨을 때 실제 사진 내용과 작품 제목이 어긋남.

#### 💡 해결 방법
1. 12개의 이미지 파일을 전수 열람하여 실제 그림/사진 내용 분석.
2. `fix_images.js` 스크립트를 작성하여 실제 작품 내용과 1:1로 일치하도록 파일명을 리네임 및 매핑 완료.

---

### 6단계: 작품 순서 재배치 및 제목/설명 수정

#### 💬 사용자 요구 프롬프트
> "3번째 이미지 그림을 제목 보물찾기, 내용 황금을 찾아서 로 하고 현재 3번을 4번으로 쭉 밀어내고 10번 제목 고양이커플, 내용 크라프트지 위 핑크/청록 고양이와 꽃 수채화 11번은 제목 쿠잔 피규어 컬렉션2, 내용 다시보기 로 작성해주면돼 현재 9번의 제목과 내용이 삭제되는 거지 다시 이미지 제목과 내용을 수정해줘"  
> "5 번 제목 세빈이와 태전이 를 세빈이와 태건이로 변경해줘"

#### ⚙️ 처리 및 해결 내용
1. `reorder_images.js` 스크립트를 실행하여 이미지 파일 재배치:
   - 3번: `artwork_03.jpg` (황금빛 방과 요정들)
   - 10번: `artwork_10.jpg` (고양이 커플)
   - 11번: `artwork_11.jpg` (쿠잔 피규어 컬렉션 2)
   - 기존 9번(캘린더) 목록 제외
2. `public/data/artworks_fixed.csv`에 변경 사항 및 5번 작품명 오타 수정(`세빈이와 태전이` ➔ `세빈이와 태건이`) 반영.
3. `npm run seed`를 실행하여 Supabase DB 데이터를 완벽 동기화.

---

### 7단계: GitHub 연동, 보안 점검 및 Vercel 배포

#### 💬 사용자 요구 프롬프트
> "깃허브에 올리려고 해 올리기 전에 뭔가 해야 될게 있어?" ➔ "진행해줘" ➔ "토스연동은 나중에 하고 버셀배포를 하려고해 네가 해줄 수 있어?" ➔ "import.env에서 .env를 업로드하게 하면 안돼?"

#### ⚙️ 처리 및 가이드 내용
1. **보안 점검**: `.env.local`이 `.gitignore`에 등록되어 GitHub에 노출되지 않음을 검증하고, 템플릿 파일인 `.env.example` 생성.
2. **GitHub 푸시**:
   ```bash
   git add .
   git commit -m "feat: 세비니의 갤러리 웹앱 초기 구축 및 Supabase 연동 완료"
   git branch -M main
   git remote add origin https://github.com/zittenn01-eng/luckysebini-gallery2.git
   git push -u origin main
   ```
3. **Vercel 원클릭 배포 가이드**:
   - Vercel 대시보드에서 `luckysebini-gallery2` 저장소 Import.
   - Environment Variables 섹션의 **`[Import .env]`** 버튼을 클릭하여 `.env.local` 파일을 업로드하고 배포를 실행하는 방법 안내.

---

## 📋 최종 작품 데이터 목록 (11선)

| 번호 | 작품 제목 | 주요 내용 (설명) | 카테고리 | 이미지 파일 |
|:---:|:---|:---|:---:|:---:|
| **1** | **어둠 속의 빛** | 폭풍우치는 바다 위, 거대한 얼굴 형상 앞에 선 소녀 (흑백 일러스트) | 일러스트 | `artwork_01.jpg` |
| **2** | **황야의 탐험가** | 노란 우비를 입은 고양이 탐험가가 어두운 숲 속에서 랜턴을 든 모험 | 일러스트 | `artwork_02.jpg` |
| **3** | **보물찾기** | 황금을 찾아서 (마법사 방과 사다리 타는 요정들) | 일러스트 | `artwork_03.jpg` |
| **4** | **어린왕자와 여우** | 황금빛 노을 아래 어린왕자와 여우가 나란히 앉아 석양을 바라보는 장면 | 페인팅 | `artwork_04.jpg` |
| **5** | **세빈이와 태건이** | 2011년 3월 31일에 그려진 이세빈, 이태건 두 아이의 정감 어린 초상화 | 드로잉 | `artwork_05.jpg` |
| **6** | **별새와 세계의 죄인** | 영화 '별새'와 '세계의 죄인', Nirvanna the Band the Show 포스터 세트 | 포스터 세트 | `artwork_06.jpg` |
| **7** | **모리아티의 초대** | BBC 셜록 Jim Moriarty WANTED 포스터 & London Confidential 일러스트 | 포스터 세트 | `artwork_07.jpg` |
| **8** | **모리아티 컬렉션 선반** | 셜록 모리아티 쿠션, 인형, 아크릴 스탠드, 굿즈 컬렉션 선반 | 피규어 컬렉션 | `artwork_08.jpg` |
| **9** | **쿠잔 피규어 컬렉션** | 원피스 아오키지(쿠잔) 전용 대형 피규어 10여 점 컬렉션 | 피규어 컬렉션 | `artwork_09.jpg` |
| **10** | **고양이 커플** | 크라프트지 위 핑크/청록 고양이와 꽃 수채화 | 페인팅 | `artwork_10.jpg` |
| **11** | **쿠잔 피규어 컬렉션2** | 다시보기 (원피스 쿠잔 피규어 컬렉션 2) | 피규어 컬렉션 | `artwork_11.jpg` |
