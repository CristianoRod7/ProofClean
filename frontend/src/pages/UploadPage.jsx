import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import UploadDropzone from '../components/upload/UploadDropzone.jsx';
import FilePreview from '../components/upload/FilePreview.jsx';
import LoadingAnalysisScreen from '../components/upload/LoadingAnalysisScreen.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import { getAnalysisById, runMockAnalysis, uploadMockFile, useSampleImage } from '../services/mockAnalysis.js';
import { SAMPLE_IMAGE } from '../data/demoAnalyses.js';
import { isSupportedFile } from '../utils/fileUtils.js';

export default function UploadPage() {
  const { id } = useParams(); const navigate = useNavigate(); const analysis = getAnalysisById(id); const [file, setFile] = useState(null); const [preview, setPreview] = useState(analysis?.filePreviewUrl || ''); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  if (!analysis) return <MainLayout><ErrorAlert message="분석 프로젝트를 찾을 수 없습니다." /></MainLayout>;
  const onFile = (nextFile) => { setError(''); if (!isSupportedFile(nextFile)) { setError('지원하지 않는 파일 형식입니다. jpg, png, webp, pdf를 사용하세요.'); return; } setFile(nextFile); const url = nextFile.type.startsWith('image/') ? URL.createObjectURL(nextFile) : SAMPLE_IMAGE; setPreview(url); uploadMockFile(id, { fileName: nextFile.name, filePreviewUrl: url }); };
  const sample = () => { setFile(null); setPreview(SAMPLE_IMAGE); useSampleImage(id); };
  const start = () => { setLoading(true); setTimeout(() => { runMockAnalysis(id); navigate(`/analyses/${id}/result`); }, 2000); };
  return <MainLayout><div className="page grid"><div><span className="badge badge-blue">파일 업로드</span><h1>{analysis.title}</h1><p className="muted">분석 결과는 탐지 후보이며, 최종 확인은 사용자가 직접 해야 합니다.</p></div>{loading ? <LoadingAnalysisScreen /> : <><ErrorAlert message={error} /><UploadDropzone onFile={onFile} /><div className="row"><button className="btn btn-secondary" onClick={sample}>샘플 이미지로 시연하기</button><button className="btn btn-primary" onClick={start} disabled={!preview}>분석 시작</button></div><FilePreview file={file} preview={preview} /></>}</div></MainLayout>;
}
