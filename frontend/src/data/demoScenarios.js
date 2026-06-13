export const scenariosByPurpose = {
  SECOND_HAND: [
    { title: '생활권 추정 가능성', text: '송장 일부와 거래 지역 정보가 함께 노출될 경우 생활권이 추정될 수 있습니다.', riskLevel: 'HIGH' },
    { title: '연락처와 주소 조합 가능성', text: '전화번호와 주소 일부가 같이 보이면 개인 식별 가능성이 높아질 수 있습니다.', riskLevel: 'CRITICAL' },
  ],
  SNS: [
    { title: '방문 장소와 생활 패턴 추정 가능성', text: '사진 속 간판, 촬영 시간, 메타데이터가 함께 노출되면 방문 장소와 생활 패턴이 추정될 수 있습니다.', riskLevel: 'HIGH' },
  ],
  ASSIGNMENT: [
    { title: '학교 정보 연결 가능성', text: '학번, 이름, 과제명, 저장소명이 함께 노출되면 개인과 학교 정보가 연결될 수 있습니다.', riskLevel: 'HIGH' },
  ],
  COMMUNITY: [
    { title: '계정 식별 가능성', text: '게시글 캡처 속 닉네임, 이메일, 지역 단서가 결합되면 계정 식별 가능성이 생길 수 있습니다.', riskLevel: 'HIGH' },
  ],
  ETC: [
    { title: '계정 정보 포함 가능성', text: '화면 속 텍스트에 개인 계정 정보나 연락처가 포함될 수 있습니다.', riskLevel: 'MEDIUM' },
  ],
};
