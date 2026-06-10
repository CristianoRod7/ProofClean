import { Info } from 'lucide-react';

const ranges = [
  { tone: 'low', range: '0–39점', label: '낮음', text: '개인정보 노출 가능성이 낮은 상태입니다.' },
  { tone: 'medium', range: '40–69점', label: '주의', text: '일부 정보가 노출될 수 있어 확인이 필요합니다.' },
  { tone: 'high', range: '70점 이상', label: '높음', text: '민감한 정보가 포함됐을 가능성이 있어 공유 전 마스킹을 권장합니다.' },
];

export default function RiskScoreGuide() {
  return (
    <section className="onboarding-section risk-guide-section" aria-labelledby="risk-guide-title">
      <div className="onboarding-section-head">
        <span>점수 해석</span>
        <div><h2 id="risk-guide-title">위험도 점수란?</h2><p>파일에서 발견된 노출 후보를 기준으로 공유 전 확인이 얼마나 필요한지 보여주는 참고 점수입니다.</p></div>
      </div>
      <div className="risk-guide-grid">
        {ranges.map((item) => <article className={`risk-guide-card risk-guide-${item.tone}`} key={item.label}><div><span>{item.range}</span><b>{item.label}</b></div><div className="risk-guide-meter"><i /></div><p>{item.text}</p></article>)}
      </div>
      <div className="onboarding-notice"><Info size={18} /><p><strong>참고해 주세요.</strong> 위험도 점수는 개인정보 확정 판정이 아니라, 사용자가 공유 전 확인해야 할 정도를 나타내는 참고 지표입니다.</p></div>
    </section>
  );
}
