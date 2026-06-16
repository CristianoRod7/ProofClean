import { CheckSquare2, Eye, FileCheck2, TriangleAlert } from 'lucide-react';

const terms = [
  { icon: Eye, title: '탐지 후보', text: '파일 안에서 개인정보일 수 있어 사용자의 확인이 필요한 영역입니다.' },
  { icon: TriangleAlert, title: '위험 시나리오', text: '해당 정보가 노출됐을 때 생길 수 있는 상황을 가능성 중심으로 설명합니다.' },
  { icon: CheckSquare2, title: '권장 조치', text: '마스킹, 자르기, 다시 촬영하기처럼 공유 전에 할 수 있는 조치입니다.' },
  { icon: FileCheck2, title: '안전본', text: '확인한 영역을 가린 뒤 공유 전에 원본과 비교할 수 있는 미리보기입니다.' },
];

export default function ResultGuide() {
  return (
    <section className="onboarding-section result-guide-section" aria-labelledby="result-guide-title">
      <div className="onboarding-section-head">
        <span>결과 안내</span>
        <div><h2 id="result-guide-title">분석 결과는 이렇게 읽으세요.</h2><p>결과 화면에서 사용하는 네 가지 용어를 미리 알아두면 확인과 마스킹이 더 쉬워집니다.</p></div>
      </div>
      <div className="result-guide-grid">
        {terms.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={20} /></span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}
