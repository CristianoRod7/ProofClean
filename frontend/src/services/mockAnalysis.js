import { demoAnalyses, buildMockResult, SAMPLE_IMAGE } from '../data/demoAnalyses.js';
import { getItem, setItem } from './storage.js';

const KEY = 'proofclean_analyses';

function now() { return new Date().toISOString(); }
function uuid(prefix = 'analysis') { return `${prefix}-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`; }
function normalize(list) { return [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)); }

export function seedDemoAnalyses() {
  const current = getItem(KEY, null);
  if (current === null) setItem(KEY, demoAnalyses);
}

export function getAnalyses() {
  seedDemoAnalyses();
  return normalize(getItem(KEY, []));
}

export function getAnalysisById(id) {
  return getAnalyses().find((analysis) => analysis.id === id) || null;
}

export function saveAnalysis(analysis) {
  const analyses = getItem(KEY, []);
  const exists = analyses.some((item) => item.id === analysis.id);
  const next = exists ? analyses.map((item) => (item.id === analysis.id ? analysis : item)) : [analysis, ...analyses];
  setItem(KEY, next);
  return analysis;
}

export function createAnalysis({ title, purpose }) {
  const created = now();
  return saveAnalysis({
    id: uuid(),
    title,
    purpose,
    status: 'CREATED',
    riskScore: 0,
    riskLevel: 'LOW',
    createdAt: created,
    updatedAt: created,
    fileName: '',
    filePreviewUrl: '',
    maskedPreviewUrl: '',
    findings: [],
    scenarios: [],
    recommendations: [],
  });
}

export function uploadMockFile(id, { fileName, filePreviewUrl, sourceType = 'upload' }) {
  const analysis = getAnalysisById(id);
  if (!analysis) throw new Error('분석 프로젝트를 찾을 수 없습니다.');
  return saveAnalysis({
    ...analysis,
    status: 'UPLOADED',
    fileName,
    filePreviewUrl: filePreviewUrl || SAMPLE_IMAGE,
    sourceType,
    isSample: sourceType === 'sample',
    updatedAt: now(),
  });
}

export function useSampleImage(id) {
  return uploadMockFile(id, { fileName: 'proofclean-sample-image.png', filePreviewUrl: SAMPLE_IMAGE, sourceType: 'sample' });
}

export function runMockAnalysis(id) {
  const analysis = getAnalysisById(id);
  if (!analysis) throw new Error('분석 프로젝트를 찾을 수 없습니다.');
  const result = buildMockResult(analysis.purpose);
  const sourceType = analysis.sourceType || 'sample';
  const findings = result.findings.map((finding) => (
    sourceType === 'upload'
      ? {
          ...finding,
          x: null,
          y: null,
          width: null,
          height: null,
          hasCoordinates: false,
          coordinateStatus: 'demo',
          coordinateSource: 'mock',
        }
      : { ...finding, hasCoordinates: true, coordinateStatus: 'demo', coordinateSource: 'mock' }
  ));
  return saveAnalysis({
    ...analysis,
    ...result,
    findings,
    detections: findings,
    status: 'ANALYZED',
    filePreviewUrl: analysis.filePreviewUrl || SAMPLE_IMAGE,
    fileName: analysis.fileName || 'proofclean-sample-image.png',
    provider: 'mock',
    aiFallback: sourceType === 'upload',
    fallbackReason: sourceType === 'upload' ? '백엔드 AI 분석을 사용할 수 없어 데모 탐지 기준으로 대체했습니다.' : '',
    updatedAt: now(),
  });
}

export function createMaskedVersion(id) {
  const analysis = getAnalysisById(id);
  if (!analysis) throw new Error('분석 프로젝트를 찾을 수 없습니다.');
  if (analysis.sourceType === 'upload' && !analysis.findings?.some((finding) => finding.hasCoordinates && finding.coordinateStatus !== 'demo')) {
    return saveAnalysis({
      ...analysis,
      maskingSkipped: true,
      maskingMessage: '정확한 위치 좌표가 없어 자동 마스킹을 건너뛰었습니다.',
      updatedAt: now(),
    });
  }
  return saveAnalysis({ ...analysis, status: 'MASKED', maskedPreviewUrl: analysis.filePreviewUrl || SAMPLE_IMAGE, maskingStyle: analysis.maskingStyle || 'solid', updatedAt: now() });
}

export function deleteAnalysis(id) {
  setItem(KEY, getItem(KEY, []).filter((analysis) => analysis.id !== id));
}

export function removeStaleAnalysisFromStorage(id) {
  const analysisId = String(id || '').trim();
  if (!analysisId) return;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) {
      localStorage.removeItem(KEY);
      return;
    }
    localStorage.setItem(
      KEY,
      JSON.stringify(stored.filter((analysis) => analysis?.id !== analysisId)),
    );
  } catch {
    localStorage.removeItem(KEY);
  }
}
