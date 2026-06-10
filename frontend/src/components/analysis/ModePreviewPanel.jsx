import { Eye, ScanSearch, ShieldCheck } from 'lucide-react';
import { purposeMeta } from '../../data/demoAnalyses.js';
import ModeVisual from './ModeVisuals.jsx';

export default function ModePreviewPanel({ mode = 'SECOND_HAND', locked = false }) {
  const meta = purposeMeta[mode] || purposeMeta.ETC;
  const guidance = {
    SNS: ['얼굴·위치 후보 확인', '게시 전 알림과 계정명 정리'],
    SECOND_HAND: ['송장과 연락처 마스킹', '거래 지역 단서 재확인'],
    ASSIGNMENT: ['학번·학교 이메일 가리기', '저장 경로와 문서 속성 확인'],
    COMMUNITY: ['닉네임·지역 단서 검토', '댓글 속 연락처 제거'],
    ETC: ['텍스트 후보를 넓게 검토', '필요한 영역만 선택 마스킹'],
  }[mode] || ['탐지 후보를 직접 검토', '공유 전 안전본 확인'];
  return (
    <aside className="mode-preview-panel interactive-flow-card" data-mode={mode}>
      <div className="mode-preview-panel__visual"><ModeVisual mode={mode} /></div>
      <div className="mode-preview-panel__copy" key={mode}>
        <span className="eyebrow"><Eye size={14} /> {locked ? '선택 상황 고정' : '선택 상황 미리보기'}</span>
        <h3>{meta.label}에서 확인할 단서</h3>
        <p>{meta.description}</p>
        <div className="mode-preview-clues">
          {meta.examples.map((example) => <span key={example}><ScanSearch size={13} />{example}</span>)}
        </div>
        <div className="mode-preview-output"><b>결과에서 제공</b><span>탐지 후보 · 위험도 · 안전본 비교</span></div>
        <div className="mode-preview-actions"><b>권장 조치 예시</b>{guidance.map((item) => <span key={item}><ShieldCheck size={13} />{item}</span>)}</div>
      </div>
    </aside>
  );
}
