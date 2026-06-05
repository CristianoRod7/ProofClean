import { useEffect, useState } from 'react';
import { Brain, CheckCircle2, Loader2, Radar } from 'lucide-react';
import ProgressBar from '../common/ProgressBar.jsx';

const steps = ['파일 구조를 확인하는 중', '화면 속 텍스트 후보를 찾는 중', '노출 가능성을 계산하는 중', '권장 조치를 생성하는 중'];

export default function LoadingAnalysisScreen() {
  const [progress, setProgress] = useState(8);
  useEffect(() => {
    const timer = setInterval(() => setProgress((prev) => Math.min(100, prev + 9)), 170);
    return () => clearInterval(timer);
  }, []);
  const activeIndex = Math.min(steps.length - 1, Math.floor(progress / 25));
  return (
    <section className="analysis-loading card">
      <div className="loading-orbit">
        <div className="orbit-ring" />
        <Brain size={44} />
        <Radar className="orbit-radar" size={24} />
      </div>
      <span className="badge badge-cyan">Mock Analysis Running</span>
      <h1>업로드 전 노출 가능성을 분석하는 중입니다</h1>
      <p className="muted">백엔드 API 없이 localStorage 기반 시연 결과를 생성하고 있습니다.</p>
      <ProgressBar value={progress} label="분석 진행률" />
      <div className="loading-steps">
        {steps.map((step, index) => (
          <div className={`loading-step ${index <= activeIndex ? 'active' : ''}`} key={step}>
            {index < activeIndex ? <CheckCircle2 size={18} /> : <Loader2 size={18} className={index === activeIndex ? 'spin' : ''} />}
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
