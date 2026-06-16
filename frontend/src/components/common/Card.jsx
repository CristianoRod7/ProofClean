export default function Card({ className = '', interactive = false, children, ...props }) {
  return (
    <div className={`card ${interactive ? 'card-interactive' : ''} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
