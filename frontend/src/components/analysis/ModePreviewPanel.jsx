import { CheckCircle2, Eye, ScanSearch, ShieldCheck } from 'lucide-react';
import ScenarioVisual from './ScenarioVisual.jsx';
import { getScenarioAsset } from '../../config/scenarioAssets.js';

export default function ModePreviewPanel({ mode = 'SECOND_HAND', locked = false }) {
  const scenario = getScenarioAsset(mode);

  return (
    <aside className={`mode-preview-panel analysis-side-panel interactive-flow-card ${locked ? 'is-locked' : 'is-previewing'}`} data-mode={scenario.mode}>
      <div className="mode-preview-panel__visual"><ScenarioVisual mode={scenario.mode} className="scenario-visual--preview" eager /></div>
      <div className="mode-preview-panel__copy" key={scenario.mode}>
        <div className="mode-preview-panel__status">
          <span className="eyebrow"><Eye size={14} /> 선택 상황 미리보기</span>
          <span className={`mode-preview-state ${locked ? 'is-selected' : ''}`}>
            {locked ? <CheckCircle2 size={13} /> : <ScanSearch size={13} />}
            {locked ? '선택됨' : '미리보기'}
          </span>
        </div>
        <h3>{scenario.title}에서 확인할 단서</h3>
        <p>{scenario.description}</p>
        <div className="mode-preview-clues" aria-label={`${scenario.title} 주요 확인 단서`}>
          {scenario.clues.map((clue) => <span key={clue}>{clue}</span>)}
        </div>
        <small className="mode-preview-note"><ShieldCheck size={14} />선택한 상황에 맞춰 탐지 후보와 권장 조치를 구성합니다.</small>
      </div>
    </aside>
  );
}
