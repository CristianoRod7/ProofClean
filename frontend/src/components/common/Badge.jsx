export default function Badge({ color = 'blue', className = '', children, ...props }) {
  return <span className={`badge badge-${color} ${className}`} {...props}>{children}</span>;
}
