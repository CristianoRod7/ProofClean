import { BarChart3, ScanSearch, ShieldCheck, Columns2 } from 'lucide-react';

const items = [
  { icon: BarChart3, title: '위험도 점수', description: '공유 전 확인이 필요한 정도' },
  { icon: ScanSearch, title: '탐지 후보', description: '주소·연락처·학번 후보 영역' },
  { icon: ShieldCheck, title: '권장 조치', description: '마스킹·자르기·재촬영 안내' },
  { icon: Columns2, title: '안전본 비교', description: '원본과 조치 결과 최종 확인' },
];

export default function ResultPreviewGuide() {
  return (
    <section className="result-preview-guide" aria-labelledby="result-preview-guide-title">
      <div className="result-preview-guide__heading">
        <span>다음 단계 미리보기</span>
        <h3 id="result-preview-guide-title">분석 결과에서 보게 될 항목</h3>
      </div>
      <div className="result-preview-guide__grid">
        {items.map(({ icon: Icon, title, description }) => (
          <div className="result-preview-guide__item" key={title}>
            <span><Icon size={14} /></span>
            <div><b>{title}</b><small>{description}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}
