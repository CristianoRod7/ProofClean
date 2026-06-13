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
const purposeToMode = { SNS: 'sns', SECOND_HAND: 'marketplace', ASSIGNMENT: 'assignment', COMMUNITY: 'community', MESSENGER: 'messenger', ETC: 'other' };
const modeToPurpose = { sns: 'SNS', marketplace: 'SECOND_HAND', second_hand: 'SECOND_HAND', assignment: 'ASSIGNMENT', community: 'COMMUNITY', messenger: 'MESSENGER', other: 'ETC', etc: 'ETC' };
const statusMap = { created: 'CREATED', uploaded: 'UPLOADED', completed: 'ANALYZED', masked: 'MASKED' };

function absoluteUrl(value) {
  if (!value || value.startsWith('data:') || /^https?:\/\//.test(value)) return value || '';
  return `${API_ROOT}${value.startsWith('/') ? '' : '/'}${value}`;
}

function mapDetection(item, context = {}) {
  const box = item.box && typeof item.box === 'object' ? item.box : null;
  const coordinateSpace = String(item.coordinateSpace || item.boxSpace || '').toLowerCase();
  const imageWidth = Number(item.imageWidth || context.imageWidth || 0);
  const imageHeight = Number(item.imageHeight || context.imageHeight || 0);
  let normalizedBox = null;

  if (box) {
    const values = ['x', 'y', 'width', 'height'].map((key) => Number(box[key]));
    const valid = values.every(Number.isFinite) && values[2] > 0 && values[3] > 0;
    if (valid && (coordinateSpace === 'normalized' || (coordinateSpace !== 'pixel' && values.every((value) => value >= 0 && value <= 1)))) {
      normalizedBox = { x: values[0], y: values[1], width: values[2], height: values[3] };
    } else if (valid && imageWidth > 0 && imageHeight > 0) {
      normalizedBox = {
        x: values[0] / imageWidth,
        y: values[1] / imageHeight,
        width: values[2] / imageWidth,
        height: values[3] / imageHeight,
      };
    }
  } else {
    const values = ['x', 'y', 'width', 'height'].map((key) => Number(item[key]));
    if (values.every(Number.isFinite) && values[2] > 0 && values[3] > 0) {
      normalizedBox = { x: values[0], y: values[1], width: values[2], height: values[3] };
    }
  }

  if (normalizedBox) {
    const x = Math.max(0, Math.min(1, normalizedBox.x));
    const y = Math.max(0, Math.min(1, normalizedBox.y));
    normalizedBox = {
      x,
      y,
      width: Math.max(0, Math.min(1 - x, normalizedBox.width)),
      height: Math.max(0, Math.min(1 - y, normalizedBox.height)),
    };
    if (!normalizedBox.width || !normalizedBox.height) normalizedBox = null;
  }

  const sourceType = context.sourceType || 'sample';
  const coordinateStatus = item.coordinateStatus
    || (normalizedBox ? (sourceType === 'sample' ? 'demo' : 'estimated') : 'none');
  return {
    ...item,
    x: normalizedBox?.x ?? null,
    y: normalizedBox?.y ?? null,
    width: normalizedBox?.width ?? null,
    height: normalizedBox?.height ?? null,
    hasCoordinates: Boolean(normalizedBox),
    coordinateStatus,
    coordinateSource: item.coordinateSource || (sourceType === 'sample' ? 'mock' : context.provider || ''),
  };
}

export function mapApiAnalysis(data, existing = {}) {
  const sourceType = data.sourceType || existing.sourceType || 'sample';
  const provider = data.provider || existing.provider || '';
  const imageWidth = data.imageWidth || existing.imageWidth;
  const imageHeight = data.imageHeight || existing.imageHeight;
  const findings = (data.detections || data.findings || existing.findings || []).map((item) => mapDetection(item, {
    sourceType,
    provider,
    imageWidth,
    imageHeight,
  }));
  return {
    ...existing,
    id: data.id,
    title: data.title || existing.title || '개인정보 노출 위험 분석',
    purpose: existing.purpose || modeToPurpose[String(data.mode || '').toLowerCase()] || 'ETC',
    mode: data.mode,
    status: statusMap[String(data.status || '').toLowerCase()] || data.status || existing.status || 'CREATED',
    riskScore: data.riskScore ?? existing.riskScore ?? 0,
    riskLevel: String(data.riskLevel || existing.riskLevel || 'low').toUpperCase(),
    findings,
    detections: findings,
    scenarios: data.scenarios || existing.scenarios || [],
    recommendations: (data.recommendations || existing.recommendations || []).map((item) => ({ ...item, text: item.text || item.title || item.description })),
    fileName: data.fileName || existing.fileName || '',
    imageWidth,
    imageHeight,
    filePreviewUrl: absoluteUrl(data.originalImageUrl) || existing.filePreviewUrl || '',
    maskedPreviewUrl: absoluteUrl(data.maskedImageUrl) || existing.maskedPreviewUrl || '',
    sourceType,
    provider,
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
    return saveAnalysis(mapApiAnalysis(data, { purpose }));
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
  } catch (error) {
    const current = getAnalysisById(id);
    if (current?.sourceType === 'upload') {
      return saveAnalysis({
        ...current,
        maskingSkipped: true,
        maskingMessage: error?.response?.data?.detail || '정확한 위치 좌표가 없어 자동 마스킹을 건너뛰었습니다.',
      });
    }
    return createMaskedVersion(id);
  }
}

export async function getFindings(id) { return (await getAnalysis(id))?.findings || []; }
export async function getScenarios(id) { return (await getAnalysis(id))?.scenarios || []; }
export async function getRecommendations(id) { return (await getAnalysis(id))?.recommendations || []; }
export { createAnalysis, createMaskedVersion, getAnalyses, getAnalysisById, runMockAnalysis };
