import Modal from './Modal.jsx';
export default function ConfirmModal({open,title,children,onClose,onConfirm}){ return <Modal open={open} title={title} onClose={onClose}>{children}<div style={{display:'flex',gap:10,marginTop:16}}><button className="btn btn-primary" onClick={onConfirm}>확인</button><button className="btn btn-muted" onClick={onClose}>취소</button></div></Modal>; }
