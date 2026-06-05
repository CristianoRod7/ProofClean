import { useEffect, useRef, useState } from 'react';
import './SplashIntro.css';

const EXIT_DURATION = 320;

export default function SplashIntro({ onFinish, duration = 2050 }) {
  const [exiting, setExiting] = useState(false);
  const finishRef = useRef(onFinish);

  useEffect(() => { finishRef.current = onFinish; }, [onFinish]);
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const safeDuration = reduced ? 520 : Math.max(1500, Math.min(duration, 2200));
    const exitTimer = window.setTimeout(() => setExiting(true), safeDuration - EXIT_DURATION);
    const finishTimer = window.setTimeout(() => finishRef.current?.(), safeDuration);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [duration]);

  return (
    <div className={`splash-intro ${exiting ? 'splash-intro--exiting' : ''}`} role="status" aria-live="polite" aria-label="ProofClean을 준비하는 중">
      <div className="splash-intro__content">
        <div className="splash-intro__logo-wrap">
          <h1 className="splash-intro__logo">Proof<span>Clean</span></h1>
          <div className="splash-intro__scan" aria-hidden="true" />
          <div className="splash-intro__clean-reveal" aria-hidden="true" />
        </div>
        <p className="splash-intro__status"><i aria-hidden="true" />Scanning hidden traces...</p>
      </div>
    </div>
  );
}
