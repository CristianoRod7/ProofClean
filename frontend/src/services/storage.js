export function getItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function removeItem(key) {
  localStorage.removeItem(key);
}
