import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import NewAnalysisPage from '../pages/NewAnalysisPage.jsx';
import UploadPage from '../pages/UploadPage.jsx';
import AnalysisResultPage from '../pages/AnalysisResultPage.jsx';
import ComparePage from '../pages/ComparePage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import ReportPage from '../pages/ReportPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
export default function AppRouter(){ return <BrowserRouter><Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<DashboardPage/>}/><Route path="/analyses/new" element={<NewAnalysisPage/>}/><Route path="/analyses/:id/upload" element={<UploadPage/>}/><Route path="/analyses/:id" element={<AnalysisResultPage/>}/><Route path="/analyses/:id/compare" element={<ComparePage/>}/><Route path="/history" element={<HistoryPage/>}/><Route path="/reports/:id" element={<ReportPage/>}/></Route><Route path="*" element={<NotFoundPage/>}/></Routes></BrowserRouter>; }
