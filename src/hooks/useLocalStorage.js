import { useState, useCallback } from 'react';

export default function useLocalStorage(key, initialValue = []) {
  const storageKey = `sms_${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(storageKey, JSON.stringify(valueToStore));
  }, [storageKey, storedValue]);

  return [storedValue, setValue];
}
