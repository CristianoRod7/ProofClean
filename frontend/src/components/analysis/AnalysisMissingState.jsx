import { Link } from 'react-router-dom';
import { FileQuestion, PlusCircle } from 'lucide-react';
import MainLayout from '../layout/MainLayout.jsx';

const DEFAULT_MESSAGE = '이 분석 기록을 찾을 수 없습니다. 서버가 재시작되었거나 오래된 임시 기록일 수 있습니다. 새 분석을 다시 시작해 주세요.';

export default function AnalysisMissingState({ message = DEFAULT_MESSAGE }) {
  return (
    <MainLayout>
      <div className="page-wide board-page">
        <section className="card empty analysis-missing-state" role="alert">
          <FileQuestion size={42} aria-hidden="true" />
          <div>
            <h2>분석 기록을 찾을 수 없습니다</h2>
            <p>{message}</p>
          </div>
          <Link className="btn btn-primary" to="/analyses/new">
            <PlusCircle size={18} /> 새 분석 시작
          </Link>
        </section>
      </div>
    </MainLayout>
  );
}
