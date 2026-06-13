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
      className={`showcase-card context-picker-card analysis-mode-card ${selected ? 'selected' : ''}`}
    >
      <div className="mode-card-visual">
        <ScenarioVisual mode={scenario.mode} />
        <div className="mode-card-meta">
          <span className="mode-card-eyebrow">업로드 상황</span>
          {selected ? (
            <span className="mode-card-badge selected-mode-mark"><CheckCircle2 size={15} /> 선택됨</span>
          ) : (
            <span className="mode-card-badge">{scenario.shortLabel}</span>
          )}
        </div>
      </div>
      <div className="mode-card-body picker-copy">
        <h3 className="mode-card-title">{scenario.title}</h3>
        <p className="mode-card-description">{scenario.description}</p>
        <div className="mode-card-chips">
          {scenario.clues.slice(0, 3).map((clue) => (
            <span className="mode-card-chip" key={clue}>{clue}</span>
          ))}
        </div>
      </div>
    </button>
  );
}
