import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, FileWarning, Fingerprint, Gauge, GitCompare, LockKeyhole, MapPin, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react';
import Header from '../components/layout/Header.jsx';
import SplashIntro from '../components/intro/SplashIntro.jsx';
import Card from '../components/common/Card.jsx';
import ImagePreviewPanel from '../components/analysis/ImagePreviewPanel.jsx';
import useAuth from '../hooks/useAuth.js';
import { buildMockResult, SAMPLE_IMAGE } from '../data/demoAnalyses.js';

const problems = [
  ['택배 송장', '주소와 연락처가 한 화면에 남아있는 거래 사진', FileWarning],
  ['카톡 캡처', '닉네임, 알림, 대화 상대 단서가 함께 노출되는 캡처', ScanSearch],
  ['모니터 화면', '학번, 이메일, 저장소 경로가 보이는 과제 화면', Eye],
  ['위치 단서', '간판, 지도, 생활권 정보로 위치가 추정되는 사진', MapPin],
];
const flow = ['업로드', '탐지 후보 확인', '노출 가능성 분석', '안전본 생성'];
const features = [
  ['개인정보 후보 탐지', '송장, 전화번호, 이메일, 위치 단서를 후보로 표시합니다.', Fingerprint],
  ['노출 가능성 점수', '확정 판정이 아닌 참고 점수로 위험도를 전달합니다.', Gauge],
  ['위험 시나리오', '어떤 맥락에서 문제가 될 수 있는지 가능성 중심으로 설명합니다.', LockKeyhole],
  ['원본/안전본 비교', '마스킹된 영역을 좌우 비교로 빠르게 확인합니다.', GitCompare],
];

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem('proofclean_intro_seen') !== 'true';
    } catch {
      return true;
    }
  });
  const auth = useAuth();
  const navigate = useNavigate();
  const startDemo = async () => {
    await auth.demoLogin();
    navigate('/dashboard');
  };
  const mock = buildMockResult('SECOND_HAND');
  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem('proofclean_intro_seen', 'true');
    } catch {
      // The intro can still finish when storage is unavailable.
    }
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <SplashIntro onFinish={finishIntro} duration={2100} />}
      <Header />
      <main>
        <section className="hero">
          <div className="hero-blob hero-blob-a" />
          <div className="hero-blob hero-blob-b" />
          <div className="page hero-grid">
            <div className="hero-copy">
              <span className="badge badge-cyan"><Sparkles size={14} /> AI 기반 업로드 전 개인정보 노출 가능성 점검</span>
              <h1>올리기 전에,<br />먼저 검사하세요</h1>
              <p className="lead">사진과 문서 속 개인정보 노출 가능성을 분석하고 안전본을 생성합니다. 발표장에서 바로 보여줄 수 있는 보안 SaaS형 mock flow입니다.</p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" onClick={startDemo}>데모 시작하기 <ArrowRight size={19} /></button>
                <Link className="btn btn-muted btn-lg" to="/login">로그인</Link>
              </div>
              <div className="trust-row">
                {['localStorage mock', 'Human-in-the-loop', 'No backend required'].map((item) => <span key={item}><CheckCircle2 size={16} /> {item}</span>)}
              </div>
            </div>
            <div className="hero-preview" id="demo">
              <Card className="hero-mock glass-card">
                <div className="mock-toolbar"><i /><i /><i /><span>ProofClean 분석 콘솔</span></div>
                <div className="between mock-title-row">
                  <div>
                    <span className="badge badge-red">위험도 87점 · 매우 높음</span>
                    <h2>중고거래 게시글 사진 점검</h2>
                  </div>
                  <span className="badge badge-green"><ShieldCheck size={14} /> 자동 마스킹 준비 완료</span>
                </div>
                <div className="hero-mini-preview">
                  <ImagePreviewPanel src={SAMPLE_IMAGE} purpose="SECOND_HAND" findings={mock.findings.slice(0, 4)} showLegend={false} />
                </div>
                <div className="mock-metrics">
                  <div><b>4개</b><span>탐지 후보</span></div>
                  <div><b>91%</b><span>최고 신뢰도</span></div>
                  <div><b>3개</b><span>권장 조치</span></div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="page">
            <div className="section-head">
              <span className="eyebrow">Problem cases</span>
              <h2>사용자가 놓치기 쉬운 노출 후보</h2>
              <p className="muted">회색 박스가 아니라, 서비스가 실제로 확인해주는 대상이 무엇인지 한눈에 보여줍니다.</p>
            </div>
            <div className="grid grid-4">
              {problems.map(([title, text, Icon]) => (
                <Card key={title} interactive className="feature-card">
                  <div className="feature-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section flow-section" id="flow">
          <div className="page">
            <div className="section-head centered">
              <span className="eyebrow">How it works</span>
              <h2>4단계 업로드 전 점검 흐름</h2>
            </div>
            <div className="flow-line">
              {flow.map((step, index) => (
                <Card key={step} className="flow-card" interactive>
                  <span>0{index + 1}</span>
                  <h3>{step}</h3>
                  <p>복잡한 설정 없이 목적 선택부터 비교 화면까지 이어지는 발표용 시나리오입니다.</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page">
            <div className="grid grid-4">
              {features.map(([title, text, Icon]) => (
                <Card key={title} interactive className="feature-card feature-card-soft">
                  <div className="feature-icon mint"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="principles">
          <div className="page">
            <Card className="principle-card">
              <div>
                <span className="badge badge-cyan">Security principle</span>
                <h2>“확정 판정”이 아니라 “탐지 후보”와 “가능성”을 안내합니다.</h2>
                <p>ProofClean은 완벽한 탐지를 약속하지 않습니다. 사용자가 업로드 전에 다시 확인할 수 있도록 위험 후보를 명확하고 시각적으로 제시합니다.</p>
              </div>
              <ShieldCheck size={86} />
            </Card>
          </div>
        </section>
      </main>
      <footer className="footer page">© ProofClean · Human-in-the-loop privacy assistant</footer>
    </>
  );
}
