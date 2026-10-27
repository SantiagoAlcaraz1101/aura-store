import { Suspense } from 'react';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { Admin } from '@/features/products/components/admin';
import { Status } from '@/features/common/components/ui';
export default function AdminPage() { return <RequireAuth admin><Suspense fallback={<Status>Cargando administración…</Status>}><Admin/></Suspense></RequireAuth>; }
