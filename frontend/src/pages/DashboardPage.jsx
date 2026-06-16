import { ArrowDown, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import AnimatedHeroVisual from '../components/dashboard/AnimatedHeroVisual.jsx';
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
        <ScrollReveal className="dashboard-reveal dashboard-reveal-hero" amount={0.08}>
          <section className="dashboard-welcome-hero">
            <div className="dashboard-welcome-copy">
              <span className="dashboard-welcome-kicker"><ShieldCheck size={16} /> {user?.name || '데모 사용자'}님의 개인정보 보호 홈</span>
              <h1>ProofClean</h1>
              <h2 className="dashboard-welcome-subtitle">공유 전 개인정보 노출 위험을 미리 점검하세요.</h2>
              <p>사진, 문서, 캡처 이미지 속 얼굴, 위치, 소속, 학번, 이메일 등 노출될 수 있는 단서를 분석하고 안전한 공유를 돕습니다.</p>
              <div className="dashboard-welcome-actions">
                <Link className="board-button board-button-primary" to="/analyses/new">새 분석 시작 <ArrowRight size={17} /></Link>
                <a className="board-button" href="#dashboard-usage">사용 방법 보기 <ArrowDown size={17} /></a>
              </div>
            </div>
            <AnimatedHeroVisual />
            <div className="dashboard-trust-line"><Sparkles size={15} /> 개인정보 확정 판정이 아닌 탐지 후보와 확인 가이드를 제공합니다.</div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="dashboard-reveal" delay={30}><IntroGuideSection /></ScrollReveal>
        <ScrollReveal className="dashboard-reveal" delay={50}><PrivacyExamples /></ScrollReveal>
        <ScrollReveal className="dashboard-reveal" delay={50}><UsageSteps /></ScrollReveal>
        <ScrollReveal className="dashboard-reveal" delay={50}><RiskScoreGuide /></ScrollReveal>
        <ScrollReveal className="dashboard-reveal" delay={50}><ScanScopeGuide /></ScrollReveal>
        <ScrollReveal className="dashboard-reveal" delay={50}><ResultGuide /></ScrollReveal>

        <ScrollReveal className="dashboard-reveal" delay={40}>
          <section className="dashboard-start-banner">
            <div><span>준비가 되셨나요?</span><h2>첫 번째 파일을 점검하고 안전본을 만들어보세요.</h2><p>업로드 상황 선택은 다음 단계에서 진행합니다.</p></div>
            <Link className="board-button board-button-light" to="/analyses/new">새 분석 시작 <ArrowRight size={17} /></Link>
          </section>
        </ScrollReveal>

        <ScrollReveal className="dashboard-reveal" delay={40}>
          <RecentAnalysisTable analyses={analyses} limit={3} compact />
        </ScrollReveal>
      </div>
    </MainLayout>
  );
}
