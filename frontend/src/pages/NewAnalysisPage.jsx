import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FilePlus2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import AnalysisModeSelector from '../components/upload/AnalysisModeSelector.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { createAnalysis } from '../services/mockAnalysis.js';

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('중고거래 게시글 사진 점검');
  const [purpose, setPurpose] = useState('SECOND_HAND');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('분석 제목을 입력하세요.');
      return;
    }
    const created = createAnalysis({ title: title.trim(), purpose });
    navigate(`/analyses/${created.id}/upload`);
  };

  return (
    <MainLayout>
      <form className="page new-analysis-page" onSubmit={submit}>
        <section className="page-hero compact">
          <span className="badge badge-cyan"><FilePlus2 size={14} /> New analysis</span>
          <h1>새 업로드 전 점검을 시작합니다</h1>
          <p>분석 목적에 따라 탐지 후보 예시와 mock 결과가 달라집니다.</p>
        </section>
        <ErrorAlert message={error} />
        <section className="card form-card">
          <label className="field-label">분석 제목</label>
          <input className="input input-xl" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: SNS 업로드 전 사진 점검" />
        </section>
        <section>
          <div className="section-head compact"><div><span className="eyebrow">Purpose</span><h2>분석 목적 선택</h2></div><span className="badge badge-dark">선택 필수</span></div>
          <AnalysisModeSelector value={purpose} onChange={setPurpose} />
        </section>
        <div className="sticky-cta card">
          <div><b>다음 단계: 파일 업로드</b><p className="muted">샘플 이미지로도 전체 분석 흐름을 시연할 수 있습니다.</p></div>
          <button className="btn btn-primary btn-lg" type="submit">다음 단계로 <ArrowRight size={18} /></button>
        </div>
      </form>
    </MainLayout>
  );
}
