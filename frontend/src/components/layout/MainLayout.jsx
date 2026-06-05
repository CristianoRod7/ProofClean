import Sidebar from './Sidebar.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
