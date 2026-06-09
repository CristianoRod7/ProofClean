import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '../components/layout/Header.jsx';
import SplashIntro from '../components/intro/SplashIntro.jsx';
import ScanVisual from '../components/visuals/ScanVisual.jsx';
import RiskVisual from '../components/visuals/RiskVisual.jsx';
import CleanVisual from '../components/visuals/CleanVisual.jsx';
import CompareVisual from '../components/visuals/CompareVisual.jsx';
import ContextVisual from '../components/visuals/ContextVisual.jsx';
import useAuth from '../hooks/useAuth.js';

const contexts = [
  { type: 'SNS', badge: 'SNS', title: 'SNS 업로드', meta: '얼굴, 위치 태그, 배경 단서를 점검합니다.' },
  { type: 'MARKETPLACE', badge: '중고거래', title: '중고거래 사진', meta: '송장, 주소, 전화번호 후보를 확인합니다.' },
  { type: 'ASSIGNMENT', badge: '과제', title: '과제 제출 캡처', meta: '학번, 이메일, 저장소 경로를 점검합니다.' },
  { type: 'COMMUNITY', badge: '커뮤니티', title: '커뮤니티 게시글', meta: '닉네임, 이메일, 지역 단서를 확인합니다.' },
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
          <div><span className="board-kicker"><i /> PRIVACY PROTECTION OS</span><h1>Upload Clean.<br />Share Safe.</h1></div>
          <div className="board-hero-side"><p>공유하기 전, 이미지와 캡처 속 개인정보 노출 가능성을 먼저 확인하세요.</p><small>ProofClean은 업로드 전 파일을 점검하고, 탐지 후보와 노출 가능성 점수를 보여준 뒤 안전본 미리보기를 제공합니다.</small><div className="board-actions"><button className="board-button board-button-primary" onClick={startDemo}>데모 시작 <ArrowRight size={16} /></button><a className="board-button" href="#scan-board">분석 흐름 보기 <ArrowDownRight size={16} /></a></div></div>
        </section><div className="board-trust">백엔드 없이 시연 가능 · 사용자 최종 확인 구조 · 로컬 데모 데이터</div>

        <section className="showcase-grid showcase-grid-main" id="scan-board" aria-label="ProofClean scan board">
          <article className="showcase-card feature-card feature-scan"><div className="card-label"><span>01 / SCAN</span><em>스캔 중</em></div><h2>업로드 전 스캔</h2><p>이미지와 캡처 속 노출 후보를 먼저 확인합니다.</p><ScanVisual /><footer><span>탐지 후보</span><b>04</b></footer></article>
          <article className="showcase-card feature-card feature-risk"><div className="card-label"><span>02 / RISK</span><em>확인 필요</em></div><h2>노출 가능성 점수</h2><p>전화번호, 주소, 위치 단서의 위험도를 점수로 정리합니다.</p><RiskVisual /><footer><span>확인 필요</span><b>87점</b></footer></article>
          <article className="showcase-card feature-card feature-clean"><div className="card-label"><span>03 / CLEAN</span><em>준비 완료</em></div><h2>안전본 생성</h2><p>확인한 영역을 마스킹한 안전본을 만듭니다.</p><CleanVisual /><footer><span>마스킹</span><b>안전본 준비 완료</b></footer></article>
          <article className="showcase-card feature-card feature-compare"><div className="card-label"><span>04 / COMPARE</span><em>비교</em></div><h2>원본 / 안전본 비교</h2><p>공유 전 원본과 마스킹 결과를 나란히 확인합니다.</p><CompareVisual /><footer><span>비교 화면</span><b>미리보기</b></footer></article>
        </section>

        <section className="board-section-head"><div><span>05 / 업로드 상황</span><h2>업로드 상황별 맞춤 점검</h2></div><p><CheckCircle2 size={15} /> 최종 확인은 사용자가 직접 진행합니다.</p></section>
        <section className="showcase-grid context-showcase-grid">
          {contexts.map((item) => <button className="showcase-card context-showcase-card" key={item.type} onClick={startDemo}><div className="card-label"><span>업로드 상황</span><em>{item.badge}</em></div><ContextVisual type={item.type} /><footer><div><h3>{item.title}</h3><p>{item.meta}</p></div><ArrowRight size={17} /></footer></button>)}
        </section>

        <section className="board-final"><div><span>지금 바로 시작</span><h2>30초 안에 개인정보 노출 가능성을 점검해보세요.</h2></div><button className="board-button board-button-light" onClick={startDemo}>데모 시작 <ArrowRight size={17} /></button></section>
      </main>
      <footer className="board-footer page"><b>ProofClean</b><span>개인정보 점검 보드 · 로컬 데모 환경</span><span>© 2026</span></footer>
    </div>
  );
}
