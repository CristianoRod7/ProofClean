export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.48)', display: 'grid', placeItems: 'center', zIndex: 100 }}><div className="card" style={{ width: 'min(540px, calc(100% - 32px))' }}><div className="between"><h2>{title}</h2><button className="btn btn-muted" onClick={onClose}>닫기</button></div>{children}</div></div>;
}
