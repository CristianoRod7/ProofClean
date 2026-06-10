import { useState } from 'react';
import { UploadCloud, FileImage, MousePointerClick } from 'lucide-react';

export default function UploadDropzone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      className={`dropzone brand-dropzone ${dragging ? 'dragging' : ''}`}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" hidden onChange={(event) => onFile(event.target.files?.[0])} />
      <div className="dropzone-orb"><UploadCloud size={44} /></div>
      <h2>파일을 드래그하거나 클릭해서 업로드</h2>
      <p>jpg, jpeg, png, webp, pdf 지원 · 샘플 이미지로도 전체 흐름을 시연할 수 있습니다.</p>
      <div className="dropzone-hints"><span><FileImage size={16} /> 이미지 미리보기</span><span><MousePointerClick size={16} /> 탐지 박스 오버레이</span></div>
    </label>
  );
}
