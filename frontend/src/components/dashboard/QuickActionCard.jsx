import { Link } from 'react-router-dom';
import { Camera, GraduationCap, Package, ArrowRight } from 'lucide-react';

const actions = [
  { title: 'SNS 사진 점검', icon: Camera, hint: '얼굴·위치 단서 확인' },
  { title: '중고거래 사진 점검', icon: Package, hint: '송장·주소 후보 확인' },
  { title: '과제 캡처 점검', icon: GraduationCap, hint: '학번·이메일 후보 확인' },
];

export default function QuickActionCard() {
  return (
    <section className="quick-actions">
      {actions.map(({ title, icon: Icon, hint }) => (
        <Link className="quick-action-card" to="/analyses/new" key={title}>
          <span><Icon size={22} /></span>
          <div><b>{title}</b><p>{hint}</p></div>
          <ArrowRight size={18} />
        </Link>
      ))}
    </section>
  );
}
