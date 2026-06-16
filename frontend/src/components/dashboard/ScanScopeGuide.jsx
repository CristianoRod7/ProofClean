import { Camera, GraduationCap, MessageSquareText, PackageCheck } from 'lucide-react';

const scopes = [
  { icon: Camera, keyword: 'SNS', title: 'SNS 사진', text: '얼굴, 위치 태그, 배경 속 장소 단서' },
  { icon: PackageCheck, keyword: '거래', title: '중고거래 사진', text: '택배 송장, 주소, 전화번호, 거래 정보' },
  { icon: GraduationCap, keyword: '과제', title: '과제 캡처', text: '학번, 이름, 이메일, 파일 경로, GitHub 주소' },
  { icon: MessageSquareText, keyword: '게시글', title: '커뮤니티 화면', text: '닉네임, 지역명, 프로필, 댓글 속 단서' },
];

export default function ScanScopeGuide() {
  return (
    <section className="onboarding-section scan-scope-section" aria-labelledby="scan-scope-title">
      <div className="onboarding-section-head">
        <span>점검 범위</span>
        <div><h2 id="scan-scope-title">무엇을 점검할 수 있나요?</h2><p>공유 목적에 따라 자주 놓치는 후보가 다릅니다. 아래 예시는 분석 상황을 이해하기 위한 안내입니다.</p></div>
      </div>
      <div className="scan-scope-grid">
        {scopes.map(({ icon: Icon, keyword, title, text }) => <article key={title}><div className="scan-scope-visual"><span>{keyword}</span><Icon size={30} /><i /></div><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </div>
    </section>
  );
}
