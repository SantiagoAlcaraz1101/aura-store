'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '../../auth/hooks/use-auth';
import { ApiError, errorMessage } from '../../common/http';
import { getProducts } from '../../products/services/product-service';
import type { Product } from '../../products/domain/types';
import type { Page } from '../../common/types';
import type { Order, OrderRequest } from '../domain/types';
import { createOrder, getOrders } from '../services/order-service';
export function useOrders(all = false) {
  const { user } = useAuth(); const params = useSearchParams(); const path = usePathname(); const pageKey = all ? 'ordersPage' : 'page'; const page = Number(params.get(pageKey) ?? 1);
  const [data, setData] = useState<Page<Order> | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [revision, setRevision] = useState(0);
  useEffect(() => { if (!user) { setLoading(false); return; } const controller = new AbortController(); setLoading(true); setError(''); getOrders(page, all, controller.signal).then(setData).catch((error: unknown) => { if (!controller.signal.aborted) setError(errorMessage(error)); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, [page, user, all, revision]);
  function pageHref(value: number) { const query = new URLSearchParams(params.toString()); query.set(pageKey, String(value)); return `${path}?${query}${all ? '#solicitudes' : ''}`; }
  return { data, loading, error, pageHref, reload: () => setRevision((value) => value + 1) };
}
export function useOrderForm() {
  const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const [loadError, setLoadError] = useState(''); const [errors, setErrors] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false); const [result, setResult] = useState<Order | null>(null); const [error, setError] = useState(''); const [revision, setRevision] = useState(0);
  useEffect(() => { const controller = new AbortController(); setLoadError(''); setLoading(true); getProducts('limit=50', controller.signal).then((result) => setProducts(result.data)).catch((error: unknown) => { if (!controller.signal.aborted) setLoadError(errorMessage(error)); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, [revision]);
  async function submit(input: Omit<OrderRequest, 'consent'> & { consent: boolean }) {
    setError(''); setResult(null); const fields: Record<string, string> = {};
    const product = products.find((item) => item.id === input.productId);
    if (!product) fields.productId = 'Selecciona un modelo del catálogo.';
    if (!product?.sizes.some((item) => item.size === input.size && item.stock > 0)) fields.size = 'Selecciona una talla disponible para este modelo.';
    if (input.city.trim().length < 3 || input.city.trim().length > 80) fields.city = 'Escribe tu ciudad con entre 3 y 80 caracteres.';
    if (input.message.trim().length < 20 || input.message.trim().length > 600) fields.message = 'Escribe entre 20 y 600 caracteres.';
    if (!input.consent) fields.consent = 'Confirma que deseas guardar esta solicitud.';
    setErrors(fields); if (Object.keys(fields).length) return fields;
    setBusy(true); try { setResult(await createOrder({ ...input, city: input.city.trim(), message: input.message.trim(), consent: true })); return {}; }
    catch (error) { setError(errorMessage(error)); const fields = error instanceof ApiError ? error.fields : {}; setErrors(fields); return fields; }
    finally { setBusy(false); }
  }
  return { products, loading, loadError, errors, busy, result, error, submit, clearResult: () => setResult(null), retry: () => setRevision((value) => value + 1) };
}
