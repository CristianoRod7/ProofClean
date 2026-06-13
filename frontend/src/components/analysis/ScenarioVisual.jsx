import { useEffect, useState } from 'react';
import ModeVisual from './ModeVisuals.jsx';
import { getScenarioAsset } from '../../config/scenarioAssets.js';

export default function ScenarioVisual({ mode, className = '', eager = false }) {
  const scenario = getScenarioAsset(mode);
  const [imageState, setImageState] = useState('loading');

  useEffect(() => {
    setImageState('loading');
  }, [scenario.customImage]);

  if (imageState === 'failed') {
    return (
      <div
        className={`scenario-visual uses-default-visual ${className}`.trim()}
        data-scenario={scenario.mode.toLowerCase()}
        data-image-state="fallback"
      >
        <div className="scenario-visual__fallback">
          <ModeVisual mode={scenario.mode} />
        </div>
        <div className="scenario-visual__shade" aria-hidden="true" />
        <span className="scenario-visual__caption" aria-hidden="true">
          <i />
          PRIVACY REVIEW
        </span>
      </div>
    );
  }

  return (
    <div
      className={`scenario-visual has-custom-image ${imageState === 'ready' ? 'is-ready' : 'is-loading'} ${className}`.trim()}
      data-scenario={scenario.mode.toLowerCase()}
      data-image-state={imageState}
    >
      <img
        className="scenario-visual__image"
        src={scenario.customImage}
        alt={scenario.visualLabel}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setImageState('ready')}
        onError={() => setImageState('failed')}
      />
      <div className="scenario-visual__shade" aria-hidden="true" />
      <span className="scenario-visual__caption" aria-hidden="true">
        <i />
        PRIVACY REVIEW
      </span>
    </div>
  );
}
