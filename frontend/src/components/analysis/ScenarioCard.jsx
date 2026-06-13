import { CheckCircle2 } from 'lucide-react';
import ScenarioVisual from './ScenarioVisual.jsx';

export default function ScenarioCard({
  scenario,
  selected,
  index,
  onSelect,
  onPreview,
  previewLocked = false,
}) {
  const preview = (mode) => {
    if (!previewLocked) onPreview?.(mode);
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      onMouseEnter={() => preview(scenario.mode)}
      onMouseLeave={() => preview(null)}
      onFocus={() => preview(scenario.mode)}
      onBlur={() => preview(null)}
      onClick={() => onSelect(scenario.mode)}
      style={{ '--card-index': index }}
      className={`showcase-card context-picker-card scenario-card ${selected ? 'selected' : ''}`}
    >
      <div className="card-label">
        <span>업로드 상황</span>
        {selected ? (
          <span className="selected-mode-mark"><CheckCircle2 size={17} /> 선택됨</span>
        ) : (
          <em>{scenario.shortLabel}</em>
        )}
      </div>
      <ScenarioVisual mode={scenario.mode} />
      <div className="picker-copy">
        <h3>{scenario.title}</h3>
        <p>{scenario.description}</p>
        <div>{scenario.clues.slice(0, 3).map((clue) => <span key={clue}>{clue}</span>)}</div>
      </div>
    </button>
  );
}
