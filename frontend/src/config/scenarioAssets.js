import { purposeMeta } from '../data/demoAnalyses.js';

const SCENARIO_IMAGE_ROOT = '/scenarios';

const scenarioDefinitions = [
  {
    order: 1,
    mode: 'SNS',
    aliases: ['sns'],
    imageFileName: 'sns.png',
    defaultTitle: 'SNS 사진 점검',
    visualLabel: 'SNS 게시물과 얼굴, 위치 단서를 점검하는 화면',
  },
  {
    order: 2,
    mode: 'SECOND_HAND',
    aliases: ['marketplace', 'second_hand'],
    imageFileName: 'marketplace.png',
    defaultTitle: '중고거래 게시글 사진 점검',
    visualLabel: '택배 송장과 주소, 연락처를 점검하는 화면',
  },
  {
    order: 3,
    mode: 'ASSIGNMENT',
    aliases: ['assignment'],
    imageFileName: 'assignment.png',
    defaultTitle: '과제 캡처 점검',
    visualLabel: '과제 문서와 학번, 이메일, 파일 경로를 점검하는 화면',
  },
  {
    order: 4,
    mode: 'COMMUNITY',
    aliases: ['community'],
    imageFileName: 'community.png',
    defaultTitle: '커뮤니티 게시글 점검',
    visualLabel: '커뮤니티 게시글과 닉네임, 댓글 단서를 점검하는 화면',
  },
  {
    order: 5,
    mode: 'MESSENGER',
    aliases: ['messenger', 'chat', 'dm'],
    imageFileName: 'messenger.png',
    defaultTitle: '메신저 캡처 점검',
    visualLabel: '메신저 대화와 프로필명, 연락처, 링크를 점검하는 화면',
  },
  {
    order: 6,
    mode: 'ETC',
    aliases: ['other', 'etc'],
    imageFileName: 'other.png',
    defaultTitle: '기타 파일 점검',
    visualLabel: '이미지와 문서, 텍스트를 폭넓게 점검하는 화면',
  },
];

export const scenarioAssets = scenarioDefinitions.map((scenario) => ({
  ...scenario,
  title: purposeMeta[scenario.mode].label,
  shortLabel: purposeMeta[scenario.mode].shortLabel,
  description: purposeMeta[scenario.mode].description,
  clues: purposeMeta[scenario.mode].examples,
  customImage: `${SCENARIO_IMAGE_ROOT}/${scenario.imageFileName}`,
})).sort((a, b) => a.order - b.order);

export function normalizeScenarioMode(mode) {
  const normalized = String(mode || '').trim().toLowerCase();
  return scenarioAssets.find((scenario) => (
    scenario.mode.toLowerCase() === normalized || scenario.aliases.includes(normalized)
  ))?.mode || 'ETC';
}

export function getScenarioAsset(mode) {
  const normalizedMode = normalizeScenarioMode(mode);
  return scenarioAssets.find((scenario) => scenario.mode === normalizedMode) || scenarioAssets.at(-1);
}
