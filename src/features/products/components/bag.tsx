'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useBag } from '../hooks/use-bag';
import { Button, Status, money } from '../../common/components/ui';
export function Bag() {
  const bag = useBag(); const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (bag.open) dialog.current?.showModal(); else dialog.current?.close(); }, [bag.open]);
  const first = bag.lines[0];
  return <dialog ref={dialog} onClose={() => bag.setOpen(false)} className="aura-dialog mr-3 w-[min(540px,calc(100%-24px))]" aria-labelledby="bag-title"><div className="mb-7 flex items-start justify-between"><div><p className="eyebrow">TU PRÓXIMA ROTACIÓN</p><h2 id="bag-title" className="mt-3 text-4xl font-semibold">Tu bolsa.</h2></div><button aria-label="Cerrar bolsa" className="size-11 text-3xl" onClick={() => bag.setOpen(false)}>×</button></div>
    {bag.loading && <Status>Actualizando disponibilidad…</Status>}{bag.error && <Status error>{bag.error}</Status>}
    {!bag.lines.length && !bag.loading && <div className="py-6"><p className="mb-5">Hay espacio para tu próximo favorito.</p><Button onClick={() => bag.setOpen(false)}>Seguir explorando ↗</Button></div>}
    {bag.lines.map((line) => { const product = bag.products[line.productId]; if (!product) return null; return <article className="flex gap-4 border-b border-line py-5" key={`${line.productId}-${line.size}`}><img src={product.image} alt={product.alt} className="size-20 rounded bg-card object-contain"/><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{product.name}</h3><p className="text-sm text-muted">EU {line.size} · {money(product.price)}</p><div className="mt-3 flex items-center gap-3"><button className="size-9 border border-line" aria-label={`Quitar un par de ${product.name}`} onClick={() => bag.change(line.productId, line.size, -1)}>−</button><span>{line.quantity}</span><button className="size-9 border border-line disabled:opacity-40" aria-label={`Añadir un par de ${product.name}`} disabled={line.quantity >= (product.sizes.find((size) => size.size === line.size)?.stock ?? 0)} onClick={() => bag.change(line.productId, line.size, 1)}>+</button><button className="ml-auto text-xs underline" onClick={() => bag.remove(line.productId, line.size)}>Eliminar</button></div></div></article>; })}
    {first && <><p className="my-6 flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{money(bag.lines.reduce((sum, line) => sum + (bag.products[line.productId]?.price ?? 0) * line.quantity, 0))}</span></p><p className="mb-5 text-sm text-muted">Consulta un modelo por solicitud. Guardarla no realiza un pago ni reserva inventario.</p><Link className="block rounded bg-ink px-5 py-3 text-center font-semibold text-paper" href={`/?product=${encodeURIComponent(first.productId)}&size=${first.size}#asesoria`} onClick={() => bag.setOpen(false)}>Consultar el primer par ↗</Link></>}
  </dialog>;
}
