import { Eye, Gauge, ScanSearch, ShieldCheck } from 'lucide-react';

const features = [
  { icon: ScanSearch, title: '업로드 전 점검', text: '공유하기 전에 사진과 캡처 속 숨은 단서를 먼저 살펴봅니다.' },
  { icon: Eye, title: '노출 후보 확인', text: '주소, 연락처, 학번처럼 확인이 필요한 영역을 탐지 후보로 표시합니다.' },
  { icon: Gauge, title: '위험도 점수 안내', text: '공유 전 확인이 얼마나 필요한지 참고 점수로 이해할 수 있습니다.' },
  { icon: ShieldCheck, title: '안전본 미리보기', text: '사용자가 선택한 영역을 가린 뒤 원본과 나란히 비교합니다.' },
];

export default function IntroGuideSection() {
  return (
    <section className="onboarding-section" aria-labelledby="proofclean-intro-title">
      <div className="onboarding-section-head">
        <span>서비스 소개</span>
        <div><h2 id="proofclean-intro-title">ProofClean은 무엇인가요?</h2><p>일상적으로 공유하는 이미지 속 노출 가능성을 사용자가 업로드 전에 직접 확인하도록 돕는 개인정보 보호 도구입니다.</p></div>
      </div>
      <div className="onboarding-feature-grid">
        {features.map(({ icon: Icon, title, text }, index) => (
          <article className="onboarding-feature-card" key={title}>
            <div className="onboarding-card-number">0{index + 1}</div>
            <span className="onboarding-icon"><Icon size={21} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
