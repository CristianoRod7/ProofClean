import { useEffect, useState } from 'react';
import ScenarioCard from '../analysis/ScenarioCard.jsx';
import { scenarioAssets } from '../../config/scenarioAssets.js';

export default function AnalysisModeSelector({ value, onChange, onHover, previewLocked = false }) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setEntering(false), 720);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`context-picker-grid ${entering ? 'is-entering' : 'is-settled'}`}>
      {scenarioAssets.map((scenario, index) => (
        <ScenarioCard
          key={scenario.mode}
          scenario={scenario}
          selected={value === scenario.mode}
          index={index}
          onSelect={onChange}
          onPreview={onHover}
          previewLocked={previewLocked}
        />
      ))}
    </div>
  );
}
