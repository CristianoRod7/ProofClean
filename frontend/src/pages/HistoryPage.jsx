import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowDownUp,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  FileArchive,
  FileImage,
  FileQuestion,
  FileText,
  History,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import AnalysisFlowHeader from '../components/analysis/AnalysisFlowHeader.jsx';
import ScrollReveal from '../components/common/ScrollReveal.jsx';
import { deleteAnalysis, getAnalyses } from '../services/mockAnalysis.js';
import { setItem } from '../services/storage.js';
import { purposeMeta } from '../data/demoAnalyses.js';

const PURPOSE_OPTIONS = [
  ['ALL', '전체 유형'],
  ['SNS', 'SNS 업로드'],
  ['SECOND_HAND', '중고거래'],
  ['ASSIGNMENT', '과제 제출'],
  ['COMMUNITY', '커뮤니티 게시'],
  ['ETC', '기타'],
];

const RISK_OPTIONS = [['ALL', '전체 위험도'], ['HIGH', '높음'], ['MEDIUM', '보통'], ['LOW', '낮음']];
const SORT_OPTIONS = [['NEWEST', '최신순'], ['OLDEST', '오래된순'], ['RISK', '위험도 높은순']];

const detectionLabels = {
  FACE: '얼굴 후보', PHONE: '전화번호', EMAIL: '이메일', ADDRESS: '주소', INVOICE: '송장 정보',
  LOCATION_HINT: '위치 단서', STUDENT_ID: '학번', SCREEN_TEXT: '화면 텍스트', EXIF: '메타데이터', DOCUMENT: '문서 정보',
};

function asList(analysis) {
  if (Array.isArray(analysis.findings)) return analysis.findings;
  if (Array.isArray(analysis.detections)) return analysis.detections;
  return [];
}

function resolvePurpose(analysis) {
  const value = analysis.purpose || analysis.mode || analysis.scenario || 'ETC';
  const normalized = String(value).toUpperCase();
  if (purposeMeta[normalized]) return normalized;
  if (normalized.includes('SNS')) return 'SNS';
  if (normalized.includes('SECOND') || normalized.includes('MARKET')) return 'SECOND_HAND';
  if (normalized.includes('ASSIGN') || normalized.includes('SCHOOL')) return 'ASSIGNMENT';
  if (normalized.includes('COMMUNITY')) return 'COMMUNITY';
  return 'ETC';
}

function resolveScore(analysis, detections) {
  const value = Number(analysis.riskScore ?? analysis.score);
  if (Number.isFinite(value)) return Math.max(0, Math.min(100, Math.round(value)));
  if (detections.length >= 5) return 82;
  if (detections.length >= 2) return 56;
  if (detections.length >= 1) return 32;
  return 8;
}

function riskMeta(score) {
  if (score >= 70) return { key: 'HIGH', label: '높음', tone: 'high' };
  if (score >= 40) return { key: 'MEDIUM', label: '보통', tone: 'medium' };
  return { key: 'LOW', label: '낮음', tone: 'low' };
}

function resolveStatus(analysis) {
  if (analysis.maskedPreviewUrl || analysis.redactedFileName || analysis.safeCopy || ['MASKED', 'REDACTED'].includes(analysis.status)) {
    return { label: '안전본 생성 완료', tone: 'safe', comparable: true };
  }
  if (['CREATED', 'UPLOADED', 'ANALYZING'].includes(analysis.status)) return { label: '검토 필요', tone: 'review', comparable: false };
  return { label: '분석 완료', tone: 'complete', comparable: false };
}

function formatHistoryDate(value, fallback = '날짜 없음') {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function summarizeDetections(detections) {
  if (!detections.length) return '탐지 후보 없음';
  const counts = detections.reduce((result, item) => {
    const key = item.type || item.label || 'UNKNOWN';
    const label = item.label || detectionLabels[key] || '기타 후보';
    result[label] = (result[label] || 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).slice(0, 3).map(([label, count]) => `${label} ${count}건`).join(' · ');
}

function fileIcon(fileName = '', purpose = 'ETC') {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return FileImage;
  if (['zip', 'rar', '7z'].includes(extension)) return FileArchive;
  if (purpose === 'ETC') return FileQuestion;
  return FileText;
}

function normalizeAnalysis(analysis, index) {
  const detections = asList(analysis);
  const purpose = resolvePurpose(analysis);
  const score = resolveScore(analysis, detections);
  const risk = riskMeta(score);
  const status = resolveStatus(analysis);
  const dateValue = analysis.updatedAt || analysis.createdAt || null;
  return {
    raw: analysis,
    id: analysis.id || `history-${index}`,
    title: analysis.title || '개인정보 노출 위험 분석',
    fileName: analysis.fileName || analysis.originalFileName || '업로드 파일',
    purpose,
    purposeLabel: purposeMeta[purpose]?.label || '기타',
    score,
    risk,
    status,
    detections,
    detectionSummary: summarizeDetections(detections),
    dateValue,
    timestamp: dateValue && !Number.isNaN(new Date(dateValue).getTime()) ? new Date(dateValue).getTime() : 0,
  };
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState(() => getAnalyses());
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState('ALL');
  const [risk, setRisk] = useState('ALL');
  const [sort, setSort] = useState('NEWEST');
  const [confirmingId, setConfirmingId] = useState(null);

  const normalized = useMemo(() => analyses.map(normalizeAnalysis), [analyses]);
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return normalized
      .filter((item) => {
        const searchable = [item.title, item.fileName, item.purposeLabel, item.detectionSummary, ...item.detections.map((detection) => `${detection.type || ''} ${detection.label || ''}`)].join(' ').toLowerCase();
        return (!keyword || searchable.includes(keyword)) && (purpose === 'ALL' || item.purpose === purpose) && (risk === 'ALL' || item.risk.key === risk);
      })
      .sort((a, b) => sort === 'OLDEST' ? a.timestamp - b.timestamp : sort === 'RISK' ? b.score - a.score : b.timestamp - a.timestamp);
  }, [normalized, purpose, query, risk, sort]);

  const stats = useMemo(() => {
    const warning = normalized.filter((item) => item.score >= 40).length;
    const safe = normalized.filter((item) => item.status.comparable).length;
    const recent = [...normalized].sort((a, b) => b.timestamp - a.timestamp)[0];
    return { total: normalized.length, warning, safe, recent: recent ? formatHistoryDate(recent.dateValue) : '기록 없음' };
  }, [normalized]);

  const refresh = () => {
    setAnalyses(getAnalyses());
    setConfirmingId(null);
  };

  const remove = (item) => {
    if (item.raw.id) deleteAnalysis(item.raw.id);
    setAnalyses((current) => {
      const next = current.filter((analysis) => analysis !== item.raw && analysis.id !== item.raw.id);
      if (!item.raw.id) setItem('proofclean_analyses', next);
      return next;
    });
    setConfirmingId(null);
  };

  const summaryCards = [
    { label: '전체 분석 수', value: stats.total, detail: '이 브라우저에 저장된 기록', icon: BarChart3, tone: 'blue' },
    { label: '주의 필요', value: stats.warning, detail: '위험 점수 40점 이상', icon: AlertTriangle, tone: 'orange' },
    { label: '안전본 생성', value: stats.safe, detail: '비교 가능한 안전본', icon: ShieldCheck, tone: 'mint' },
    { label: '최근 분석 일시', value: stats.recent, detail: '가장 최근 업데이트 기준', icon: CalendarClock, tone: 'violet', isDate: true },
  ];

  return (
    <MainLayout>
      <div className="page-wide history-page">
        <ScrollReveal className="flow-reveal" amount={0.05}>
          <AnalysisFlowHeader
            eyebrow="ANALYSIS HISTORY"
            title="분석 기록"
            description="업로드 전 점검했던 파일과 노출 가능성, 조치 상태를 한눈에 확인합니다."
            meta={<><span>로컬 저장소</span><strong>{analyses.length}건 동기화됨</strong></>}
            actions={<>
              <Link className="btn btn-primary" to="/analyses/new"><Plus size={17} /> 새 분석 시작</Link>
              <button className="btn btn-muted" type="button" onClick={refresh} aria-label="localStorage에서 분석 기록 새로고침"><RefreshCw size={17} /> 기록 새로고침</button>
            </>}
          />
        </ScrollReveal>

        <ScrollReveal className="flow-reveal" delay={50}>
          <section className="history-summary-grid" aria-label="분석 기록 요약">
            {summaryCards.map(({ label, value, detail, icon: Icon, tone, isDate }) => (
              <article className={`history-summary-card history-summary-card--${tone}`} key={label}>
                <div className="history-summary-icon"><Icon size={20} /></div>
                <span>{label}</span>
                <strong className={isDate ? 'history-summary-date' : ''}>{value}</strong>
                <small>{detail}</small>
              </article>
            ))}
          </section>
        </ScrollReveal>

        <ScrollReveal className="flow-reveal" delay={80}>
          <section className="history-filter-bar" aria-label="분석 기록 필터">
            <label className="history-search-field">
              <span className="sr-only">기록 검색</span><Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 파일명, 유형, 탐지 항목 검색" aria-label="분석 기록 검색" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="검색어 지우기"><X size={15} /></button>}
            </label>
            <label><span>상황 유형</span><select value={purpose} onChange={(event) => setPurpose(event.target.value)}>{PURPOSE_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label><span>위험도</span><select value={risk} onChange={(event) => setRisk(event.target.value)}>{RISK_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label><span>정렬</span><select value={sort} onChange={(event) => setSort(event.target.value)}>{SORT_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <div className="history-filter-count"><ArrowDownUp size={15} /><b>{filtered.length}</b><span>개 기록</span></div>
          </section>
        </ScrollReveal>

        {!normalized.length ? (
          <section className="history-empty-state">
            <div className="history-empty-icon"><History size={32} /></div>
            <h2>아직 분석 기록이 없습니다</h2>
            <p>파일을 업로드하기 전에 노출 위험을 점검하면 이곳에 기록됩니다.</p>
            <Link className="btn btn-primary" to="/analyses/new"><Plus size={17} /> 첫 분석 시작하기</Link>
          </section>
        ) : !filtered.length ? (
          <section className="history-empty-state history-empty-state--filtered">
            <div className="history-empty-icon"><Search size={30} /></div>
            <h2>조건에 맞는 기록이 없습니다</h2>
            <p>검색어 또는 필터를 변경해 다시 확인해보세요.</p>
            <button className="btn btn-muted" type="button" onClick={() => { setQuery(''); setPurpose('ALL'); setRisk('ALL'); }}>필터 초기화</button>
          </section>
        ) : (
          <section className="history-list" aria-label="분석 기록 목록">
            {filtered.map((analysis) => {
              const Icon = fileIcon(analysis.fileName, analysis.purpose);
              const confirming = confirmingId === analysis.id;
              return (
                <article className="history-card" key={analysis.id}>
                  <div className="history-card-leading">
                    <div className="history-file-icon"><Icon size={25} /></div>
                    <div className="history-card-badges">
                      <span className="history-purpose-badge">{analysis.purposeLabel}</span>
                      <span className={`history-risk-badge history-risk-badge--${analysis.risk.tone}`}>{analysis.risk.label}</span>
                    </div>
                  </div>
                  <div className="history-card-content">
                    <div className="history-card-title-row"><div><h2>{analysis.title}</h2><p>{analysis.fileName}</p></div><time>{formatHistoryDate(analysis.dateValue)}</time></div>
                    <div className="history-detection-summary"><Search size={14} /><span>{analysis.detectionSummary}</span></div>
                    <div className={`history-status history-status--${analysis.status.tone}`}><CheckCircle2 size={14} /><span>{analysis.status.label}</span></div>
                  </div>
                  <div className="history-card-risk">
                    <div className="history-score"><span>위험 점수</span><strong>{analysis.score}</strong><small>/ 100</small></div>
                    <div className="history-risk-meter" aria-label={`위험 점수 ${analysis.score}점`}><i style={{ width: `${analysis.score}%` }} /></div>
                    <div className="history-card-actions">
                      <Link className="btn btn-primary" to={`/analyses/${analysis.id}/result`} aria-label={`${analysis.title} 결과 보기`}>결과 보기</Link>
                      {analysis.status.comparable && <Link className="btn btn-secondary" to={`/analyses/${analysis.id}/compare`} aria-label={`${analysis.title} 비교 보기`}>비교 보기</Link>}
                      {!confirming ? (
                        <button className="btn history-delete-trigger" type="button" onClick={() => setConfirmingId(analysis.id)} aria-label={`${analysis.title} 삭제 확인`}><Trash2 size={16} /> 삭제</button>
                      ) : (
                        <div className="history-delete-confirm" role="group" aria-label={`${analysis.title} 삭제 확인`}><span>정말 삭제할까요?</span><button type="button" onClick={() => remove(analysis)}>삭제</button><button type="button" onClick={() => setConfirmingId(null)}>취소</button></div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </MainLayout>
  );
}
