export function getRiskLevel(score = 0) {
  if (score >= 81) return 'CRITICAL';
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}

export function getRiskLabel(levelOrScore = 0) {
  const level = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;
  return ({ LOW: '낮음', MEDIUM: '주의', HIGH: '높음', CRITICAL: '매우 높음' })[level] || '확인 필요';
}

export function getRiskColor(levelOrScore = 0) {
  const level = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;
  return ({ LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' })[level] || '#2563eb';
}

export function getRiskBadgeColor(levelOrScore = 0) {
  const level = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;
  return level === 'CRITICAL' ? 'red' : level === 'HIGH' ? 'orange' : level === 'MEDIUM' ? 'yellow' : 'green';
}

export function getStatusLabel(status = '') {
  return ({ CREATED: '생성됨', UPLOADED: '업로드 완료', ANALYZING: '분석 중', ANALYZED: '분석 완료', MASKED: '안전본 생성 완료' })[status] || status || '확인 필요';
}
