import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnalysisResultPage from '../pages/AnalysisResultPage.jsx';
import ComparePage from '../pages/ComparePage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NewAnalysisPage from '../pages/NewAnalysisPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import UploadPage from '../pages/UploadPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicOnlyRoute from './PublicOnlyRoute.jsx';
import RootRedirect from './RootRedirect.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyses/new" element={<NewAnalysisPage />} />
          <Route path="/analyses/:id/upload" element={<UploadPage />} />
          <Route path="/analyses/:id/result" element={<AnalysisResultPage />} />
          <Route path="/analyses/:id/compare" element={<ComparePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
