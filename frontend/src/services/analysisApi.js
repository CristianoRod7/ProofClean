import api from './api.js';
import { API_ORIGIN } from './api.js';
import {
  createAnalysis,
  createMaskedVersion,
  getAnalyses,
  getAnalysisById,
  removeStaleAnalysisFromStorage,
  saveAnalysis,
} from './mockAnalysis.js';

const purposeToMode = { SNS: 'sns', SECOND_HAND: 'marketplace', ASSIGNMENT: 'assignment', COMMUNITY: 'community', MESSENGER: 'messenger', ETC: 'other' };
const modeToPurpose = { sns: 'SNS', marketplace: 'SECOND_HAND', second_hand: 'SECOND_HAND', assignment: 'ASSIGNMENT', community: 'COMMUNITY', messenger: 'MESSENGER', other: 'ETC', etc: 'ETC' };
const statusMap = { created: 'CREATED', uploaded: 'UPLOADED', completed: 'ANALYZED', masked: 'MASKED' };

function absoluteUrl(value) {
  if (!value || value.startsWith('data:') || /^https?:\/\//.test(value)) return value || '';
  return `${API_ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`;
}

export class AnalysisNotFoundError extends Error {
  constructor(id) {
    super('이 분석 기록을 찾을 수 없습니다. 서버가 재시작되었거나 오래된 임시 기록일 수 있습니다. 새 분석을 다시 시작해 주세요.');
    this.name = 'AnalysisNotFoundError';
    this.analysisId = id;
    this.status = 404;
    this.isNotFound = true;
  }
}

function requireAnalysisId(id) {
  const normalized = String(id || '').trim();
  if (!normalized || normalized === 'undefined' || normalized === 'null' || normalized === ':id') {
    throw new AnalysisNotFoundError(normalized);
  }
  return normalized;
}

function isNotFound(error) {
  return error?.response?.status === 404;
}

function handleNotFound(error, id) {
  if (!isNotFound(error)) return false;
  removeStaleAnalysisFromStorage(id);
  throw new AnalysisNotFoundError(id);
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
  const boxStatus = item.boxStatus
    || ({ verified: 'exact', estimated: 'estimated', demo: 'demo', none: 'none' }[item.coordinateStatus])
    || (normalizedBox ? (sourceType === 'sample' ? 'demo' : 'estimated') : 'none');
  const coordinateStatus = item.coordinateStatus
    || ({ exact: 'verified', estimated: 'estimated', demo: 'demo', none: 'none' }[boxStatus])
    || (normalizedBox ? (sourceType === 'sample' ? 'demo' : 'estimated') : 'none');
  return {
    ...item,
    x: normalizedBox?.x ?? null,
    y: normalizedBox?.y ?? null,
    width: normalizedBox?.width ?? null,
    height: normalizedBox?.height ?? null,
    hasCoordinates: Boolean(normalizedBox),
    boxStatus,
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
    maskedCount: data.maskedCount ?? existing.maskedCount ?? 0,
    skippedCount: data.skippedCount ?? existing.skippedCount ?? 0,
    mergedCount: data.mergedCount ?? existing.mergedCount ?? 0,
    maskingStyle: data.maskingStyle || existing.maskingStyle || "solid",
    skippedReasons: data.skippedReasons || existing.skippedReasons || [],
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

async function fetchAndSave(id) {
  const analysisId = requireAnalysisId(id);
  try {
    const { data } = await api.get(`/analyses/${analysisId}`);
    return saveAnalysis(mapApiAnalysis(data, getAnalysisById(analysisId) || {}));
  } catch (error) {
    handleNotFound(error, analysisId);
    throw error;
  }
}

export const demoAnalyses = async () => getAnalysesApi();

export async function getAnalysesApi() {
  try {
    const { data } = await api.get('/analyses');
    return data.map((item) => saveAnalysis(mapApiAnalysis(item, getAnalysisById(item.id) || {})));
  } catch {
    return getAnalyses();
  }
}

export async function getAnalysis(id) {
  const analysisId = requireAnalysisId(id);
  try {
    return await fetchAndSave(analysisId);
  } catch (error) {
    if (error instanceof AnalysisNotFoundError) throw error;
    return getAnalysisById(analysisId);
  }
}

export async function createAnalysisApi(payload) {
  const purpose = payload.purpose || modeToPurpose[payload.mode] || 'ETC';
  const { data } = await api.post('/analyses', { title: payload.title, mode: purposeToMode[purpose] || payload.mode || 'other' });
  if (!data?.id) throw new Error('백엔드가 분석 ID를 반환하지 않았습니다.');
  return saveAnalysis(mapApiAnalysis(data, { purpose }));
}

export async function uploadFile(id, file, localPreviewUrl = '') {
  const analysisId = requireAnalysisId(id);
  try {
    const form = new FormData();
    form.append('file', file);
    await api.post(`/analyses/${analysisId}/files`, form);
    return await fetchAndSave(analysisId);
  } catch (error) {
    handleNotFound(error, analysisId);
    throw error;
  }
}

export async function runAnalysis(id) {
  const analysisId = requireAnalysisId(id);
  try {
    const { data } = await api.post(`/analyses/${analysisId}/run`);
    return saveAnalysis(mapApiAnalysis(data, getAnalysisById(analysisId) || {}));
  } catch (error) {
    handleNotFound(error, analysisId);
    throw error;
  }
}

export async function selectSample(id) {
  const analysisId = requireAnalysisId(id);
  try {
    await api.post(`/analyses/${analysisId}/sample`);
    return await fetchAndSave(analysisId);
  } catch (error) {
    handleNotFound(error, analysisId);
    throw error;
  }
}

export async function maskAnalysis(id) {
  const analysisId = requireAnalysisId(id);
  try {
    await api.post(`/analyses/${analysisId}/mask`);
    return await fetchAndSave(analysisId);
  } catch (error) {
    handleNotFound(error, analysisId);
    const current = getAnalysisById(analysisId);
    if (current?.sourceType === 'upload') {
      return saveAnalysis({
        ...current,
        maskingSkipped: true,
        maskingMessage: error?.response?.data?.detail || '정확한 위치 좌표가 없어 자동 마스킹을 건너뛰었습니다.',
      });
    }
    return createMaskedVersion(analysisId);
  }
}

export async function getFindings(id) { return (await getAnalysis(id))?.findings || []; }
export async function getScenarios(id) { return (await getAnalysis(id))?.scenarios || []; }
export async function getRecommendations(id) { return (await getAnalysis(id))?.recommendations || []; }
export {
  createAnalysis,
  createMaskedVersion,
  getAnalyses,
  getAnalysisById,
  removeStaleAnalysisFromStorage,
};
