'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import { Button, Status } from '../../common/components/ui';
export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading, sessionError, refresh } = useAuth(); const router = useRouter();
  useEffect(() => { if (loading || sessionError) return; if (!user) router.replace('/login'); else if (admin && user.role !== 'admin') router.replace('/'); }, [user, loading, admin, router, sessionError]);
  if (loading) return <Status>Comprobando tu sesión…</Status>;
  if (sessionError) return <div className="space-y-4"><Status error>{sessionError}</Status><Button onClick={() => void refresh()}>Reintentar</Button></div>;
  if (!user || (admin && user.role !== 'admin')) return <Status>Redirigiendo…</Status>;
  return children;
}
