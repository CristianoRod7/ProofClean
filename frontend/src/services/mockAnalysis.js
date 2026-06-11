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

export function uploadMockFile(id, { fileName, filePreviewUrl }) {
  const analysis = getAnalysisById(id);
  if (!analysis) throw new Error('분석 프로젝트를 찾을 수 없습니다.');
  return saveAnalysis({ ...analysis, status: 'UPLOADED', fileName, filePreviewUrl: filePreviewUrl || SAMPLE_IMAGE, updatedAt: now() });
}

export function useSampleImage(id) {
  return uploadMockFile(id, { fileName: 'proofclean-sample-image.png', filePreviewUrl: SAMPLE_IMAGE });
}

export function runMockAnalysis(id) {
  const analysis = getAnalysisById(id);
  if (!analysis) throw new Error('분석 프로젝트를 찾을 수 없습니다.');
  const result = buildMockResult(analysis.purpose);
  return saveAnalysis({ ...analysis, ...result, status: 'ANALYZED', filePreviewUrl: analysis.filePreviewUrl || SAMPLE_IMAGE, fileName: analysis.fileName || 'proofclean-sample-image.png', updatedAt: now() });
}

export function createMaskedVersion(id) {
  const analysis = getAnalysisById(id);
  if (!analysis) throw new Error('분석 프로젝트를 찾을 수 없습니다.');
  return saveAnalysis({ ...analysis, status: 'MASKED', maskedPreviewUrl: analysis.filePreviewUrl || SAMPLE_IMAGE, updatedAt: now() });
}

export function deleteAnalysis(id) {
  setItem(KEY, getItem(KEY, []).filter((analysis) => analysis.id !== id));
}
