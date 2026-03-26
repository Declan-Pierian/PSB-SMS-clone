import { useState, useMemo, useCallback } from 'react';
import storageService from '../services/storageService';

export default function useSearch(storageKey) {
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const data = useMemo(() => {
    const hasFilters = Object.values(filters).some((v) => v !== '' && v !== null && v !== undefined);
    if (hasFilters) {
      return storageService.search(storageKey, filters);
    }
    return storageService.getAll(storageKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, filters, refreshKey]);

  const handleSearch = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({});
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { data, filters, handleSearch, handleReset, refresh };
}
