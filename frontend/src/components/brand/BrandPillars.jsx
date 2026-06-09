import { useState } from 'react';
import { Activity, Eye, GitCompare, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import ImagePreviewPanel from '../analysis/ImagePreviewPanel.jsx';
import { buildMockResult } from '../../data/demoAnalyses.js';

const pillars = [
  {
    id: 'scan',
    number: '01',
    label: 'Scan',
    title: 'Find what the eye skips.',
    description: '이미지와 캡처 속 송장, 연락처, 주소, 위치 단서를 업로드 전에 탐지 후보로 표시합니다.',
    icon: ScanLine,
    metric: '04',
    metricLabel: 'exposure candidates',
  },
  {
    id: 'risk',
    number: '02',
    label: 'Risk',
    title: 'Turn traces into context.',
    description: '탐지 후보의 신뢰도와 맥락을 조합해 개인정보 확정이 아닌 노출 가능성 참고 점수를 제공합니다.',
    icon: Activity,
    metric: '87',
    metricLabel: 'exposure score',
  },
  {
    id: 'clean',
    number: '03',
    label: 'Clean',
    title: 'Mask before you publish.',
    description: '확인이 필요한 영역을 좌표 기반 마스킹으로 가려 공유 전 안전본을 빠르게 준비합니다.',
    icon: Sparkles,
    metric: '04',
    metricLabel: 'areas cleaned',
  },
  {
    id: 'compare',
    number: '04',
    label: 'Compare',
    title: 'Review every change.',
    description: '원본과 안전본을 같은 기준으로 비교해 무엇이 가려졌는지 사용자가 최종 확인합니다.',
    icon: GitCompare,
    metric: '1:1',
    metricLabel: 'review workflow',
  },
];

export default function BrandPillars() {
  const [activeId, setActiveId] = useState('scan');
  const active = pillars.find((pillar) => pillar.id === activeId) || pillars[0];
  const mock = buildMockResult('SECOND_HAND');
  const ActiveIcon = active.icon;

  return (
    <div className="pillar-system">
      <div className="pillar-tabs" role="tablist" aria-label="ProofClean 핵심 기능">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const selected = pillar.id === activeId;
          return (
            <button
              key={pillar.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`pillar-tab ${selected ? 'active' : ''}`}
              onClick={() => setActiveId(pillar.id)}
            >
              <span>{pillar.number}</span>
              <Icon size={20} />
              <b>{pillar.label}</b>
            </button>
          );
        })}
      </div>

      <div className="interactive-panel pillar-stage" role="tabpanel" key={active.id}>
        <div className="pillar-copy">
          <span className="brand-pill"><ActiveIcon size={15} /> {active.label} system</span>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <div className="pillar-metric">
            <strong>{active.metric}</strong>
            <span>{active.metricLabel}</span>
          </div>
        </div>
        <div className={`pillar-visual pillar-visual--${active.id}`}>
          <div className="visual-topline"><span>개인정보 실시간 점검</span><b><i /> 시스템 준비 완료</b></div>
          <ImagePreviewPanel
            purpose="SECOND_HAND"
            findings={mock.findings}
            masked={active.id === 'clean' || active.id === 'compare'}
            showLegend={false}
          />
          <div className="brand-scan-line" aria-hidden="true" />
          <div className="visual-chip visual-chip-score"><Eye size={14} /> {active.id === 'risk' ? 'RISK 87' : '4 TRACES'}</div>
          <div className="visual-chip visual-chip-safe"><ShieldCheck size={14} /> {active.id === 'scan' ? '스캔 중' : '안전본 미리보기'}</div>
        </div>
      </div>
    </div>
  );
}
