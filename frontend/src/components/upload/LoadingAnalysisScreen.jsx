import { useEffect, useState } from 'react';
import { Brain, CheckCircle2, Loader2, Radar } from 'lucide-react';
import ProgressBar from '../common/ProgressBar.jsx';

const steps = ['파일 구조를 확인하는 중', '화면 속 텍스트 후보를 찾는 중', '노출 가능성을 계산하는 중', '권장 조치를 정리하는 중', '안전본 미리보기를 준비하는 중'];

export default function LoadingAnalysisScreen() {
  const [progress, setProgress] = useState(6);
  useEffect(() => {
    const timer = setInterval(() => setProgress((prev) => Math.min(100, prev + 7)), 125);
    return () => clearInterval(timer);
  }, []);
  const activeIndex = Math.min(steps.length - 1, Math.floor(progress / 20));
  return (
    <section className="analysis-loading card flow-loading-screen" aria-live="polite">
      <div className="loading-orbit" aria-hidden="true">
        <span className="loading-pulse pulse-a" /><span className="loading-pulse pulse-b" />
        <div className="orbit-ring" />
        <div className="loading-scan-line" />
        <Brain size={44} />
        <Radar className="orbit-radar" size={24} />
      </div>
      <span className="badge badge-cyan">분석 진행 중</span>
      <h1>업로드 전 노출 가능성을 분석하는 중입니다</h1>
      <p className="loading-active-copy" key={activeIndex}>{steps[activeIndex]}</p>
      <p className="muted">백엔드 API 없이 로컬 데모 결과를 생성하고 있습니다.</p>
      <ProgressBar value={progress} label="분석 진행률" />
      <div className="loading-steps">
        {steps.map((step, index) => (
          <div className={`loading-step ${index <= activeIndex ? 'active' : ''}`} style={{ '--step-index': index }} key={step}>
            {index < activeIndex ? <CheckCircle2 size={18} /> : <Loader2 size={18} className={index === activeIndex ? 'spin' : ''} />}
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
