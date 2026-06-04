export const findingsByPurpose = {
  SECOND_HAND: [
    { type: 'INVOICE', label: '송장 정보 후보', severity: 'HIGH', confidence: 0.91, description: '택배 송장 영역으로 보이는 정보가 포함되어 있습니다.', x: 0.12, y: 0.18, width: 0.42, height: 0.16 },
    { type: 'PHONE', label: '전화번호 후보', severity: 'HIGH', confidence: 0.87, description: '전화번호 형식으로 보이는 텍스트가 감지되었습니다.', x: 0.58, y: 0.22, width: 0.28, height: 0.08 },
    { type: 'ADDRESS', label: '주소 후보', severity: 'CRITICAL', confidence: 0.84, description: '주소 또는 생활권을 추정할 수 있는 정보 후보입니다.', x: 0.18, y: 0.39, width: 0.55, height: 0.11 },
    { type: 'LOCATION_HINT', label: '거래 지역 단서', severity: 'MEDIUM', confidence: 0.76, description: '거래 장소와 연결될 수 있는 단서가 있습니다.', x: 0.62, y: 0.64, width: 0.22, height: 0.13 },
  ],
  SNS: [
    { type: 'FACE', label: '얼굴 후보', severity: 'MEDIUM', confidence: 0.78, description: '얼굴 또는 주변 인물로 보이는 영역 후보가 있습니다.', x: 0.36, y: 0.14, width: 0.18, height: 0.24 },
    { type: 'LOCATION_HINT', label: '위치 단서 후보', severity: 'HIGH', confidence: 0.83, description: '간판이나 창밖 배경에서 위치가 추정될 수 있습니다.', x: 0.08, y: 0.38, width: 0.34, height: 0.14 },
    { type: 'EXIF', label: '메타데이터 확인 필요', severity: 'HIGH', confidence: 0.72, description: '촬영 시간 또는 위치 메타데이터가 포함될 가능성이 있습니다.', x: 0.68, y: 0.08, width: 0.22, height: 0.1 },
    { type: 'SCREEN_TEXT', label: '화면 속 텍스트 후보', severity: 'MEDIUM', confidence: 0.69, description: '캡처 화면에 계정명 또는 알림 텍스트 후보가 있습니다.', x: 0.52, y: 0.58, width: 0.32, height: 0.13 },
  ],
  ASSIGNMENT: [
    { type: 'STUDENT_ID', label: '학번 후보', severity: 'HIGH', confidence: 0.86, description: '학번 형식으로 보이는 텍스트 후보가 있습니다.', x: 0.14, y: 0.2, width: 0.26, height: 0.08 },
    { type: 'EMAIL', label: '이메일 후보', severity: 'MEDIUM', confidence: 0.82, description: '학교 또는 개인 이메일 후보가 있습니다.', x: 0.44, y: 0.28, width: 0.34, height: 0.08 },
    { type: 'SCREEN_TEXT', label: '화면 속 텍스트 후보', severity: 'MEDIUM', confidence: 0.75, description: '프로젝트 경로나 저장소명 후보가 보입니다.', x: 0.16, y: 0.52, width: 0.48, height: 0.12 },
    { type: 'DOCUMENT', label: '문서 정보 후보', severity: 'LOW', confidence: 0.66, description: '과제명 또는 이름이 함께 보일 수 있습니다.', x: 0.22, y: 0.68, width: 0.4, height: 0.1 },
  ],
  COMMUNITY: [
    { type: 'SCREEN_TEXT', label: '닉네임 후보', severity: 'MEDIUM', confidence: 0.79, description: '게시글 캡처 내 닉네임 후보가 있습니다.', x: 0.15, y: 0.18, width: 0.46, height: 0.1 },
    { type: 'EMAIL', label: '이메일 후보', severity: 'MEDIUM', confidence: 0.72, description: '이메일 형식 후보가 있습니다.', x: 0.3, y: 0.44, width: 0.34, height: 0.08 },
    { type: 'LOCATION_HINT', label: '위치 단서 후보', severity: 'HIGH', confidence: 0.67, description: '지역명 또는 건물명으로 보이는 텍스트 후보가 있습니다.', x: 0.58, y: 0.62, width: 0.22, height: 0.08 },
  ],
  ETC: [
    { type: 'SCREEN_TEXT', label: '텍스트 후보', severity: 'LOW', confidence: 0.64, description: '이미지 내 텍스트 후보가 있습니다.', x: 0.2, y: 0.3, width: 0.46, height: 0.12 },
    { type: 'EMAIL', label: '이메일 후보', severity: 'MEDIUM', confidence: 0.67, description: '이메일 형식 후보가 있습니다.', x: 0.28, y: 0.54, width: 0.32, height: 0.08 },
  ],
};
