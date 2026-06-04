import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import useAuth from '../hooks/useAuth.js';

export default function RegisterPage() {
  const auth = useAuth(); const navigate = useNavigate(); const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const submit = async (event) => { event.preventDefault(); setError(''); try { await auth.register(form); navigate('/dashboard'); } catch (err) { setError(err.message); } };
  return <AuthLayout title="회원가입" subtitle="로컬 브라우저에만 저장되는 mock 계정입니다."><ErrorAlert message={error} /><form className="form" onSubmit={submit}><input className="input" placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><input className="input" placeholder="이메일" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><input className="input" type="password" placeholder="비밀번호" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button className="btn btn-primary btn-block">가입하고 시작</button></form><p className="muted">이미 계정이 있나요? <Link className="kicker" to="/login">로그인</Link></p></AuthLayout>;
}
