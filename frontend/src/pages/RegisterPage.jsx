import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import useAuth from '../hooks/useAuth.js';

export default function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await auth.register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  const demo = async () => {
    await auth.demoLogin();
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="개인정보 점검 작업 공간 만들기" subtitle="이 브라우저에 저장되는 시연용 계정을 생성합니다.">
      <form className="form auth-form" onSubmit={submit}>
        <ErrorAlert message={error} />
        <label>이름<input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>이메일<input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>비밀번호<input className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
        <button className="btn btn-primary btn-block" type="submit">회원가입 <ArrowRight size={18} /></button>
        <button className="btn btn-secondary btn-block" type="button" onClick={demo}><PlayCircle size={18} /> 데모 계정으로 시작</button>
      </form>
      <p className="auth-switch">이미 계정이 있나요? <Link to="/login">로그인</Link></p>
    </AuthLayout>
  );
}
