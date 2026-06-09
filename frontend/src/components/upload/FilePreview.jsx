import { FileCheck2 } from 'lucide-react';
import { fileSize } from '../../utils/fileUtils.js';
import ImagePreviewPanel from '../analysis/ImagePreviewPanel.jsx';

export default function FilePreview({ file, preview, purpose }) {
  if (!file && !preview) return null;
  return (
    <section className="card file-preview-card">
      <div className="between">
        <div>
          <span className="eyebrow">미리보기 준비 완료</span>
          <h3>{file?.name || 'proofclean-sample-image.png'}</h3>
          <p className="muted">{file ? fileSize(file.size) : '목적별 대체 화면 기반 샘플 이미지'}</p>
        </div>
        <span className="badge badge-green"><FileCheck2 size={14} /> 미리보기 준비 완료</span>
      </div>
      <ImagePreviewPanel src={preview} purpose={purpose} findings={[]} showLegend={false} />
    </section>
  );
}
