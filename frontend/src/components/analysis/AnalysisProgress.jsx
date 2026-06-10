import { Check, CircleDot } from 'lucide-react';

const steps = ['상황 선택', '파일 업로드', '분석 결과', '안전본 비교'];

export default function AnalysisProgress({ current = 1 }) {
  const progress = Math.max(0, Math.min(100, ((current - 1) / (steps.length - 1)) * 100));
  return (
    <nav className="analysis-progress" aria-label="분석 진행 단계">
      <div className="analysis-progress__rail"><i style={{ '--flow-progress': `${progress}%` }} /></div>
      {steps.map((step, index) => {
        const number = index + 1;
        const complete = number < current;
        const active = number === current;
        return (
          <div className={`analysis-progress__step ${complete ? 'complete' : ''} ${active ? 'active' : ''}`} key={step}>
            <span>{complete ? <Check size={15} /> : active ? <CircleDot size={15} /> : number}</span>
            <b>{step}</b>
          </div>
        );
      })}
    </nav>
  );
}
