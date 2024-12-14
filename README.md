# New Notion 
>Next.js를 사용하여 제작된 New Notion


## 설치 및 실행

1. **`npm install`** (종속성 설치)

2. **`npx prisma migrate dev --name init`** (Prisma migration 생성)

3. **`npm run dev`** (개발 서버 실행)

4. **localhost:3000** 접속


## 폴더 구조
```bash
/prisma        # DB 설정
/public        
  /music       # 페이지 음악 
  /uploads     # 사용자 프로필 사진 
/src
  /app
    /api       # 라우팅
    /fonts     # 폰트
    /login     # 로그인
    /profile   # 프로필 사진 
    /register  # 회원가입
  /components  # UI 컴포넌트
  /lib         # 공통 함수 

```

## 기술 스택
- Framework: Next.js
- Styling: Tailwind CSS
- DB: SQLite with Prisma