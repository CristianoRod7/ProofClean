import { AtSign, GraduationCap, MapPin, MessageCircle, Package, Phone } from 'lucide-react';

const examples = [
  { icon: Package, title: '택배 송장의 주소', text: '받는 사람과 상세 주소가 사진에 함께 남을 수 있습니다.' },
  { icon: AtSign, title: '캡처 속 이메일', text: '브라우저나 메신저 상단에 계정 정보가 표시될 수 있습니다.' },
  { icon: GraduationCap, title: '과제 파일의 학번', text: '표지, 파일명, 제출 화면에 학번이 포함될 수 있습니다.' },
  { icon: MapPin, title: '사진 배경의 위치 단서', text: '간판, 건물명, 위치 태그가 촬영 장소를 드러낼 수 있습니다.' },
  { icon: MessageCircle, title: '커뮤니티의 닉네임', text: '프로필과 댓글 영역에서 계정 단서가 노출될 수 있습니다.' },
  { icon: Phone, title: '거래 사진 속 전화번호', text: '송장이나 대화 캡처에 연락처가 남아 있을 수 있습니다.' },
];

export default function PrivacyExamples() {
  return (
    <section className="onboarding-section onboarding-problem-section" aria-labelledby="privacy-problem-title">
      <div className="onboarding-section-head">
        <span>왜 필요한가요?</span>
        <div><h2 id="privacy-problem-title">공유 전에는 잘 보이지 않는 정보가 있습니다.</h2><p>ProofClean은 놓치기 쉬운 정보를 공유 전에 다시 확인할 수 있도록 노출 가능성을 정리합니다.</p></div>
      </div>
      <div className="privacy-example-grid">
        {examples.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={19} /><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </div>
    </section>
  );
}
