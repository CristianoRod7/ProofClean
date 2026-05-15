import { Link } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Card from '../components/common/Card.jsx';

export default function LandingPage() {
  const features = ['개인정보 후보 탐지', '노출 가능성 점수', '자동 마스킹', '안전본 다운로드'];
  return (
    <>
      <Header />
      <main className="page">
        <section className="hero">
          <span className="badge badge-blue">AI 기반 업로드 전 점검</span>
          <h1>올리기 전에,<br />먼저 검사하세요</h1>
          <p>사진과 문서 속 개인정보 노출 가능성을 확인하고 안전본을 생성합니다. 모든 결과는 탐지 후보이며 최종 확인은 사용자가 진행합니다.</p>
          <Link className="btn btn-primary" to="/register">분석 시작하기</Link>
        </section>
        <section className="grid grid-2">
          {features.map((feature) => <Card key={feature}><h3>{feature}</h3><p className="muted">업로드 전 노출 가능성을 점검하고 확인 필요 영역을 안내합니다.</p></Card>)}
        </section>
        <section className="hero">
          <div className="card"><h2>탐지 후보 → 위험도 분석 → 자동 마스킹 → 안전본 다운로드</h2><p className="muted">택배 송장, 카톡 캡처, 모니터 화면, 메타데이터 등 사용자가 놓칠 수 있는 후보를 먼저 보여주는 SaaS 대시보드입니다.</p></div>
        </section>
      </main>
    </>
  );
}
