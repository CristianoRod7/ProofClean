export default function Badge({ color = 'blue', tone, className = '', children, ...props }) {
  const colorClass = tone ? `badge-${tone}` : `badge-${color}`;
  return (
    <span className={`badge ${colorClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
