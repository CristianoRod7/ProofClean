import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import useAuth from '../hooks/useAuth.js';

export default function LoginPage() {
  const auth = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: 'demo@proofclean.com', password: 'password1234' });
  const [error, setError] = useState('');
  const after = location.state?.from || '/dashboard';
  const submit = async (event) => { event.preventDefault(); setError(''); try { await auth.login(form); navigate(after); } catch (err) { setError(err.message); } };
  const demo = async () => { await auth.demoLogin(); navigate('/dashboard'); };
  return <AuthLayout title="로그인" subtitle="데모 계정 또는 가입한 mock 계정으로 시작하세요."><ErrorAlert message={error} /><form className="form" onSubmit={submit}><input className="input" placeholder="이메일" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input className="input" type="password" placeholder="비밀번호" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button className="btn btn-primary btn-block">로그인</button><button type="button" className="btn btn-secondary btn-block" onClick={demo}>데모 계정으로 시작</button></form><p className="muted">계정이 없나요? <Link className="kicker" to="/register">회원가입</Link></p></AuthLayout>;
}
