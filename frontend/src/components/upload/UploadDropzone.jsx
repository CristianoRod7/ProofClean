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
      <h2>파일을 여기에 끌어오거나 선택하세요.</h2>
      <p>JPG, PNG, WEBP 캡처 이미지를 기준으로 시연합니다. PDF는 대체 미리보기를 제공합니다.</p>
      <div className="dropzone-hints"><span><FileImage size={16} /> 이미지 미리보기</span><span><MousePointerClick size={16} /> 탐지 박스 오버레이</span></div>
    </label>
  );
}
