# ProofClean

## 프로젝트 소개
ProofClean은 사용자가 SNS, 커뮤니티, 중고거래, 과제 제출 등에 사진/캡처/PDF를 올리기 전에 파일 안의 개인정보 노출 가능성 후보를 점검하고 안전본을 생성하는 웹 서비스입니다. 모든 결과는 개인정보 확정이 아니라 **탐지 후보**, **노출 가능성**, **확인 필요** 관점으로 제공합니다.

## 개발 배경
택배 송장, 카카오톡 캡처, 모니터 화면, 과제 제출 이미지에는 사용자가 미처 인지하지 못한 연락처, 주소, 학번, 이메일, 위치 단서, 메타데이터가 포함될 수 있습니다. ProofClean은 업로드 전 점검 흐름을 제공해 사용자가 최종 판단을 내릴 수 있도록 돕습니다.

## 핵심 기능
- 회원가입/로그인 및 JWT 인증
- 분석 프로젝트 생성과 기록 대시보드
- 이미지/PDF 업로드 기본 뼈대
- MockAnalysisService 기반 탐지 후보 생성
- RiskScoringService 기반 노출 가능성 점수 계산
- 탐지 후보, 위험 시나리오, 권장 조치 표시
- 좌표 기반 안전본 마스킹 생성
- 원본/안전본 미리보기 및 다운로드 API

## 기술 스택
- Frontend: React, Vite, React Router, Axios, CSS 기반 SaaS UI
- Backend: Spring Boot 3, Java 17, Spring Security, JWT, Spring Data JPA
- Database: MySQL 호환 설정, 기본 실행은 H2 파일 DB
- Storage: local uploads/original, uploads/masked

## 시스템 아키텍처
```text
React/Vite Frontend -> Axios/JWT -> Spring Boot API -> Service Layer
                                               |-> MockAiAnalysisService
                                               |-> RiskScoringService
                                               |-> MaskingService
                                               |-> JPA Repository -> DB
                                               |-> Local File Storage
```

## ERD 요약
```text
users 1:N analysis_projects
analysis_projects 1:N uploaded_files
analysis_projects 1:N detection_findings
analysis_projects 1:N risk_scenarios
analysis_projects 1:N recommendations
analysis_projects 1:N masked_files
uploaded_files 1:N detection_findings
uploaded_files 1:N masked_files
```

## API 요약
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Analysis
- `GET /api/analyses`
- `POST /api/analyses`
- `GET /api/analyses/{analysisId}`
- `POST /api/analyses/{analysisId}/files`
- `POST /api/analyses/{analysisId}/run`
- `GET /api/analyses/{analysisId}/findings`
- `GET /api/analyses/{analysisId}/scenarios`
- `GET /api/analyses/{analysisId}/recommendations`
- `POST /api/analyses/{analysisId}/mask`

### Files
- `GET /api/files/{fileId}/preview`
- `GET /api/files/masked/{maskedFileId}/preview`
- `GET /api/files/masked/{maskedFileId}/download`

### Report
- `GET /api/reports/{analysisId}/pdf` — 2차 기능 TODO 응답

## 실행 방법
### 1. 백엔드 실행
```bash
cd backend
./gradlew bootRun
```
Gradle Wrapper가 없는 환경에서는 다음 명령을 사용할 수 있습니다.
```bash
cd backend
gradle bootRun
```

기본값은 H2 파일 DB입니다. MySQL을 사용하려면 환경변수를 지정합니다.
```bash
DB_URL=jdbc:mysql://localhost:3306/proofclean DB_USERNAME=root DB_PASSWORD=password DB_DRIVER=com.mysql.cj.jdbc.Driver gradle bootRun
```

### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

### 3. 시연 계정
```text
email: demo@proofclean.com
password: password1234
name: Demo User
```

## 시연 시나리오
1. `demo@proofclean.com` 계정으로 로그인합니다.
2. 대시보드에서 기존 더미 분석 3개를 확인합니다.
3. “새 분석 시작”을 클릭합니다.
4. 목적을 선택하고 이미지를 업로드합니다.
5. Mock 분석을 실행해 탐지 후보와 위험 시나리오를 확인합니다.
6. 안전본 생성을 클릭해 마스킹된 이미지를 확인합니다.
7. 원본/안전본 비교 페이지에서 결과를 확인하고 다운로드합니다.

## 향후 확장 계획
- 실제 OCR/Vision API 연동
- EXIF 메타데이터 추출
- PDF 분석 및 PDF 리포트 다운로드
- 사용자가 직접 마스킹 영역 추가/수정
- 얼굴, 차량번호, 신분증, 송장 객체 탐지 확장
- SNS/중고거래/과제제출/커뮤니티 모드별 위험도 세분화

## 주의사항
본 서비스는 개인정보 탐지 보조 도구이며, 분석 결과는 탐지 후보와 노출 가능성을 안내하기 위한 참고 정보입니다. 최종 업로드 여부와 마스킹 필요 여부는 사용자가 직접 확인해야 합니다.
