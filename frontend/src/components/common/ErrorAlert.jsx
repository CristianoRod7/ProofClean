export default function ErrorAlert({message}){ if(!message)return null; return <div className="card" style={{borderColor:'#fecaca',color:'#991b1b',background:'#fff1f2'}}>{message}</div>; }
