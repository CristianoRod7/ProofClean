export default function LoadingSpinner({ message = '불러오는 중입니다...' }) {
  return (
    <div className="loading-inline">
      <span className="spinner" />
      <span>{message}</span>
    </div>
  );
}
