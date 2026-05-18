import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import BeforeAfterCompare from '../components/analysis/BeforeAfterCompare.jsx';
import DetectionList from '../components/analysis/DetectionList.jsx';
import DownloadButton from '../components/common/DownloadButton.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { createMaskedVersion, getAnalysisById } from '../services/mockAnalysis.js';

export default function ComparePage() {
  const { id } = useParams(); const [analysis, setAnalysis] = useState(() => { const found = getAnalysisById(id); return found && !found.maskedPreviewUrl ? createMaskedVersion(id) : found; }); const [toast, setToast] = useState('');
  if (!analysis) return <MainLayout><ErrorAlert message="비교할 분석 기록을 찾을 수 없습니다." /></MainLayout>;
  const download = () => { setToast('안전본 다운로드 기능은 백엔드 연동 후 활성화됩니다.'); setTimeout(() => setToast(''), 2600); };
  return <MainLayout><div className="page-wide grid"><div className="between"><div><span className="badge badge-green">자동 마스킹 완료</span><h1>원본/안전본 비교</h1><p className="muted">안전본은 동일 이미지 위에 탐지 영역을 검은 박스로 가린 mock 미리보기입니다.</p></div><div className="row"><DownloadButton onClick={download} /><Link className="btn btn-muted" to={`/analyses/${id}/result`}>결과로 돌아가기</Link></div></div><BeforeAfterCompare analysis={analysis} /><div className="grid grid-2"><div><h2>마스킹된 탐지 항목</h2><DetectionList findings={analysis.findings} /></div><div className="card"><h2>다운로드 안내</h2><p className="muted">현재 프론트엔드 MVP에서는 브라우저 mock 데이터로 비교 화면을 구성합니다. 실제 파일 다운로드는 FastAPI 마스킹 API 연동 후 활성화됩니다.</p></div></div>{toast && <div className="toast">{toast}</div>}</div></MainLayout>;
}
