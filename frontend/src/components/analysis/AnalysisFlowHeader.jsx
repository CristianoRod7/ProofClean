export default function AnalysisFlowHeader({ eyebrow, title, description, meta, actions, className = '' }) {
  return (
    <section className={`analysis-flow-header ${className}`.trim()}>
      <div className="analysis-flow-header__copy">
        <p className="analysis-flow-header__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="analysis-flow-header__description">{description}</p>
        {meta ? <div className="analysis-flow-header__meta">{meta}</div> : null}
      </div>
      {actions ? <div className="analysis-flow-header__actions">{actions}</div> : null}
    </section>
  );
}
