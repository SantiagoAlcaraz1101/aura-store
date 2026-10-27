'use client';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../domain/types';
import { useBag } from '../hooks/use-bag';
import { Button, money } from '../../common/components/ui';
export function ProductDetail({ product, close }: { product: Product; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null); const [size, setSize] = useState<number | null>(null); const [error, setError] = useState(''); const bag = useBag();
  useEffect(() => { dialog.current?.showModal(); }, []);
  function add() { if (size === null) { setError('Elige una talla disponible.'); return; } const error = bag.add(product, size); if (error) setError(error); else { dialog.current?.close(); bag.setOpen(true); } }
  return <dialog ref={dialog} onClose={close} className="aura-dialog w-[min(850px,calc(100%-32px))]" aria-labelledby="detail-title"><button className="absolute right-3 top-3 size-11 rounded-full bg-paper text-2xl" onClick={() => dialog.current?.close()} aria-label="Cerrar detalle">×</button><div className="grid gap-8 md:grid-cols-2">
    <div className="rounded bg-card"><img src={product.image} alt={product.alt} className="aspect-square w-full object-contain mix-blend-multiply"/></div><div className="py-5"><p className="eyebrow">{product.brand.name} · {product.tag}</p><h2 id="detail-title" className="mt-3 text-3xl font-semibold">{product.name}</h2><p className="mt-3 text-sm text-muted">{product.color} · Ref. {product.sku}</p><p className="mt-5 text-sm text-muted">{product.description}</p><p className="mt-5 text-xl font-semibold">{money(product.price)} COP</p><fieldset className="mt-5"><legend className="mb-3 font-semibold">Elige tu talla (EU)</legend><div className="flex flex-wrap gap-2">{product.sizes.map((item) => <button key={item.size} aria-pressed={size === item.size} disabled={!item.stock} onClick={() => { setSize(item.size); setError(''); }} className={`size-11 rounded border border-line disabled:opacity-35 disabled:line-through ${size === item.size ? 'bg-ink text-paper' : ''}`}>{item.size}</button>)}</div></fieldset><p className="mt-3 text-xs text-muted">Las tallas tachadas están agotadas. La bolsa no reserva inventario.</p><p role="status" className="mt-3 min-h-6 text-sm text-danger">{error}</p><Button onClick={add} className="mt-2 w-full">Añadir a la bolsa +</Button></div>
    </div></dialog>;
}
