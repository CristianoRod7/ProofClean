import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadDropzone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const handleDrop = (event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files?.[0]; if (file) onFile(file); };
  return <label className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}><input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" hidden onChange={(e) => onFile(e.target.files?.[0])} /><div><UploadCloud size={48} color="#2563eb" /><h2>파일을 드래그하거나 클릭해서 업로드</h2><p className="muted">jpg, jpeg, png, webp, pdf 지원 · 프론트 MVP는 이미지 미리보기를 우선 제공합니다.</p></div></label>;
}
