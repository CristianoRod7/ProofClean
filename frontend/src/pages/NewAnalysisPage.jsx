import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import AnalysisModeSelector from '../components/upload/AnalysisModeSelector.jsx';
import { createAnalysis } from '../services/mockAnalysis.js';

export default function NewAnalysisPage() {
  const [title, setTitle] = useState('중고거래 게시글 사진 점검'); const [purpose, setPurpose] = useState('SECOND_HAND'); const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); const analysis = createAnalysis({ title, purpose }); navigate(`/analyses/${analysis.id}/upload`); };
  return <MainLayout><div className="page grid"><div><span className="badge badge-blue">새 분석</span><h1>무엇을 업로드하기 전에 점검할까요?</h1><p className="muted">분석 목적에 따라 탐지 후보와 노출 가능성 가중치가 달라집니다.</p></div><form className="grid" onSubmit={submit}><div className="card"><label className="stack"><b>분석 제목</b><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 중고거래 게시글 사진 점검" required /></label></div><AnalysisModeSelector value={purpose} onChange={setPurpose} /><div className="between"><span className="muted">결과는 탐지 후보이며 최종 확인은 사용자가 직접 해야 합니다.</span><button className="btn btn-primary">다음: 파일 업로드</button></div></form></div></MainLayout>;
}
