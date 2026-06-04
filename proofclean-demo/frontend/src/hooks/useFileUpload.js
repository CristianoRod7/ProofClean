import { useState } from 'react';
export default function useFileUpload(){ const [file,setFile]=useState(null); const [preview,setPreview]=useState(null); const selectFile=(next)=>{setFile(next); setPreview(next?.type?.startsWith('image/') ? URL.createObjectURL(next) : null);}; return {file,preview,selectFile}; }
