import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, PlusCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import AnalysisProgress from '../components/analysis/AnalysisProgress.jsx';
import AnalysisFlowHeader from '../components/analysis/AnalysisFlowHeader.jsx';
import BeforeAfterCompare from '../components/analysis/BeforeAfterCompare.jsx';
import DetectionList from '../components/analysis/DetectionList.jsx';
import DownloadButton from '../components/common/DownloadButton.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import Card from '../components/common/Card.jsx';
import AnalysisMissingState from '../components/analysis/AnalysisMissingState.jsx';
import { getAnalysisById } from '../services/mockAnalysis.js';
import { AnalysisNotFoundError, getAnalysis, maskAnalysis } from '../services/analysisApi.js';

const maskStyleCopy = {
  pixelate: { title: '모자이크 처리된 영역은 개인정보 후보입니다.', body: '겹치거나 가까운 탐지 박스를 합친 뒤 모자이크를 적용해 문서 구조는 유지하고 텍스트는 읽기 어렵게 처리했습니다.' },
  blur: { title: '흐림 처리된 영역은 비식별화된 개인정보 후보입니다.', body: '겹치거나 가까운 탐지 박스를 합친 뒤 강한 블러를 적용했습니다. 문맥에 필요한 내용까지 흐려지지 않았는지 확인하세요.' },
  fill: { title: '숨김 처리된 영역은 개인정보 후보입니다.', body: '겹치거나 가까운 탐지 박스를 합친 뒤 밝은 숨김 영역으로 대체했습니다. 문맥에 필요한 내용까지 가려지지 않았는지 확인하세요.' },
  solid: { title: '가려진 영역은 개인정보 후보입니다.', body: '겹치거나 가까운 탐지 박스를 합친 뒤 보안 박스로 가렸습니다. 문맥에 필요한 내용까지 가려지지 않았는지 확인하세요.' },
};

export default function ComparePage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(() => getAnalysisById(id));
  const [toast, setToast] = useState('');
  const [activeId, setActiveId] = useState('');
  const [missing, setMissing] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    getAnalysis(id)
      .then(async (found) => {
        if (!found || !active) return;
        const hasMaskableCoordinates = found.findings?.some((finding) => (
          finding.hasCoordinates && (found.sourceType === 'sample' || finding.coordinateStatus !== 'demo')
        ));
        const next = found.maskedPreviewUrl || !hasMaskableCoordinates ? found : await maskAnalysis(id);
        if (active) setAnalysis(next);
      })
      .catch((fetchError) => {
        if (active && fetchError instanceof AnalysisNotFoundError) {
          setAnalysis(null);
          setMissing(true);
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, [id]);

  if (missing) return <AnalysisMissingState />;
  if (checking && !analysis) return <MainLayout><div className="page-wide board-page"><p className="muted">분석 기록을 확인하는 중입니다.</p></div></MainLayout>;
  if (!analysis) return <AnalysisMissingState message="분석 기록을 불러오지 못했습니다. 잠시 후 다시 시도하거나 새 분석을 시작해 주세요." />;
  const isUploadFallback = analysis.sourceType === 'upload' && (analysis.provider === 'mock' || analysis.aiFallback);
  const maskableCount = analysis.findings.filter((finding) => (
    finding.hasCoordinates && (analysis.sourceType === 'sample' || finding.coordinateStatus !== 'demo')
  )).length;
  const maskingStyle = analysis.maskingStyle || 'solid';
  const maskingCopy = maskStyleCopy[maskingStyle] || maskStyleCopy.solid;

  const download = () => {
    setToast('실제 파일 다운로드는 백엔드 연동 후 활성화됩니다.');
    setTimeout(() => setToast(''), 2600);
  };

  return (
    <MainLayout>
      <div className="page-wide board-page compare-page">
        <ScrollReveal className="flow-reveal" amount={0.05}>
          <AnalysisFlowHeader
            className="compare-hero"
            eyebrow="안전본 비교 · 4단계"
            title="원본과 안전본을 비교하세요."
            description="마스킹된 안전본을 확인한 뒤 공유 가능 여부를 최종 판단하세요."
            meta={<><span>마스킹 상태</span><strong>{analysis.maskedPreviewUrl ? `${maskableCount}개 후보 영역 적용` : '자동 마스킹 미적용'}</strong></>}
            actions={<><DownloadButton onClick={download} /><Link className="btn btn-muted" to={`/analyses/${id}/result`}><ArrowLeft size={18} /> 결과로 돌아가기</Link></>}
          />
        </ScrollReveal>

        <ScrollReveal className="flow-reveal" delay={50}><AnalysisProgress current={4} /></ScrollReveal>
        {isUploadFallback && (
          <div className="coordinate-warning" role="alert">
            <Info size={20} />
            <div>
              <b>현재 결과는 AI 분석 실패로 인해 데모 탐지 기준으로 표시되었습니다.</b>
              <p>실제 개인정보 위치와 다를 수 있어 고정 mock 좌표와 자동 마스킹을 적용하지 않았습니다.</p>
            </div>
          </div>
        )}
        <ScrollReveal className="flow-reveal" delay={80}><BeforeAfterCompare analysis={analysis} /></ScrollReveal>

        <ScrollReveal className="flow-reveal" delay={100}>
          <div className="compare-mask-note" role="note">
            <Info size={20} />
            <div>
              <b>{analysis.maskedPreviewUrl ? maskingCopy.title : '자동 마스킹이 적용되지 않았습니다.'}</b>
              <p>{analysis.maskedPreviewUrl
                ? maskingCopy.body
                : '정확한 위치 좌표가 없어 원본을 그대로 표시합니다. 탐지 후보 목록을 직접 확인해 주세요.'}</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="flow-reveal" delay={115}>
          <div className="compare-lower-grid board-compare-lower">
            <Card className="result-dark-card">
              <div className="section-head compact"><div><span className="eyebrow">마스킹 항목</span><h2>마스킹된 항목</h2></div></div>
              <DetectionList findings={analysis.findings} activeId={activeId} onSelect={setActiveId} />
            </Card>
            <Card className="download-guide compare-checklist-card analysis-side-panel">
              <CheckCircle2 size={30} />
              <h2>공유 전 체크리스트</h2>
              <ul className="compare-checklist">
                <li><span>1</span>주소·연락처 후보가 가려졌는지 확인</li>
                <li><span>2</span>원본과 안전본의 문맥이 유지되는지 확인</li>
                <li><span>3</span>최종 공유 여부를 사용자가 직접 판단</li>
              </ul>
              <div className="compare-completion-actions">
                <button className="btn btn-primary" onClick={download}>안전본 다운로드 확인</button>
                <Link className="btn btn-secondary" to="/analyses/new"><PlusCircle size={18} /> 새 분석 시작</Link>
              </div>
            </Card>
          </div>
        </ScrollReveal>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </MainLayout>
  );
}
