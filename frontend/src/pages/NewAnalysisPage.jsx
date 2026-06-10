import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import PageHero from '../components/layout/PageHero.jsx';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import AnalysisProgress from '../components/analysis/AnalysisProgress.jsx';
import ModePreviewPanel from '../components/analysis/ModePreviewPanel.jsx';
import AnalysisModeSelector from '../components/upload/AnalysisModeSelector.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { createAnalysis } from '../services/mockAnalysis.js';

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('중고거래 게시글 사진 점검');
  const [purpose, setPurpose] = useState('SECOND_HAND');
  const [previewMode, setPreviewMode] = useState('SECOND_HAND');
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
        <ScrollReveal className="flow-reveal" amount={0.05}>
          <PageHero
            eyebrow="새 분석 / 업로드 상황"
            title="어떤 상황의 파일인가요?"
            description="공유 목적에 따라 얼굴, 위치, 송장, 학번처럼 확인해야 할 단서가 달라집니다."
          />
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={60}><AnalysisProgress current={1} /></ScrollReveal>
        <ErrorAlert message={error} />
        <ScrollReveal className="flow-reveal" delay={90}>
          <section className="analysis-title-row interactive-flow-card" aria-labelledby="analysis-title-label">
            <label className="field-label" id="analysis-title-label" htmlFor="analysis-title">분석 제목</label>
            <input id="analysis-title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: SNS 업로드 전 사진 점검" />
          </section>
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={110}>
          <section className="analysis-mode-section" aria-labelledby="analysis-mode-heading">
            <div className="analysis-section-heading">
              <span className="eyebrow">분석 목적</span>
              <div>
                <h2 id="analysis-mode-heading">공유 상황을 선택하세요</h2>
                <p>선택한 상황에 따라 확인할 탐지 후보와 권장 조치가 달라집니다.</p>
              </div>
              <span className="badge badge-dark">선택 필수</span>
            </div>
            <div className="analysis-mode-workspace">
              <AnalysisModeSelector value={purpose} onChange={setPurpose} onPreview={setPreviewMode} />
              <ModePreviewPanel key={previewMode} mode={previewMode} />
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={130}>
          <div className="board-sticky-cta interactive-flow-card">
            <div><b>다음 단계: 파일 업로드</b><p className="muted">샘플 이미지로도 전체 분석 흐름을 시연할 수 있습니다.</p></div>
            <button className="btn btn-primary btn-lg" type="submit">다음 단계로 <ArrowRight size={18} /></button>
          </div>
        </ScrollReveal>
      </form>
    </MainLayout>
  );
}
