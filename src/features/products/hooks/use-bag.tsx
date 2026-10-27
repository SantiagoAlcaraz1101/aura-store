'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { BagLine, Product } from '../domain/types';
import { getProduct } from '../services/product-service';
import { errorMessage } from '../../common/http';
interface BagValue { lines: BagLine[]; products: Record<string, Product>; loading: boolean; error: string; add: (product: Product, size: number) => string; change: (id: string, size: number, delta: number) => void; remove: (id: string, size: number) => void; count: number; open: boolean; setOpen: (open: boolean) => void }
const Context = createContext<BagValue | null>(null);
function readBag(): BagLine[] {
  try { const saved: unknown = JSON.parse(localStorage.getItem('aura.bag.v1') ?? '[]'); if (!Array.isArray(saved)) return []; return saved.filter((item): item is BagLine => typeof item === 'object' && item !== null && typeof item.productId === 'string' && typeof item.size === 'number' && Number.isInteger(item.quantity) && item.quantity > 0).slice(0, 50); } catch { return []; }
}
export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]); const [products, setProducts] = useState<Record<string, Product>>({}); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [open, setOpen] = useState(false);
  useEffect(() => { let active = true; const saved = readBag(); if (!saved.length) { setLoading(false); return; }
    Promise.all([...new Set(saved.map((line) => line.productId))].map(getProduct)).then((items) => { if (!active) return; const data = Object.fromEntries(items.map((item) => [item.id, item])); const normalized: BagLine[] = [];
      for (const line of saved) { const stock = data[line.productId]?.sizes.find((item) => item.size === line.size)?.stock ?? 0; if (!stock) continue; const previous = normalized.find((item) => item.productId === line.productId && item.size === line.size); if (previous) previous.quantity = Math.min(stock, previous.quantity + line.quantity); else normalized.push({ ...line, quantity: Math.min(stock, line.quantity) }); }
      setProducts(data); setLines(normalized);
    }).catch((error: unknown) => { if (active) setError(errorMessage(error)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; };
  }, []);
  function save(next: BagLine[]) { setLines(next); try { localStorage.setItem('aura.bag.v1', JSON.stringify(next)); } catch { setError('La bolsa funciona en esta sesión, pero no se pudo guardar en el navegador.'); } }
  function add(product: Product, size: number) { const stock = product.sizes.find((item) => item.size === size)?.stock ?? 0; const current = lines.find((line) => line.productId === product.id && line.size === size); if (!stock) return 'Elige una talla disponible.'; if ((current?.quantity ?? 0) >= stock) return 'Ya tienes la cantidad disponible de esta talla en la bolsa.'; setProducts((old) => ({ ...old, [product.id]: product })); const next = current ? lines.map((line) => line === current ? { ...line, quantity: line.quantity + 1 } : line) : [...lines, { productId: product.id, size, quantity: 1 }]; save(next); return ''; }
  function change(id: string, size: number, delta: number) { const stock = products[id]?.sizes.find((item) => item.size === size)?.stock ?? 0; save(lines.map((line) => line.productId === id && line.size === size ? { ...line, quantity: Math.min(stock, line.quantity + delta) } : line).filter((line) => line.quantity > 0)); }
  function remove(id: string, size: number) { save(lines.filter((line) => !(line.productId === id && line.size === size))); }
  return <Context.Provider value={{ lines, products, loading, error, add, change, remove, count: lines.reduce((total, line) => total + line.quantity, 0), open, setOpen }}>{children}</Context.Provider>;
}
export function useBag() { const context = useContext(Context); if (!context) throw new Error('useBag necesita BagProvider'); return context; }
