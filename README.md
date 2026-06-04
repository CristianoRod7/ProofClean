# ProofClean

AI 기반 업로드 전 개인정보 노출 위험 분석 및 자동 비식별화 플랫폼입니다.

## 프로젝트 소개

ProofClean은 사용자가 SNS, 커뮤니티, 중고거래, 과제 제출 등에 사진이나 캡처를 올리기 전에 파일 안의 개인정보 후보, 위치 단서, 노출 가능성을 점검하고 안전본을 확인할 수 있도록 돕는 웹 서비스 MVP입니다.

이번 버전은 **백엔드 없이도 시연 가능한 React/Vite 프론트엔드 단독 MVP**입니다. 인증, 분석 생성, 샘플 업로드, 위험도 산출, 탐지 후보 표시, 마스킹 안전본 비교, 기록 조회는 모두 브라우저 `localStorage`와 mock 데이터를 기반으로 동작합니다.

> ProofClean의 결과는 “확정 판정”이 아니라 “탐지 후보”와 “노출 가능성” 안내입니다. 최종 확인은 사용자가 직접 진행하는 human-in-the-loop 구조를 따릅니다.

## 핵심 기능

- 데모 계정 기반 mock 로그인/회원가입
- 분석 목적 선택: 중고거래, SNS, 과제 제출, 커뮤니티, 기타
- 업로드 파일 미리보기 및 샘플 이미지 시연
- 2초 mock 분석 로딩 플로우
- 위험도 점수, 위험 등급, 탐지 후보, 위험 시나리오, 권장 조치 표시
- 원본 이미지 위 탐지 후보 bounding box 오버레이
- 안전본 생성 후 원본/마스킹 이미지 split 비교
- localStorage 기반 분석 기록 검색 및 필터링

## 기술 스택

- React
- Vite
- JavaScript
- React Router
- Axios
- lucide-react
- CSS
- localStorage mock services

## 폴더 구조

```text
ProofClean/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       └── utils/
├── README.md
└── .gitignore
```

## 로컬 실행 방법

```bash
cd frontend
npm install
npm run dev
```

개발 서버 기본 주소는 다음과 같습니다.

```text
http://localhost:5173
```

## 빌드 방법

```bash
cd frontend
npm run build
```

## 데모 계정

```text
이메일: demo@proofclean.com
비밀번호: password1234
```

랜딩 페이지의 **데모 시작** 버튼을 누르면 위 계정으로 자동 로그인되어 대시보드로 이동합니다.

## 추천 시연 흐름

1. `/`에서 **데모 시작**을 클릭합니다.
2. 대시보드에서 **새 분석 시작**을 클릭합니다.
3. 분석 제목과 목적을 선택합니다.
4. 업로드 화면에서 **샘플 이미지로 시연하기**를 클릭합니다.
5. **분석 시작**을 클릭하고 mock 로딩 화면을 확인합니다.
6. 결과 화면에서 위험도, 탐지 후보, 권장 조치를 확인합니다.
7. **안전본 생성**을 클릭합니다.
8. 비교 화면에서 원본/마스킹 안전본을 확인합니다.
9. 기록 화면에서 생성된 분석을 검색하거나 필터링합니다.

## 구현 범위

이 MVP는 발표 및 사용자 흐름 검증을 위한 프론트엔드 프로토타입입니다. 실제 OCR, 이미지 저장소, 사용자 DB, 서버 인증, 안전본 파일 다운로드는 추후 백엔드 연동 단계에서 구현할 수 있도록 서비스 레이어를 분리해 두었습니다.
