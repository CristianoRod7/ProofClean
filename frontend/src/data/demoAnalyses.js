import { findingsByPurpose } from './demoFindings.js';
import { recommendationsByPurpose } from './demoRecommendations.js';
import { scenariosByPurpose } from './demoScenarios.js';

export const purposeMeta = {
  SNS: {
    label: 'SNS 업로드',
    shortLabel: 'SNS',
    icon: 'Camera',
    description: '얼굴, 위치, 알림 노출 후보를 점검합니다.',
    examples: ['얼굴/인물', '위치 단서', '계정명/알림'],
    placeholder: 'sns',
  },
  SECOND_HAND: {
    label: '중고거래',
    shortLabel: '거래',
    icon: 'Package',
    description: '송장, 연락처, 주소 노출 후보를 확인합니다.',
    examples: ['택배 송장', '전화번호', '주소'],
    placeholder: 'invoice',
  },
  ASSIGNMENT: {
    label: '과제 제출',
    shortLabel: '과제',
    icon: 'GraduationCap',
    description: '학번, 이메일, 파일 경로를 확인합니다.',
    examples: ['학번', '학교 이메일', '파일 경로'],
    placeholder: 'assignment',
  },
  COMMUNITY: {
    label: '커뮤니티',
    shortLabel: '커뮤니티',
    icon: 'MessagesSquare',
    description: '닉네임, 이메일, 지역 단서를 확인합니다.',
    examples: ['닉네임', '이메일', '지역명'],
    placeholder: 'community',
  },
  MESSENGER: {
    label: '메신저 공유',
    shortLabel: '메신저',
    icon: 'MessageCircleMore',
    description: '프로필명, 전화번호, 링크를 확인합니다.',
    examples: ['프로필명', '전화번호', '링크'],
    placeholder: 'messenger',
  },
  ETC: {
    label: '기타',
    shortLabel: '기타',
    icon: 'FileQuestion',
    description: '텍스트, 이메일, 문서 정보를 넓게 점검합니다.',
    examples: ['텍스트 후보', '이메일', '문서 정보'],
    placeholder: 'document',
  },
};

export const purposeScores = {
  SECOND_HAND: { riskScore: 87, riskLevel: 'CRITICAL' },
  SNS: { riskScore: 74, riskLevel: 'HIGH' },
  ASSIGNMENT: { riskScore: 68, riskLevel: 'HIGH' },
  COMMUNITY: { riskScore: 63, riskLevel: 'HIGH' },
  MESSENGER: { riskScore: 66, riskLevel: 'HIGH' },
  ETC: { riskScore: 52, riskLevel: 'MEDIUM' },
};

export const SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#ccfbf1"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.18"/></filter>
  </defs>
  <rect width="900" height="620" fill="url(#bg)"/>
  <rect x="92" y="64" width="716" height="492" rx="34" fill="#fff" filter="url(#shadow)"/>
  <rect x="132" y="104" width="260" height="34" rx="17" fill="#0f172a" opacity="0.88"/>
  <rect x="132" y="166" width="590" height="88" rx="18" fill="#e2e8f0"/>
  <rect x="168" y="194" width="342" height="14" rx="7" fill="#64748b" opacity="0.72"/>
  <rect x="168" y="222" width="474" height="14" rx="7" fill="#94a3b8"/>
  <rect x="132" y="294" width="590" height="80" rx="18" fill="#fef3c7"/>
  <rect x="168" y="322" width="426" height="13" rx="7" fill="#a16207" opacity="0.72"/>
  <rect x="168" y="348" width="310" height="13" rx="7" fill="#ca8a04" opacity="0.54"/>
  <rect x="132" y="414" width="280" height="76" rx="18" fill="#dbeafe"/>
  <rect x="456" y="414" width="266" height="76" rx="18" fill="#fee2e2"/>
  <text x="168" y="462" font-family="Arial" font-size="25" fill="#1d4ed8">010-****-1234</text>
  <text x="488" y="462" font-family="Arial" font-size="24" fill="#b91c1c">Seoul **-gu</text>
</svg>`)} `;

export function buildMockResult(purpose) {
  const score = purposeScores[purpose] || purposeScores.ETC;
  return {
    riskScore: score.riskScore,
    riskLevel: score.riskLevel,
    findings: (findingsByPurpose[purpose] || findingsByPurpose.ETC).map((finding, index) => ({ ...finding, id: `${purpose}-finding-${index + 1}` })),
    scenarios: (scenariosByPurpose[purpose] || scenariosByPurpose.ETC).map((scenario, index) => ({ ...scenario, id: `${purpose}-scenario-${index + 1}` })),
    recommendations: (recommendationsByPurpose[purpose] || recommendationsByPurpose.ETC).map((text, index) => ({ id: `${purpose}-recommendation-${index + 1}`, text, completed: false })),
  };
}

export const demoAnalyses = [
  {
    id: 'demo-second-hand',
    title: '중고거래 게시글 사진 점검',
    purpose: 'SECOND_HAND',
    status: 'MASKED',
    createdAt: '2026-05-15T09:00:00.000Z',
    updatedAt: '2026-05-15T09:04:00.000Z',
    fileName: 'delivery-label-sample.png',
    filePreviewUrl: SAMPLE_IMAGE,
    maskedPreviewUrl: SAMPLE_IMAGE,
    ...buildMockResult('SECOND_HAND'),
  },
  {
    id: 'demo-sns',
    title: 'SNS 업로드 사진 점검',
    purpose: 'SNS',
    status: 'ANALYZED',
    createdAt: '2026-05-15T10:30:00.000Z',
    updatedAt: '2026-05-15T10:34:00.000Z',
    fileName: 'sns-capture-sample.png',
    filePreviewUrl: '',
    maskedPreviewUrl: '',
    ...buildMockResult('SNS'),
  },
  {
    id: 'demo-assignment',
    title: '과제 제출 캡처 점검',
    purpose: 'ASSIGNMENT',
    status: 'ANALYZED',
    createdAt: '2026-05-15T11:00:00.000Z',
    updatedAt: '2026-05-15T11:05:00.000Z',
    fileName: 'assignment-screen.png',
    filePreviewUrl: '',
    maskedPreviewUrl: '',
    ...buildMockResult('ASSIGNMENT'),
  },
];
