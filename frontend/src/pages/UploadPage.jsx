import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, FileType2, PlayCircle, ShieldQuestion } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import AnalysisFlowHeader from '../components/analysis/AnalysisFlowHeader.jsx';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import AnalysisProgress from '../components/analysis/AnalysisProgress.jsx';
import UploadDropzone from '../components/upload/UploadDropzone.jsx';
import UploadContextSummary from '../components/upload/UploadContextSummary.jsx';
import FilePreview from '../components/upload/FilePreview.jsx';
import LoadingAnalysisScreen from '../components/upload/LoadingAnalysisScreen.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import Card from '../components/common/Card.jsx';
import { getAnalysisById, runMockAnalysis, uploadMockFile, useSampleImage } from '../services/mockAnalysis.js';
import { isSupportedFile } from '../utils/fileUtils.js';
import { purposeMeta } from '../data/demoAnalyses.js';

export default function UploadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = getAnalysisById(id);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(analysis?.filePreviewUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!analysis) return <MainLayout><ErrorAlert message="분석 프로젝트를 찾을 수 없습니다." /></MainLayout>;

  const onFile = (nextFile) => {
    setError('');
    if (!nextFile) return;
    if (!isSupportedFile(nextFile)) {
      setError('지원하지 않는 파일 형식입니다. jpg, png, webp, pdf를 사용하세요.');
      return;
    }
    setFile(nextFile);
    const url = nextFile.type.startsWith('image/') ? URL.createObjectURL(nextFile) : '';
    setPreview(url);
    uploadMockFile(id, { fileName: nextFile.name, filePreviewUrl: url });
  };

  const sample = () => {
    setFile(null);
    const updated = useSampleImage(id);
    setPreview(updated.filePreviewUrl);
  };

  const start = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setLoading(true);
    setTimeout(() => {
      runMockAnalysis(id);
      navigate(`/analyses/${id}/result`);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="page-wide board-page upload-page">
        <ScrollReveal className="flow-reveal" amount={0.05}>
          <AnalysisFlowHeader
            className="upload-page-hero"
            eyebrow="새 분석 · 2단계"
            title="점검할 파일을 업로드하세요."
            description="선택한 상황에 맞춰 이미지와 캡처 속 노출 후보를 확인합니다."
            meta={<><span>{purposeMeta[analysis.purpose]?.label || '일반 파일'}</span><strong>{analysis.title}</strong></>}
          />
        </ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={60}><AnalysisProgress current={2} /></ScrollReveal>
        <ScrollReveal className="flow-reveal" delay={80}>
          <UploadContextSummary purpose={analysis.purpose} title={analysis.title} />
        </ScrollReveal>
        {loading ? <LoadingAnalysisScreen /> : (
          <ScrollReveal className="flow-reveal" delay={100}>
          <div className="upload-grid board-upload-grid">
            <div className="stack">
              <ErrorAlert message={error} />
              <UploadDropzone onFile={onFile} />
              <div className="row upload-actions">
                <button className="btn btn-secondary" onClick={sample} type="button"><PlayCircle size={18} /> 샘플로 시연하기</button>
                <button className="btn btn-primary" onClick={start} disabled={!preview && !analysis.filePreviewUrl} type="button">분석 시작</button>
              </div>
              <FilePreview file={file} preview={preview || analysis.filePreviewUrl} purpose={analysis.purpose} />
            </div>
            <aside className="stack board-guide-stack">
              <Card className="guide-card">
                <ShieldQuestion size={28} />
                <h3>분석 결과는 탐지 후보입니다</h3>
                <p>ProofClean은 업로드 전 확인을 돕는 도구입니다. 개인정보 확정 판정이 아니며 최종 판단은 사용자가 직접 해야 합니다.</p>
              </Card>
              <Card className="guide-card">
                <FileType2 size={28} />
                <h3>지원 형식</h3>
                <p>jpg, jpeg, png, webp, pdf를 지원합니다. 현재 시제품에서는 이미지 미리보기와 대체 화면을 우선 표시합니다.</p>
              </Card>
              <Card className="guide-card warning">
                <AlertCircle size={28} />
                <h3>백엔드 API 의존 없음</h3>
                <p>현재 분석과 마스킹은 로컬 저장소 기반 데모 흐름으로 동작합니다.</p>
              </Card>
            </aside>
          </div>
          </ScrollReveal>
        )}
      </div>
    </MainLayout>
  );
}
