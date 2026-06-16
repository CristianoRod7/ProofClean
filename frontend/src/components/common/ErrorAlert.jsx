import { AlertTriangle } from 'lucide-react';

export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger">
      <AlertTriangle size={18} />
      <span>{message}</span>
    </div>
  );
}
