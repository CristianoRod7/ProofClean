import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import './SplashIntro.css';

const EXIT_DURATION = 360;

export default function SplashIntro({ onFinish, duration = 2200 }) {
  const [exiting, setExiting] = useState(false);
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const safeDuration = reduceMotion ? Math.min(700, duration) : Math.max(800, duration);
    const exitTimer = window.setTimeout(() => setExiting(true), Math.max(0, safeDuration - EXIT_DURATION));
    const finishTimer = window.setTimeout(() => finishRef.current?.(), safeDuration);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [duration]);

  return (
    <div
      className={`splash-intro ${exiting ? 'splash-intro--exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="ProofClean을 준비하는 중"
    >
      <div className="splash-intro__ambient splash-intro__ambient--blue" />
      <div className="splash-intro__ambient splash-intro__ambient--mint" />

      <div className="splash-intro__content">
        <div className="splash-intro__mark" aria-hidden="true">
          <ShieldCheck size={23} strokeWidth={2.25} />
        </div>

        <div className="splash-intro__logo-wrap">
          <h1 className="splash-intro__logo">
            <span>Proof</span><i aria-hidden="true" /><span>Clean</span>
          </h1>
          <div className="splash-intro__scan" aria-hidden="true" />
          <div className="splash-intro__clean-flash" aria-hidden="true" />
        </div>

        <div className="splash-intro__status">
          <span className="splash-intro__status-dot" aria-hidden="true" />
          <p>Scanning hidden traces...</p>
        </div>
        <div className="splash-intro__progress" aria-hidden="true"><i /></div>
      </div>

      <p className="splash-intro__caption">PRIVACY PRE-FLIGHT · SECURE BY REVIEW</p>
    </div>
  );
}
