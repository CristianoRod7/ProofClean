export default function PageHero({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={`analysis-page-hero ${className}`.trim()}>
      <p className="analysis-page-hero__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="analysis-page-hero__description">{description}</p>
      {children ? <div className="analysis-page-hero__meta">{children}</div> : null}
    </section>
  );
}
