'use client';
import { useState } from 'react';
import { ApiError, errorMessage } from '../../common/http';
import { createProduct, deleteProduct, updateProduct } from '../services/product-service';
import type { ProductInput } from '../domain/types';
export function useAdminProducts() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [fields, setFields] = useState<Record<string, string>>({});
  function clear() { setError(''); setFields({}); }
  async function save(id: string | undefined, input: ProductInput) { clear(); setBusy(true); try { if (id) await updateProduct(id, input); else await createProduct(input); return true; } catch (error) { setError(errorMessage(error)); if (error instanceof ApiError) setFields(error.fields); return false; } finally { setBusy(false); } }
  async function remove(id: string) { clear(); setBusy(true); try { await deleteProduct(id); return true; } catch (error) { setError(errorMessage(error)); return false; } finally { setBusy(false); } }
  return { busy, error, fields, save, remove, clear };
}
