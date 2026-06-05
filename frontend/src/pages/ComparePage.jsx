import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import BeforeAfterCompare from '../components/analysis/BeforeAfterCompare.jsx';
import DetectionList from '../components/analysis/DetectionList.jsx';
import DownloadButton from '../components/common/DownloadButton.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import Card from '../components/common/Card.jsx';
import { createMaskedVersion, getAnalysisById } from '../services/mockAnalysis.js';

export default function ComparePage() {
  const { id } = useParams();
  const [analysis] = useState(() => {
    const found = getAnalysisById(id);
    return found && !found.maskedPreviewUrl ? createMaskedVersion(id) : found;
  });
  const [toast, setToast] = useState('');
  const [activeId, setActiveId] = useState('');

  if (!analysis) return <MainLayout><ErrorAlert message="비교할 분석 기록을 찾을 수 없습니다." /></MainLayout>;

  const download = () => {
    setToast('실제 파일 다운로드는 백엔드 연동 후 활성화됩니다.');
    setTimeout(() => setToast(''), 2600);
  };

  return (
    <MainLayout>
      <div className="page-wide compare-page">
        <section className="page-hero compact compare-hero">
          <div>
            <span className="badge badge-green">자동 마스킹 완료</span>
            <h1>Original vs Safe Preview</h1>
            <p>오른쪽 안전본은 detection finding 좌표를 기반으로 검은 마스킹 박스를 overlay한 mock preview입니다.</p>
          </div>
          <div className="row"><DownloadButton onClick={download} /><Link className="btn btn-muted" to={`/analyses/${id}/result`}><ArrowLeft size={18} /> 결과로 돌아가기</Link></div>
        </section>
        <BeforeAfterCompare analysis={analysis} />
        <div className="compare-lower-grid">
          <Card>
            <div className="section-head compact"><div><span className="eyebrow">Masked items</span><h2>마스킹된 항목</h2></div></div>
            <DetectionList findings={analysis.findings} activeId={activeId} onSelect={setActiveId} />
          </Card>
          <Card className="download-guide">
            <Info size={28} />
            <h2>다운로드 안내</h2>
            <p>현재 프론트엔드 MVP에서는 브라우저 mock 데이터로 비교 화면을 구성합니다. 실제 파일 다운로드는 백엔드 연동 후 활성화됩니다.</p>
            <button className="btn btn-primary" onClick={download}>다운로드 동작 확인</button>
          </Card>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </MainLayout>
  );
}
