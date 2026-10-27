'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Page } from '../../common/types';
import { errorMessage } from '../../common/http';
import { getCatalogOptions, getProducts } from '../services/product-service';
import type { CatalogOptions, Product } from '../domain/types';

export function useProducts(limit = 3) {
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname(); const query = params.toString();
  const [result, setResult] = useState<Page<Product> | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    const allowed = ['page', 'search', 'brandId', 'categoryId', 'sort', 'minPrice', 'maxPrice']; const apiQuery = new URLSearchParams(); const url = new URLSearchParams(query);
    for (const key of allowed) { const value = url.get(key); if (value) apiQuery.set(key, value); }
    apiQuery.set('limit', String(limit));
    getProducts(apiQuery.toString(), controller.signal).then(setResult).catch((error: unknown) => { if (!controller.signal.aborted) { setError(errorMessage(error)); setResult(null); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, revision, limit]);
  function update(values: Record<string, string>) { const next = new URLSearchParams(query); for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); } next.set('page', '1'); router.push(`${pathname}?${next}#catalogo`, { scroll: false }); }
  function pageHref(page: number) { const next = new URLSearchParams(query); next.set('page', String(page)); return `${pathname}?${next}#catalogo`; }
  return { result, loading, error, params, update, pageHref, reset: () => router.push(`${pathname}#catalogo`, { scroll: false }), reload: () => setRevision((value) => value + 1) };
}
export function useCatalogOptions() {
  const [options, setOptions] = useState<CatalogOptions | null>(null); const [error, setError] = useState('');
  useEffect(() => { let active = true; getCatalogOptions().then((data) => { if (active) setOptions(data); }).catch((error: unknown) => { if (active) setError(errorMessage(error)); }); return () => { active = false; }; }, []);
  return { options, error };
}
