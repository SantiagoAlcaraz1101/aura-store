'use client';
import { useOrders } from '../hooks/use-orders';
import { Button, Pagination, Status, money } from '../../common/components/ui';
export function OrderList({ all = false }: { all?: boolean }) {
  const orders = useOrders(all);
  if (orders.loading) return <Status>Cargando solicitudes…</Status>;
  if (orders.error) return <div className="space-y-4"><Status error>{orders.error}</Status><Button onClick={orders.reload}>Reintentar</Button></div>;
  if (!orders.data?.data.length) return <Status>Todavía no hay solicitudes en esta página.</Status>;
  return <div><div className="space-y-4">{orders.data.data.map((order) => <article key={order.id} className="grid gap-4 rounded border border-line p-5 sm:grid-cols-[100px_1fr]"><img src={order.product.image} alt={order.product.name} className="aspect-square w-24 rounded bg-card object-contain"/><div><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{order.product.name} · EU {order.size}</h3><span className="rounded bg-surface px-3 py-1 text-xs">{order.status}</span></div><p className="mt-1 text-sm text-muted">{new Date(order.createdAt).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })} · {order.city} · {money(order.unitPrice)}</p>{all && <p className="mt-2 text-sm">{order.user.name} · {order.user.email}</p>}<p className="mt-3 break-words text-sm">{order.message}</p><p className="mt-3 break-all text-xs text-muted">Referencia: {order.id}</p></div></article>)}</div><Pagination pagination={orders.data.pagination} href={orders.pageHref}/></div>;
}
export function MyOrders() { return <section className="container-shell py-16"><p className="eyebrow">TU CUENTA AURA</p><h1 className="mb-5 mt-4 text-5xl font-semibold tracking-tight">Mis solicitudes.</h1><p className="mb-8 text-muted">Los pares que te interesan, con todos sus detalles. Solo tú y la administración pueden consultar tus solicitudes.</p><OrderList/></section>; }
