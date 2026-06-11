import { ScanText, ScanFace, ShieldCheck } from 'lucide-react';

const criteria = [
  {
    icon: ScanText,
    title: '화면 속 텍스트',
    description: '송장, 이메일, 학번, 연락처처럼 화면에 보이는 문자를 확인합니다.',
  },
  {
    icon: ScanFace,
    title: '시각적 단서',
    description: '얼굴, 위치 태그, 배경 속 장소 단서처럼 이미지 안의 맥락을 확인합니다.',
  },
  {
    icon: ShieldCheck,
    title: '공유 전 조치',
    description: '마스킹, 자르기, 다시 촬영 등 공유 전 필요한 조치를 안내합니다.',
  },
];

export default function DetectionCriteriaSummary() {
  return (
    <section className="detection-criteria-summary" aria-labelledby="detection-criteria-title">
      <div className="detection-criteria-summary__heading">
        <span>탐지 기준 요약</span>
        <h3 id="detection-criteria-title">선택한 상황에 따라 탐지 기준이 달라집니다.</h3>
      </div>
      <div className="detection-criteria-grid">
        {criteria.map(({ icon: Icon, title, description }) => (
          <article key={title}>
            <span><Icon size={17} /></span>
            <div><h4>{title}</h4><p>{description}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
