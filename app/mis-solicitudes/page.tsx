import { Suspense } from 'react';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { MyOrders } from '@/features/orders/components/order-list';
import { Status } from '@/features/common/components/ui';
export default function OrdersPage() { return <RequireAuth><Suspense fallback={<Status>Cargando solicitudes…</Status>}><MyOrders/></Suspense></RequireAuth>; }
