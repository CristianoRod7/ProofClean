import { Download } from 'lucide-react';

export default function DownloadButton({ onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      <Download size={18} /> 안전본 다운로드
    </button>
  );
}
