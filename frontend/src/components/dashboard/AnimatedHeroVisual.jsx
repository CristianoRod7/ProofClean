import { ShieldCheck } from 'lucide-react';

export default function AnimatedHeroVisual() {
  return (
    <div className="dashboard-welcome-visual animated-security-visual" aria-label="탐지 후보, 위험도 점수, 안전본으로 이어지는 보안 점검 흐름" role="img">
      <div className="security-grid" aria-hidden="true" />
      <div className="security-orbit" aria-hidden="true">
        <span className="security-ripple ripple-one" />
        <span className="security-ripple ripple-two" />
        <span className="security-ripple ripple-three" />
        <i className="orbit-ring orbit-ring-one" />
        <i className="orbit-ring orbit-ring-two" />
        <i className="orbit-sweep" />
        <span className="security-core"><ShieldCheck size={38} /></span>
      </div>
      <div className="welcome-signal welcome-signal-one"><b>탐지 후보</b><span>공유 전 확인</span></div>
      <div className="welcome-signal welcome-signal-two"><b>위험도 점수</b><span>참고 지표</span></div>
      <div className="welcome-signal welcome-signal-three"><b>안전본</b><span>마스킹 비교</span></div>
    </div>
  );
}
