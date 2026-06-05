import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, GraduationCap, Package, ScanLine, ShieldCheck, Users, View } from 'lucide-react';
import Header from '../components/layout/Header.jsx';
import SplashIntro from '../components/intro/SplashIntro.jsx';
import useAuth from '../hooks/useAuth.js';

const flow = [
  { number: '01', title: 'Scan', copy: '이미지와 캡처 속 숨은 노출 후보를 찾습니다.' },
  { number: '02', title: 'Risk', copy: '공유 맥락에 맞춰 노출 가능성을 정리합니다.' },
  { number: '03', title: 'Clean', copy: '확인이 필요한 영역을 안전하게 가립니다.' },
  { number: '04', title: 'Compare', copy: '원본과 안전본을 나란히 검토합니다.' },
];
const contexts = [
  { title: 'Social', candidates: '얼굴 · 위치 · 계정명', icon: View },
  { title: 'Marketplace', candidates: '송장 · 연락처 · 주소', icon: Package },
  { title: 'Assignment', candidates: '학번 · 이메일 · 경로', icon: GraduationCap },
  { title: 'Community', candidates: '닉네임 · 지역 · 문서', icon: Users },
];

function MinimalScanPreview() {
  return (
    <div className="minimal-scan" aria-label="ProofClean 개인정보 탐지 예시">
      <div className="minimal-scan__top"><span>LIVE SCAN</span><i>READY</i></div>
      <div className="minimal-document">
        <div className="document-heading" />
        <div className="document-line wide" />
        <div className="document-line" />
        <div className="document-line short" />
        <div className="document-block" />
        <span className="minimal-detection detection-a" />
        <span className="minimal-detection detection-b" />
        <span className="minimal-detection detection-c" />
        <div className="minimal-scan-line" />
      </div>
      <div className="minimal-risk"><small>EXPOSURE RISK</small><b>87</b></div>
      <div className="minimal-safe"><ShieldCheck size={15} /> Safe preview ready</div>
    </div>
  );
}

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
    <div className="brand-shell brand-page">
      {showIntro && <SplashIntro onFinish={finishIntro} duration={2050} />}
      <Header />
      <main>
        <section className="minimal-hero" id="scan">
          <div className="page minimal-hero__grid">
            <div className="minimal-hero__copy">
              <span className="brand-eyebrow"><ScanLine size={14} /> Privacy Protection OS</span>
              <h1>Upload Clean.<br /><span>Share Safe.</span></h1>
              <p className="brand-subtitle">Scan hidden traces before you share. Review exposure risks and create a safer preview.</p>
              <p className="minimal-korean">공유 전, 이미지와 캡처 속 노출 가능성을 먼저 확인하세요.</p>
              <div className="minimal-actions">
                <button className="primary-action" onClick={startDemo}>Start Demo <ArrowRight size={18} /></button>
                <a className="quiet-action" href="#flow">View Scan Flow <ArrowDown size={17} /></a>
              </div>
              <div className="minimal-trust">{['No backend required', 'Human-in-the-loop', 'Local demo data'].map((item) => <span key={item}><Check size={13} />{item}</span>)}</div>
            </div>
            <MinimalScanPreview />
          </div>
        </section>

        <section className="brand-section minimal-flow" id="flow">
          <div className="page">
            <div className="minimal-section-heading"><span className="mono-label">THE SYSTEM</span><h2>Scan. Risk.<br />Clean. Compare.</h2><p>공유 전에 필요한 네 가지 움직임만 남겼습니다.</p></div>
            <div className="minimal-flow-grid">
              {flow.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="brand-section minimal-context" id="clean">
          <div className="page">
            <div className="minimal-section-heading"><span className="mono-label">SHARE WITH CONTEXT</span><h2>One privacy layer.<br />Every upload context.</h2></div>
            <div className="minimal-context-grid">
              {contexts.map(({ title, candidates, icon: Icon }) => <article key={title}><Icon size={21} /><h3>{title}</h3><p>{candidates}</p></article>)}
            </div>
          </div>
        </section>

        <section className="brand-section minimal-principle" id="compare">
          <div className="page"><span className="mono-label">REVIEW, NOT BLIND TRUST</span><h2>The Privacy OS<br />for safer sharing.</h2><p>탐지는 신호입니다. 최종 공유 여부는 사용자가 직접 결정합니다.</p></div>
        </section>

        <section className="brand-section minimal-final">
          <div className="page"><div><span className="mono-label">READY WHEN YOU ARE</span><h2>Try a privacy scan<br />in 30 seconds.</h2></div><button className="primary-action" onClick={startDemo}>Start Demo <ArrowRight size={19} /></button></div>
        </section>
      </main>
      <footer className="minimal-footer"><div className="page"><b>ProofClean</b><span>Upload Clean. Share Safe.</span><span>© 2026</span></div></footer>
    </div>
  );
}
