import { Suspense } from 'react';
import { Hero, Manifesto } from '@/features/common/components/home-content';
import { Catalog } from '@/features/products/components/catalog';
import { OrderForm } from '@/features/orders/components/order-form';
import { Status } from '@/features/common/components/ui';
export default function HomePage() { return <><Hero/><Suspense fallback={<Status>Cargando selección…</Status>}><Catalog/></Suspense><Manifesto/><Suspense fallback={<Status>Cargando solicitud…</Status>}><OrderForm/></Suspense></>; }
