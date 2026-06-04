import { useEffect, useState } from 'react';
import { getItem, setItem } from '../services/storage.js';

export default function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => getItem(key, fallback));
  useEffect(() => { setItem(key, value); }, [key, value]);
  return [value, setValue];
}
