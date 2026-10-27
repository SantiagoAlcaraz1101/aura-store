import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import type { PaginationData } from '../types';

export function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`inline-flex min-h-12 items-center justify-center gap-4 rounded px-5 py-3 text-sm font-semibold transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50 bg-ink text-paper ${className}`}>{children}</button>;
}
export function Input({ label, error, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; id: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label><input {...props} id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className="min-h-12 w-full rounded border border-line bg-paper px-3 text-ink"/>{error && <p id={`${id}-error`} className="mt-1 text-sm text-danger">{error}</p>}</div>;
}
export function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: ReactNode; htmlFor: string }) { return <div><label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">{label}</label>{children}{error && <p id={`${htmlFor}-error`} className="mt-1 text-sm text-danger">{error}</p>}</div>; }
export function Status({ children, error = false }: { children: ReactNode; error?: boolean }) { return <p role={error ? 'alert' : 'status'} className={`rounded border border-line p-4 text-sm ${error ? 'text-danger' : 'text-muted'}`}>{children}</p>; }
export function Pagination({ pagination, href }: { pagination: PaginationData; href: (page: number) => string }) {
  if (pagination.totalPages < 2 && pagination.page === 1) return null;
  return <nav aria-label="Paginación" className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
    {pagination.page > 1 && <Link className="rounded border border-line px-4 py-3" href={href(pagination.page - 1)}>← Anterior</Link>}
    <span>Página {pagination.page} de {Math.max(1, pagination.totalPages)}</span>
    {pagination.page < pagination.totalPages && <Link className="rounded border border-line px-4 py-3" href={href(pagination.page + 1)}>Siguiente →</Link>}
  </nav>;
}
export const money = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
