import { useEffect, useState } from 'react';
import ModeVisual from './ModeVisuals.jsx';
import { getScenarioAsset } from '../../config/scenarioAssets.js';

export default function ScenarioVisual({ mode, className = '', eager = false }) {
  const scenario = getScenarioAsset(mode);
  const [customImageReady, setCustomImageReady] = useState(false);
  const [customImageFailed, setCustomImageFailed] = useState(false);

  useEffect(() => {
    setCustomImageReady(false);
    setCustomImageFailed(false);
  }, [scenario.customImage]);

  return (
    <div
      className={`scenario-visual ${customImageReady ? 'has-custom-image' : 'uses-default-visual'} ${className}`.trim()}
      data-scenario={scenario.mode.toLowerCase()}
    >
      <div className="scenario-visual__fallback" aria-hidden={customImageReady}>
        <ModeVisual mode={scenario.mode} />
      </div>
      {!customImageFailed && (
        <img
          className="scenario-visual__image"
          src={scenario.customImage}
          alt={scenario.visualLabel}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setCustomImageReady(true)}
          onError={() => {
            setCustomImageReady(false);
            setCustomImageFailed(true);
          }}
        />
      )}
      <div className="scenario-visual__shade" aria-hidden="true" />
      <span className="scenario-visual__caption" aria-hidden="true">
        <i />
        PRIVACY REVIEW
      </span>
    </div>
  );
}
