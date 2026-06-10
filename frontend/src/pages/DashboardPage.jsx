import { ArrowDown, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import IntroGuideSection from '../components/dashboard/IntroGuideSection.jsx';
import PrivacyExamples from '../components/dashboard/PrivacyExamples.jsx';
import RecentAnalysisTable from '../components/dashboard/RecentAnalysisTable.jsx';
import ResultGuide from '../components/dashboard/ResultGuide.jsx';
import RiskScoreGuide from '../components/dashboard/RiskScoreGuide.jsx';
import ScanScopeGuide from '../components/dashboard/ScanScopeGuide.jsx';
import UsageSteps from '../components/dashboard/UsageSteps.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import useAuth from '../hooks/useAuth.js';
import { getAnalyses } from '../services/mockAnalysis.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const analyses = getAnalyses();

  return (
    <MainLayout>
      <div className="page-wide onboarding-dashboard">
        <section className="dashboard-welcome-hero">
          <div className="dashboard-welcome-copy">
            <span className="dashboard-welcome-kicker"><ShieldCheck size={16} /> {user?.name || '데모 사용자'}님의 개인정보 보호 홈</span>
            <h1>공유하기 전, 숨은 개인정보 노출 가능성을 먼저 확인하세요.</h1>
            <p>ProofClean은 사진, 캡처, 문서 이미지를 업로드하기 전에 얼굴, 위치, 송장, 학번, 이메일처럼 노출될 수 있는 단서를 점검하는 업로드 전 개인정보 보호 도구입니다.</p>
            <div className="dashboard-welcome-actions">
              <Link className="board-button board-button-primary" to="/analyses/new">새 분석 시작 <ArrowRight size={17} /></Link>
              <a className="board-button" href="#dashboard-usage">사용 방법 보기 <ArrowDown size={17} /></a>
            </div>
          </div>
          <div className="dashboard-welcome-visual" aria-hidden="true">
            <div className="welcome-radar"><i /><i /><i /><span><ShieldCheck size={36} /></span></div>
            <div className="welcome-signal welcome-signal-one"><b>탐지 후보</b><span>공유 전 확인</span></div>
            <div className="welcome-signal welcome-signal-two"><b>위험도 점수</b><span>참고 지표</span></div>
            <div className="welcome-signal welcome-signal-three"><b>안전본</b><span>마스킹 비교</span></div>
          </div>
          <div className="dashboard-trust-line"><Sparkles size={15} /> 개인정보 확정 판정이 아닌 탐지 후보와 확인 가이드를 제공합니다.</div>
        </section>

        <IntroGuideSection />
        <PrivacyExamples />
        <UsageSteps />
        <RiskScoreGuide />
        <ScanScopeGuide />
        <ResultGuide />

        <section className="dashboard-start-banner">
          <div><span>준비가 되셨나요?</span><h2>첫 번째 파일을 점검하고 안전본을 만들어보세요.</h2><p>업로드 상황 선택은 다음 단계에서 진행합니다.</p></div>
          <Link className="board-button board-button-light" to="/analyses/new">새 분석 시작 <ArrowRight size={17} /></Link>
        </section>

        <RecentAnalysisTable analyses={analyses} limit={3} compact />
      </div>
    </MainLayout>
  );
}
