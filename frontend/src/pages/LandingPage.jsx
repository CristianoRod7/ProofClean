import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, Check, CircleDot, Eye, GraduationCap, Package, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Header from '../components/layout/Header.jsx';
import SplashIntro from '../components/intro/SplashIntro.jsx';
import BrandPillars from '../components/brand/BrandPillars.jsx';
import ImagePreviewPanel from '../components/analysis/ImagePreviewPanel.jsx';
import useAuth from '../hooks/useAuth.js';
import { buildMockResult } from '../data/demoAnalyses.js';

const contexts = [
  { title: 'Social', label: 'SNS 업로드', copy: '얼굴, 계정명, 알림, 위치 단서를 공유 전에 확인합니다.', icon: Eye },
  { title: 'Resale', label: '중고거래', copy: '송장, 연락처, 주소, 거래 지역 후보를 한 번에 점검합니다.', icon: Package },
  { title: 'Campus', label: '과제 제출', copy: '학번, 이메일, 저장소 경로가 보이는 화면을 정리합니다.', icon: GraduationCap },
  { title: 'Community', label: '커뮤니티', copy: '닉네임, 지역명, 문서 단서가 남은 캡처를 확인합니다.', icon: Users },
];

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(() => {
    try { return sessionStorage.getItem('proofclean_intro_seen') !== 'true'; } catch { return true; }
  });
  const auth = useAuth();
  const navigate = useNavigate();
  const mock = buildMockResult('SECOND_HAND');

  const startDemo = async () => {
    await auth.demoLogin();
    navigate('/dashboard');
  };
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem('proofclean_intro_seen', 'true'); } catch { /* Storage may be unavailable. */ }
    setShowIntro(false);
  }, []);

  return (
    <div className="brand-shell">
      {showIntro && <SplashIntro onFinish={finishIntro} duration={2100} />}
      <Header />
      <main>
        <section className="brand-hero" id="scan">
          <div className="brand-grid-bg" />
          <div className="brand-orb brand-orb-blue" />
          <div className="brand-orb brand-orb-mint" />
          <div className="page brand-hero-grid">
            <div className="brand-hero-copy brand-fade-up">
              <span className="brand-eyebrow"><CircleDot size={14} /> Privacy protection OS</span>
              <h1 className="brand-title"><span>Upload Clean.</span><span>Share Safe.</span></h1>
              <p className="brand-subtitle">ProofClean scans images and screenshots before upload, highlights exposure risks, and creates a safer preview.</p>
              <p className="brand-korean">보이지 않던 개인정보 노출 후보를 찾고, 공유 전에 사용자가 직접 검토할 수 있게 합니다.</p>
              <div className="brand-actions">
                <button className="btn btn-primary btn-lg brand-cta" onClick={startDemo}>Start Demo <ArrowRight size={19} /></button>
                <a className="btn btn-ghost btn-lg brand-link" href="#ecosystem">View Scan Flow <ArrowDownRight size={18} /></a>
              </div>
              <div className="brand-proof-row">
                {['No backend required', 'Human-in-the-loop', 'Local demo data'].map((item) => <span key={item}><Check size={14} /> {item}</span>)}
              </div>
            </div>

            <div className="hero-scan-console brand-fade-up brand-fade-up-delay">
              <div className="console-frame glass-panel">
                <div className="console-head">
                  <span>PROOFCLEAN / LIVE SCAN</span>
                  <b><i /> PROTECTED SESSION</b>
                </div>
                <div className="console-body">
                  <ImagePreviewPanel purpose="SECOND_HAND" findings={mock.findings} showLegend={false} />
                  <div className="brand-scan-line" />
                  <div className="console-risk"><small>EXPOSURE RISK</small><strong>87</strong><span>HIGH REVIEW</span></div>
                  <div className="console-status"><ShieldCheck size={16} /> Safe preview ready</div>
                </div>
                <div className="console-metrics">
                  <div><span>TRACES</span><b>04</b></div>
                  <div><span>CONFIDENCE</span><b>91%</b></div>
                  <div><span>MASKING</span><b>READY</b></div>
                </div>
              </div>
            </div>
          </div>
          <div className="page hero-index"><span>01 / PRIVACY SCANNER</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <section className="brand-section ecosystem-section" id="ecosystem">
          <div className="page">
            <div className="brand-section-head">
              <div><span className="brand-eyebrow">Integrated protection flow</span><h2>One system.<br />Four privacy moves.</h2></div>
              <p>ProofClean은 탐지에서 끝나지 않습니다. 위험 맥락을 읽고, 가리고, 비교하는 검토 흐름을 하나의 시스템으로 연결합니다.</p>
            </div>
            <BrandPillars />
          </div>
        </section>

        <section className="brand-section os-section" id="clean">
          <div className="page">
            <div className="os-statement">
              <span className="brand-eyebrow">ProofClean OS</span>
              <h2>The Privacy OS<br />for safer sharing.</h2>
              <p>어디에 올리든, 먼저 보이지 않는 흔적을 확인하세요.</p>
            </div>
            <div className="context-grid">
              {contexts.map(({ title, label, copy, icon: Icon }, index) => (
                <article className="context-card" key={title}>
                  <div className="context-number">0{index + 1}</div>
                  <Icon size={24} />
                  <div><small>{title}</small><h3>{label}</h3><p>{copy}</p></div>
                  <ArrowRight size={18} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-section system-principle" id="compare">
          <div className="page principle-stage">
            <div className="principle-line" />
            <span className="brand-eyebrow">Review, not blind trust</span>
            <h2>Detection is a signal.<br />You make the decision.</h2>
            <p>ProofClean의 결과는 개인정보 확정 판정이 아닌 탐지 후보와 노출 가능성 안내입니다. 최종 공유 전 사용자가 직접 확인하는 과정을 제품의 중심에 둡니다.</p>
            <div className="principle-metrics"><span><b>04</b> exposure candidates</span><span><b>01</b> human decision</span><span><b>00</b> forced API calls</span></div>
          </div>
        </section>

        <section className="brand-section final-cta-section">
          <div className="page final-cta-panel">
            <div><span className="brand-eyebrow"><Sparkles size={14} /> Ready when you are</span><h2>Try a privacy scan<br />in 30 seconds.</h2></div>
            <div><p>샘플 이미지로 Scan → Risk → Clean → Compare 전체 흐름을 바로 경험하세요.</p><button className="btn btn-primary btn-lg" onClick={startDemo}>Start Demo <ArrowRight size={20} /></button></div>
          </div>
        </section>
      </main>
      <footer className="brand-footer"><div className="page"><b>ProofClean</b><span>Upload Clean. Share Safe.</span><span>© 2026 Privacy Pre-flight System</span></div></footer>
    </div>
  );
}
