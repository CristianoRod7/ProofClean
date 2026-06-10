import { CheckCircle2, Eye, FileUp, Layers3, MousePointerClick } from 'lucide-react';

const steps = [
  { icon: MousePointerClick, title: '상황 선택', text: 'SNS, 중고거래, 과제 제출 등 공유 목적을 선택합니다.' },
  { icon: FileUp, title: '파일 업로드', text: '사진, 캡처 이미지 또는 문서 이미지를 올립니다.' },
  { icon: Eye, title: '노출 후보 확인', text: '주소, 전화번호, 학번, 이메일, 위치 단서 등 확인이 필요한 영역을 살펴봅니다.' },
  { icon: Layers3, title: '안전본 생성', text: '공유하면 안 되는 영역을 마스킹하고 원본과 비교합니다.' },
  { icon: CheckCircle2, title: '최종 확인', text: '탐지 후보와 참고 지표를 바탕으로 사용자가 직접 공유 여부를 판단합니다.' },
];

export default function UsageSteps() {
  return (
    <section className="onboarding-section" id="dashboard-usage" aria-labelledby="usage-title">
      <div className="onboarding-section-head">
        <span>사용 방법</span>
        <div><h2 id="usage-title">ProofClean 사용 방법</h2><p>자동 확정 판정이 아니라, 사용자가 놓친 부분을 다시 확인할 수 있도록 돕는 5단계 흐름입니다.</p></div>
      </div>
      <ol className="usage-step-list">
        {steps.map(({ icon: Icon, title, text }, index) => <li key={title}><span className="usage-step-number">{String(index + 1).padStart(2, '0')}</span><span className="usage-step-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div></li>)}
      </ol>
    </section>
  );
}
