import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '../components/layout/Header.jsx';
import SplashIntro from '../components/intro/SplashIntro.jsx';
import ScanVisual from '../components/visuals/ScanVisual.jsx';
import RiskVisual from '../components/visuals/RiskVisual.jsx';
import CleanVisual from '../components/visuals/CleanVisual.jsx';
import ContextVisual from '../components/visuals/ContextVisual.jsx';
import useAuth from '../hooks/useAuth.js';

const contexts = [
  { type: 'SNS', title: 'SNS Upload', meta: '얼굴 · 위치 · 계정명' },
  { type: 'MARKETPLACE', title: 'Marketplace', meta: '송장 · 연락처 · 주소' },
  { type: 'ASSIGNMENT', title: 'Assignment', meta: '학번 · 이메일 · 경로' },
  { type: 'COMMUNITY', title: 'Community', meta: '닉네임 · 지역 · 문서' },
];

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(() => {
    try { return sessionStorage.getItem('proofclean_intro_seen') !== 'true'; } catch { return true; }
  });
  const auth = useAuth();
  const navigate = useNavigate();
  const startDemo = async () => { await auth.demoLogin(); navigate('/dashboard'); };
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem('proofclean_intro_seen', 'true'); } catch { /* Storage may be unavailable. */ }
    setShowIntro(false);
  }, []);

  return (
    <div className="board-site">
      {showIntro && <SplashIntro onFinish={finishIntro} duration={2050} />}
      <Header />
      <main className="board-home page">
        <section className="board-hero">
          <div><span className="board-kicker"><i /> Local privacy scanner ready.</span><h1>Upload Clean.<br />Share Safe.</h1></div>
          <div className="board-hero-side"><p>Scan hidden traces before you share.</p><div className="board-actions"><button className="board-button board-button-primary" onClick={startDemo}>Start Demo <ArrowRight size={16} /></button><a className="board-button" href="#scan-board">View Scan Flow <ArrowDownRight size={16} /></a></div></div>
        </section>

        <section className="showcase-grid showcase-grid-main" id="scan-board" aria-label="ProofClean scan board">
          <article className="showcase-card feature-card feature-scan"><div className="card-label"><span>01 / SCAN</span><em>LIVE</em></div><h2>Hidden trace detection.</h2><ScanVisual /><footer><span>Candidates</span><b>04</b></footer></article>
          <article className="showcase-card feature-card feature-risk"><div className="card-label"><span>02 / RISK</span><em>REVIEW</em></div><h2>Exposure, made visible.</h2><RiskVisual /><footer><span>Risk status</span><b>High review</b></footer></article>
          <article className="showcase-card feature-card feature-clean"><div className="card-label"><span>03 / CLEAN</span><em>READY</em></div><h2>Safer preview, one step away.</h2><CleanVisual /><footer><span>Masking</span><b>Safe preview ready</b></footer></article>
        </section>

        <section className="board-section-head"><div><span>04 / CONTEXTS</span><h2>Built for every upload.</h2></div><p><CheckCircle2 size={15} /> Human review stays in control.</p></section>
        <section className="showcase-grid context-showcase-grid">
          {contexts.map((item) => <button className="showcase-card context-showcase-card" key={item.type} onClick={startDemo}><div className="card-label"><span>CONTEXT</span><em>{item.type === 'MARKETPLACE' ? 'MARKET' : item.type}</em></div><ContextVisual type={item.type} /><footer><div><h3>{item.title}</h3><p>{item.meta}</p></div><ArrowRight size={17} /></footer></button>)}
        </section>

        <section className="board-final"><div><span>READY WHEN YOU ARE</span><h2>Try a privacy scan in 30 seconds.</h2></div><button className="board-button board-button-light" onClick={startDemo}>Start Demo <ArrowRight size={17} /></button></section>
      </main>
      <footer className="board-footer page"><b>ProofClean</b><span>Privacy Scan Gallery · Local mock workspace</span><span>© 2026</span></footer>
    </div>
  );
}
