import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, FileType2, PlayCircle, ShieldQuestion } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import UploadDropzone from '../components/upload/UploadDropzone.jsx';
import FilePreview from '../components/upload/FilePreview.jsx';
import LoadingAnalysisScreen from '../components/upload/LoadingAnalysisScreen.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import Card from '../components/common/Card.jsx';
import { getAnalysisById, runMockAnalysis, uploadMockFile, useSampleImage } from '../services/mockAnalysis.js';
import { isSupportedFile } from '../utils/fileUtils.js';

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
    setLoading(true);
    setTimeout(() => {
      runMockAnalysis(id);
      navigate(`/analyses/${id}/result`);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="page-wide board-page upload-page">
        <section className="board-page-header">
          <span>SCAN STATION / SECURE INTAKE</span>
          <h1>Drop a file. Find hidden traces.</h1>
          <h2 className="upload-project-title">{analysis.title}</h2>
          <p>분석 결과는 탐지 후보입니다. 최종 확인은 사용자가 직접 진행합니다.</p>
        </section>
        {loading ? <LoadingAnalysisScreen /> : (
          <div className="upload-grid board-upload-grid">
            <div className="stack">
              <ErrorAlert message={error} />
              <UploadDropzone onFile={onFile} />
              <div className="row upload-actions">
                <button className="btn btn-secondary" onClick={sample} type="button"><PlayCircle size={18} /> 샘플 이미지로 시연하기</button>
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
                <p>jpg, jpeg, png, webp, pdf를 지원합니다. 프론트엔드 MVP에서는 이미지 preview와 placeholder를 우선 표시합니다.</p>
              </Card>
              <Card className="guide-card warning">
                <AlertCircle size={28} />
                <h3>백엔드 API 의존 없음</h3>
                <p>현재 분석과 마스킹은 localStorage mock flow로 동작합니다.</p>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
