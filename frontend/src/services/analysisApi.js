import api from './api.js';
import {
  createAnalysis,
  createMaskedVersion,
  getAnalyses,
  getAnalysisById,
  runMockAnalysis,
  saveAnalysis,
  uploadMockFile,
} from './mockAnalysis.js';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const purposeToMode = { SNS: 'sns', SECOND_HAND: 'marketplace', ASSIGNMENT: 'assignment', COMMUNITY: 'community', ETC: 'other' };
const modeToPurpose = { sns: 'SNS', marketplace: 'SECOND_HAND', second_hand: 'SECOND_HAND', assignment: 'ASSIGNMENT', community: 'COMMUNITY', other: 'ETC', etc: 'ETC' };
const statusMap = { created: 'CREATED', uploaded: 'UPLOADED', completed: 'ANALYZED', masked: 'MASKED' };

function absoluteUrl(value) {
  if (!value || value.startsWith('data:') || /^https?:\/\//.test(value)) return value || '';
  return `${API_ROOT}${value.startsWith('/') ? '' : '/'}${value}`;
}

function mapDetection(item) {
  const box = item.box || {};
  return {
    ...item,
    x: Math.max(0, Math.min(1, Number(box.x ?? item.x ?? 0) / (item.box ? 900 : 1))),
    y: Math.max(0, Math.min(1, Number(box.y ?? item.y ?? 0) / (item.box ? 620 : 1))),
    width: Math.max(0.02, Math.min(1, Number(box.width ?? item.width ?? 0.2) / (item.box ? 900 : 1))),
    height: Math.max(0.02, Math.min(1, Number(box.height ?? item.height ?? 0.1) / (item.box ? 620 : 1))),
  };
}

export function mapApiAnalysis(data, existing = {}) {
  const findings = (data.detections || data.findings || existing.findings || []).map(mapDetection);
  return {
    ...existing,
    id: data.id,
    title: data.title || existing.title || '개인정보 노출 위험 분석',
    purpose: modeToPurpose[String(data.mode || '').toLowerCase()] || existing.purpose || 'ETC',
    mode: data.mode,
    status: statusMap[String(data.status || '').toLowerCase()] || data.status || existing.status || 'CREATED',
    riskScore: data.riskScore ?? existing.riskScore ?? 0,
    riskLevel: String(data.riskLevel || existing.riskLevel || 'low').toUpperCase(),
    findings,
    detections: findings,
    scenarios: data.scenarios || existing.scenarios || [],
    recommendations: (data.recommendations || existing.recommendations || []).map((item) => ({ ...item, text: item.text || item.title || item.description })),
    fileName: data.fileName || existing.fileName || '',
    filePreviewUrl: absoluteUrl(data.originalImageUrl) || existing.filePreviewUrl || '',
    maskedPreviewUrl: absoluteUrl(data.maskedImageUrl) || existing.maskedPreviewUrl || '',
    sourceType: data.sourceType || existing.sourceType || 'sample',
    provider: data.provider || existing.provider || '',
    aiFallback: Boolean(data.aiFallback),
    fallbackReason: data.fallbackReason || '',
    createdAt: data.createdAt || existing.createdAt,
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

async function fetchAndSave(id) {
  const { data } = await api.get(`/api/analyses/${id}`);
  return saveAnalysis(mapApiAnalysis(data, getAnalysisById(id) || {}));
}

export const demoAnalyses = async () => getAnalysesApi();

export async function getAnalysesApi() {
  try {
    const { data } = await api.get('/api/analyses');
    return data.map((item) => saveAnalysis(mapApiAnalysis(item, getAnalysisById(item.id) || {})));
  } catch {
    return getAnalyses();
  }
}

export async function getAnalysis(id) {
  try {
    return await fetchAndSave(id);
  } catch {
    return getAnalysisById(id);
  }
}

export async function createAnalysisApi(payload) {
  try {
    const purpose = payload.purpose || modeToPurpose[payload.mode] || 'ETC';
    const { data } = await api.post('/api/analyses', { title: payload.title, mode: purposeToMode[purpose] || payload.mode || 'other' });
    return saveAnalysis(mapApiAnalysis(data));
  } catch {
    return createAnalysis({ title: payload.title, purpose: payload.purpose || modeToPurpose[payload.mode] || 'ETC' });
  }
}

export async function uploadFile(id, file, localPreviewUrl = '') {
  try {
    const form = new FormData();
    form.append('file', file);
    await api.post(`/api/analyses/${id}/files`, form);
    return await fetchAndSave(id);
  } catch {
    return uploadMockFile(id, { fileName: file?.name || 'sample.png', filePreviewUrl: localPreviewUrl });
  }
}

export async function runAnalysis(id) {
  try {
    const { data } = await api.post(`/api/analyses/${id}/run`);
    return saveAnalysis(mapApiAnalysis(data, getAnalysisById(id) || {}));
  } catch {
    return runMockAnalysis(id);
  }
}

export async function selectSample(id) {
  try {
    await api.post(`/api/analyses/${id}/sample`);
    return await fetchAndSave(id);
  } catch {
    return getAnalysisById(id);
  }
}

export async function maskAnalysis(id) {
  try {
    await api.post(`/api/analyses/${id}/mask`);
    return await fetchAndSave(id);
  } catch {
    return createMaskedVersion(id);
  }
}

export async function getFindings(id) { return (await getAnalysis(id))?.findings || []; }
export async function getScenarios(id) { return (await getAnalysis(id))?.scenarios || []; }
export async function getRecommendations(id) { return (await getAnalysis(id))?.recommendations || []; }
export { createAnalysis, createMaskedVersion, getAnalyses, getAnalysisById, runMockAnalysis };
