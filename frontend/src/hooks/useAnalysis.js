import { useEffect, useState } from 'react';
import { demoAnalyses, getAnalyses } from '../services/analysisApi.js';

export const LOCAL_DEMO_ANALYSES = [
  { id: 1, title: '중고거래 게시글 사진 점검', purpose: 'SECOND_HAND', status: 'ANALYZED', riskScore: 87 },
  { id: 2, title: 'SNS 업로드 사진 점검', purpose: 'SNS', status: 'ANALYZED', riskScore: 74 },
  { id: 3, title: '과제 제출 캡처 점검', purpose: 'ASSIGNMENT', status: 'ANALYZED', riskScore: 68 },
];

export default function useAnalysis({ demo = false } = {}) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = demo ? demoAnalyses : getAnalyses;
    load()
      .then(setAnalyses)
      .catch(() => {
        setError('백엔드 연결에 실패해 로컬 시연 데이터를 표시합니다.');
        setAnalyses(LOCAL_DEMO_ANALYSES);
      })
      .finally(() => setLoading(false));
  }, [demo]);

  return { analyses, loading, error };
}
