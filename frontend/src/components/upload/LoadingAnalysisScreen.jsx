import { useEffect, useState } from 'react';
import ProgressBar from '../common/ProgressBar.jsx';

const steps = ['파일 구조를 확인하는 중', '화면 속 텍스트 후보를 찾는 중', '노출 가능성을 계산하는 중', '권장 조치를 생성하는 중'];
export default function LoadingAnalysisScreen() {
  const [progress, setProgress] = useState(8);
  useEffect(() => { const timer = setInterval(() => setProgress((prev) => Math.min(100, prev + 11)), 180); return () => clearInterval(timer); }, []);
  const activeIndex = Math.min(steps.length - 1, Math.floor(progress / 26));
  return <div className="card" style={{ padding: 36 }}><span className="badge badge-blue">Mock Analysis Running</span><h1>분석 중입니다</h1><p className="muted">외부 AI API 없이 시연용 분석 결과를 생성하고 있습니다.</p><ProgressBar value={progress} /><div className="loading-steps" style={{ marginTop: 20 }}>{steps.map((step, index) => <div className={`loading-step ${index <= activeIndex ? 'active' : ''}`} key={step}><span className="badge badge-blue">{index + 1}</span>{step}</div>)}</div></div>;
}
