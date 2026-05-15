export default function Badge({ color='blue', className='', ...props }) { return <span className={`badge badge-${color} ${className}`} {...props} />; }
