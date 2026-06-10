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
      <form className="page-wide board-page new-analysis-page" onSubmit={submit}>
        <section className="board-page-header">
          <span><FilePlus2 size={14} /> 새 분석 / 업로드 상황</span>
          <h1>어떤 상황의 파일인가요?</h1>
          <p>공유 목적에 따라 얼굴, 위치, 송장, 학번처럼 확인해야 할 단서가 달라집니다.</p>
        </section>
        <ErrorAlert message={error} />
        <section className="showcase-card board-form-card">
          <label className="field-label">분석 제목</label>
          <input className="input input-xl" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: SNS 업로드 전 사진 점검" />
        </section>
        <section>
          <div className="section-head compact"><div><span className="eyebrow">분석 목적</span><h2>분석 목적 선택</h2></div><span className="badge badge-dark">선택 필수</span></div>
          <AnalysisModeSelector value={purpose} onChange={setPurpose} />
        </section>
        <div className="board-sticky-cta">
          <div><b>다음 단계: 파일 업로드</b><p className="muted">샘플 이미지로도 전체 분석 흐름을 시연할 수 있습니다.</p></div>
          <button className="btn btn-primary btn-lg" type="submit">다음 단계로 <ArrowRight size={18} /></button>
        </div>
      </form>
    </MainLayout>
  );
}
