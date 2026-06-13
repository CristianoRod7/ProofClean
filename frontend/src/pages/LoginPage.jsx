import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import useAuth from '../hooks/useAuth.js';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@proofclean.com', password: 'password1234' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await auth.login({ ...form, rememberMe });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  const demo = async () => {
    await auth.demoLogin({ rememberMe });
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="작업 공간에 로그인하세요" subtitle="데모 계정으로 바로 시작하거나 저장된 계정으로 로그인하세요.">
      <form className="form auth-form" onSubmit={submit}>
        <ErrorAlert message={error} />
        <label>이메일<input className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>비밀번호<input className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <label style={{ display: 'flex', gridTemplateColumns: 'none', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            style={{ marginTop: 4 }}
          />
          <span>
            로그인 유지
            <small style={{ display: 'block', marginTop: 3, fontWeight: 600 }}>체크하면 다음 접속 때도 로그인 상태를 유지합니다.</small>
          </span>
        </label>
        <button className="btn btn-primary btn-block" type="submit">로그인 <ArrowRight size={18} /></button>
        <button className="btn btn-secondary btn-block" type="button" onClick={demo}><PlayCircle size={18} /> 데모 계정으로 시작</button>
      </form>
      <p className="auth-switch">계정이 없나요? <Link to="/register">회원가입</Link></p>
    </AuthLayout>
  );
}
