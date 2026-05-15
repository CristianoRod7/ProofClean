# ProofClean

## 1. 프로젝트 소개
ProofClean은 사용자가 SNS, 커뮤니티, 중고거래, 과제 제출 등에 사진/캡처/PDF를 올리기 전에 파일 안의 개인정보 후보, 위치 단서, 메타데이터 노출 가능성을 점검하고 자동으로 마스킹된 안전본을 생성하는 웹 서비스입니다.

ProofClean은 단순 모자이크 앱이 아니라 업로드 전 분석 흐름을 제공합니다. 사용자가 놓칠 수 있는 탐지 후보를 먼저 제안하고, 노출 가능성 점수, 위험 시나리오, 권장 조치, 원본/안전본 비교, 안전본 다운로드를 제공합니다.

> 본 서비스의 결과는 “탐지 후보”, “노출 가능성”, “확인 필요” 안내입니다. 최종 판단은 사용자가 직접 확인하는 human-in-the-loop 구조를 따릅니다.

## 2. Spring Boot에서 FastAPI로 전환한 이유
ProofClean은 일반 CRUD 서비스보다 이미지 분석, OCR 확장, 파일 마스킹, AI 분석 파이프라인이 핵심인 프로젝트입니다. 따라서 Java Spring Boot보다 Python 기반의 FastAPI, Pillow, OCR/비전 라이브러리 생태계가 MVP 구현과 향후 확장에 더 적합하다고 판단했습니다.

## 3. 핵심 기능
- 회원가입/로그인 및 JWT 인증
- SQLite 기반 분석 프로젝트 저장
- 이미지/PDF 업로드 기본 지원
- MockAnalysisService 기반 개인정보 탐지 후보 생성
- RiskScoringService 기반 위험도 및 노출 가능성 점수 계산
- 탐지 후보, 위험 시나리오, 권장 조치 표시
- Pillow 기반 좌표 마스킹 안전본 생성
- 원본/안전본 미리보기 및 다운로드
- 로그인 없이도 확인 가능한 `/api/demo/analyses` 시연 데이터

## 4. 기술 스택
### Frontend
- React + Vite
- JavaScript
- React Router
- Axios
- 일반 CSS 기반 SaaS 스타일 UI

### Backend
- Python 3.11+
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite (`backend/proofclean.db`)
- Pydantic
- python-multipart
- Pillow
- passlib[bcrypt]
- python-jose[cryptography]
- CORS Middleware

### Storage
- `uploads/original/`
- `uploads/masked/`

## 5. 폴더 구조
```text
ProofClean/
├── frontend/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── core/
│       ├── api/
│       ├── db/
│       ├── models/
│       ├── schemas/
│       ├── services/
│       └── utils/
├── backend-spring-archive/
├── uploads/
│   ├── original/
│   └── masked/
├── README.md
├── run-local.bat
└── run-local.sh
```

## 6. 로컬 실행 주소
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- API docs: http://localhost:8080/docs
- Health check: http://localhost:8080/api/health

## 7. 백엔드 실행 방법
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

정상 실행 후 확인:
```bash
curl http://localhost:8080/api/health
```

## 8. 프론트엔드 실행 방법
```bash
cd frontend
npm install
npm run dev
```

환경 변수 예시:
```bash
cp frontend/.env.example frontend/.env
```

`frontend/.env.example` 기본값:
```text
VITE_API_BASE_URL=http://localhost:8080
```

## 9. 로컬 실행 스크립트
Linux/Mac:
```bash
chmod +x run-local.sh
./run-local.sh
```

Windows:
```bat
run-local.bat
```

두 스크립트는 자동 실행보다 안전한 설치/실행 명령 안내를 출력합니다. 백엔드와 프론트엔드는 각각 별도 터미널에서 실행하세요.

## 10. API 목록
### Health
- `GET /api/health`

### Demo
- `GET /api/demo/analyses`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Analyses
- `GET /api/analyses`
- `POST /api/analyses`
- `GET /api/analyses/{analysis_id}`
- `POST /api/analyses/{analysis_id}/files`
- `POST /api/analyses/{analysis_id}/run`
- `GET /api/analyses/{analysis_id}/findings`
- `GET /api/analyses/{analysis_id}/scenarios`
- `GET /api/analyses/{analysis_id}/recommendations`
- `POST /api/analyses/{analysis_id}/mask`

### Files
- `GET /api/files/{file_id}/preview`
- `GET /api/files/masked/{masked_file_id}/preview`
- `GET /api/files/masked/{masked_file_id}/download`

## 11. 시연 시나리오
1. `demo@proofclean.com` 계정으로 로그인합니다.
2. 대시보드에서 더미 분석 3개를 확인합니다.
3. “새 분석 시작”을 클릭합니다.
4. 분석 목적을 선택하고 이미지를 업로드합니다.
5. 분석 실행 후 탐지 후보, 위험 시나리오, 권장 조치를 확인합니다.
6. “안전본 생성”을 클릭해 마스킹된 이미지를 생성합니다.
7. 원본/안전본 비교 페이지에서 결과를 확인하고 안전본을 다운로드합니다.

## 12. 더미 계정
```text
email: demo@proofclean.com
password: password1234
name: Demo User
```

## 13. 향후 확장 계획
- 실제 OCR 연동
- EXIF 메타데이터 추출
- PDF 분석 및 PDF 마스킹
- 사용자가 직접 마스킹 영역 추가/수정
- 얼굴/차량번호/신분증/송장 객체 탐지 확장
- SNS/중고거래/과제제출/커뮤니티 모드별 위험도 가중치 고도화
- SQLite에서 MySQL/PostgreSQL로 전환

## 14. 주의사항
본 서비스는 개인정보 탐지 보조 도구이며, 분석 결과는 탐지 후보와 노출 가능성을 안내하기 위한 참고 정보입니다. 최종 업로드 여부와 마스킹 필요 여부는 사용자가 직접 확인해야 합니다.
