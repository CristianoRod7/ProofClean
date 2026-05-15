import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
export default function Header(){ const auth=useAuth(); return <header className="header"><Link className="logo" to="/"><span className="logo-mark">✓</span>ProofClean</Link><div>{auth?.isAuthenticated ? <button className="btn btn-muted" onClick={auth.logout}>로그아웃</button> : <Link className="btn btn-primary" to="/login">로그인</Link>}</div></header>; }
